#!/usr/bin/env python3
"""Generates art/facts.json and art/sources.json for Hot Wallet. Every figure below was read from the cited page on 2 Nov 2026
(see FACTS-NOTES.md for what each source did and did not say). Run: python3 -I art/_gen_facts.py"""
import json, os, sys
HERE = os.path.dirname(os.path.abspath(__file__))
R = '2026-11-02'
def S(title, url, kind='read'):  # kind: read = page text fetched; listing = only the headline/search listing seen
    return {'title': title, 'url': url, 'retrieved': R, 'kind': kind}

WP = lambda page, t=None: S('Wikipedia: ' + (t or page.replace('_', ' ')), 'https://en.wikipedia.org/wiki/' + page)
MTGOX = WP('Mt._Gox', 'Mt. Gox'); BITSTAMP = WP('Bitstamp'); BITFINEX = WP('Bitfinex'); COINCHECK = WP('Coincheck'); CRYPTOPIA = WP('Cryptopia')
QUADRIGA = WP('QuadrigaCX'); BYBIT = WP('Bybit'); B26 = WP('2026_Binance_hack', '2026 Binance hack'); BINANCE = WP('Binance'); BITHUMB = WP('Bithumb')
UPBIT = WP('Upbit'); KUCOIN = WP('KuCoin'); WAZIRX = WP('WazirX'); WALLET = WP('Cryptocurrency_wallet', 'Cryptocurrency wallet'); MULTISIG = WP('Multisignature')
TETHER = WP('Tether_(cryptocurrency)', 'Tether (cryptocurrency)'); LAZARUS = WP('Lazarus_Group', 'Lazarus Group')
IC3 = S('FBI IC3 PSA I-022625: North Korea responsible for the Bybit theft', 'https://ic3.gov/psa/2025/psa250226')
REC_BYBIT = S('The Record: Hackers drained Bybit crypto exchange (21 Feb 2025)', 'https://therecord.media/hackers-drained-bybit-crypto-exchange-hack')
REC_BFX = S('The Record: DOJ seizes $3.6 billion from 2016 Bitfinex hack', 'https://therecord.media/doj-seizes-3-6-billion-from-2016-bitfinex-hack-arrests-new-york-couple/')
HELP_BSTAMP = S('Help Net Security: Bitstamp suspends service in wake of compromise', 'https://www.helpnetsecurity.com/?p=38106')
CSPK_BSTAMP = S('Coinspeaker: Bitstamp claims 18,866 BTC lost in hot wallet hack', 'https://coinspeaker.com/bitcoin-exchange-bitstamp-claims-18866-btc-lost-in-hot-wallet-hack', 'listing')
SEC_CCHK = S('Security Affairs: Coincheck refunds customers (58 billion yen, 523 million NEM, 46.3 billion yen refund)', 'https://securityaffairs.com/68341/cyber-crime/coincheck-refunds-customers.html')
CD_ZAIF = S('CoinDesk: Zaif hacked in $60 million bitcoin theft', 'https://coindesk.com/crypto-exchange-zaif-hacked-in-60-million-6000-bitcoin-theft/')
CT_ZAIF = S('Cointelegraph: Japanese exchange hacked, $59 million in losses reported', 'https://cointelegraph.com/news/japanese-cryptocurrency-exchange-hacked-59-million-in-losses-reported', 'listing')
FM_BITHUMB = S('Finance Magnates: Bithumb hacked for $19 million, insider job suspected', 'https://www.financemagnates.com/cryptocurrency/news/bithumb-hacked-for-19-million-insider-job-suspected', 'listing')
CT_BN19 = S('Cointelegraph: Hackers withdraw 7,000 bitcoins in Binance security breach (May 2019)', 'https://cointelegraph.com/news/hackers-withdraw-7-000-bitcoins-in-binance-crypto-exchange-security-breach')
CD_UPBIT = S('CoinDesk: Upbit confirms theft of $49M in ether', 'https://www.coindesk.com/markets/2019/11/27/crypto-exchange-upbit-confirms-theft-of-49m-in-ether', 'listing')
DECRYPT_KUCOIN = S('Decrypt: Hacked exchange KuCoin recovers $236 million of stolen funds', 'https://decrypt.co/47868', 'listing')
BLEEP_DMM = S('BleepingComputer: FBI links North Korean hackers to $308 million crypto heist', 'https://www.bleepingcomputer.com/news/security/fbi-links-north-korean-hackers-to-308-million-crypto-heist')
REGISTER26 = S('The Register: FBI pins $6.3B Binance crypto heist on North Korean hackers (2 Nov 2026)', 'https://www.theregister.com/security/2026/11/02/fbi-pins-63b-binance-crypto-heist-on-north-korean-hackers/5306889')
NPR26 = S('NPR: A simple explainer of the massive $6.3 billion crypto heist at Binance (31 Oct 2026)', 'https://www.npr.org/2026/10/31/nx-s1-6024426/binance-crypto-heist-cyber-criminals-north-korea', 'listing')
CNBC26 = S('CNBC: Binance\'s $6.3 billion hack, what we know and what comes next (30 Oct 2026)', 'https://www.cnbc.com/2026/10/30/billions-in-crypto-frozen-in-binance-hack-heres-what-happens-next-.html', 'listing')

def ex(slot, name, year, dateText, place, taken, takenLong, usdText, coin, how, lesson, outcome, sources, caveat='', note=''):
    return {'slot': slot, 'name': name, 'year': year, 'dateText': dateText, 'place': place, 'taken': taken, 'takenLong': takenLong, 'usdText': usdText,
            'coin': coin, 'how': how, 'lesson': lesson, 'outcome': outcome, 'caveat': caveat, 'note': note, 'sources': sources}

exhibits = {
 'cherry': ex('cherry', 'BITSTAMP', 2015, 'January 2015', 'Founded in Slovenia, registered in Luxembourg', '18,866 BTC',
   'Just under 19,000 BTC (18,866) from one operational wallet', 'about $5 million at the time', 'BTC',
   'One of the exchange\'s operational (hot) wallets was compromised on 4 January 2015.',
   'Keep only a small share of customer coins online and the rest offline.',
   'Trading paused, then reopened nearly a week later; offline reserves covered customers.',
   [BITSTAMP, HELP_BSTAMP, CSPK_BSTAMP], note='Now considered the world\'s longest-running crypto exchange (Wikipedia, uncited there). The exact 18,866 BTC figure is from the Coinspeaker headline; Wikipedia says "less than 19,000" and gives the ~$5M only in cited headlines.'),
 'lemon': ex('lemon', 'CRYPTOPIA', 2019, 'January 2019', 'Christchurch, New Zealand', 'NZ$24M',
   'About NZ$24 million (roughly 10% of its assets), mostly Ethereum and ERC-20 tokens, from hot wallets; up to 900,000 users affected', 'about NZ$24 million at the time', 'NZD',
   'Suspicious hot-wallet activity pointed to a compromised private key; the theft ran on for weeks.',
   'A hot wallet is a target: keep its balance small and watched.',
   'The firm went into liquidation in May 2019; liquidators began returning funds in December 2024.',
   [CRYPTOPIA], note='NZ$24M is Elementus\'s estimate as quoted by Wikipedia. Up to 900,000 users is an upper bound.'),
 'chip': ex('chip', 'BITFINEX', 2016, 'August 2016', 'British Virgin Islands-registered exchange', '119,756 BTC',
   '119,756 BTC taken from users\' segregated wallets (a Justice Department-based report gives 119,754)', 'about $72 million at the time', 'BTC',
   'Coins left users\' segregated wallets even though BitGo multi-signature security was in use.',
   'Multi-signature only helps if the whole signing setup is sound.',
   'In 2022 US authorities seized about 94,000 BTC (then $3.6B); two people later pleaded guilty to laundering.',
   [BITFINEX, REC_BFX], note='Wikipedia says 119,756 BTC; The Record says 119,754. How the signing was bypassed is not explained in either source, so the card does not say.'),
 'block': ex('block', 'COINCHECK', 2018, 'January 2018', 'Tokyo, Japan', '523M NEM',
   'About 523 million NEM sent out of one Coincheck NEM address', 'about $400 to $530 million at the time (58 billion yen)', 'NEM',
   'About 523 million NEM tokens were sent out of one of the exchange\'s NEM addresses in a single night.',
   'An exchange that can repay users from its own funds keeps its customers.',
   'Coincheck repaid all 260,000 affected users in yen from its own funds, about 46.3 billion yen.',
   [COINCHECK, SEC_CCHK], note='Wikipedia says "approximately 500 million NEM"; the AFP-based report quotes the exchange\'s 523 million. USD varies with the NEM price: $400M to $530M. Whether the coins sat in a hot wallet without multi-sig is widely reported but not stated in the fetched sources, so the card does not say.'),
 'artifact': ex('artifact', 'BYBIT', 2025, 'February 2025', 'Dubai, UAE', '~400,000 ETH',
   'About 400,000 ETH (Bybit\'s chief executive said 401,000) taken during a cold-to-warm wallet transfer', 'roughly $1.4 to $1.5 billion at the time', 'ETH',
   'A wallet signing screen was manipulated, so approvers saw the right address while the code did something else.',
   'Check what you are really signing, not just what the screen shows.',
   'The FBI attributed it to North Korea-linked actors. It was the record until October 2026.',
   [IC3, BYBIT, REC_BYBIT], note='The FBI alert states only "approximately $1.5 billion". The 400,000 ETH figure comes from Wikipedia ("about 400,000 ETH") and Bybit\'s CEO (401,000 ETH). Bybit replacing the stolen funds is widely reported but is not in the fetched sources, so the card does not say it. "A third party\'s signing tool (Safe{Wallet}) was compromised" is Wikipedia\'s account, Bybit\'s own first report did not name it.'),
 'bitcoin': ex('bitcoin', 'BINANCE', 2026, '29 October 2026', 'Global exchange; ten blockchains', '~$6.3B',
   'About $6.3 billion across ten blockchains, the largest crypto heist on record', 'about $6.3 billion as reported (other counts: $6.36B and $6.43B)', 'MULTI',
   'As reported: attackers drained hot wallets on ten chains in minutes; Binance first blamed a staff laptop.',
   'Freeze fast, absorb the loss, and show proof of reserves.',
   'About $3B in stablecoins was frozen; withdrawals reopened 1 Nov; Binance says users will not bear the loss.',
   [B26, REGISTER26, NPR26, CNBC26], caveat='as reported, 2 November 2026',
   note='Attribution to North Korea-linked actors is by the FBI and TRM Labs and is described in Wikipedia as alleged: keep "alleged". Still unfolding; the cause is not settled (laptop first; "other issues later found"; the EIP-7702 description is inconsistent). Frozen: ~$3B per Wikipedia (range $2.7 to $3B), Elliptic verified $2.85B frozen or seized per The Register. Replenished: 90% on 31 Oct (Wikipedia), ~95% by 2 Nov (The Register). Re-check at build time.'),
 'wild': ex('wild', 'COLD STORAGE', 0, '', 'Offline, out of reach of the internet', '',
   'A sealed cold wallet: keys kept offline', '', 'MULTI',
   'The defence: a cold wallet is kept offline, so its keys cannot be taken from a connected server.',
   'Keys that never touch the internet cannot be stolen over it.',
   'Why exchanges keep most customer coins offline and only a small float in hot wallets.',
   [WALLET, MULTISIG, HELP_BSTAMP], note='Wikipedia: a cold wallet "remains offline and disconnected from the internet"; cold storage means "keeping the private keys out of reach of hackers". Bybit 2025 shows cold wallets can still be tricked at signing.'),
 'scatter': ex('scatter', 'MT. GOX', 2014, 'February 2014', 'Tokyo, Japan', '~850,000 BTC',
   'About 850,000 BTC (almost 750,000 customers\' and about 100,000 its own), roughly 7% of all bitcoin then in existence; 200,000 were later found, leaving about 650,000', 'about 7% of all bitcoin then in existence', 'BTC',
   'Cause still debated: withdrawals froze 7 February 2014; it filed for bankruptcy on 28 February.',
   'Not your keys, not your coins.',
   'Once handling over 70% of all bitcoin trades, it was bankrupt within weeks of halting withdrawals.',
   [MTGOX], note='No USD figure for 2014 is stated in the fetched sources, so none is shown; the share of all bitcoin is used instead. The 2011 first breach: accounts worth more than $8.75M affected, price briefly fell to one cent on 19 June 2011.'),
 'vault': ex('vault', 'QUADRIGACX', 2019, 'January 2019', 'Vancouver-founded, run from Nova Scotia, Canada', 'C$250M',
   'About C$250 million owed to about 115,000 customers, missing or inaccessible (C$215.7M liabilities at the April 2019 bankruptcy filing)', 'about C$250 million (about US$190 million)', 'FIAT',
   'Not a hack: the founder died in December 2018, and its cold wallets had held nothing since April 2018.',
   'Ask for proof of reserves: empty vaults look full until someone checks.',
   'In June 2020 the Ontario Securities Commission concluded it was a fraud and a Ponzi scheme.',
   [QUADRIGA], note='Wikipedia: the five cold-wallet addresses examined by Ernst & Young had contained no cryptocurrency since April 2018; the OSC called it "an old-fashioned fraud wrapped in modern technology". The collapse became public in January 2019. Wikipedia does not call it a hack.'),
}

def tl(year, month, exchange, taken, usdText, how, lesson, headline, verified, note, sources):
    return {'year': year, 'month': month, 'exchange': exchange, 'taken': taken, 'usdText': usdText, 'how': how, 'lesson': lesson,
            'headline': headline, 'verified': verified, 'note': note, 'sources': sources}

timeline = [
 tl(2011, 6, 'Mt. Gox (first breach)', 'accounts worth over $8.75M', 'more than $8.75 million; price briefly fell to one cent',
    'A flood of fraudulent trades hit the exchange\'s market on 19 June 2011.', 'One weak exchange can move the whole market.',
    'BITCOIN PRICE CRASHES TO ONE CENT ON MT. GOX', True, 'Wikipedia gives "more than $8,750,000" and the date 19 June 2011.', [MTGOX]),
 tl(2014, 2, 'Mt. Gox (collapse)', 'about 850,000 BTC, later 650,000', 'about 7% of all bitcoin then in existence',
    'Cause still debated; withdrawals froze 7 Feb 2014 and bankruptcy was filed 28 Feb.', 'Not your keys, not your coins.',
    'MT. GOX FILES FOR BANKRUPTCY, 850,000 BTC MISSING', True, '200,000 BTC found in an old wallet on 20 March 2014 brought the total lost down to about 650,000.', [MTGOX]),
 tl(2015, 1, 'Bitstamp', '18,866 BTC', 'about $5 million', 'An operational (hot) wallet was compromised on 4 January 2015.',
    'Keep a small float online and the rest offline.', 'BITSTAMP SUSPENDS SERVICE AFTER WALLET COMPROMISE', True,
    'Exact BTC figure from Coinspeaker headline; Wikipedia says "less than 19,000".', [BITSTAMP, HELP_BSTAMP, CSPK_BSTAMP]),
 tl(2016, 8, 'Bitfinex', '119,756 BTC', 'about $72 million', 'Coins left users\' segregated wallets despite BitGo multi-signature security.',
    'Multi-sig only helps if the whole setup is sound.', 'BITFINEX HALTS TRADING AFTER MAJOR SECURITY BREACH', True,
    'Wikipedia: 119,756 BTC; The Record: 119,754 BTC. Seizure of about 94,000 BTC in Feb 2022.', [BITFINEX, REC_BFX]),
 tl(2018, 1, 'Coincheck', '523M NEM', 'about $400 to $530 million', 'About 523 million NEM were sent out of one Coincheck NEM address.',
    'An exchange with capital can make users whole.', 'COINCHECK TO REPAY 260,000 CUSTOMERS AFTER NEM THEFT', True,
    'USD range reflects NEM price differences between reports (58 billion yen quoted).', [COINCHECK, SEC_CCHK]),
 tl(2018, 9, 'Zaif (Japan)', '5,966 BTC plus other coins', 'about $59 to $60 million (6.7 billion yen)',
    'Attackers gained unauthorised access to the exchange\'s hot wallets.', 'Hot wallets must be small, watched and rate-limited.',
    'ZAIF HOT WALLETS HIT: 5,966 BTC AND ALTCOINS GONE', True, 'Coins also taken: BCH and MonaCoin (BCH amount unknown). 14 September 2018. The how-line is CoinDesk\'s; it does not say how access was gained.', [CD_ZAIF, CT_ZAIF]),
 tl(2019, 1, 'Cryptopia (New Zealand)', 'about NZ$24 million', 'about NZ$24 million (up to 900,000 users affected)',
    'Suspicious hot-wallet activity pointed to a compromised private key; theft ran on for weeks.', 'Watch hot wallets around the clock.',
    'CRYPTOPIA HACKED: CHRISTCHURCH EXCHANGE GOES OFFLINE', True, 'First noticed 14 January 2019. Liquidation began May 2019; first distributions December 2024.', [CRYPTOPIA]),
 tl(2019, 1, 'QuadrigaCX (Canada)', 'about C$250 million owed', 'about C$250 million; ruled a fraud, not a hack',
    'Not a hack: the founder died in December 2018 and its cold wallets had been empty since April 2018.', 'Ask for proof of reserves.',
    'QUADRIGACX LOCKS OUT USERS; COLD WALLETS FOUND EMPTY', True,
    'OSC concluded fraud and Ponzi scheme in June 2020. Owed ~C$250M to ~115,000 customers per the affidavit; C$215.7M liabilities at the April 2019 bankruptcy filing.', [QUADRIGA]),
 tl(2019, 3, 'Bithumb (South Korea)', 'about $19 million in EOS and XRP', 'about $19 million (reports up to nearly $20 million)',
    'Bithumb said it was hacked and blamed insiders.', 'Insiders and access control matter as much as outsiders.',
    'BITHUMB LOSES EOS AND XRP IN SECOND HACK, BLAMES INSIDERS', True,
    'Wikipedia: 29 March 2019, "nearly $20 million in EOS and Ripple tokens", insiders blamed. $19M from headline-level sources. Token counts (3M EOS, 20M XRP) not confirmed. An earlier June 2018 hack of about $32 million is a separate event.', [BITHUMB, FM_BITHUMB]),
 tl(2019, 5, 'Binance', '7,000 BTC', 'over $40 million', 'Hackers used phishing, viruses and stolen codes and keys to drain hot wallets, Binance said.',
    'Keep hot wallets small (here about 2% of holdings) and insure users.', 'BINANCE HALTS WITHDRAWALS AFTER 7,000 BTC THEFT', True,
    'Cointelegraph: 7,000 BTC, $40.7M at press time, hot wallets held about 2% of its bitcoin, SAFU covers it, withdrawals paused up to a week. The prompt\'s 7,074 BTC is NOT confirmed by any fetched source. 7 May 2019.', [CT_BN19, BINANCE]),
 tl(2019, 11, 'Upbit (South Korea)', '342,000 ETH', 'about $48.5 to $49 million (58 billion won)',
    '342,000 ETH was moved out of the exchange\'s wallets to an unknown address.', 'Moving stolen coins is easier than getting them back.',
    'UPBIT SAYS 342,000 ETHER STOLEN, SUSPENDS TRANSFERS', True,
    '27 November 2019. Wikipedia: about US$48.5M; South Korea\'s investigators later attributed it to North Korean groups (Nov 2024). The wallet type is in Upbit\'s statement, not read in full here.', [UPBIT, CD_UPBIT]),
 tl(2020, 9, 'KuCoin', 'about $281 million in many tokens', 'about $281 million (first reports said over $150 million)',
    'Private keys to its hot wallets were exposed, the exchange said.', 'Have an insurance fund and a plan to track and freeze coins.',
    'KUCOIN HACKED; MOST OF THE LOSS LATER RECOVERED', True,
    'Wikipedia: $281M; 78% recovered with partners, 6% with law enforcement, 16% (about $45.55M) covered by the insurance fund. The prompt\'s "over $150 million" is the first-day figure and was revised upward.', [KUCOIN, DECRYPT_KUCOIN]),
 tl(2024, 5, 'DMM Bitcoin (Japan)', '4,502.9 BTC', 'about $308 million at the time',
    'A staff member of a wallet-software supplier was tricked with a fake job test; attackers later altered a real transaction.', 'Protect the people and laptops that can sign.',
    'DMM BITCOIN LOSES 4,502.9 BTC IN MAY HEIST', True,
    'BleepingComputer: 4,502.9 BTC, $308M, attributed by the FBI to North Korea-linked actors. The prompt\'s "about 4,500 BTC (verify)" is confirmed as 4,502.9. Day of the month not given in the fetched text, so none is shown.', [BLEEP_DMM]),
 tl(2024, 7, 'WazirX (India)', 'about $235 million', 'about $234.9 million',
    'Assets were taken from one of its multi-signature wallets, which was managed with a third-party custodian.', 'Multi-sig is only as strong as every signer\'s screen.',
    'WAZIRX MULTISIG WALLET DRAINED, $235 MILLION GONE', True,
    '18 July 2024. Wikipedia: blockchain analysts attributed it to the North Korea-linked Lazarus Group; it does not say that WazirX or authorities confirmed it. Keep as "linked by analysts".', [WAZIRX]),
 tl(2025, 2, 'Bybit', 'about 400,000 ETH', 'about $1.4 to $1.5 billion',
    'A wallet signing screen was manipulated during a cold-to-warm transfer.', 'Verify what you sign.',
    'BYBIT LOSES $1.5 BILLION IN ETHER; FBI BLAMES N. KOREA', True,
    'FBI PSA of 26 Feb 2025: about $1.5B, North Korea-linked actors, theft on or about 21 Feb 2025. ETH count from Wikipedia and Bybit\'s CEO.', [IC3, BYBIT, REC_BYBIT]),
 tl(2026, 10, 'Binance', 'about $6.3 billion, ten chains', 'about $6.3 billion as reported',
    'As reported: hot wallets were drained across ten blockchains; Binance first blamed a staff laptop.', 'Freeze fast; absorb the loss; show proof of reserves.',
    'BINANCE HACK: $6.3 BILLION, LARGEST CRYPTO HEIST ON RECORD', True,
    'As reported, 2 November 2026. Attribution (North Korea-linked actors) is alleged. About $3B frozen; withdrawals reopened 1 Nov.', [B26, REGISTER26, NPR26, CNBC26]),
]

lessons = [
 {'id': 'keys', 'title': 'NOT YOUR KEYS', 'line': 'Not your keys, not your coins: coins on an exchange are a promise, not property.', 'from': 'Mt. Gox 2014', 'sources': [MTGOX]},
 {'id': 'cold', 'title': 'COLD STORAGE', 'line': 'Keep most coins offline; only a small float should ever sit in a hot wallet.', 'from': 'Bitstamp 2015', 'sources': [BITSTAMP, HELP_BSTAMP, WALLET]},
 {'id': 'multisig', 'title': 'MULTI-SIG', 'line': 'Several signers beat one, but every signer must trust what they approve.', 'from': 'Bitfinex 2016', 'sources': [BITFINEX, MULTISIG, WAZIRX]},
 {'id': 'reserves', 'title': 'PROOF OF RESERVES', 'line': 'A public check that the coins exist would have shown empty vaults early.', 'from': 'QuadrigaCX 2019', 'sources': [QUADRIGA, B26]},
 {'id': 'verify', 'title': 'VERIFY WHAT YOU SIGN', 'line': 'A screen can show the right address while the code does something else.', 'from': 'Bybit 2025', 'sources': [REC_BYBIT, BYBIT]},
 {'id': 'segregate', 'title': 'SEGREGATE HOT AND COLD', 'line': 'A hot wallet holding about 2% of the total caps the damage of one breach.', 'from': 'Binance 2019', 'sources': [CT_BN19]},
 {'id': 'devices', 'title': 'PROTECT SIGNER DEVICES', 'line': 'One tricked employee or laptop can open the door to the whole wallet system.', 'from': 'DMM Bitcoin 2024', 'sources': [BLEEP_DMM, B26]},
 {'id': 'reimburse', 'title': 'REIMBURSE FUND', 'line': 'A reserve set aside from fees lets an exchange repay users after a theft.', 'from': 'Binance 2019', 'sources': [CT_BN19]},
 {'id': 'makewhole', 'title': 'MAKE USERS WHOLE', 'line': 'An exchange with capital can repay every customer from its own funds.', 'from': 'Coincheck 2018', 'sources': [COINCHECK, SEC_CCHK]},
 {'id': 'insurance', 'title': 'INSURANCE FUND', 'line': 'An insurance fund covered a slice of the loss while most coins were tracked down.', 'from': 'KuCoin 2020', 'sources': [KUCOIN]},
 {'id': 'freeze', 'title': 'FREEZE FAST', 'line': 'Stablecoin issuers can freeze stolen tokens, so speed decides what is recovered.', 'from': 'Binance 2026', 'sources': [B26, REGISTER26, TETHER]},
 {'id': 'trace', 'title': 'THE CHAIN REMEMBERS', 'line': 'Stolen coins are traceable, and years later the authorities can still seize them.', 'from': 'Bitfinex 2016', 'sources': [REC_BFX, BITFINEX]},
 {'id': 'pause', 'title': 'PAUSE AND CHECK', 'line': 'Halting withdrawals while investigating limits a run and a second theft.', 'from': 'Binance 2019', 'sources': [CT_BN19, HELP_BSTAMP]},
 {'id': 'insiders', 'title': 'WATCH INSIDER ACCESS', 'line': 'Bithumb blamed insiders: staff access needs limits and logs.', 'from': 'Bithumb 2019', 'sources': [BITHUMB, FM_BITHUMB]},
]

glossary = [
 {'term': 'Hot wallet', 'line': 'A wallet connected to the internet so an exchange can pay withdrawals fast. Convenient, and the usual target.', 'sources': [WALLET]},
 {'term': 'Cold wallet', 'line': 'A wallet kept offline and disconnected from the internet, so its keys are out of reach of online attackers.', 'sources': [WALLET]},
 {'term': 'Multi-signature', 'line': 'A wallet that needs a set number of independent keys to approve each transaction.', 'sources': [MULTISIG]},
 {'term': 'Proof of reserves', 'line': 'A public check that an exchange really holds the coins it owes customers. Binance said it would show its on 2 November 2026.', 'sources': [B26], 'note': 'General definition written for this machine; no dedicated reference page was reachable. The 2 November 2026 statement is from the Binance 2026 article.'},
 {'term': 'Attribution', 'line': 'Naming who is behind a theft. An investigator\'s attribution, such as the FBI\'s to North Korea-linked actors, is shown as alleged unless a court has ruled. The museum names no attackers.', 'sources': [IC3, BLEEP_DMM, REGISTER26]},
 {'term': 'Stablecoin freeze', 'line': 'A stablecoin issuer can block tokens at a given address, which is how about $3 billion was frozen after the Binance hack.', 'sources': [TETHER, B26]},
]

coins = {
 'BTC': {'status': 'file', 'file': 'art/coins/btc-logo_ios.png', 'extra': 'art/coins/btc-logotop.svg', 'source': 'https://raw.githubusercontent.com/bitcoin/bitcoin.org/master/img/icons/logo_ios.png',
         'note': 'Official bitcoin.org icon (114x114 PNG, the orange B coin), used unmodified. btc-logotop.svg is the full bitcoin.org logo (coin plus wordmark), kept for reference; never crop or recolour. The repository is MIT-licensed; the logo\'s own terms were not stated in the repo.'},
 'ETH': {'status': 'file', 'file': 'art/coins/eth-diamond-black.svg', 'source': 'https://raw.githubusercontent.com/ethereum/ethereum-org-website/dev/public/images/assets/svgs/eth-diamond-black.svg',
         'note': 'Official ethereum.org logo asset (the diamond, black), used unmodified. The repository is MIT-licensed; brand-asset terms on ethereum.org were not read.'},
 'NEM': {'status': 'type', 'source': '', 'note': 'No official NEM symbol file was reachable from the build network (nem.io was blocked and no GitHub repo path was found). Shows "NEM" set in type.'},
 'NZD': {'status': 'type', 'source': '', 'note': 'A currency, not a coin: shows "NZ$" in type.'},
 'FIAT': {'status': 'type', 'source': '', 'note': 'Canadian dollars (QuadrigaCX): shows "C$" in type.'},
 'MULTI': {'status': 'type', 'source': '', 'note': 'Several assets (Binance 2026: ETH, BTC, TRX, XRP, SOL and more; Cold Storage): shows the chain count or a keyhole drawn as vector shapes by the game (not a logo).'},
 'XRP': {'status': 'type', 'source': '', 'note': 'Used only inside headlines/data text; no symbol file needed.'},
 'EOS': {'status': 'type', 'source': '', 'note': 'Used only inside headlines/data text; no symbol file needed.'},
}

# ---- checks against the schema limits the game is coded to ----
bad = []
def chk(label, s, n):
    if len(s) > n: bad.append(f'{label}: {len(s)} > {n}: {s}')
for k, e in exhibits.items():
    chk(k + '.name', e['name'], 16); chk(k + '.how', e['how'], 110); chk(k + '.lesson', e['lesson'], 90); chk(k + '.outcome', e['outcome'], 110)
    if not e['sources']: bad.append(k + ' has no sources')
for t in timeline:
    chk(f"tl{t['year']}.headline", t['headline'], 58)
    if not t['sources']: bad.append('timeline row without sources')
for l in lessons:
    chk(l['id'] + '.title', l['title'], 22); chk(l['id'] + '.line', l['line'], 90)
if bad: print('\n'.join(bad)); sys.exit(1)
assert [t['year'] for t in timeline] == sorted(t['year'] for t in timeline) and len(timeline) == 16

facts = {'asOf': '2 November 2026', 'machine': 'hot-wallet', 'exhibits': exhibits, 'timeline': timeline, 'lessons': lessons, 'glossary': glossary, 'coins': coins,
         'rules': ['Amounts are "at the time" and ranges are shown where sources disagree.', 'No individual hacker is named or shown; attribution is shown as alleged where sources say so.',
                   'Each "how" line is one plain sentence of cause, never instructions.', 'No hacked exchange\'s logo is used.']}
json.dump(facts, open(os.path.join(HERE, 'facts.json'), 'w'), indent=1, ensure_ascii=False)

# ---- sources.json ----
seen = {}
for obj in list(exhibits.values()) + timeline + lessons + glossary:
    label = obj.get('slot') or obj.get('exchange') or obj.get('id') or obj.get('term')
    kind = 'exhibit' if 'slot' in obj else 'timeline' if 'exchange' in obj else 'lesson' if 'id' in obj else 'glossary'
    for s in obj['sources']:
        e = seen.setdefault(s['url'], {'title': s['title'], 'url': s['url'], 'retrieved': R, 'kind': s['kind'], 'backs': []})
        e['backs'].append(f"{kind}:{label}" + (f" {obj['year']}" if kind == 'timeline' else ''))
images = [{'file': c['file'], 'source': c['source'], 'coin': k, 'note': c['note']} for k, c in coins.items() if c['status'] == 'file']
images.append({'file': coins['BTC']['extra'], 'source': 'https://raw.githubusercontent.com/bitcoin/bitcoin.org/master/img/icons/logotop.svg', 'coin': 'BTC', 'note': 'full official logo, reference copy'})
import os
HERE_LOGOS = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logos', 'manifest.json')
sources = {'machine': 'hot-wallet', 'retrieved': R, 'facts': list(seen.values()), 'images': images, 'logos': [{'key': k, 'name': v['name'], 'file': 'art/logos/' + k + '.png', 'suppliedAs': v['source'], 'suppliedBy': 'Jim (Xtrata), from his Downloads/Logos folder, 2 November 2026'} for k, v in __import__('json').load(open(HERE_LOGOS)).items()],
 'logosNeedingPermission': ['Bitstamp', 'Cryptopia', 'Bitfinex', 'Coincheck', 'Bybit', 'Binance', 'Mt. Gox', 'QuadrigaCX', 'Zaif', 'Bithumb', 'Upbit', 'KuCoin', 'DMM Bitcoin', 'WazirX', 'BitGo', 'EY'],
 'logosMissing': [{'coin': k, 'note': c['note']} for k, c in coins.items() if c['status'] == 'type'],
 'notes': ['Company logos (art/logos, trimmed from the files Jim supplied; colours and shapes untouched) are shown on the reel tiles, the Timeline clippings, the panels and the cabinet\'s evidence cases. They are the companies\' trademarks and none of the companies has given permission or endorsed the machine: see logosNeedingPermission, and the panel says so. The FBI and US Department of Justice seals and the Wikipedia logo were in the folder but are not used (official seals, and Wikipedia is a source, not a company in the game).',
           '"kind":"listing" means only the headline or search listing of that page was seen (the page itself could not be read); those sources back a figure only together with a "read" source, and are flagged so they can be re-checked.',
           'BleepingComputer, NPR, CNBC, CBC and Wikipedia pages for Zaif, DMM Bitcoin and the list of exchange hacks could not be fetched on the build network (robots or errors); see FACTS-NOTES.md.',
           'Coin symbol files: only BTC and ETH official files were reachable; the rest show the ticker set in type. Nothing was drawn or recreated by hand.',
           'Binance 2026 is still unfolding: label "as reported, 2 November 2026", keep the attribution as alleged, and re-check every figure at build time.']}
json.dump(sources, open(os.path.join(HERE, 'sources.json'), 'w'), indent=1, ensure_ascii=False)
print('ok: exhibits', len(exhibits), 'timeline', len(timeline), 'lessons', len(lessons), 'glossary', len(glossary), 'sources', len(seen), 'images', len(images))
