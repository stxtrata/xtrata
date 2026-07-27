// Single entry → bundled by Vite into xtrata-agent-one/wizard/agent-one.js (IIFE).
// Sets BOTH window.XtrataWallet (connect/pay) and window.XtrataAgent (the in-browser
// inscription agent). The wizard loads this one file instead of agent-one-wallet.js.
import './agent-one-wallet';
import './agent-core';
import './ui-panels';
