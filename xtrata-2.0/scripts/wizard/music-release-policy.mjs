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

export function releaseDownloadVersion(release, download) {
 const version=Object.hasOwn(download||{},'version')?download?.version:release?.version;
 return typeof version==='string'&&/^\d+\.\d+\.\d+$/.test(version)?version:null;
}

function compareVersions(a, b) {
 const left=a.split('.').map(Number);
 const right=b.split('.').map(Number);
 return left[0]-right[0]||left[1]-right[1]||left[2]-right[2];
}

export function verifiedReleaseForPlatforms(release, platforms) {
 if (!release || !Array.isArray(release.downloads)) return null;
 const allowed=Array.isArray(platforms)?new Set(platforms):null;
 const safe=download=>download&&download.verified===true&&
   (download.signed===true||(release.channel==='preview'&&download.preview===true&&download.signed===false));
 const versions=release.downloads.filter(download=>safe(download)&&(!allowed||allowed.has(download.platform))).map(download=>releaseDownloadVersion(release,download)).filter(Boolean);
 return versions.sort(compareVersions).at(-1)||null;
}
