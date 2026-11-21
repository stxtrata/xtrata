// Keep the synchronous host contract while downloading only the selected face.
export function lazyFaces(runtime, loaders) {
  const pending = new Map();
  const load = id => {
    if (runtime.has(id)) return Promise.resolve(true);
    if (!loaders[id]) return Promise.resolve(false);
    if (!pending.has(id)) pending.set(id, loaders[id]().then(() => true).catch(error => { pending.delete(id); throw error; }));
    return pending.get(id);
  };
  return { ...runtime, has: id => !!loaders[id] || runtime.has(id), load,
    mount(host, id, ...args) {
      if (runtime.has(id)) return runtime.mount(host, id, ...args);
      let actual, disposed = false; const calls = [];
      host.textContent = "Loading instrument controls…";
      const P = new Proxy({}, { get: (_, key) => actual ? actual.P[key]?.bind?.(actual.P) ?? actual.P[key] : (...values) => calls.push([key, values]) });
      const ready = load(id).then(() => {
        if (disposed || !host.isConnected) return null;
        actual = runtime.mount(host, id, ...args);
        for (const [key, values] of calls) actual?.P[key]?.(...values);
        return actual;
      }).catch(error => { if (!disposed) host.textContent = `Controls unavailable: ${error.message}. The instrument still plays.`; return null; });
      return { P, ready, refit: () => actual?.refit(), dispose: () => { disposed = true; actual?.dispose(); calls.length = 0; } };
    },
  };
}
