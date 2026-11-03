// Refresh the reviewed edition catalogue from downloaded engine #3060 and the
// supplied assignment CSV. Parses JSON literals only; never executes the engine.
import { readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
const [enginePath, csvPath] = process.argv.slice(2);
if (!enginePath || !csvPath) throw Error('Usage: node scripts/audionaut-royalties-catalogue.mjs engine.js song-assignments.csv');
const source = readFileSync(enginePath, 'utf8');
function literalAfter(marker) {
  const start = source.indexOf(marker);
  if (start < 0) throw Error(`Missing ${marker}`);
  const text = source.slice(start + marker.length);
  let quoted = false, escaped = false, depth = 0;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) { if (escaped) escaped = false; else if (c === '\\') escaped = true; else if (c === '"') quoted = false; }
    else if (c === '"') quoted = true;
    else if ('[{'.includes(c)) depth++;
    else if (']}'.includes(c) && --depth === 0) return JSON.parse(text.slice(0, i + 1));
  }
  throw Error('Incomplete catalogue');
}
function csvRows(text) {
  const rows = []; let row = [], cell = '', quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (c === '"') { if (quoted && text[i + 1] === '"') { cell += '"'; i++; } else quoted = !quoted; }
    else if (c === ',' && !quoted) { row.push(cell); cell = ''; }
    else if (c === '\n' && !quoted) { row.push(cell.replace(/\r$/, '')); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  return rows;
}
const csv = csvRows(readFileSync(csvPath, 'utf8')), headers = csv.shift();
const creditBySong = new Map();
for (const row of csv) {
  const song = row[headers.indexOf('song_inscription_id')], artist = row[headers.indexOf('artist')];
  if (!artist) continue;
  const prior = creditBySong.get(song);
  if (prior && prior.toLowerCase() !== artist.toLowerCase()) throw Error(`Conflicting credits for ${song}`);
  creditBySong.set(song, artist.toLowerCase() === 'botcupid' ? 'BotCupid' : artist);
}
const catalog = literalAfter('const secretCatalog=');
const keys = literalAfter('const frozenKeys='), values = literalAfter('frozenValues='), encodedCrew = literalAfter('];const crew=');
const members = encodedCrew.map(row => Object.fromEntries(row.map((i, k) => [keys[k], values[i]])));
const tracks = new Map(catalog.tracks.map(t => [t.id, t]));
const editions = members.map(member => {
  const track = tracks.get(catalog.assignments[String(member.id)]);
  const artist = creditBySong.get(track.id) || track.artist;
  if (!artist) throw Error(`Missing artist for song ${track.id}`);
  return { edition: member.id, seed: member.seed, name: member.name, songId: Number(track.tokenId), title: track.title, artist };
});
if (editions.length !== 111) throw Error('Expected 111 editions');
const artists = [...new Set(editions.map(e => e.artist))].map(artist => ({ artist,
  firstSongId: Math.min(...editions.filter(e => e.artist === artist).map(e => e.songId)) }));
const data = { engineTokenId: 3060, engineSha256: createHash('sha256').update(source).digest('hex'),
  artistRule: 'Current holder of the lowest primary song inscription ID for each artist in this catalogue', artists, editions };
writeFileSync(new URL('../functions/lib/audionaut-royalties-catalogue.json', import.meta.url), JSON.stringify(data, null, 2) + '\n');
console.log(`Wrote ${editions.length} editions and ${artists.length} artist receiving-song references.`);
