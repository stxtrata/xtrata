import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

const homeMain = readFileSync(new URL('../main.js', import.meta.url), 'utf8');
const indexHtml = readFileSync(new URL('../../../index.html', import.meta.url), 'utf8');
const homeStyles = readFileSync(new URL('../styles/home.css', import.meta.url), 'utf8');
const redirects = readFileSync(new URL('../../../public/_redirects', import.meta.url), 'utf8');

/**
 * The historic drop gallery. A settled drop is deleted from the contract's
 * Drops map, so this view has to come from the print events; these assertions
 * guard the wiring that keeps it that way.
 */
describe('historic drop gallery — page wiring', () => {
  it('builds the gallery from the durable event feed, never from get-drop', () => {
    expect(homeMain).toContain("from '/src/lib/drops/gallery.ts'");
    expect(homeMain).toContain('buildDropGalleryItems(');
    expect(homeMain).toContain('const dropsGalleryItems = ');
    expect(homeMain).toContain('dropsState.historySources');
    // The gallery reads live drops from state, but its record of past drops is
    // the event feed — a get-drop call there would return none for every one.
    const galleryBlock = homeMain.slice(
      homeMain.indexOf('const dropsGalleryItems ='),
      homeMain.indexOf('const renderDropsHistory =')
    );
    expect(galleryBlock.length).toBeGreaterThan(0);
    expect(galleryBlock).not.toContain("functionName: 'get-drop'");
  });

  it('routes on the drops page query params, not on ?gallery=', () => {
    expect(homeMain).toContain('parseDropGallerySelection(params ?? null)');
    expect(homeMain).toContain('dropGalleryHref(');
    // ?gallery= is claimed by the pre-paint router in index.html for curated
    // Xplorer views: using it here would route the request off this page.
    expect(indexHtml).toContain("params.has('gallery')");
    expect(homeMain).not.toContain("dropGalleryHref({ gallery");
    // /drops already serves the SPA shell, so the query-param routes need no
    // new redirect rule.
    expect(redirects).toContain('/drops / 200');
  });

  it('renders the gallery markup and hides the live-claim furniture behind it', () => {
    expect(indexHtml).toContain('id="dropsGallery"');
    expect(indexHtml).toContain('id="dropsGalleryGrid"');
    expect(indexHtml).toContain('id="dropsGalleryStatus"');
    expect(indexHtml).toContain('id="dropsGalleryEntry"');
    expect(homeMain).toContain("document.documentElement.dataset.dropsView = active ? 'gallery' : ''");
    expect(homeStyles).toContain(":root[data-drops-view='gallery']");
    expect(homeStyles).toContain('.drops-gallery__grid');
  });

  it('reuses the market media pipeline and the shared thumbnail painter', () => {
    expect(homeMain).toContain('const paintDropThumbnail = (slot, media, tokenId)');
    expect(homeMain).toContain('paintDropThumbnail(slot, media, drop.tokenId);');
    expect(homeMain).toContain('paintDropThumbnail(slot, media, item.tokenId);');
    expect(homeMain).toContain('dropGalleryMediaTarget(item, dropsGalleryEntryFor(item.contractId))');
    expect(homeMain).toContain('await marketMediaFor(target)');
  });

  it('joins live ownership without ever blanking a tile', () => {
    expect(homeMain).toContain('const hydrateDropGalleryOwners');
    expect(homeMain).toContain('.getOwner(item.tokenId,');
    expect(homeMain).toContain('owner = null; // a failed read must never blank the tile');
    expect(homeMain).toContain('paintGalleryOwnerRow(');
    expect(homeMain).toContain("traded.textContent = 'traded on'");
    expect(homeMain).toContain('drops contract (escrow)');
  });

  it('resolves BNS names through the same resolver the history rows use', () => {
    expect(homeMain).toContain('const galleryWalletRow =');
    expect(homeMain).toContain('applyBnsName(value, address);');
  });

  it('links into the gallery from the drops page and from every history row', () => {
    expect(homeMain).toContain('const renderDropGalleryEntryPoints');
    expect(homeMain).toContain("all.textContent = 'View gallery — every drop'");
    expect(homeMain).toContain("galleryLink.textContent = 'Gallery'");
    expect(homeMain).toContain('actions.append(viewLink, dropLink, galleryLink);');
    // SPA navigation only picks up same-tab internal links.
    expect(homeMain).toContain("galleryLink.target = '_self'");
  });

  it('keeps loading, empty and populated states distinct', () => {
    expect(homeMain).toContain('dropsState.gallery.loading');
    expect(homeMain).toContain('Loading drop history…');
    expect(homeMain).toContain('No completed drops have been recorded here yet');
    expect(homeMain).toContain('rebuilt from on-chain drop events');
  });

  it('does not rebuild an unchanged grid, so mounted previews survive', () => {
    expect(homeMain).toContain('dropsState.gallery.signature');
    expect(homeMain).toContain('identical grid: keep the mounted previews alive');
  });
});
