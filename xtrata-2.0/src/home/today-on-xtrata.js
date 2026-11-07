// "Today on Xtrata": which day of the campaign it is, and which card goes in the first wall slot.
// Pure functions with an injectable clock, so the UK midnight rollover, the launch and the end
// can be tested. The content lives in today-schedule.js.
import { TODAY_DAYS, TODAY_LAUNCH_DATE, TODAY_SCHEDULE, TODAY_TIMEZONE } from './today-schedule.js';

const DAY_MS = 86400000;
const formatters = new Map();

const ukParts = (ms, timeZone) => {
  let format = formatters.get(timeZone);
  if (!format) {
    format = new Intl.DateTimeFormat('en-GB', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' });
    formatters.set(timeZone, format);
  }
  const out = {};
  format.formatToParts(new Date(ms)).forEach((part) => { if (part.type !== 'literal') out[part.type] = Number(part.value); });
  return out;
};

/** The calendar day in the given zone as a whole number of days since 1970-01-01. */
export const calendarDay = (ms, timeZone = TODAY_TIMEZONE) => {
  const { year, month, day } = ukParts(ms, timeZone);
  return Math.floor(Date.UTC(year, month - 1, day) / DAY_MS);
};

const launchDay = (launchDate) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(String(launchDate));
  if (!match) return null;
  return Math.floor(Date.UTC(Number(match[1]), Number(match[2]) - 1, Number(match[3])) / DAY_MS);
};

/** 1..days while the campaign runs (by UK date, whatever the visitor's own timezone), otherwise null. */
export const todayDayNumber = (now = Date.now(), { launchDate = TODAY_LAUNCH_DATE, days = TODAY_DAYS, timeZone = TODAY_TIMEZONE } = {}) => {
  const start = launchDay(launchDate);
  if (start === null || !Number.isFinite(now)) return null;
  const n = calendarDay(now, timeZone) - start + 1;
  return n >= 1 && n <= days ? n : null;
};

/** The schedule entry for a given moment, or null before launch / after the last day / if that day is missing. */
export const todayEntry = (now = Date.now(), options = {}) => {
  const schedule = options.schedule || TODAY_SCHEDULE;
  const n = options.day ?? todayDayNumber(now, options);
  if (!n) return null;
  return schedule.find((entry) => entry.day === n) || null;
};

/** Milliseconds from `now` until the UK date next changes (found by search, so clock changes are handled). */
export const msUntilNextUkMidnight = (now = Date.now(), timeZone = TODAY_TIMEZONE) => {
  const today = calendarDay(now, timeZone);
  let lo = now;
  let hi = now + 26 * 3600000;
  while (hi - lo > 1) {
    const mid = Math.floor((lo + hi) / 2);
    if (calendarDay(mid, timeZone) === today) lo = mid; else hi = mid;
  }
  return hi - now;
};

/** Optional preview for the team: ?today=3 shows Day 3 whatever the date. Ignored if it is not 1..days. */
export const previewDay = (search = '', days = TODAY_DAYS) => {
  const raw = new URLSearchParams(search).get('today');
  const n = raw === null ? NaN : Number(raw);
  return Number.isInteger(n) && n >= 1 && n <= days ? n : null;
};

const CHAMPION_ENDPOINT = '/api/arcade-champion';
const NAME = /^[A-Za-z0-9 _.-]{1,12}$/;

/** Reads the current Astro Blaster champion. Resolves to { name, score } or null when it cannot be read. */
export const fetchChampion = async (fetchImpl = globalThis.fetch, timeoutMs = 4000) => {
  try {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    const response = await fetchImpl(CHAMPION_ENDPOINT, { cache: 'no-store', signal: controller?.signal });
    if (timer) clearTimeout(timer);
    if (!response.ok) return null;
    const data = await response.json();
    if (!data || data.version !== 1 || data.empty === true) return null;
    if (typeof data.name !== 'string' || !NAME.test(data.name)) return null;
    if (!Number.isSafeInteger(data.score) || data.score <= 0) return null;
    return { name: data.name, score: data.score };
  } catch {
    return null;
  }
};

export const championCopy = (champion, fallback) =>
  champion
    ? `${champion.name} holds the crown with ${new Intl.NumberFormat('en-GB').format(champion.score)} points. Can you beat it?`
    : fallback;

/** Everything wrong with the schedule, as a list of messages (empty when it is sound). */
export const validateTodaySchedule = (schedule = TODAY_SCHEDULE, days = TODAY_DAYS, launchDate = TODAY_LAUNCH_DATE) => {
  const errors = [];
  const start = launchDay(launchDate);
  if (start === null) errors.push('Launch date must look like 2026-11-09.');
  else if (new Date(start * DAY_MS).getUTCDay() !== 1) errors.push('Launch date must be a Monday.');
  if (schedule.length !== days) errors.push(`Schedule has ${schedule.length} entries but TODAY_DAYS is ${days}.`);
  const ids = new Set();
  schedule.forEach((entry, i) => {
    const where = `Day ${entry.day ?? i + 1}`;
    if (entry.day !== i + 1) errors.push(`${where}: days must run 1..${days} in order.`);
    if (!entry.id || ids.has(entry.id)) errors.push(`${where}: id missing or repeated.`);
    ids.add(entry.id);
    ['feature', 'title', 'copy'].forEach((key) => { if (!entry[key]) errors.push(`${where}: ${key} is required.`); });
    if (!entry.action || !entry.action.label) errors.push(`${where}: needs one primary action with a label.`);
    else if (entry.action.type === 'song') {
      if (!Number.isInteger(entry.action.tokenId)) errors.push(`${where}: song action needs a tokenId.`);
    } else if (!entry.action.href || !(entry.action.href.startsWith('/') || entry.action.href.startsWith('https://'))) {
      errors.push(`${where}: action needs a / or https:// href.`);
    }
    if (/—/.test(`${entry.title} ${entry.copy}`)) errors.push(`${where}: no em dashes in card copy.`);
  });
  return errors;
};

/**
 * How far this device's clock is from the server's, in ms (server minus device), read from the HTTP Date
 * header of a tiny same-origin request. Returns 0 when it cannot be read or looks wrong, so the device
 * clock is used as before. A wrong device clock then cannot show the wrong day.
 */
export const fetchClockOffset = async (fetchImpl = globalThis.fetch, url = '/favicon.svg', timeoutMs = 4000) => {
  try {
    const controller = typeof AbortController === 'function' ? new AbortController() : null;
    const timer = controller ? setTimeout(() => controller.abort(), timeoutMs) : null;
    const sent = Date.now();
    const response = await fetchImpl(url, { method: 'HEAD', cache: 'no-store', signal: controller?.signal });
    const received = Date.now();
    if (timer) clearTimeout(timer);
    const header = response.headers?.get?.('date');
    const server = header ? Date.parse(header) : NaN;
    if (!Number.isFinite(server)) return 0;
    const offset = server - (sent + received) / 2;
    return Math.abs(offset) <= 3 * 86400000 ? Math.round(offset) : 0;
  } catch {
    return 0;
  }
};
