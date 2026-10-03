"""Refresh bundled L1 indexes without executing the original transcript scripts."""
import argparse, json, re
from pathlib import Path

parser = argparse.ArgumentParser()
parser.add_argument('--audionals', type=Path, default=Path('/Users/melophonic/Documents/GitHub/audionals'))
args = parser.parse_args()
root = Path(__file__).resolve().parents[1]
ordinal = re.compile(r'^[a-f0-9]{64}i\d+$', re.I)
catalogue = json.loads((args.audionals/'B64x-v2.0/AudioInscriptions/all_audio_inscriptions.json').read_text())
words = json.loads((args.audionals/'Audionaut-Sequencer/V2.3/data/word-index.json').read_text())
metadata = json.loads((args.audionals/'Audional-Base64-Sampl--Loader-Module/v4/audional-sample-metadata.json').read_text())
entries = {}
def entry(id):
    id = id.lower()
    if not ordinal.fullmatch(id): raise ValueError('Invalid inscription ID')
    return entries.setdefault(id, {'id': id, 'label': 'Bitcoin audio '+id[:12]+'…', 'catalogued': False, 'words': 0})
for row in catalogue: entry(row['id'])['catalogued'] = True
for source in words['sources']:
    item = entry(source['ordinalId']);item['words'] = len(source['words'])
    item['excerpt'] = ' '.join(w[0] for w in source['words'][:24])
pattern = r'''id:\s*(['"])([a-f0-9]{64}i\d+)\1\s*,\s*label:\s*(['"])((?:\\.|(?!\3).)*)\3'''
for _,id,quote,label in re.findall(pattern, (root/'js/library.js').read_text(), re.S):
    entry(id).update(label=label.replace("\\'", "'").replace('\\"', '"'), curated=True)
for row in metadata:
    match = re.search(r'[a-f0-9]{64}i\d+', row['url'], re.I)
    if match:
        item = entry(match[0]);item['label'] = row['name']
        item['metadata'] = {key:row.get(key) for key in ['duration','sampleRate','channels','isLoop','bpm','key','success','error']}
for id,kind in re.findall(r"['\"]([a-f0-9]{64}i\d+)['\"]:\s*\{\s*kind:\s*['\"]([^'\"]+)['\"]", (root/'js/song-format.js').read_text()):
    if id in entries: entries[id]['kind'] = kind
payload = {'version':1, 'cataloguedCount':len(catalogue), 'wordCount':sum(len(s['words']) for s in words['sources']),
           'transcriptCount':len(words['sources']), 'entries':list(entries.values()),
           'provenance':['B64x-v2.0/AudioInscriptions/all_audio_inscriptions.json', 'on-chain-music/AudioSearchEngine_v1/TranscriptionArrays', 'Audional-Base64-Sampl--Loader-Module/v4/audional-sample-metadata.json', 'Sequencer X curated library']}
(root/'data/l1-catalogue.json').write_text(json.dumps(payload,ensure_ascii=False,separators=(',',':')))
(root/'data/word-index.json').write_text(json.dumps(words,ensure_ascii=False,separators=(',',':')))
print(json.dumps({key:payload[key] for key in ['cataloguedCount','wordCount','transcriptCount']} | {'availableSources':len(entries)}))
