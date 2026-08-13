const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { spawn } = require('child_process');
const url = require('url');

// Configuration
// PORT and the output directory can be overridden via env vars so the test suite can
// run an isolated server on a free port writing into a throwaway temp directory.
const PORT = parseInt(process.env.PORT, 10) || 3001;
const ROOT_DIR = path.join(__dirname, '..', '..');
const FRONTEND_DIR = path.join(ROOT_DIR, 'src', 'frontend');
const OUTPUT_DIR = process.env.NARRATE_OUTPUT_DIR
    ? path.resolve(process.env.NARRATE_OUTPUT_DIR)
    : path.join(ROOT_DIR, 'output');
const CHUNKS_DIR = path.join(OUTPUT_DIR, 'chunks');
const CHAPTERS_DIR = path.join(OUTPUT_DIR, 'chapters');
const TITLES_DIR = path.join(OUTPUT_DIR, 'titles');
const BOOK_DIR = path.join(OUTPUT_DIR, 'book');
const LOGS_DIR = path.join(OUTPUT_DIR, 'logs');
const PROJECTS_DIR = path.join(OUTPUT_DIR, 'projects'); 
const TEMP_DIR = path.join(OUTPUT_DIR, 'temp');

// Ensure directories exist
[OUTPUT_DIR, CHUNKS_DIR, CHAPTERS_DIR, TITLES_DIR, BOOK_DIR, LOGS_DIR, PROJECTS_DIR, TEMP_DIR].forEach(d => {
    if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Queue System to protect resources
class AsyncQueue {
    constructor(concurrency = 1) {
        this.concurrency = concurrency;
        this.active = 0;
        this.queue = [];
    }

    add(fn) {
        return new Promise((resolve, reject) => {
            this.queue.push({ fn, resolve, reject });
            this.next();
        });
    }

    next() {
        if (this.active >= this.concurrency || this.queue.length === 0) return;
        
        this.active++;
        const { fn, resolve, reject } = this.queue.shift();
        
        fn().then(resolve)
            .catch(reject)
            .finally(() => {
                this.active--;
                this.next();
            });
    }
}

// Queues
// Global cap on concurrent ElevenLabs requests. This protects the API key from being
// over-subscribed across ALL tabs (the aggregate never exceeds this), so it should be set
// to your plan's concurrency limit (Free 2, Starter 3, Creator 5, Pro 10, Scale/Business 15).
// The per-book client setting can request up to this number. Override with NARRATE_TTS_CONCURRENCY.
const TTS_CONCURRENCY = Math.max(1, parseInt(process.env.NARRATE_TTS_CONCURRENCY, 10) || 15);
const elevenLabsQueue = new AsyncQueue(TTS_CONCURRENCY);
const ffmpegQueue = new AsyncQueue(1);     // Serial processing for heavy CPU tasks

function generateHash(text) {
    return crypto.createHash('md5').update(text).digest('hex').substring(0, 12);
}

// FFmpeg Helper
const executeFfmpeg = (args) => new Promise((resolve, reject) => {
    const ff = spawn('ffmpeg', args);
    let stderr = '';
    ff.stderr.on('data', d => stderr += d);
    ff.on('close', code => code === 0 ? resolve() : reject(new Error(`FFmpeg exited with ${code}: ${stderr}`)));
    ff.on('error', reject);
});

async function createSilenceFile(duration) {
    const filename = `silence_${duration}s.mp3`;
    const filePath = path.join(TEMP_DIR, filename);
    if (fs.existsSync(filePath)) return filePath;
    
    // Generate silence (44.1kHz, mono, 128k - standard ElevenLabs match)
    // We use -c:a libmp3lame to ensure mp3 format.
    await executeFfmpeg([
        '-f', 'lavfi', '-i', 'anullsrc=r=44100:cl=mono', 
        '-t', duration.toString(), 
        '-b:a', '128k', 
        '-y', filePath
    ]);
    return filePath;
}

async function mergeAudioFiles(inputPaths, outputPath, silenceDuration = 0) {
    return ffmpegQueue.add(async () => {
        if (inputPaths.length === 0) throw new Error("No files to merge");
        
        let filesToMerge = [...inputPaths];

        // Insert silence if requested
        if (silenceDuration > 0) {
            try {
                const silenceFile = await createSilenceFile(silenceDuration);
                const interleaved = [];
                for (let i = 0; i < filesToMerge.length; i++) {
                    interleaved.push(filesToMerge[i]);
                    // Add silence between chunks (not after the last one)
                    if (i < filesToMerge.length - 1) {
                        interleaved.push(silenceFile);
                    }
                }
                filesToMerge = interleaved;
            } catch (e) {
                console.error("Silence generation failed, proceeding without silence:", e);
            }
        }

        const listPath = outputPath + '.list.txt';
        const fileContent = filesToMerge.map(p => `file '${p.replace(/'/g, "'\\''")}'`).join('\n');
        fs.writeFileSync(listPath, fileContent);
        
        try {
            await executeFfmpeg([
                '-f', 'concat', '-safe', '0', '-i', listPath, '-c', 'copy', '-y', outputPath
            ]);
        } finally {
            if (fs.existsSync(listPath)) fs.unlinkSync(listPath);
        }
    });
}

// ElevenLabs API Helper
async function generateAudio(text, voiceId, apiKey, modelId) {
    return elevenLabsQueue.add(() => new Promise((resolve, reject) => {
        let settled = false;
        const req = https.request('https://api.elevenlabs.io/v1/text-to-speech/' + voiceId, {
            method: 'POST',
            headers: {
                'xi-api-key': apiKey,
                'Content-Type': 'application/json',
                'Accept': 'audio/mpeg'
            }
        }, (res) => {
            const chunks = [];
            res.on('data', chunk => chunks.push(chunk));
            res.on('end', () => {
                settled = true;
                if (res.statusCode !== 200) {
                    const body = Buffer.concat(chunks).toString('utf8');
                    reject(new Error(`ElevenLabs API Error: ${res.statusCode} — ${body}`));
                } else {
                    resolve(Buffer.concat(chunks));
                }
            });
        });

        req.on('error', reject);
        req.setTimeout(120000, () => {
            if (settled) return;
            settled = true;
            req.destroy(new Error('ElevenLabs request timed out after 120s'));
        });
        // Eleven v3 only accepts stability values of 0.0 / 0.5 / 1.0 and
        // rejects similarity_boost, so send a v3-safe settings object.
        const voiceSettings = modelId === 'eleven_v3'
            ? { stability: 0.5 }
            : { stability: 0.5, similarity_boost: 0.75 };
        req.write(JSON.stringify({
            text,
            model_id: modelId,
            voice_settings: voiceSettings
        }));
        req.end();
    }));
}

const server = http.createServer(async (req, res) => {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') { res.writeHead(200); res.end(); return; }

    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;

    // ==========================================
    // 1. SERVE FRONTEND (MODIFIED FOR MODULES)
    // ==========================================

    // Serve HTML
    if (pathname === '/' || pathname === '/index.html') {
        const fileToServe = path.join(FRONTEND_DIR, 'index.html');
        
        fs.readFile(fileToServe, (err, data) => {
            if (err) {
                res.writeHead(500);
                res.end('Error loading UI: Ensure src/frontend/index.html exists.');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
        return;
    }

    // Serve CSS
    if (pathname === '/style.css' || pathname === '/css/style.css') {
        const cssPath = path.join(FRONTEND_DIR, 'css', 'style.css');
        fs.readFile(cssPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('CSS not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/css' });
                res.end(data);
            }
        });
        return;
    }

    // Serve JS
    if (pathname === '/script.js' || pathname === '/js/script.js') {
        const jsPath = path.join(FRONTEND_DIR, 'js', 'script.js');
        fs.readFile(jsPath, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end('JS not found');
            } else {
                res.writeHead(200, { 'Content-Type': 'application/javascript' });
                res.end(data);
            }
        });
        return;
    }

    // V13: Generic static assets from the frontend dir (js/core.js, js/vendor/*, css/*, etc.)
    // Older versions only hard-coded script.js + style.css, which would 404 the new
    // core.js and vendored mammoth. A path-traversal guard keeps it within FRONTEND_DIR.
    if (pathname.startsWith('/js/') || pathname.startsWith('/css/') || pathname.startsWith('/assets/')) {
        const safePath = path.normalize(path.join(FRONTEND_DIR, pathname));
        if (safePath !== FRONTEND_DIR && !safePath.startsWith(FRONTEND_DIR + path.sep)) {
            res.writeHead(403); res.end('Forbidden'); return;
        }
        fs.readFile(safePath, (err, data) => {
            if (err) { res.writeHead(404); res.end('Not found'); return; }
            const ext = path.extname(safePath).toLowerCase();
            const types = {
                '.js': 'application/javascript', '.mjs': 'application/javascript',
                '.css': 'text/css', '.json': 'application/json', '.map': 'application/json',
                '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
                '.woff': 'font/woff', '.woff2': 'font/woff2'
            };
            res.writeHead(200, { 'Content-Type': types[ext] || 'application/octet-stream' });
            res.end(data);
        });
        return;
    }

    // V13 (dev only): serve the browser smoke-test harness at /tests/* so it can load the
    // real app same-origin. Guarded to the tests/ directory.
    if (pathname.startsWith('/tests/')) {
        const testsRoot = path.join(ROOT_DIR, 'tests');
        const safePath = path.normalize(path.join(ROOT_DIR, pathname));
        if (safePath !== testsRoot && !safePath.startsWith(testsRoot + path.sep)) {
            res.writeHead(403); res.end('Forbidden'); return;
        }
        fs.readFile(safePath, (err, data) => {
            if (err) { res.writeHead(404); res.end('Not found'); return; }
            const ext = path.extname(safePath).toLowerCase();
            const types = { '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css', '.json': 'application/json' };
            res.writeHead(200, { 'Content-Type': types[ext] || 'text/plain' });
            res.end(data);
        });
        return;
    }

    // ==========================================
    // 2. Serve Audio Files (EXISTING LOGIC)
    // ==========================================
    if (pathname.startsWith('/output/')) {
        // Map /output/* onto OUTPUT_DIR (which may be relocated via NARRATE_OUTPUT_DIR),
        // not blindly onto ROOT_DIR - this keeps serving consistent with where files are
        // actually written and hardens against path traversal.
        const rel = decodeURIComponent(pathname.replace(/^\/output\//, ''));
        const filePath = path.normalize(path.join(OUTPUT_DIR, rel));
        // Security check (stay within OUTPUT_DIR)
        if (filePath !== OUTPUT_DIR && !filePath.startsWith(OUTPUT_DIR + path.sep)) {
            res.writeHead(403);
            res.end('Access Denied');
            return;
        }
        if (fs.existsSync(filePath)) {
            res.writeHead(200, {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'no-store, no-cache, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': '0'
            });
            fs.createReadStream(filePath).pipe(res);
        } else {
            res.writeHead(404);
            res.end('File not found');
        }
        return;
    }

    // ==========================================
    // 3. API ROUTES (EXISTING LOGIC)
    // ==========================================

    // API: List Projects
    if ((pathname === '/api/projects' || pathname === '/api/projects/') && req.method === 'GET') {
        try {
            // 1. Get Real Projects (JSON files)
            if (!fs.existsSync(PROJECTS_DIR)) fs.mkdirSync(PROJECTS_DIR, { recursive: true });
            const projectFiles = fs.readdirSync(PROJECTS_DIR).filter(f => f.endsWith('.json'));
            const projectList = projectFiles.map(f => {
                try {
                    const content = fs.readFileSync(path.join(PROJECTS_DIR, f), 'utf8');
                    const data = JSON.parse(content);
                    const id = data.id || f.replace('.json', '');
                    return { 
                        id: id, 
                        title: data.displayTitle || data.title || 'Untitled', 
                        author: data.author || 'Unknown',
                        updatedAt: data.updatedAt || fs.statSync(path.join(PROJECTS_DIR, f)).mtime.toISOString(),
                        filename: f,
                        type: 'saved'
                    };
                } catch(e) { return null; }
            }).filter(Boolean);

            // 2. Discover "Ghost" Projects from Chunks (Unsaved)
            const chunkFiles = fs.existsSync(CHUNKS_DIR) ? fs.readdirSync(CHUNKS_DIR).filter(f => f.endsWith('.mp3')) : [];
            const ghostIds = new Set();
            
            chunkFiles.forEach(f => {
                const match = f.match(/^(.+?)_ch\d+_chk\d+/);
                if (match) {
                    ghostIds.add(match[1]);
                }
            });

            const existingIds = new Set(projectList.map(p => p.id));
            
            ghostIds.forEach(gid => {
                if (!existingIds.has(gid) && gid !== 'undefined') {
                    const inferredTitle = gid.split('_').slice(0, -1).join('_') || gid;
                    
                    projectList.push({
                        id: gid,
                        title: `(Recovered) ${inferredTitle}`,
                        author: 'Unknown',
                        updatedAt: new Date().toISOString(), 
                        type: 'ghost'
                    });
                }
            });

            projectList.sort((a,b) => new Date(b.updatedAt) - new Date(a.updatedAt));

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(projectList));
        } catch (e) {
            console.error("List Projects Error:", e);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: e.message }));
        }
        return;
    }

    // API: Load Specific Project
    if (pathname.startsWith('/api/projects/') && req.method === 'GET') {
        const parts = pathname.split('/').filter(Boolean);
        const projectId = parts.pop();
        
        if (!projectId || projectId === 'projects') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Invalid Project ID" }));
            return;
        }

        const filePath = path.join(PROJECTS_DIR, `${projectId}.json`);
        
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                const data = JSON.parse(content);

                // 1. Auto-discover existing chapter/title files
                if (data.chapters && Array.isArray(data.chapters)) {
                    // Pre-scan chunks directory to speed up lookup
                    const chunkFiles = fs.existsSync(CHUNKS_DIR) ? fs.readdirSync(CHUNKS_DIR) : [];

                    data.chapters.forEach((ch, idx) => {
                        const isTitle = ch.title === "Titles" || idx === 0;
                        const chapterFileName = isTitle ? `${projectId}_titles.mp3` : `${projectId}_chapter_${idx}.mp3`;
                        const chapterDir = isTitle ? TITLES_DIR : CHAPTERS_DIR;
                        const subDir = isTitle ? 'titles' : 'chapters';
                        
                        if (fs.existsSync(path.join(chapterDir, chapterFileName))) {
                            ch.audioUrl = `/output/${subDir}/${chapterFileName}`;
                        }

                        // 2. Discover individual chunks for this chapter
                        if (ch.chunks && Array.isArray(ch.chunks)) {
                            ch.chunks.forEach((chunk, cIdx) => {
                                const chunkPrefix = `${projectId}_ch${idx}_chk${cIdx}_`;
                                const foundChunkFile = chunkFiles.find(f => f.startsWith(chunkPrefix) && f.endsWith('.mp3'));
                                
                                if (foundChunkFile) {
                                    chunk.audioUrl = `/output/chunks/${foundChunkFile}`;
                                    chunk.filename = foundChunkFile;
                                    chunk.status = 'done';
                                }
                            });
                        }
                    });
                }

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Failed to parse project: " + e.message }));
            }
            return;
        }

        try {
            if (!fs.existsSync(CHUNKS_DIR)) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Project not found" }));
                return;
            }
            const chunkFiles = fs.readdirSync(CHUNKS_DIR).filter(f => f.startsWith(`${projectId}_`) && f.endsWith('.mp3'));
            
            if (chunkFiles.length === 0) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Project not found" }));
                return;
            }

            // Group by Chapter
            const chaptersMap = new Map();
            
            chunkFiles.forEach(f => {
                // Parse: projId_ch0_chk0_hash.mp3
                const match = f.match(/_ch(\d+)_chk(\d+)_/);
                if (match) {
                    const chIdx = parseInt(match[1]);
                    const ckIdx = parseInt(match[2]);
                    
                    if (!chaptersMap.has(chIdx)) {
                        chaptersMap.set(chIdx, []);
                    }
                    
                    chaptersMap.get(chIdx).push({
                        id: `rec_${chIdx}_${ckIdx}`,
                        text: "(Recovered Audio Segment)",
                        status: 'done',
                        filename: f,
                        audioUrl: `/output/chunks/${f}`,
                        chunkIndex: ckIdx,
                        voiceId: null
                    });
                }
            });

            // Convert to Array and Sort
            const chapters = Array.from(chaptersMap.entries())
                .sort((a, b) => a[0] - b[0])
                .map(([idx, chunks]) => ({
                    title: idx === 0 ? "Titles (Recovered)" : `Chapter ${idx} (Recovered)`,
                    chunks: chunks.sort((a, b) => a.chunkIndex - b.chunkIndex)
                }));

            const recoveredProject = {
                id: projectId,
                title: projectId,
                author: 'Unknown',
                manuscript: "Project recovered from audio files. Original text unavailable.\n\nTo restore generation capabilities, paste the original text here and Analyze again (it should match the hashes if unchanged).",
                chapters: chapters,
                projectSettings: { mode: 'single', voiceIds: [], names: [] }
            };

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(recoveredProject));

        } catch(e) {
            res.writeHead(500);
            res.end(JSON.stringify({ error: "Recovery failed: " + e.message }));
        }
        return;
    }

    // API: Rename Project
    if (pathname.startsWith('/api/projects/') && req.method === 'PATCH') {
        const parts = pathname.split('/').filter(Boolean);
        const projectId = parts.pop();

        if (!projectId || projectId === 'projects') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Invalid Project ID" }));
            return;
        }

        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { title } = JSON.parse(body);
                if (!title) throw new Error("Title is required");

                const filePath = path.join(PROJECTS_DIR, `${projectId}.json`);

                if (fs.existsSync(filePath)) {
                    const content = fs.readFileSync(filePath, 'utf8');
                    const data = JSON.parse(content);
                    
                    data.title = title;
                    data.displayTitle = title;
                    data.baseTitle = title;
                    data.updatedAt = new Date().toISOString();

                    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ status: 'updated', id: projectId, title }));
                } else {
                    res.writeHead(404, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: "Project not found" }));
                }
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Failed to rename: " + e.message }));
            }
        });
        return;
    }

    // API: Delete Project
    if (pathname.startsWith('/api/projects/') && req.method === 'DELETE') {
        const parts = pathname.split('/').filter(Boolean);
        const projectId = parts.pop();

        if (!projectId || projectId === 'projects') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Invalid Project ID" }));
            return;
        }

        const filePath = path.join(PROJECTS_DIR, `${projectId}.json`);

        if (fs.existsSync(filePath)) {
            try {
                fs.unlinkSync(filePath);
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ status: 'deleted', id: projectId }));
            } catch (e) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: "Failed to delete project: " + e.message }));
            }
        } else {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: "Project not found" }));
        }
        return;
    }

    // API: Save Project (Create/Update)
    if (pathname === '/api/projects' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                // Ensure ID
                const id = data.id || 'proj_' + Date.now().toString(36);
                const projectData = {
                    ...data,
                    id,
                    updatedAt: new Date().toISOString()
                };
                if (!projectData.displayTitle) projectData.displayTitle = projectData.title || 'Untitled';

                // Save to individual file (async so the shared event loop stays responsive
                // while many chunks are generating in parallel).
                const filePath = path.join(PROJECTS_DIR, `${id}.json`);
                await fs.promises.writeFile(filePath, JSON.stringify(projectData, null, 2));

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ id, status: 'saved' }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // API: Generate Audio Chunk
    if (pathname === '/api/generate' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const requestData = JSON.parse(body);
                console.log("[API Generate Request]", { ...requestData, apiKey: '***' }); // Log request (hide key)

                const { text, voiceId, apiKey, modelId, projectId, chapterIndex, chunkIndex, force } = requestData;
                
                if (!text || !voiceId || !apiKey) {
                    throw new Error("Missing required fields: text, voiceId, or apiKey");
                }

                // Deterministic Filename based on content hash
                const contentHash = generateHash(text + voiceId + modelId);
                const fileName = `${projectId}_ch${chapterIndex}_chk${chunkIndex}_${contentHash}.mp3`;
                const filePath = path.join(CHUNKS_DIR, fileName);
                const publicUrl = `/output/chunks/${fileName}`;

                // Check if exists (Bypass if force is true)
                if (fs.existsSync(filePath) && !force) {
                    console.log(`[Cache Hit] ${fileName}`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ url: publicUrl, filename: fileName, cached: true }));
                    return;
                }

                console.log(`[Generating${force ? ' (FORCE)' : ''}] ${fileName} ...`);
                const audioBuffer = await generateAudio(text, voiceId, apiKey, modelId);
                await fs.promises.writeFile(filePath, audioBuffer); // async: don't block the event loop

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ url: publicUrl, filename: fileName, cached: false }));

            } catch (e) {
                console.error("Generation Error:", e);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // API: Merge Chapter
    if (pathname === '/api/merge-chapter' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { projectId, chapterIndex, filenames, isTitle, silence } = JSON.parse(body);
                
                if (!filenames || filenames.length === 0) throw new Error("No files provided");

                // Resolve absolute paths
                const inputPaths = filenames.map(f => path.join(CHUNKS_DIR, f));
                
                // Verify all exist
                for (const p of inputPaths) {
                    if (!fs.existsSync(p)) throw new Error(`Missing chunk file: ${path.basename(p)}`);
                }

                // Determine Output Dir and Filename
                const targetDir = isTitle ? TITLES_DIR : CHAPTERS_DIR;
                const outName = isTitle ? `${projectId}_titles.mp3` : `${projectId}_chapter_${chapterIndex}.mp3`;
                const outPath = path.join(targetDir, outName);
                const publicUrl = `/output/${isTitle ? 'titles' : 'chapters'}/${outName}`;

                console.log(`[Merging] ${outName} from ${filenames.length} chunks...`);
                await mergeAudioFiles(inputPaths, outPath, silence);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ url: publicUrl, path: outPath }));

            } catch (e) {
                console.error("Merge Error:", e);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // API: Merge Book
    if (pathname === '/api/merge-book' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const { projectId, silence } = JSON.parse(body);
                if (!projectId) throw new Error("Project ID required");

                // 1. Find Files
                const files = [];
                
                // Titles
                const titleFile = `${projectId}_titles.mp3`;
                if (fs.existsSync(path.join(TITLES_DIR, titleFile))) {
                    files.push({ path: path.join(TITLES_DIR, titleFile), index: -1 });
                }

                // Chapters
                if (fs.existsSync(CHAPTERS_DIR)) {
                    const chFiles = fs.readdirSync(CHAPTERS_DIR);
                    chFiles.forEach(f => {
                        const match = f.match(new RegExp(`^${projectId}_chapter_(\\d+)\\.mp3$`));
                        if (match) {
                            files.push({ path: path.join(CHAPTERS_DIR, f), index: parseInt(match[1]) });
                        }
                    });
                }

                if (files.length === 0) throw new Error("No chapters found to merge");

                // 2. Sort
                files.sort((a, b) => a.index - b.index);
                const inputPaths = files.map(f => f.path);

                // 3. Merge
                const outName = `${projectId}_full_book.mp3`;
                const outPath = path.join(BOOK_DIR, outName);
                const publicUrl = `/output/book/${outName}`;

                console.log(`[Merging Book] ${outName} from ${files.length} files...`);
                await mergeAudioFiles(inputPaths, outPath, silence);

                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ url: publicUrl, path: outPath }));

            } catch (e) {
                console.error("Book Merge Error:", e);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    // API: Bulk Cache Check
    if (pathname === '/api/check-cache' && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            try {
                const { chunks, projectId, modelId } = JSON.parse(body);
                const results = chunks.map(c => {
                    const contentHash = generateHash(c.text + c.voiceId + modelId);
                    const fileName = `${projectId}_ch${c.chapterIndex}_chk${c.chunkIndex}_${contentHash}.mp3`;
                    const filePath = path.join(CHUNKS_DIR, fileName);
                    return {
                        id: c.id,
                        exists: fs.existsSync(filePath),
                        filename: fileName,
                        url: `/output/chunks/${fileName}`
                    };
                });
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ chunks: results }));
            } catch (e) {
                res.writeHead(400);
                res.end(JSON.stringify({ error: e.message }));
            }
        });
        return;
    }

    res.writeHead(404);
    res.end('Not Found');
});

server.listen(PORT, () => {
    console.log(`Audiobook Server running at http://localhost:${PORT}`);
    console.log(`Files will be saved to: ${path.resolve(OUTPUT_DIR)}`);
    console.log(`Max concurrent ElevenLabs requests: ${TTS_CONCURRENCY} (set NARRATE_TTS_CONCURRENCY to change)`);
});

// V13.1: A second listener on a separate port, dedicated to I/O (project save/load + audio
// playback). Browsers cap concurrent connections PER ORIGIN (~6, shared across ALL tabs), so
// long-lived generation requests on the main port can starve saves and audio - they queue
// with no error ("save doesn't work / no sound while generating"). Serving those from a
// separate origin gives them their own connection pool so they keep working during generation.
const IO_PORT = parseInt(process.env.NARRATE_IO_PORT, 10) || (PORT + 1);
const ioHandler = server.listeners('request')[0];
const ioServer = http.createServer(ioHandler);
ioServer.on('error', e => console.error(`I/O port ${IO_PORT} unavailable: ${e.message}`));
ioServer.listen(IO_PORT, () => {
    console.log(`I/O channel (saves + audio) running at http://localhost:${IO_PORT}`);
});
