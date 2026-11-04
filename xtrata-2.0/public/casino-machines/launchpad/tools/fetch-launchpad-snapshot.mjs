// Optional research refresh. It never changes the game's approved art or metadata.
import { mkdir, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const output = resolve(root, 'art/evidence/launchpad-refresh.json');
const faktoryUrl = process.argv[2];
const endpoints = {
  stxcity: 'https://stx.city/api/fetchFrontEnd/bondingData?page=1&limit=1000',
  ...(faktoryUrl ? { faktory: faktoryUrl } : {})
};
const sources = await Promise.all(Object.entries(endpoints).map(async ([name, url]) => {
  try {
    const response = await fetch(url, { signal: AbortSignal.timeout(25000) });
    if (!response.ok) return [name, { status: 'unavailable', http: response.status }];
    return [name, { status: 'retrieved', data: await response.json() }];
  } catch (error) {
    return [name, { status: 'unavailable', error: error.message }];
  }
}));
if (!faktoryUrl) sources.push(['faktory', {status:'unavailable',reason:'Supply the current public Faktory token-list URL as the first argument.'}]);
await mkdir(resolve(root,'art/evidence'), { recursive: true });
await writeFile(output, JSON.stringify({ retrievedAt: new Date().toISOString(), sources:Object.fromEntries(sources) }, null, 2)+'\n');
console.log(output);
if(sources.some(([,source])=>source.status==='unavailable'))process.exitCode=1;
