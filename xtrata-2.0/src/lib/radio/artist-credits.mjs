// Artist display credits supplied in song-assignments.csv (Audionauts-NFT-v9.0.0).
// Deduplicated by song_inscription_id; empty artist cells are not overrides.
export const ARTIST_CREDITS = Object.freeze({
  "8": "melophonic",
  "312": "Hundred Little Reasons",
  "315": "melophonic",
  "577": "Cicada",
  "688": "Cicada",
  "689": "Cicada",
  "785": "Cicada",
  "1050": "Cicada",
  "1097": "Audionals",
  "1099": "Audionals",
  "1101": "Audionals",
  "1105": "Audionals",
  "1107": "Audionals",
  "1117": "Cicada",
  "1120": "Audionals",
  "1122": "Hundred Little Reasons",
  "2186": "Hundred Little Reasons",
  "2187": "Hundred Little Reasons",
  "2188": "Hundred Little Reasons",
  "2189": "Hundred Little Reasons",
  "2190": "Hundred Little Reasons",
  "2753": "BotCupid",
  "2755": "botcupid",
  "2756": "botcupid",
  "2830": "Xtrata Demo",
  "2883": "Audionals",
  "2885": "Audionals",
  "2889": "Audionals",
  "2892": "Audionals",
  "2895": "Audionals",
  "2896": "Audionals",
  "2910": "Audionals",
  "2964": "3ai3",
  "2971": "Audionals",
  "2972": "Audionals",
  "2978": "Audionals",
  "2981": "Audionals",
  "2985": "3ai3",
  "3018": "3ai3",
  "3020": "3ai3",
  "3031": "3ai3",
  "3032": "3ai3",
  "3036": "3ai3"
});
export function radioArtist(id, fallback = "") {
 return Object.hasOwn(ARTIST_CREDITS, String(id)) ? ARTIST_CREDITS[String(id)] : fallback;
}

const TITLES = Object.freeze({312: 'Smalltalk', 315: 'Entertainment'});
export function radioTitle(id, fallback = '') {
 return Object.hasOwn(TITLES, String(id)) ? TITLES[String(id)] : fallback;
}
