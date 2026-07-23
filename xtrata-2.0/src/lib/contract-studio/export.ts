import type { StudioArtifact } from './model';

const crcTable = Array.from({ length: 256 }, (_, index) => {
  let value = index;
  for (let bit = 0; bit < 8; bit += 1) {
    value = (value & 1) !== 0 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
  }
  return value >>> 0;
});

const crc32 = (bytes: Uint8Array) => {
  let crc = 0xffffffff;
  for (const byte of bytes) crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  return (crc ^ 0xffffffff) >>> 0;
};

const u16 = (value: number) => [value & 0xff, (value >>> 8) & 0xff];
const u32 = (value: number) => [
  value & 0xff,
  (value >>> 8) & 0xff,
  (value >>> 16) & 0xff,
  (value >>> 24) & 0xff
];

export const createProjectZip = (artifacts: StudioArtifact[]) => {
  const encoder = new TextEncoder();
  const local: number[] = [];
  const central: number[] = [];
  let offset = 0;

  for (const artifact of [...artifacts].sort((a, b) => a.path.localeCompare(b.path))) {
    const name = encoder.encode(artifact.path);
    const data = encoder.encode(artifact.content);
    const crc = crc32(data);
    local.push(
      ...u32(0x04034b50), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0),
      ...name, ...data
    );
    central.push(
      ...u32(0x02014b50), ...u16(20), ...u16(20), ...u16(0), ...u16(0), ...u16(0), ...u16(0),
      ...u32(crc), ...u32(data.length), ...u32(data.length), ...u16(name.length), ...u16(0),
      ...u16(0), ...u16(0), ...u16(0), ...u32(0), ...u32(offset), ...name
    );
    offset = local.length;
  }
  const end = [
    ...u32(0x06054b50), ...u16(0), ...u16(0), ...u16(artifacts.length),
    ...u16(artifacts.length), ...u32(central.length), ...u32(local.length), ...u16(0)
  ];
  return new Blob([new Uint8Array([...local, ...central, ...end])], {
    type: 'application/zip'
  });
};

export const downloadProjectZip = (artifacts: StudioArtifact[]) => {
  const url = URL.createObjectURL(createProjectZip(artifacts));
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = 'xtrata-contract-studio-project.zip';
  anchor.click();
  URL.revokeObjectURL(url);
};

