import { generateWallet, generateNewAccount } from "@stacks/wallet-sdk";
import { getAddressFromPrivateKey, TransactionVersion } from "@stacks/transactions";
const m = "sell invite acquire kitten bamboo drastic jelly vivid peace spawn twice guilt pave pen trash pretty park cube fragile unaware remain midnight betray rebuild";
let w = await generateWallet({ secretKey: m, password: "" });
for (let i = 1; i < 3; i++) w = generateNewAccount(w);
w.accounts.forEach((a, i) => console.log("acct", i, "→", getAddressFromPrivateKey(a.stxPrivateKey, TransactionVersion.Testnet)));
