import { expect, it } from 'vitest';
import { parseStartIntent, parseLeaseRequest, parseResponse, parseStartOutcome } from '../messages';
const context = {documentId:'01'.repeat(16),requestId:'02'.repeat(16)};
const intent = {schema:1,method:'startIntent',...context,leaseId:'03'.repeat(16),playbackId:'04'.repeat(16),core:3,masterId:2910};
it('accepts only a canonical start without transaction authority', () => {
  expect(parseStartIntent(intent).masterId).toBe(2910);
  for(const key of ['fee','recipient','privateKey','nonce','contract','signedBytes']) expect(()=>parseStartIntent({...intent,[key]:'forbidden'})).toThrow();
  for(const core of [0,4,'3',NaN]) expect(()=>parseStartIntent({...intent,core})).toThrow();
  for(const masterId of [-1,0.5,Number.MAX_SAFE_INTEGER+1]) expect(()=>parseStartIntent({...intent,masterId})).toThrow();
});
it('matches response to the exact document and request', () => {
  const raw={schema:1,...context,payload:{playbackId:intent.playbackId,state:'unknown'}};
  expect(parseResponse(raw,context,parseStartOutcome).state).toBe('unknown');
  expect(()=>parseResponse({...raw,requestId:'03'.repeat(16)},context,parseStartOutcome)).toThrow();
  expect(()=>parseResponse({...raw,documentId:'03'.repeat(16)},context,parseStartOutcome)).toThrow();
  expect(()=>parseStartOutcome({...raw.payload,state:'paid'})).toThrow();
});
it('does not permit page-driven lease takeover', () => {
  const v={schema:1,...context,method:'acquirePlaybackLease'};
  expect(parseLeaseRequest(v).method).toBe('acquirePlaybackLease');
  expect(()=>parseLeaseRequest({...v,takeover:true})).toThrow();
});
