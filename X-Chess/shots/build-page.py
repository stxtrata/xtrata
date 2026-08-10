# Generates tweets.html from the data below.
# Edit CAMPAIGNS, re-run: python3 build-page.py
import json, html, pathlib

CAMPAIGNS = [
 {"id":"live","title":"Live","blurb":"The announcement. Post these first.","groups":[
   {"kind":"single","posts":[
     {"text":"X Chess is live.\n\nFully on chain. No server, no account, no referee. Open a board and play.",
      "shot":"01-hero-game1.png","note":"The hero shot. Real game, real .btc names."},
     {"text":"Game 1 is open.\n\nWhite is taken. Black is anyone else.\n\nFirst person to move is playing me.",
      "shot":"02-players-panel.png","note":"Small and quotable. White xtrata.btc, Black anyone-else."}]}]},

 {"id":"create","title":"Create your own game","blurb":"Thread. The core how-it-works.","groups":[
   {"kind":"thread","label":"Thread: opening a board","posts":[
     {"text":"You do not join X Chess. You open a board."},
     {"text":"Name your opponent, or leave the seat empty, and share the link.\n\nA .btc name if you want a specific person.\nanyone if you want a stranger.\nanyone-else if you want a stranger who is not you.",
      "shot":"04-open-anyone-else.png","note":"Crop to the summary line if you can."},
     {"text":"anyone-else is my favourite setting.\n\nThe board is open to the world and closed to me. I cannot quietly play both colours.",
      "shot":"02-players-panel.png"},
     {"text":"Every game is public and permanent, so people would reasonably wonder if I played myself.\n\nThis makes it impossible rather than unlikely."},
     {"text":"Want it to count? Tick ranked.\n\nThe rating is stored nowhere. Anyone can recompute every rating from the chain and get the same number.",
      "shot":"07-ranked.png"},
     {"text":"Copy link, send it to someone, they move.\n\nThat is the whole onboarding flow."}]}]},

 {"id":"sponsored","title":"Sponsored games","blurb":"Thread. Your strongest material.","groups":[
   {"kind":"thread","label":"Thread: playing with an empty wallet","posts":[
     {"text":"You can challenge somebody who has never held a satoshi."},
     {"text":"Tick sponsored. The contract sends them their gas in the same transaction that opens the board.\n\nNo airdrop. No faucet. No signup. No support ticket.",
      "shot":"05-sponsored-challenge.png","note":"BEST SHOT OF THE SET. The itemised cost line does the whole argument."},
     {"text":"They open the link with an empty wallet and they can move."},
     {"text":"Every move they make is refunded, up to the allowance you paid for.\n\nWhen it runs out the game does not stop. They just start paying their own way."},
     {"text":"Sponsor both sides and you hand a whole game to two people who hold nothing.\n\nOne transaction.",
      "shot":"06-sponsor-both.png"},
     {"text":"The best onboarding is not a tutorial.\n\nIt is a game somebody already opened for you."}]}]},

 {"id":"mobile","title":"Mobile","blurb":"Thread. Check the passkey line against the real flow first.","groups":[
   {"kind":"thread","label":"Thread: on a phone","posts":[
     {"text":"X Chess runs on your phone.\n\nOpen it in the Xverse browser and play. Same board, same chain, nothing installed.",
      "shot":"08-mobile-game.png"},
     {"text":"No app store. No download. No update.\n\nThe board is inscribed. Your browser is the client.",
      "shot":"09-mobile-play.png"},
     {"text":"Have a passkey wallet? That works on mobile too.\n\nFace ID, then a move on Bitcoin.",
      "note":"UNVERIFIED. Only true if there is no seed import step in front of it."},
     {"text":"Chess on Bitcoin, on a phone, signed with your face.\n\nTen years ago that sentence would have been four separate lies.",
      "note":"UNVERIFIED. Same caveat as above."}]}]},

 {"id":"standalone","title":"Standalone posts","blurb":"Drop these in between threads.","groups":[
   {"kind":"single","posts":[
     {"text":"No matchmaking. No lobby. No queue.\n\nYou open a board and share a link. That is the product."},
     {"text":"A person with nothing in their wallet can play a full game on Bitcoin and it costs them nothing at all.\n\nThat is the bit I am proudest of.",
      "shot":"05-sponsored-challenge.png"},
     {"text":"There is no step 5.\n\n1. Open the board\n2. Connect a wallet\n3. Open a game, or open a link\n4. Move","note":"Pin this one."},
     {"text":"The board is not hosted. It is inscribed.\n\nThe artefact is the application."},
     {"text":"It stores no position. No turn. No winner.\n\nJust a list of four character strings and the arithmetic to read it.",
      "shot":"03-moves-panel.png"}]}]},

 {"id":"replies","title":"Replies","blurb":"Alt account asks, main account answers. Leave a few minutes between.","groups":[
   {"kind":"pair","label":"Under the anyone-else post","posts":[
     {"text":"what stops you just playing yourself with a second wallet","who":"alt"},
     {"text":"nothing stops me. anyone-else stops the board accepting it","who":"main"}]},
   {"kind":"pair","label":"Under the sponsored post","posts":[
     {"text":"so you are paying for their moves?","who":"alt"},
     {"text":"the fee for opening a board covers it. players fund the next players","who":"main"}]},
   {"kind":"pair","label":"Under the mobile post","posts":[
     {"text":"does it need an app","who":"alt"},
     {"text":"no. it is a web page that lives on Bitcoin","who":"main"}]},
   {"kind":"pair","label":"Under the live post","posts":[
     {"text":"how do I get a game","who":"alt"},
     {"text":"open one. there is no queue","who":"main"}]},
   {"kind":"pair","label":"Anywhere","posts":[
     {"text":"wait, no account at all?","who":"alt"},
     {"text":"your wallet is the account. the transaction is the signup","who":"main"}]}]},

 {"id":"qt","title":"Quote tweets","blurb":"Add an angle rather than repeating the parent.","groups":[
   {"kind":"single","posts":[
     {"text":"The list of things we deleted is longer than the list of things we built.\n\nThat is the whole project."},
     {"text":"The chain does not judge. It records.\n\nJudgement happens in every reader at once, and they agree because the rules were fixed before the first move."},
     {"text":"Self sustaining is a strong claim so here is the mechanism.\n\nOpening a game costs a fee. That fee funds a reserve. The reserve pays the gas of players who hold nothing.",
      "shot":"05-sponsored-challenge.png"},
     {"text":"Four characters.\n\nThat is the entire protocol."}]}]},

 {"id":"subtraction","title":"Boiling down chess.com","blurb":"Thread. Subtraction is legible: people know what chess.com has.","groups":[
   {"kind":"thread","label":"Thread: delete until only the chess is left","posts":[
     {"text":"Imagine boiling chess.com down until nothing is left but the chess.\n\nDelete the servers. Delete the accounts. Delete the referee. Delete the company.\n\nIt still works. That is X Chess."},
     {"text":"No servers.\n\nThe board is not hosted. It is inscribed on Bitcoin. The artefact is the application."},
     {"text":"No database.\n\nNo position is stored. No turn, no winner. Just a list of four character strings and the arithmetic to read it.",
      "shot":"03-moves-panel.png"},
     {"text":"No account.\n\nYour wallet is the login. There is no signup because the transaction is the signup."},
     {"text":"No referee.\n\nThe contract has never seen a chessboard and never will. It checks that your move is four characters long. That is all it does."},
     {"text":"No anti-cheat.\n\nYou are free to submit an illegal move. It will be stored forever, it will cost you a fee, and it will count for nothing."},
     {"text":"No leaderboard.\n\nRatings are not kept anywhere. Anyone can recompute every rating from the log and get the same numbers."},
     {"text":"No subscription.\n\nOpening a game pays the gas for somebody who holds nothing. New players start with an empty wallet and the contract funds their first moves.",
      "shot":"05-sponsored-challenge.png"},
     {"text":"No company.\n\nIf everyone who built this disappeared tomorrow, the games would keep going."}]}]},

 {"id":"mystery","title":"Mystery (pre-launch)","blurb":"Kept for reference, or reuse for the next drop.","groups":[
   {"kind":"single","posts":[
     {"text":"e2e4"},
     {"text":"A referee that has never seen the game."},
     {"text":"64 squares. No server."},
     {"text":"Nobody is keeping score. Everyone is keeping score."},
     {"text":"The contract cannot tell a queen from a typo. That is the design, not a gap."},
     {"text":"Your blunder is permanent. So is mine."},
     {"text":"There is nothing to take down. No API, no database, no login, no us."}]}]},
]

LIMIT = 280
CSS = """
:root{--bg:#12100e;--panel:#1b1815;--line:#2e2924;--ink:#e8e2d9;--dim:#9a9187;
--gold:#d8a24a;--warn:#e0733f;--good:#6fae5f;--radius:10px}
*{box-sizing:border-box}
body{margin:0;background:var(--bg);color:var(--ink);
font:15px/1.55 ui-sans-serif,system-ui,-apple-system,sans-serif}
a{color:var(--gold)}
header{position:sticky;top:0;z-index:20;background:rgba(18,16,14,.96);
backdrop-filter:blur(8px);border-bottom:1px solid var(--line);padding:14px 20px}
.bar{display:flex;gap:14px;align-items:center;flex-wrap:wrap;max-width:1180px;margin:0 auto}
h1{font-size:18px;margin:0;letter-spacing:.2px}
h1 b{color:var(--gold)}
.grow{flex:1}
input[type=search]{background:#0e0c0a;border:1px solid var(--line);color:var(--ink);
border-radius:8px;padding:9px 12px;font:inherit;min-width:200px}
.chip{background:none;border:1px solid var(--line);color:var(--dim);padding:7px 13px;
border-radius:999px;cursor:pointer;font:inherit;font-size:13px}
.chip:hover{color:var(--ink)}
.chip[aria-pressed=true]{color:var(--gold);border-color:var(--gold);background:#241d12}
.prog{font-size:13px;color:var(--dim);font-variant-numeric:tabular-nums;white-space:nowrap}
main{max-width:1180px;margin:0 auto;padding:22px 20px 90px}
section{margin:0 0 34px}
.sec-head{display:flex;align-items:baseline;gap:12px;flex-wrap:wrap;margin:0 0 12px}
h2{font-size:16px;color:var(--gold);margin:0}
.blurb{color:var(--dim);font-size:13px}
.group{border:1px solid var(--line);border-radius:var(--radius);padding:14px;margin:0 0 14px;
background:#151311}
.group.thread{border-left:3px solid var(--gold)}
.group.pair{border-left:3px solid #4a6fa5}
.group-head{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 12px}
.group-label{font-size:13px;color:var(--dim);text-transform:uppercase;letter-spacing:.9px}
.card{display:grid;grid-template-columns:1fr auto;gap:14px;align-items:start;
border:1px solid var(--line);border-radius:8px;padding:12px;background:var(--panel);
margin:0 0 10px}
.card:last-child{margin-bottom:0}
.card.done{opacity:.42}
.card.done .txt{text-decoration:line-through;text-decoration-color:var(--dim)}
.txt{white-space:pre-wrap;font-size:15px;margin:0 0 10px;overflow-wrap:anywhere}
.meta{display:flex;gap:8px;align-items:center;flex-wrap:wrap}
.count{font-size:12px;font-variant-numeric:tabular-nums;color:var(--good);
border:1px solid #2f4a29;border-radius:999px;padding:2px 9px}
.count.over{color:var(--warn);border-color:#5a2f1c}
.who{font-size:11px;letter-spacing:.8px;text-transform:uppercase;padding:2px 8px;
border-radius:999px;border:1px solid var(--line);color:var(--dim)}
.who.main{color:var(--gold);border-color:#4a3a1e}
button.act{background:#221d18;border:1px solid var(--line);color:var(--ink);
border-radius:7px;padding:7px 12px;font:inherit;font-size:13px;cursor:pointer}
button.act:hover{border-color:var(--gold);color:var(--gold)}
button.act.ok{border-color:var(--good);color:var(--good)}
.note{font-size:12px;color:var(--warn);margin:8px 0 0}
.note.plain{color:var(--dim)}
.side{width:150px;display:flex;flex-direction:column;gap:6px;align-items:stretch}
.side img{width:100%;border:1px solid var(--line);border-radius:6px;cursor:zoom-in;
display:block;background:#0e0c0a}
.fname{font:11px/1.3 ui-monospace,Menlo,monospace;color:var(--dim);overflow-wrap:anywhere}
.tick{display:flex;align-items:center;gap:7px;font-size:13px;color:var(--dim);cursor:pointer;
user-select:none}
.tick input{width:17px;height:17px;accent-color:var(--gold);cursor:pointer}
dialog{border:1px solid var(--line);background:var(--panel);border-radius:12px;padding:10px;
max-width:94vw;max-height:94vh}
dialog::backdrop{background:rgba(0,0,0,.82)}
dialog img{max-width:88vw;max-height:80vh;display:block;border-radius:6px}
dialog .row{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:8px 4px 2px}
.hide{display:none!important}
.toast{position:fixed;left:50%;bottom:26px;transform:translateX(-50%);background:var(--gold);
color:#1b1408;padding:10px 18px;border-radius:999px;font-weight:600;font-size:14px;
opacity:0;pointer-events:none;transition:opacity .18s}
.toast.show{opacity:1}
footer{max-width:1180px;margin:0 auto;padding:0 20px 40px;color:var(--dim);font-size:13px}
code{font-family:ui-monospace,Menlo,monospace;background:#0e0c0a;padding:2px 6px;border-radius:4px}
@media(max-width:720px){.card{grid-template-columns:1fr}.side{width:auto;flex-direction:row;align-items:center}
.side img{width:110px}}
"""

JS = r"""
const LIMIT = 280;
const KEY = 'xchess-posted-v1';
const done = new Set(JSON.parse(localStorage.getItem(KEY) || '[]'));
const save = () => localStorage.setItem(KEY, JSON.stringify([...done]));

function toast(msg){
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  clearTimeout(t._t); t._t = setTimeout(() => t.classList.remove('show'), 1300);
}
async function copy(text, label){
  try { await navigator.clipboard.writeText(text); toast(label || 'Copied'); }
  catch { // file:// without permission, so fall back to a selection
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); ta.remove(); toast(label || 'Copied');
  }
}
function progress(){
  const all = document.querySelectorAll('.card').length;
  document.getElementById('prog').textContent = done.size + ' of ' + all + ' posted';
}
function applyFilter(){
  const q = document.getElementById('q').value.trim().toLowerCase();
  const mode = document.querySelector('.chip[aria-pressed=true]').dataset.filter;
  for (const card of document.querySelectorAll('.card')){
    const text = card.dataset.text.toLowerCase();
    const isDone = card.classList.contains('done');
    let ok = !q || text.includes(q);
    if (ok && mode === 'todo') ok = !isDone;
    if (ok && mode === 'shots') ok = card.dataset.shot !== '';
    card.classList.toggle('hide', !ok);
  }
  for (const g of document.querySelectorAll('.group')){
    g.classList.toggle('hide', !g.querySelector('.card:not(.hide)'));
  }
  for (const s of document.querySelectorAll('section')){
    s.classList.toggle('hide', !s.querySelector('.group:not(.hide)'));
  }
}
document.addEventListener('DOMContentLoaded', () => {
  for (const card of document.querySelectorAll('.card')){
    const id = card.dataset.id;
    const box = card.querySelector('input[type=checkbox]');
    if (done.has(id)) { card.classList.add('done'); box.checked = true; }
    box.addEventListener('change', () => {
      box.checked ? done.add(id) : done.delete(id);
      card.classList.toggle('done', box.checked);
      save(); progress(); applyFilter();
    });
    card.querySelector('.copy').addEventListener('click', () => copy(card.dataset.text, 'Tweet copied'));
    const path = card.querySelector('.copypath');
    if (path) path.addEventListener('click', () => copy(card.dataset.abs, 'Image path copied'));
    const img = card.querySelector('img');
    if (img) img.addEventListener('click', () => {
      const d = document.getElementById('lb');
      d.querySelector('img').src = img.src;
      d.querySelector('.lbname').textContent = card.dataset.shot;
      d.showModal();
    });
  }
  for (const b of document.querySelectorAll('.copy-thread')){
    b.addEventListener('click', () => {
      const cards = [...b.closest('.group').querySelectorAll('.card')];
      const numbered = cards.map((c, i) => (i + 1) + '/ ' + c.dataset.text).join('\n\n---\n\n');
      copy(numbered, 'Whole thread copied');
    });
  }
  document.getElementById('q').addEventListener('input', applyFilter);
  for (const chip of document.querySelectorAll('.chip')){
    chip.addEventListener('click', () => {
      document.querySelectorAll('.chip').forEach(c => c.setAttribute('aria-pressed', 'false'));
      chip.setAttribute('aria-pressed', 'true');
      applyFilter();
    });
  }
  document.getElementById('reset').addEventListener('click', () => {
    if (!confirm('Clear every posted tick?')) return;
    done.clear(); save();
    document.querySelectorAll('.card').forEach(c => {
      c.classList.remove('done'); c.querySelector('input').checked = false;
    });
    progress(); applyFilter();
  });
  document.getElementById('lbclose').addEventListener('click', () => document.getElementById('lb').close());
  progress();
});
"""

def card(post, cid, base):
    text = post["text"]
    n = len(text)
    over = " over" if n > LIMIT else ""
    shot = post.get("shot", "")
    who = post.get("who", "")
    note = post.get("note", "")
    side = ""
    if shot:
        side = (f'<div class="side"><img src="{shot}" alt="" loading="lazy" draggable="true">'
                f'<div class="fname">{shot}</div>'
                f'<button class="act copypath" type="button">Copy path</button></div>')
    whotag = f'<span class="who {who}">{"alt account" if who=="alt" else "you"}</span>' if who else ""
    notetag = ""
    if note:
        plain = "" if note.startswith("UNVERIFIED") or note.startswith("BEST") else " plain"
        notetag = f'<p class="note{plain}">{html.escape(note)}</p>'
    return f'''<div class="card" data-id="{cid}" data-shot="{shot}"
 data-abs="{html.escape(base + "/" + shot) if shot else ""}"
 data-text="{html.escape(text)}">
<div><p class="txt">{html.escape(text)}</p>
<div class="meta">{whotag}<span class="count{over}">{n}/{LIMIT}</span>
<button class="act copy" type="button">Copy</button>
<label class="tick"><input type="checkbox"> posted</label></div>{notetag}</div>
{side}</div>'''

def build(base):
    out = []
    for camp in CAMPAIGNS:
        out.append(f'<section id="{camp["id"]}"><div class="sec-head"><h2>{html.escape(camp["title"])}</h2>'
                   f'<span class="blurb">{html.escape(camp["blurb"])}</span></div>')
        for gi, g in enumerate(camp["groups"]):
            kind = g["kind"]
            head = ""
            if g.get("label") or kind == "thread":
                btn = ('<button class="act copy-thread" type="button">Copy whole thread</button>'
                       if kind == "thread" else "")
                head = (f'<div class="group-head"><span class="group-label">'
                        f'{html.escape(g.get("label",""))}</span>{btn}</div>')
            out.append(f'<div class="group {kind}">{head}')
            for pi, post in enumerate(g["posts"]):
                out.append(card(post, f'{camp["id"]}-{gi}-{pi}', base))
            out.append('</div>')
        out.append('</section>')
    return "\n".join(out)

base = str(pathlib.Path(__file__).resolve().parent)
page = f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>X Chess posting board</title>
<style>{CSS}</style></head>
<body>
<header><div class="bar">
<h1><b>X Chess</b> posting board</h1>
<input type="search" id="q" placeholder="Search the text">
<button class="chip" data-filter="all" aria-pressed="true">All</button>
<button class="chip" data-filter="todo" aria-pressed="false">Not posted</button>
<button class="chip" data-filter="shots" aria-pressed="false">Has image</button>
<span class="grow"></span>
<span class="prog" id="prog"></span>
<button class="act" id="reset" type="button">Reset ticks</button>
</div></header>
<main>
{build(base)}
</main>
<footer>
<p>Ticks are remembered in this browser only. Images live beside this file, so keep them together.
To attach one, drag the thumbnail straight into the compose box, or hit <b>Copy path</b> and paste it
into the file picker with <code>Cmd Shift G</code>.</p>
<p>Counts are plain character counts. A link always counts as 23 whatever its length.</p>
<p>To add a thread later, edit <code>build-page.py</code> and run <code>python3 build-page.py</code>.</p>
</footer>
<dialog id="lb"><div class="row"><span class="lbname fname"></span>
<button class="act" id="lbclose" type="button">Close</button></div><img alt=""></dialog>
<div class="toast" id="toast"></div>
<script>{JS}</script>
</body></html>'''

pathlib.Path(base, "tweets.html").write_text(page, encoding="utf-8")
cards = sum(len(g["posts"]) for c in CAMPAIGNS for g in c["groups"])
longest = max((len(p["text"]) for c in CAMPAIGNS for g in c["groups"] for p in g["posts"]))
over = [p["text"][:40] for c in CAMPAIGNS for g in c["groups"] for p in g["posts"] if len(p["text"]) > LIMIT]
print(f"tweets.html written: {len(CAMPAIGNS)} campaigns, {cards} posts, longest {longest} chars")
print("over the limit:", over or "none")
