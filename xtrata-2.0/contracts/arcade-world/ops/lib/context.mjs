// Builds the facts the validator needs (look book, rooms, current height, timeline use) either from a chain or offline.
import { readFileSync } from 'node:fs';
import { defaultLookBook, ROOMS } from './catalogue.mjs';
import { networkTransport } from './transport.mjs';
import { readLookBook, readRooms, readTimelineCounts } from './readback.mjs';

export function transportFromArgs(args, env = process.env) {
  const network = args.network;
  if (!network) return null;
  if (!['testnet', 'mainnet', 'devnet'].includes(network)) throw new Error('--network must be testnet, mainnet or devnet (leave it out to work offline)');
  const world = args.world || env.XA_WORLD, posters = args.posters || env.XA_POSTERS;
  if (!world || !posters) throw new Error('--world and --posters (full contract ids) are needed with --network (or XA_WORLD / XA_POSTERS)');
  return networkTransport({ network, names: { world, posters }, readSender: args.readSender || env.XA_READ_SENDER });
}

// Returns { t, looks, rooms, height, timelineUsed, offline }
export async function loadContext(args, doc, t = undefined) {
  if (t === undefined) t = transportFromArgs(args);
  if (t) {
    const looks = await readLookBook(t);
    const room = doc && doc.room;
    const rooms = room ? await readRooms(t, [room, ...new Set(((doc.scenes || []).map((s) => s.link && s.link.room)).filter(Boolean))]) : {};
    const timelineUsed = room && rooms[room] ? await readTimelineCounts(t, room, rooms[room].bays) : {};
    return { t, looks, rooms, height: await t.height(), timelineUsed, offline: false };
  }
  const looks = args.looks ? JSON.parse(readFileSync(args.looks, 'utf8')) : defaultLookBook();
  const height = args.height != null ? Number(args.height) : null;
  const rooms = doc && doc.room ? { [doc.room]: { bays: (ROOMS.find((r) => r.id === doc.room) || { bays: 2 }).bays, hidden: false }, ...(args.rooms ? JSON.parse(readFileSync(args.rooms, 'utf8')) : { lobby: { bays: 2, hidden: false } }) } : {};
  return { t: null, looks, rooms, height, timelineUsed: {}, offline: true };
}
