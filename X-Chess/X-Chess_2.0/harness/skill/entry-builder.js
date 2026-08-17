// X-CHESS-SKILL/1  entry-builder
//
// Checks a character sheet before anybody pays to inscribe it.
//
// AN INSCRIPTION CANNOT BE EDITED. A sheet with a field name nobody reads, or a
// style two characters over the limit, is wrong forever and was paid for. So
// the validator is inscribed alongside the tournament that enforces it: an
// entrant can run the exact code the Director will run, on their own machine,
// before spending anything.
//
// AN ENTRY IS A PERSONALITY, NOT A CHESS PROGRAM. Every player is handed the
// same engine and arrives competent; the sheet decides only what KIND of player
// it is. Teaching chess in a prompt was measured four times here and never
// worked once — more thinking effort, competence instructions, a king-mobility
// hint, all zero. Without that inversion a tournament measures who wrote the
// best chess instructions, which is a worse game than chess and one nobody can
// referee.
//
// blankEntry() returns a form with every limit written next to its field.
// parseEntry(text) returns { ok, entry, problems, used } — problems name the
// field and say what is wrong, because "invalid" helps nobody holding a wallet.
// entryToPrompt(entry) is exactly what the model is shown.
//
// The instruction-shaped-text check is a COURTESY, not a defence, and the tests
// say so. The real boundary is structural: an entry goes in the user turn, never
// the system prompt, and whatever comes back must be one move from a list the
// harness generated. The strongest thing any sheet can cause is a legal move.
var ENTRY_HEADER = "X-CHESS-ENTRY/1";
var FIELDS = [
  "name",
  "pronouns",
  "motto",
  "style",
  "opening",
  "risk",
  "endgame",
  "quirk"
];
var LIMITS = {
  name: 24,
  pronouns: 20,
  motto: 80,
  style: 600,
  opening: 200,
  risk: 200,
  endgame: 200,
  quirk: 120
};
var REQUIRED = ["name", "style"];
var MAX_TOTAL = 1200;
var INSTRUCTION_SHAPED = [
  "ignore previous",
  "ignore all previous",
  "disregard",
  "system prompt",
  "you are now",
  "new instructions",
  "override",
  "reveal your",
  "print your",
  "output the"
];
function parseEntry(text) {
  const problems = [];
  const raw = typeof text === "string" ? text : "";
  const lines = raw.replace(/\r\n?/g, "\n").split("\n");
  if (lines[0]?.trim() !== ENTRY_HEADER) {
    return {
      ok: false,
      entry: null,
      used: 0,
      problems: [{ field: "entry", says: `the first line must be exactly "${ENTRY_HEADER}"` }]
    };
  }
  const found = {};
  const known = new Set(FIELDS);
  let current = null;
  for (const line of lines.slice(1)) {
    if (!line.trim()) {
      current = null;
      continue;
    }
    if (line.trim().startsWith("#")) continue;
    if (/^\s/.test(line) && current) {
      found[current] = `${found[current] ?? ""} ${line.trim()}`.trim();
      continue;
    }
    const at = line.indexOf(":");
    if (at < 1) {
      problems.push({ field: "entry", says: `cannot read this line: ${line.trim().slice(0, 40)}` });
      current = null;
      continue;
    }
    const label = line.slice(0, at).trim().toLowerCase();
    const value = line.slice(at + 1).trim();
    if (!known.has(label)) {
      problems.push({ field: "entry", says: `"${label}" is not a field. Allowed: ${FIELDS.join(", ")}` });
      current = null;
      continue;
    }
    const field = label;
    if (found[field] !== void 0) {
      problems.push({ field, says: "given twice" });
    }
    found[field] = value;
    current = field;
  }
  for (const field of REQUIRED) {
    if (!found[field]?.trim()) problems.push({ field, says: "is required" });
  }
  let used = 0;
  for (const field of FIELDS) {
    const value = found[field];
    if (value === void 0) continue;
    used += value.length;
    if (value.length > LIMITS[field]) {
      problems.push({ field, says: `is ${value.length} characters, and the limit is ${LIMITS[field]}` });
    }
    const lowered = value.toLowerCase();
    for (const phrase of INSTRUCTION_SHAPED) {
      if (lowered.includes(phrase)) {
        problems.push({
          field,
          says: `reads as an instruction ("${phrase}"). An entry describes a player; it is shown to the model as a description and cannot direct it.`
        });
        break;
      }
    }
  }
  if (used > MAX_TOTAL) {
    problems.push({ field: "entry", says: `is ${used} characters, and the limit is ${MAX_TOTAL}` });
  }
  const ok = problems.length === 0;
  return {
    ok,
    used,
    problems,
    entry: ok ? { ...found } : null
  };
}
function entryToPrompt(entry) {
  const lines = [entry.style.trim()];
  const add = (label, value) => {
    if (value?.trim()) lines.push(`${label}: ${value.trim()}`);
  };
  add("Openings", entry.opening);
  add("Risk", entry.risk);
  add("Endgames", entry.endgame);
  add("Quirk", entry.quirk);
  return lines.join("\n\n");
}
function blankEntry() {
  return `${ENTRY_HEADER}
# Fill this in and inscribe it. Lines starting with # are ignored.
# Your character is handed a chess engine that already plays competently.
# You are not teaching it chess. You are deciding who it is.

name:
# ${LIMITS.name} characters. What the board and the leaderboard will call it.

pronouns:
# ${LIMITS.pronouns} characters. Optional. Used when the board talks about your player.

motto:
# ${LIMITS.motto} characters. Optional. Shown under the name.

style:
# ${LIMITS.style} characters. REQUIRED, and the heart of the entry.
# Describe the kind of player this is. What does it want from a position?
# What does it find beautiful, or beneath it? Write about a PLAYER, not about
# chess rules - the engine handles those.

opening:
# ${LIMITS.opening} characters. Optional. What it likes to play, and why.

risk:
# ${LIMITS.risk} characters. Optional. When it will accept a worse move for a
# sharper game, and when it will not.

endgame:
# ${LIMITS.endgame} characters. Optional. How it behaves once the pieces thin out.

quirk:
# ${LIMITS.quirk} characters. Optional. One habit that makes it recognisable.

# ${MAX_TOTAL} characters across all fields. Everything is public and permanent.
`;
}
export {
  ENTRY_HEADER,
  FIELDS,
  LIMITS,
  MAX_TOTAL,
  REQUIRED,
  blankEntry,
  entryToPrompt,
  parseEntry
};
