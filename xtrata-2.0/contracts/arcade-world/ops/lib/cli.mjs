// Tiny argument parser and output helpers shared by the command-line tools.
export function parseArgs(argv, spec = {}) {
  const out = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a.startsWith('--')) {
      const [k, v] = a.slice(2).split('=');
      const key = k.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
      if (v !== undefined) out[key] = v;
      else if (spec[key] === 'value') out[key] = argv[++i];
      else out[key] = true;
    } else out._.push(a);
  }
  return out;
}
export const die = (msg, code = 1) => { console.error(msg); process.exit(code); };
