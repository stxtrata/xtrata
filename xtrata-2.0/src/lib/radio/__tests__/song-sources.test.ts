import { describe, expect, it } from 'vitest';
import { audioMime, hiddenTrackRange, linkedAudioId, linkedImageId, webmAudioOnly, webmCodecs, HIDDEN_TRACK_MARKER, HIDDEN_TRAILER_BYTES } from '../song-sources.mjs';
import { ascii, webm, withHiddenTrack } from './song-fixtures';


describe('hidden tracks', () => {
  it('finds the appended file from the last 30 bytes and the total size', () => {
    const hidden = webm('A_OPUS');
    const file = withHiddenTrack(webm('V_VP9'), hidden);
    const range = hiddenTrackRange(file.subarray(file.length - HIDDEN_TRAILER_BYTES), file.length)!;
    expect(range).toEqual({ start: file.length - HIDDEN_TRAILER_BYTES - hidden.length, end: file.length - HIDDEN_TRAILER_BYTES });
    expect(file.slice(range.start, range.end)).toEqual(hidden);
  });

  it('matches the real #139 layout (marker + u64 at the very end)', () => {
    // From the inscription itself: 3,751,625 bytes, a hidden WebM of 2,571,075 bytes starting at 1,180,520.
    const tail = new Uint8Array([...ascii('XTRATA-HIDDEN-TRACK-v1'), 0, 0, 0, 0, 0, 0x27, 0x3b, 0x43]);
    expect(hiddenTrackRange(tail, 3_751_625)).toEqual({ start: 1_180_520, end: 3_751_595 });
  });

  it('says no for ordinary files, a wrong marker, or a length that cannot fit', () => {
    const plain = webm('V_VP9', 'A_OPUS');
    expect(hiddenTrackRange(plain.subarray(Math.max(0, plain.length - 30)), plain.length)).toBeNull();
    const bad = withHiddenTrack(webm('V_VP9'), webm('A_OPUS'));
    bad[bad.length - 10] = 0x30; // marker ends "...-v0"
    expect(hiddenTrackRange(bad.subarray(bad.length - 30), bad.length)).toBeNull();
    const huge = new Uint8Array([...ascii(HIDDEN_TRACK_MARKER), 0, 0, 0, 0, 0xff, 0xff, 0xff, 0xff]);
    expect(hiddenTrackRange(huge, 40)).toBeNull();
    expect(hiddenTrackRange(new Uint8Array(4), 4)).toBeNull();
  });
});

describe('WebM tracks', () => {
  it('reads CodecIDs and treats an all-audio WebM as a song file', () => {
    expect(webmCodecs(webm('V_VP9', 'A_OPUS'))).toEqual(['V_VP9', 'A_OPUS']);
    expect(webmAudioOnly(webm('A_OPUS'))).toBe(true);           // #8: minted as video/webm, audio only
    expect(webmAudioOnly(webm('V_VP9'))).toBe(false);           // #139's visible part: picture only
    expect(webmAudioOnly(webm('V_VP9', 'A_OPUS'))).toBe(false); // a film: not a song
    expect(webmAudioOnly(new Uint8Array(ascii('not a webm at all')))).toBe(false);
  });

  it('names the audio type from the first bytes', () => {
    expect(audioMime(webm('A_OPUS'))).toBe('audio/webm');
    expect(audioMime(new Uint8Array([...ascii('ID3'), 3, 0]))).toBe('audio/mpeg');
    expect(audioMime(new Uint8Array(ascii('OggS....')))).toBe('audio/ogg');
    expect(audioMime(new Uint8Array(ascii('RIFF....WAVEfmt ')))).toBe('audio/wav');
    expect(audioMime(new Uint8Array(ascii('<html>')))).toBe('');
  });
});

describe('linked audio', () => {
  it('follows a player whose <source> points at another inscription (as #319 points at #8)', () => {
    expect(linkedAudioId('<audio id="xtrataAudio" preload="metadata"><source src="https://xtrata.xyz/inscription/8" type="audio/webm; codecs=opus"></audio>')).toBe(8);
    expect(linkedAudioId('<audio src="/inscription/42"></audio>')).toBe(42);
    expect(linkedAudioId("<source type='audio/mpeg' src='https://radio.xtrata.xyz/inscription/7'>")).toBe(7);
  });

  it('ignores other sites, images and scripts', () => {
    expect(linkedAudioId('<source src="https://example.com/inscription/8">')).toBeNull();
    expect(linkedAudioId('<img src="/inscription/134">')).toBeNull();
    expect(linkedAudioId('<script>fetch("/inscription/8")</script>')).toBeNull();
    expect(linkedImageId('<img class="cover" src="https://xtrata.xyz/inscription/134">')).toBe(134);
  });
});
