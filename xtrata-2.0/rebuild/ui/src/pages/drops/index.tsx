import { mountPage } from '../../shell/mount';
import { DropsApp, parseRoute } from './DropsApp';

/**
 * Drop Builder + claim page entry.
 *
 * One MPA entry serves both audiences: `?drop=<id>` (or `?view=claim`) opens
 * the collector's claim page, and `?collection=<contractId>` is the Collection
 * Studio handoff into the creator's builder.
 */
const route = parseRoute(typeof window === 'undefined' ? '' : window.location.href);

mountPage(<DropsApp route={route} />);
