import {describe,it,expect} from 'vitest';
import {inscriptionMetadata,inscriptionArtwork,safeArtwork} from '../inscription-metadata';
describe('inscribed artist extraction',()=>{
 it('reads new music metadata and decodes entities without executing scripts',()=>{
  expect(inscriptionMetadata('<title>A &amp; B</title><script type="application/json" id="xtrata-music-metadata">{"artist":"Singer \\"X\\""}</script>')).toEqual({title:'A & B',artist:'Singer "X"'});
 });
 it('supports visible artist classes, legacy JSON strings and structured byArtist',()=>{
  expect(inscriptionMetadata('<p class="track artist">Alice &amp; Bob</p>').artist).toBe('Alice & Bob');
  expect(inscriptionMetadata('<script>window.data={"artist":"Legacy"}</script>').artist).toBe('Legacy');
  expect(inscriptionMetadata('<script type="application/ld+json">{"name":"Track","byArtist":{"name":"Artist"}}</script>')).toEqual({title:'Track',artist:'Artist'});
 });
 it('leaves missing artists blank and handles malformed metadata',()=>{
  expect(inscriptionMetadata('<title>Unknown</title><script type="application/json">broken</script>')).toEqual({title:'Unknown',artist:''});
 });
});

describe('inscribed artwork',()=>{
 it('finds metadata images and embedded covers',()=>{
  expect(inscriptionArtwork('<script type="application/json">{"image":"https://example.com/cover.png"}</script>')).toBe('https://example.com/cover.png');
  expect(inscriptionArtwork("<img src='data:image/png;base64,aGVsbG8='>")).toBe('data:image/png;base64,aGVsbG8=');
 });
 it('rejects active, insecure, credentialed and oversized sources',()=>{
  for(const value of ['javascript:alert(1)','data:text/html;base64,aGVsbG8=','data:image/svg+xml;base64,aGVsbG8=','http://example.com/a','https://user:pass@example.com/a','data:image/png;base64,'+'A'.repeat(700000)])expect(safeArtwork(value)).toBe('');
  expect(inscriptionArtwork('<p>No cover</p>')).toBe('');
 });
});
