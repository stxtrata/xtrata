import {describe,it,expect} from 'vitest';
import {inscriptionMetadata} from '../inscription-metadata';
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
