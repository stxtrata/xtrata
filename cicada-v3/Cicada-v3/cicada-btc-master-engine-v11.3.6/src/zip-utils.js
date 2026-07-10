// Tiny dependency-free ZIP writer used by the collection exporter.
const textEncoder = new TextEncoder();
const crcTable = (() => {
    const table = new Uint32Array(256);
    for (let n = 0; n < 256; n++) {
        let c = n;
        for (let k = 0; k < 8; k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1);
        table[n] = c >>> 0;
    }
    return table;
})();

function crc32(bytes) {
    let crc = 0 ^ -1;
    for (const byte of bytes) crc = (crc >>> 8) ^ crcTable[(crc ^ byte) & 0xff];
    return (crc ^ -1) >>> 0;
}

const u32 = value => [value, 4];
function zipHeader(...fields) {
    const bytes = [];
    for (const field of fields) {
        const [value, width] = Array.isArray(field) ? field : [field, 2];
        for (let offset = 0; offset < width * 8; offset += 8) bytes.push((value >>> offset) & 0xff);
    }
    return new Uint8Array(bytes);
}

function dosDateTime(date = new Date()) {
    const year = Math.max(1980, date.getFullYear());
    const dosTime = (date.getHours() << 11) | (date.getMinutes() << 5) | Math.floor(date.getSeconds() / 2);
    const dosDate = ((year - 1980) << 9) | ((date.getMonth() + 1) << 5) | date.getDate();
    return [dosTime, dosDate];
}

export function tinyHtml(seed) {
    return `<!doctype html><script type=module>import{init}from'./cicada-core.js';init(${seed})<\/script>`;
}

export async function createZip(entries, onProgress) {
    const chunks = [];
    const central = [];
    let offset = 0;
    const [dosTime, dosDate] = dosDateTime();

    for (let i = 0; i < entries.length; i++) {
        const [name, content] = entries[i];
        const nameBytes = textEncoder.encode(name);
        const data = typeof content === 'string' ? textEncoder.encode(content) : content;
        const crc = crc32(data);
        const local = zipHeader(
            u32(0x04034b50), 20, 0, 0, dosTime, dosDate, u32(crc),
            u32(data.length), u32(data.length), nameBytes.length, 0
        );
        chunks.push(local, nameBytes, data);

        const centralHeader = zipHeader(
            u32(0x02014b50), 20, 20, 0, 0, dosTime, dosDate, u32(crc),
            u32(data.length), u32(data.length), nameBytes.length,
            0, 0, 0, 0, u32(0), u32(offset)
        );
        central.push(centralHeader, nameBytes);

        offset += local.length + nameBytes.length + data.length;

        if (i % 100 === 0 || i === entries.length - 1) {
            onProgress?.(i + 1, entries.length);
            await new Promise(requestAnimationFrame);
        }
    }

    const centralSize = central.reduce((sum, chunk) => sum + chunk.length, 0);
    const centralOffset = offset;
    const end = zipHeader(u32(0x06054b50), 0, 0, entries.length, entries.length, u32(centralSize), u32(centralOffset), 0);
    return new Blob([...chunks, ...central, end], { type: 'application/zip' });
}
