/** Null slots retain the radio's rotating station information. */
export function radioTickerSections(track: {title: string; artist?: string; album?: string}): Array<string|null> {
 return [`♪ ${track.title}`,track.artist?`BY ${track.artist.toUpperCase()}`:null,
  ...(track.album?[`ALBUM: ${track.album}`]:[]),null];
}
