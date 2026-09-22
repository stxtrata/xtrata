// The desktop update check must never offer an installer for another OS.
// Standalone companions derive the same narrow list from their own runtime,
// rather than treating an omitted caller option as permission to show all
// release assets.
export function releasePlatformsForRuntime(platform, architecture) {
 if (platform==='win32') return architecture==='x64'?['win-x64']:[];
 if (platform==='darwin') {
  if (architecture==='x64') return ['mac-universal','mac-x64'];
  if (architecture==='arm64') return ['mac-universal','mac-arm64'];
 }
 return [];
}

export function verifiedReleaseForPlatforms(release, platforms) {
 if (!release || !/^\d+\.\d+\.\d+$/.test(release.version) || !Array.isArray(release.downloads)) return null;
 const allowed=Array.isArray(platforms)?new Set(platforms):null;
 const safe=download=>download&&download.verified===true&&
   (download.signed===true||(release.channel==='preview'&&download.preview===true&&download.signed===false));
 return release.downloads.some(download=>safe(download)&&(!allowed||allowed.has(download.platform)))?release.version:null;
}
