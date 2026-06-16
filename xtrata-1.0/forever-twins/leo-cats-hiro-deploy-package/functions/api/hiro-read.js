const DEFAULT_API_BASE = {
  mainnet: 'https://api.mainnet.hiro.so',
  testnet: 'https://api.testnet.hiro.so',
};

function corsHeaders(request) {
  const origin = request.headers.get('Origin') || '*';
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'content-type',
    'Vary': 'Origin',
  };
}

function jsonResponse(request, payload, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(request),
      'content-type': 'application/json; charset=utf-8',
      'cache-control': 'no-store',
    },
  });
}

function cleanApiBase(network, apiBase) {
  const fallback = DEFAULT_API_BASE[network] || DEFAULT_API_BASE.mainnet;
  try {
    const url = new URL(String(apiBase || fallback));
    const host = url.hostname.toLowerCase();
    if (host !== 'api.mainnet.hiro.so' && host !== 'api.testnet.hiro.so') return fallback;
    return `${url.protocol}//${url.host}`;
  } catch {
    return fallback;
  }
}

function safeSegment(value, pattern, label) {
  const text = String(value || '').trim();
  if (!pattern.test(text)) throw new Error(`Invalid ${label}`);
  return text;
}

export async function onRequestOptions({ request }) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function onRequestPost({ request, env }) {
  const hiroApiKey = env.HIRO_API_KEY || env.VITE_HIRO_API_KEY;
  if (!hiroApiKey) {
    return jsonResponse(request, { okay: false, error: 'Missing HIRO_API_KEY secret on the Pages Function environment.' }, 500);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse(request, { okay: false, error: 'Body must be valid JSON.' }, 400);
  }

  try {
    const network = body.network === 'testnet' ? 'testnet' : 'mainnet';
    const apiBase = cleanApiBase(network, body.apiBase);
    const contractAddress = safeSegment(body.contractAddress, /^(SP|ST)[A-Z0-9]{20,}$/i, 'contractAddress');
    const contractName = safeSegment(body.contractName, /^[a-zA-Z]([a-zA-Z0-9_-]{0,127})$/, 'contractName');
    const functionName = safeSegment(body.functionName, /^[a-zA-Z]([a-zA-Z0-9_-]{0,127})$/, 'functionName');
    const sender = safeSegment(body.sender || 'SP000000000000000000002Q6VF78', /^(SP|ST)[A-Z0-9]{20,}$/i, 'sender');
    const args = Array.isArray(body.arguments) ? body.arguments : [];

    if (!args.every((arg) => typeof arg === 'string' && /^0x[0-9a-f]+$/i.test(arg))) {
      return jsonResponse(request, { okay: false, error: 'arguments must be an array of 0x-prefixed Clarity value hex strings.' }, 400);
    }

    const hiroUrl = `${apiBase}/v2/contracts/call-read/${encodeURIComponent(contractAddress)}/${encodeURIComponent(contractName)}/${encodeURIComponent(functionName)}`;
    const response = await fetch(hiroUrl, {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'x-api-key': hiroApiKey,
      },
      body: JSON.stringify({ sender, arguments: args }),
    });

    const text = await response.text();
    return new Response(text, {
      status: response.status,
      headers: {
        ...corsHeaders(request),
        'content-type': response.headers.get('content-type') || 'application/json; charset=utf-8',
        'cache-control': 'no-store',
      },
    });
  } catch (err) {
    return jsonResponse(request, { okay: false, error: err.message || String(err) }, 400);
  }
}
