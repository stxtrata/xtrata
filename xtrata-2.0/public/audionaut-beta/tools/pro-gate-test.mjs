#!/usr/bin/env node
// The community Beta opens directly without wallet connection or session checks.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { serve, browser } from './serve.mjs';
const {srv,url} = await serve(), b = await browser();
try {
  for (const existingSession of [false, true]) {
    const context = await b.newContext(), p = await context.newPage(), errors = [], authRequests = [];
    let mounted = 0;
    p.on('pageerror', e => errors.push(e.message));
    if (existingSession) await p.addInitScript(() => {
      localStorage.setItem('xtrata.v15.1.wallet.session', JSON.stringify({isConnected:true,address:'test-nonmember',network:'mainnet'}));
    });
    await context.route('**/*', route => {
      const target = new URL(route.request().url());
      if (target.origin !== url) return route.abort();
      if (target.pathname.startsWith('/api/audionaut-beta') || target.pathname.startsWith('/hiro/')) {
        authRequests.push(target.pathname);
        return route.fulfill({status:403,body:'No membership'});
      }
      if (target.pathname === '/audionaut-beta/daw.html') {
        mounted++;
        return route.fulfill({contentType:'text/html',body:'<!doctype html><h1>Community studio</h1>'});
      }
      return route.continue();
    });
    await p.goto(url + '/audionaut-beta/');
    await p.frameLocator('#daw').getByText('Community studio').waitFor();
    assert.equal(mounted, 1, 'opens one studio immediately');
    assert.deepEqual(authRequests, [], 'public entry does not request membership');
    assert.equal(await p.locator('#stage, #action, #leave').count(), 0);
    assert.deepEqual(errors, []);
    await context.close();
  }
  const pkg = JSON.parse(await readFile(new URL('../../../package.json',import.meta.url)));
  assert.ok(pkg.scripts.prebuild.includes('build:audionaut-beta'));
  console.log('PASS public Beta entry: no wallet, session or membership requirement');
} finally { await b.close(); await new Promise(resolve => srv.close(resolve)); }
