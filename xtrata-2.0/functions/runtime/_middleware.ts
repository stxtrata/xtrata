// On the pay-per-play radio host nothing here may run as that origin. See functions/lib/radio-host.ts.
// On the main host, direct loads of raw inscription HTML/SVG can be sandboxed. See functions/lib/content-isolation.ts.
// Order matters: the radio guard runs first and its sandbox wins on the radio host.
import { radioHostGuard } from '../lib/radio-host';
import { contentIsolationGuard } from '../lib/content-isolation';

export const onRequest = [radioHostGuard, contentIsolationGuard];
