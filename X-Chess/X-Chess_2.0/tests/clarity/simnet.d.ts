// The `simnet` global the clarinet vitest environment injects.
//
// The environment provides it at runtime but there is no ambient declaration
// for it, so without this every Clarity test is a wall of "Cannot find name
// 'simnet'" and `npm run typecheck` is useless as a gate. Typed from the SDK's
// own Simnet interface rather than as `any`, so a wrong argument is still an
// error here.

import type { Simnet } from '@stacks/clarinet-sdk';

declare global {
  // eslint-disable-next-line no-var
  var simnet: Simnet;
}

export {};
