import {describe,it,expect} from 'vitest';
import {inscriptionMetadata,inscriptionArtwork,safeArtwork,inscriptionHasAudio} from '../inscription-metadata';
describe('inscribed artist extraction',()=>{
 it('reads new music metadata and decodes entities without executing scripts',()=>{
  expect(inscriptionMetadata('<title>A &amp; B</title><script type="application/json" id="xtrata-music-metadata">{"artist":"Singer \\"X\\""}</script>')).toEqual({title:'A & B',artist:'Singer "X"',album:''});
 });
 it('supports visible artist classes, legacy JSON strings and structured byArtist',()=>{
  expect(inscriptionMetadata('<p class="track artist">Alice &amp; Bob</p>').artist).toBe('Alice & Bob');
  expect(inscriptionMetadata('<script>window.data={"artist":"Legacy"}</script>').artist).toBe('Legacy');
  expect(inscriptionMetadata('<script type="application/ld+json">{"name":"Track","byArtist":{"name":"Artist"}}</script>')).toEqual({title:'Track',artist:'Artist',album:''});
 });
 it('leaves missing artists blank and handles malformed metadata',()=>{
  expect(inscriptionMetadata('<title>Unknown</title><script type="application/json">broken</script>')).toEqual({title:'Unknown',artist:'',album:''});
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

it('requires an actual embedded audio element rather than an HTML title or script sound',()=>{
 expect(inscriptionHasAudio('<title>X Chess</title><script>new Audio("move.mp3")</script>')).toBe(false);
 expect(inscriptionHasAudio('<source src="data:audio/ogg;base64,YQ==">')).toBe(true);
 expect(inscriptionHasAudio('<source src="data:video/mp4;base64,YQ==">')).toBe(false);
});

it('extracts optional album names from current, legacy and structured metadata',()=>{
 expect(inscriptionMetadata('<script type="application/json">{"album":"Night &amp; Day"}</script>').album).toBe('Night & Day');
 expect(inscriptionMetadata('<script>const metadata={"album":"Old Album"}</script>').album).toBe('Old Album');
 expect(inscriptionMetadata('<script type="application/ld+json">{"inAlbum":{"name":"Collection"}}</script>').album).toBe('Collection');
 expect(inscriptionMetadata('<p class="album">Visible Album</p>').album).toBe('Visible Album');
 expect(inscriptionMetadata('<script type="application/json">{"album":42}</script>').album).toBe('');
});
