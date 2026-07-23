export const CONFIG = {
  network: "mainnet" as const,
  apiUrl: "https://api.hiro.so",
  xtrata: {
    address: "SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X",
    name: "xtrata-v3-2-3"
  },
  // Fill these two values after deploying the gateway and registry contracts.
  gateway: {
    address: "",
    name: "xtrata-v3-2-3-gateway"
  },
  registry: {
    address: "",
    name: "proof-of-free-living-synth-v1"
  },
  collectionSize: 1024,
  pageSize: 32
};

export function contractConfigured() {
  return Boolean(CONFIG.gateway.address && CONFIG.registry.address);
}

