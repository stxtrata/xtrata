// Exact original gzip hashes and minimal verified padding instructions.
// No private song bytes, names, sample URLs or musical data are included.
// Each sibling source-array hash covers compact UTF-8 JSON.stringify(channelURLs).
export const VERIFIED_SOURCE_TAILS = [
  {
    id: 'verified-source-tail-6-v1',
    kind: 'source-tail-padding',
    inputSha256: '19d2d05ed5e7e4ef8a1e9f08318d316dc6d80e88bf8f8963ecbd9f506931b5a1',
    inputBytes: 957,
    compact: true,
    resultSha256: '22e37c89d121f774b2c1979096ef1a77adf0892c5061d4aabb55b2c671fad407',
    companionJson:
      '{"originalSourceCount":6,"channelCount":64,"originalSourceArraySha256":"8373153984ca7a00d4838600069d9b173d41dbd90400c6dfd04818a59f37b1f4","donorSourceArraySha256":"f0e60aa999f9bf546c63b48008e7954bd853b15462c27afe770a9ca77c52db6f"}',
    companionSha256: '0877fcc9f3031ce558acb0fdeb196aa7d83c25a5ac0234b10cf3db5b2f81bee1',
    sourceSha256: 'ccd601a1f62b7f9e851626efa600119c5a1ba95a9dbd07660222b4946aa7072d'
  },
  {
    id: 'verified-source-tail-4-v1',
    kind: 'source-tail-padding',
    inputSha256: '863667b24cde30485c8b5e8c834424cf72ae76780a48cba29185d452c58e4003',
    inputBytes: 787,
    compact: true,
    resultSha256: '5ce778da3f4a252a54feb86355f5f9d76cf368c1ed5ea9a7be2ee44eafacc85c',
    companionJson:
      '{"originalSourceCount":4,"channelCount":64,"originalSourceArraySha256":"bf9d30e4788c6e6d8ea789239d3b959570c7cff528988fd2d24bb767dfc1d507","donorSourceArraySha256":"1f842cb27b2b70a0885b6ec7c100160afbbe208677a6016891c62f18b3a821d3"}',
    companionSha256: '7d6120f60b9cee4dcb6cf078fd33af88c4fd1e39c52f6027b3fab3f67854256c',
    sourceSha256: 'f251d1f0d117b019002c3fb2f1674e48219d817970393bcbae4e1fe5f000fae6'
  },
  {
    id: 'verified-source-tail-3-v1',
    kind: 'source-tail-padding',
    inputSha256: '10aa86e9fb6861cc0228f81e9d210a45d3a7fbf8707faf7a2757dfe5b9c406c9',
    inputBytes: 725,
    compact: true,
    resultSha256: '877eb8c71531cd2cd5ab341ad87dabe77642da12bd302584d5675b477fb75947',
    companionJson:
      '{"originalSourceCount":3,"channelCount":64,"originalSourceArraySha256":"9ed0c09cfb82e51bd9f0c16c68e943d2887b0e250b14b2bb5048b136942482ac","donorSourceArraySha256":"c6d4c663cc9374b9fc134b1cb38938834586c086138dc93ca89d173916872107"}',
    companionSha256: '0aa8498af76da289868a811453c0539fad63ab13a740ac72f30adaa5d68f6291',
    sourceSha256: '8716622ecfc7ecbdb5979ffbe00ddd8e19392aa89d9bb2aa3e50aa77906f8010'
  }
];
