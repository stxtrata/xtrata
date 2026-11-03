// Campaign generators: turn a short list of things to announce into a poster file (arcade-poster-file/1).
// They emit ABSOLUTE Bitcoin day numbers, anchored at the day you generate on, so the file means the same thing every time it is read
// (the bot relies on that to know it already sent a poster).
import { POSTER_FORMAT } from './posters.mjs';
import { DAY_BLOCKS } from './util.mjs';

const itemFields = (it) => {
  const o = { head: it.head, sub: it.sub == null ? '' : it.sub };
  for (const k of ['foot', 'colour', 'art', 'kind', 'weight', 'action', 'scope', 'image', 'sheet', 'payout', 'evergreen']) if (it[k] != null) o[k] = it[k];
  return o;
};

// Show `items` one after another across `days` days starting `startDay`, each for `each` days (`overlap` > 1 makes windows overlap so
// several are live at once). Items cycle if there are more days than items.
export function rotation({ items, startDay, days, each = 1, overlap = 1, defaults = {} }) {
  if (!Array.isArray(items) || !items.length) throw new Error('rotation needs a non-empty list of items');
  if (!Number.isInteger(startDay) || !(days >= 1) || !(each >= 1) || !(overlap >= 1)) throw new Error('rotation needs startDay, days >= 1, each >= 1, overlap >= 1');
  const posters = [];
  for (let d = 0, i = 0; d < days; d += each, i++) {
    posters.push({ ...itemFields(items[i % items.length]), from: startDay + d, days: Math.max(1, Math.round(each * overlap)) });
  }
  return { format: POSTER_FORMAT, defaults, posters };
}

// Events with a date: each poster starts `lead` days before and runs through the event day. event.day is a Bitcoin day number, or
// event.date is "YYYY-MM-DD" and todayDate is today's date (a Bitcoin day is close to a calendar day, at 144 blocks).
export function calendar({ events, todayDay, todayDate = null, lead = 2, defaults = {} }) {
  if (!Array.isArray(events) || !events.length) throw new Error('calendar needs a non-empty list of events');
  const posters = events.map((e, i) => {
    let day = e.day;
    if (day == null) {
      if (!e.date || !todayDate) throw new Error(`event ${i + 1}: give "day" (a Bitcoin day number) or "date" with --today-date`);
      const diff = Math.round((Date.parse(e.date + 'T00:00:00Z') - Date.parse(todayDate + 'T00:00:00Z')) / 86400000);
      if (!Number.isFinite(diff)) throw new Error(`event ${i + 1}: bad date ${e.date}`);
      day = todayDay + diff;
    }
    const l = e.lead == null ? lead : e.lead;
    const start = Math.max(todayDay + 1, day - l);
    if (day < start) throw new Error(`event ${i + 1} ("${e.head}") is already past`);
    return { ...itemFields(e), from: start, until: day + 1 };
  });
  return { format: POSTER_FORMAT, defaults, posters };
}

export const dayOf = (height) => Math.floor(height / DAY_BLOCKS);
