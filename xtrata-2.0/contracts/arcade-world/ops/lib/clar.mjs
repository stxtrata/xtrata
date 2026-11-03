// Clarity encoding of the tools' plain objects. Pure functions, no network.
import { Cl } from '@stacks/transactions';

const S = (s) => Cl.stringAscii(s);

// Scene as compiled by scene.mjs:
//   { room, bay, from, base, doorLook: id|null, layers: [{slot, look, params, state}], interaction, link: null|{targetRoom, arrivalBay, path} }
export function sceneCv(s) {
  return Cl.tuple({
    room: S(s.room), bay: Cl.uint(s.bay), 'from-height': Cl.uint(s.from), base: Cl.uint(s.base),
    'door-look': s.doorLook == null ? Cl.none() : Cl.some(Cl.uint(s.doorLook)),
    layers: Cl.list(s.layers.map((l) => Cl.tuple({ slot: Cl.uint(l.slot), look: Cl.uint(l.look), params: S(l.params), state: S(l.state) }))),
    interaction: Cl.uint(s.interaction),
    link: s.link ? Cl.some(Cl.tuple({ 'target-room': S(s.link.targetRoom), 'arrival-bay': Cl.uint(s.link.arrivalBay), path: S(s.link.path) })) : Cl.none(),
  });
}

// Poster as compiled by posters.mjs (all fields present).
export function posterCv(p) {
  return Cl.tuple({
    set: Cl.uint(p.set), kind: Cl.uint(p.kind),
    head: S(p.head), sub: S(p.sub), foot: S(p.foot), colour: S(p.colour), art: S(p.art),
    'image-id': Cl.uint(p.imageId), 'image-hash': Cl.buffer(p.imageHash), 'image-size': Cl.uint(p.imageSize),
    cols: Cl.uint(p.cols), frames: Cl.uint(p.frames), fps: Cl.uint(p.fps),
    'act-kind': Cl.uint(p.actKind), 'act-id': Cl.uint(p.actId), 'act-text': S(p.actText),
    weight: Cl.uint(p.weight), 'start-day': Cl.uint(p.startDay), 'end-day': Cl.uint(p.endDay),
    scope: Cl.list(p.scope.map(S)), evergreen: Cl.bool(p.evergreen),
    payout: p.payout ? Cl.some(Cl.principal(p.payout)) : Cl.none(),
  });
}

export const cl = { Cl, S };
