import { onRequest as __runtime_modules__network___contractAddress___contractName___entryTokenId____path___ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/runtime/modules/[network]/[contractAddress]/[contractName]/[entryTokenId]/[[path]].ts"
import { onRequest as __runtime_modules__network___contractAddress___contractName____path___ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/runtime/modules/[network]/[contractAddress]/[contractName]/[[path]].ts"
import { onRequest as __inscription__network___contractAddress___contractName___tokenId__ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/inscription/[network]/[contractAddress]/[contractName]/[tokenId].ts"
import { onRequest as __index_dependents__contract__ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/index/dependents/[contract].ts"
import { onRequest as __index_relations__contract__ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/index/relations/[contract].ts"
import { onRequest as __collections__collectionId__asset_preview_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/[collectionId]/asset-preview.ts"
import { onRequest as __collections__collectionId__assets_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/[collectionId]/assets.ts"
import { onRequest as __collections__collectionId__fee_guidance_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/[collectionId]/fee-guidance.ts"
import { onRequest as __collections__collectionId__oversight_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/[collectionId]/oversight.ts"
import { onRequest as __collections__collectionId__publish_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/[collectionId]/publish.ts"
import { onRequest as __collections__collectionId__readiness_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/[collectionId]/readiness.ts"
import { onRequest as __collections__collectionId__reserve_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/[collectionId]/reserve.ts"
import { onRequest as __collections__collectionId__upload_url_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/[collectionId]/upload-url.ts"
import { onRequest as __bnsv2__network____path___ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/bnsv2/[network]/[[path]].ts"
import { onRequest as __hiro__network____path___ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/hiro/[network]/[[path]].ts"
import { onRequestGet as __api_gallery_cache_ts_onRequestGet } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/api/gallery-cache.ts"
import { onRequestOptions as __api_gallery_cache_ts_onRequestOptions } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/api/gallery-cache.ts"
import { onRequestPost as __api_gallery_cache_ts_onRequestPost } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/api/gallery-cache.ts"
import { onRequest as __arcade_attest_score_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/arcade/attest-score.ts"
import { onRequest as __collections_health_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/health.ts"
import { onRequest as __index_page_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/index/page.ts"
import { onRequest as __manage_allowlist_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/manage/allowlist.ts"
import { onRequest as __prices_spot_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/prices/spot.ts"
import { onRequest as __runtime_cache_purge_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/runtime/cache-purge.ts"
import { onRequest as __runtime_content_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/runtime/content.ts"
import { onRequest as __collections__collectionId__ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections/[collectionId].ts"
import { onRequest as __i__tokenId__ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/i/[tokenId].ts"
import { onRequest as __index__contract__ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/index/[contract].ts"
import { onRequest as __inscription__tokenId__ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/inscription/[tokenId].ts"
import { onRequest as __explorer___path___ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/explorer/[[path]].ts"
import { onRequest as __g___path___ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/g/[[path]].ts"
import { onRequest as __rpc_testnet___path___ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/rpc-testnet/[[path]].ts"
import { onRequest as __rpc___path___ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/rpc/[[path]].ts"
import { onRequest as __collections_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/collections.ts"
import { onRequest as __warm_ts_onRequest } from "/Users/melophonic/Documents/GitHub/xtrata/xtrata-2.0/functions/warm.ts"

export const routes = [
    {
      routePath: "/runtime/modules/:network/:contractAddress/:contractName/:entryTokenId/:path*",
      mountPath: "/runtime/modules/:network/:contractAddress/:contractName/:entryTokenId",
      method: "",
      middlewares: [],
      modules: [__runtime_modules__network___contractAddress___contractName___entryTokenId____path___ts_onRequest],
    },
  {
      routePath: "/runtime/modules/:network/:contractAddress/:contractName/:path*",
      mountPath: "/runtime/modules/:network/:contractAddress/:contractName",
      method: "",
      middlewares: [],
      modules: [__runtime_modules__network___contractAddress___contractName____path___ts_onRequest],
    },
  {
      routePath: "/inscription/:network/:contractAddress/:contractName/:tokenId",
      mountPath: "/inscription/:network/:contractAddress/:contractName",
      method: "",
      middlewares: [],
      modules: [__inscription__network___contractAddress___contractName___tokenId__ts_onRequest],
    },
  {
      routePath: "/index/dependents/:contract",
      mountPath: "/index/dependents",
      method: "",
      middlewares: [],
      modules: [__index_dependents__contract__ts_onRequest],
    },
  {
      routePath: "/index/relations/:contract",
      mountPath: "/index/relations",
      method: "",
      middlewares: [],
      modules: [__index_relations__contract__ts_onRequest],
    },
  {
      routePath: "/collections/:collectionId/asset-preview",
      mountPath: "/collections/:collectionId",
      method: "",
      middlewares: [],
      modules: [__collections__collectionId__asset_preview_ts_onRequest],
    },
  {
      routePath: "/collections/:collectionId/assets",
      mountPath: "/collections/:collectionId",
      method: "",
      middlewares: [],
      modules: [__collections__collectionId__assets_ts_onRequest],
    },
  {
      routePath: "/collections/:collectionId/fee-guidance",
      mountPath: "/collections/:collectionId",
      method: "",
      middlewares: [],
      modules: [__collections__collectionId__fee_guidance_ts_onRequest],
    },
  {
      routePath: "/collections/:collectionId/oversight",
      mountPath: "/collections/:collectionId",
      method: "",
      middlewares: [],
      modules: [__collections__collectionId__oversight_ts_onRequest],
    },
  {
      routePath: "/collections/:collectionId/publish",
      mountPath: "/collections/:collectionId",
      method: "",
      middlewares: [],
      modules: [__collections__collectionId__publish_ts_onRequest],
    },
  {
      routePath: "/collections/:collectionId/readiness",
      mountPath: "/collections/:collectionId",
      method: "",
      middlewares: [],
      modules: [__collections__collectionId__readiness_ts_onRequest],
    },
  {
      routePath: "/collections/:collectionId/reserve",
      mountPath: "/collections/:collectionId",
      method: "",
      middlewares: [],
      modules: [__collections__collectionId__reserve_ts_onRequest],
    },
  {
      routePath: "/collections/:collectionId/upload-url",
      mountPath: "/collections/:collectionId",
      method: "",
      middlewares: [],
      modules: [__collections__collectionId__upload_url_ts_onRequest],
    },
  {
      routePath: "/bnsv2/:network/:path*",
      mountPath: "/bnsv2/:network",
      method: "",
      middlewares: [],
      modules: [__bnsv2__network____path___ts_onRequest],
    },
  {
      routePath: "/hiro/:network/:path*",
      mountPath: "/hiro/:network",
      method: "",
      middlewares: [],
      modules: [__hiro__network____path___ts_onRequest],
    },
  {
      routePath: "/api/gallery-cache",
      mountPath: "/api",
      method: "GET",
      middlewares: [],
      modules: [__api_gallery_cache_ts_onRequestGet],
    },
  {
      routePath: "/api/gallery-cache",
      mountPath: "/api",
      method: "OPTIONS",
      middlewares: [],
      modules: [__api_gallery_cache_ts_onRequestOptions],
    },
  {
      routePath: "/api/gallery-cache",
      mountPath: "/api",
      method: "POST",
      middlewares: [],
      modules: [__api_gallery_cache_ts_onRequestPost],
    },
  {
      routePath: "/arcade/attest-score",
      mountPath: "/arcade",
      method: "",
      middlewares: [],
      modules: [__arcade_attest_score_ts_onRequest],
    },
  {
      routePath: "/collections/health",
      mountPath: "/collections",
      method: "",
      middlewares: [],
      modules: [__collections_health_ts_onRequest],
    },
  {
      routePath: "/index/page",
      mountPath: "/index",
      method: "",
      middlewares: [],
      modules: [__index_page_ts_onRequest],
    },
  {
      routePath: "/manage/allowlist",
      mountPath: "/manage",
      method: "",
      middlewares: [],
      modules: [__manage_allowlist_ts_onRequest],
    },
  {
      routePath: "/prices/spot",
      mountPath: "/prices",
      method: "",
      middlewares: [],
      modules: [__prices_spot_ts_onRequest],
    },
  {
      routePath: "/runtime/cache-purge",
      mountPath: "/runtime",
      method: "",
      middlewares: [],
      modules: [__runtime_cache_purge_ts_onRequest],
    },
  {
      routePath: "/runtime/content",
      mountPath: "/runtime",
      method: "",
      middlewares: [],
      modules: [__runtime_content_ts_onRequest],
    },
  {
      routePath: "/collections/:collectionId",
      mountPath: "/collections",
      method: "",
      middlewares: [],
      modules: [__collections__collectionId__ts_onRequest],
    },
  {
      routePath: "/i/:tokenId",
      mountPath: "/i",
      method: "",
      middlewares: [],
      modules: [__i__tokenId__ts_onRequest],
    },
  {
      routePath: "/index/:contract",
      mountPath: "/index",
      method: "",
      middlewares: [],
      modules: [__index__contract__ts_onRequest],
    },
  {
      routePath: "/inscription/:tokenId",
      mountPath: "/inscription",
      method: "",
      middlewares: [],
      modules: [__inscription__tokenId__ts_onRequest],
    },
  {
      routePath: "/explorer/:path*",
      mountPath: "/explorer",
      method: "",
      middlewares: [],
      modules: [__explorer___path___ts_onRequest],
    },
  {
      routePath: "/g/:path*",
      mountPath: "/g",
      method: "",
      middlewares: [],
      modules: [__g___path___ts_onRequest],
    },
  {
      routePath: "/rpc-testnet/:path*",
      mountPath: "/rpc-testnet",
      method: "",
      middlewares: [],
      modules: [__rpc_testnet___path___ts_onRequest],
    },
  {
      routePath: "/rpc/:path*",
      mountPath: "/rpc",
      method: "",
      middlewares: [],
      modules: [__rpc___path___ts_onRequest],
    },
  {
      routePath: "/collections",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__collections_ts_onRequest],
    },
  {
      routePath: "/warm",
      mountPath: "/",
      method: "",
      middlewares: [],
      modules: [__warm_ts_onRequest],
    },
  ]