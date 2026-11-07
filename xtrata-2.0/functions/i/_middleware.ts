// On the pay-per-play radio host nothing here may run as that origin. See functions/lib/radio-host.ts.
// On the main host, direct loads of raw inscription HTML/SVG can be sandboxed. See functions/lib/content-isolation.ts.
// Link-preview crawlers get preview tags instead of raw HTML. See functions/lib/link-preview.ts.
// Order matters: the radio guard runs first and its sandbox wins on the radio host.
import { radioHostGuard } from '../lib/radio-host';
import { contentIsolationGuard } from '../lib/content-isolation';
import { linkPreviewGuard } from '../lib/link-preview';

export const onRequest = [radioHostGuard, linkPreviewGuard, contentIsolationGuard];
