import React from 'react';
import ReactDOM from 'react-dom/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App';
// PublicApp and SimplePublicHome are intentionally no longer mounted — see the
// isLegacyPublicPanelPath comment below. The files are kept so the fix can be
// applied to src/screens/MintScreen.tsx and the routes restored.
import CollectionMintLivePage from './CollectionMintLivePage';
import LabLandingPage from './LabLandingPage';
import LabEvolutionPage from './LabEvolutionPage';
import ContractStudioPage from './contract-studio/ContractStudioPage';
import AdminGate from './admin/AdminGate';
import ArtistManagerGate from './manage/ArtistManagerGate';
import CollectionManagerApp from './manage/CollectionManagerApp';
import { ADMIN_PATH } from './config/admin';
import { MANAGE_PATH } from './config/manage';
import { ReadOnlyBackoffError } from './lib/contract/read-only';
import { hydrateQueryCache, setupQueryCachePersistence } from './lib/cache/query-persist';
import { applyThemeToDocument, resolveInitialTheme } from './lib/theme/preferences';
import './styles/app.css';
import { installGlobalTelemetry, TelemetryBoundary } from './lib/telemetry';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error) => {
        if (error instanceof ReadOnlyBackoffError) {
          return failureCount < 1;
        }
        return failureCount < 1;
      },
      retryDelay: (failureCount, error) => {
        if (error instanceof ReadOnlyBackoffError) {
          return error.retryAfterMs;
        }
        return Math.min(1000 * 2 ** failureCount, 8000);
      },
      refetchOnWindowFocus: false
    }
  }
});

void hydrateQueryCache(queryClient);
setupQueryCachePersistence(queryClient);

const root = document.getElementById('root');
if (!root) {
  throw new Error('Root element not found');
}

applyThemeToDocument(resolveInitialTheme());

// Capture uncaught errors + flush on tab hide, site-wide.
installGlobalTelemetry();

const COLLECTION_LIVE_PATH_PREFIX = '/collection/';
const LAB_PATH_PREFIX = '/lab';
const LAB_EVOLUTION_PATH_PREFIX = '/lab/evolution';
const CONTRACT_STUDIO_PATH_PREFIX = '/contract-studio';
const pathname = window.location.pathname;
const isLabPath = pathname === LAB_PATH_PREFIX || pathname.startsWith(`${LAB_PATH_PREFIX}/`);
const isLabEvolutionPath =
  pathname === LAB_EVOLUTION_PATH_PREFIX || pathname.startsWith(`${LAB_EVOLUTION_PATH_PREFIX}/`);
const collectionPathMatch = pathname.startsWith(COLLECTION_LIVE_PATH_PREFIX)
  ? pathname.slice(COLLECTION_LIVE_PATH_PREFIX.length)
  : '';
const decodePathSegment = (value: string) => {
  try {
    return decodeURIComponent(value).trim();
  } catch {
    return value.trim();
  }
};
const collectionIdFromPath =
  collectionPathMatch.length > 0 ? decodePathSegment(collectionPathMatch.split('/')[0] ?? '') : '';

// The legacy public panel (PublicApp at /workspace, SimplePublicHome as the
// catch-all) duplicates the homepage, but its mint path pins an exact-match STX
// post-condition against a stale three-stage fee estimate. On v3.2.3 that means
// 300000 SentEq 11000: every inscription by a non-admin aborts and burns the
// miner fee. It only ever worked for the fee recipient, which is why it survived
// internal testing. See src/screens/MintScreen.tsx (resolveFeePostConditions).
//
// Until that is fixed, anything that would have landed on the legacy panel goes
// to the homepage, which mints correctly. This deliberately also covers bare
// /collection, which used to fall through to SimplePublicHome. The gated tools
// are unaffected: public/_redirects rewrites them to this asset but preserves
// their own pathname, so they still match their own branch below.
const isLegacyPublicPanelPath =
  !collectionIdFromPath &&
  !pathname.startsWith(CONTRACT_STUDIO_PATH_PREFIX) &&
  !pathname.startsWith(ADMIN_PATH) &&
  !pathname.startsWith(MANAGE_PATH) &&
  !isLabEvolutionPath &&
  !isLabPath;

if (isLegacyPublicPanelPath) {
  window.location.replace('/');
} else {
  ReactDOM.createRoot(root).render(
    <React.StrictMode>
      <TelemetryBoundary>
        <QueryClientProvider client={queryClient}>
          {collectionIdFromPath ? (
            <CollectionMintLivePage collectionKey={collectionIdFromPath} />
          ) : pathname.startsWith(CONTRACT_STUDIO_PATH_PREFIX) ? (
            <ContractStudioPage />
          ) : pathname.startsWith(ADMIN_PATH) ? (
            <AdminGate>
              <App />
            </AdminGate>
          ) : pathname.startsWith(MANAGE_PATH) ? (
            <ArtistManagerGate>
              <CollectionManagerApp />
            </ArtistManagerGate>
          ) : isLabEvolutionPath ? (
            <LabEvolutionPage />
          ) : (
            <LabLandingPage />
          )}
        </QueryClientProvider>
      </TelemetryBoundary>
    </React.StrictMode>
  );
}
