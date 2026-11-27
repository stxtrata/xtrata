// On the pay-per-play radio host nothing here may run as that origin. See functions/lib/radio-host.ts.
// On the main host, direct loads of raw inscription HTML/SVG can be sandboxed. See functions/lib/content-isolation.ts.
// Tabs opened straight on an inscription get the Xtrata icon if it has none. See functions/lib/tab-icon.ts.
// Order matters: the radio guard runs first and its sandbox wins on the radio host.
import { radioHostGuard } from '../lib/radio-host';
import { contentIsolationGuard } from '../lib/content-isolation';
import { tabIconGuard } from '../lib/tab-icon';

export const onRequest = [radioHostGuard, tabIconGuard, contentIsolationGuard];
