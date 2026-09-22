// An update is only useful when a compatible installer exists. Keep this
// separate from the release manifest so a Mac build can never offer Windows
// (or another Mac CPU's only) installer.
export function releasePlatformsForRuntime(platform, architecture) {
 if (platform==='win32') return architecture==='x64'?['win-x64']:[];
 if (platform==='darwin') {
  if (architecture==='x64') return ['mac-universal','mac-x64'];
  if (architecture==='arm64') return ['mac-universal','mac-arm64'];
 }
 return [];
}
