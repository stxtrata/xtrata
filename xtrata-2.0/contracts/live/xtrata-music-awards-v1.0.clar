;; xtrata-music-awards-v1.0
;;
;; Xtrata Music Hero awards (docs/music/AWARDS-INSCRIPTION.md).
;;
;; A listener who has earned an award claims it with one call. This contract then, as itself:
;;   1. inscribes the award's record on Xtrata (a tiny HTML file naming the award template and carrying the
;;      hero's number, address, name, plays and seed),
;;   2. pays Xtrata's inscription fee from its own balance, and
;;   3. transfers the new inscription to the hero.
;; The award is therefore an ordinary Xtrata inscription: a standard, transferable NFT.
;;
;; Who may claim what is decided off-chain and proven by a signed note. The note covers the hero's address, the
;; drop, class, wall number, plays, and the hash of the exact record bytes, so nothing in it can be swapped.
;; The signing key signs notes and nothing else: it holds no funds and cannot inscribe or move anything.
;;
;; Limits that hold even if that key leaked: one award per wall number and one per address in a drop, and no more
;; awards of a class than the owner allowed. The most that can ever be spent is fee x the sum of the class caps.
;;
;; Deploy as Clarity 3 (it uses `as-contract`).

(define-constant ERR-NOT-OWNER        (err u200))
(define-constant ERR-PAUSED           (err u201))
(define-constant ERR-NO-SIGNER        (err u202))
(define-constant ERR-BAD-NOTE         (err u203))
(define-constant ERR-NUMBER-CLAIMED   (err u204))
(define-constant ERR-ALREADY-AWARDED  (err u205))
(define-constant ERR-CLASS-NOT-SET    (err u206))
(define-constant ERR-CLASS-FULL       (err u207))
(define-constant ERR-BAD-RECORD       (err u208))
(define-constant ERR-BAD-ARGS         (err u209))
(define-constant ERR-UNEXPECTED       (err u210))

;; Errors below u200 come straight from the Xtrata core (u109 paused, u111 template missing, and so on) or from
;; the STX transfer of the fee (u1: this contract's balance cannot cover it).

(define-constant DOMAIN "xtrata-music-awards-v1")
(define-constant MIME "text/html")
;; Xtrata hashes a file as a chain over its chunks, starting from 32 zero bytes. A record is always one chunk.
(define-constant ZERO-HASH 0x0000000000000000000000000000000000000000000000000000000000000000)

(define-data-var contract-owner principal tx-sender)
;; hash160 of the public key whose notes are accepted. None: nobody can claim.
(define-data-var signer-hash (optional (buff 20)) none)
(define-data-var paused bool false)
(define-data-var token-uri (string-ascii 256) "https://xtrata.xyz/players")

;; A class of award within a drop: the template its records are built from, how many may exist, how many do.
(define-map Classes { drop: uint, class: uint } { template: uint, cap: uint, minted: uint })
;; Every award made, by its Xtrata inscription id. `hero` is who earned it, whoever holds it now.
(define-map Awards uint { drop: uint, class: uint, edition: uint, number: uint, plays: uint, hero: principal })
(define-map ByNumber { drop: uint, number: uint } uint)
(define-map ByHero { drop: uint, hero: principal } uint)

;; --- reading ---

(define-read-only (get-contract-owner) (ok (var-get contract-owner)))
(define-read-only (get-signer-hash) (ok (var-get signer-hash)))
(define-read-only (is-paused) (ok (var-get paused)))
(define-read-only (get-token-uri) (ok (var-get token-uri)))
(define-read-only (get-balance) (ok (stx-get-balance (as-contract tx-sender))))
(define-read-only (get-class (drop uint) (class uint)) (map-get? Classes { drop: drop, class: class }))
(define-read-only (get-award (id uint)) (map-get? Awards id))
(define-read-only (get-award-by-number (drop uint) (number uint)) (map-get? ByNumber { drop: drop, number: number }))
(define-read-only (get-award-of (drop uint) (hero principal)) (map-get? ByHero { drop: drop, hero: hero }))

;; What a note is bound to besides its own fields: this chain and this very contract. A note signed for one
;; deployment is worthless on another.
(define-read-only (get-domain)
  { chain: chain-id, contract: (as-contract tx-sender), domain: DOMAIN })

;; The hash Xtrata will compute for a one-chunk record.
(define-read-only (get-record-hash (record (buff 1024)))
  (sha256 (concat ZERO-HASH record)))

;; The hash a note signs. The server builds the same tuple, serialises it the standard way, and signs its sha256.
(define-read-only (get-note-hash
    (drop uint) (class uint) (number uint) (plays uint) (hero principal) (record-hash (buff 32)))
  (sha256 (unwrap-panic (to-consensus-buff? {
    chain: chain-id,
    class: class,
    contract: (as-contract tx-sender),
    domain: DOMAIN,
    drop: drop,
    hero: hero,
    number: number,
    plays: plays,
    record: record-hash
  }))))

;; --- claiming ---

(define-public (claim
    (drop uint) (class uint) (number uint) (plays uint) (record (buff 1024)) (signature (buff 65)))
  (let (
      (hero tx-sender)
      (size (len record))
      (record-hash (get-record-hash record))
      (signer (unwrap! (var-get signer-hash) ERR-NO-SIGNER))
      (cfg (unwrap! (map-get? Classes { drop: drop, class: class }) ERR-CLASS-NOT-SET))
      (pubkey (unwrap! (secp256k1-recover? (get-note-hash drop class number plays hero record-hash) signature)
                       ERR-BAD-NOTE))
    )
    (asserts! (not (var-get paused)) ERR-PAUSED)
    (asserts! (> size u0) ERR-BAD-RECORD)
    (asserts! (> number u0) ERR-BAD-ARGS)
    (asserts! (is-eq (hash160 pubkey) signer) ERR-BAD-NOTE)
    (asserts! (is-none (map-get? ByNumber { drop: drop, number: number })) ERR-NUMBER-CLAIMED)
    (asserts! (is-none (map-get? ByHero { drop: drop, hero: hero })) ERR-ALREADY-AWARDED)
    (asserts! (< (get minted cfg) (get cap cfg)) ERR-CLASS-FULL)
    (let (
        ;; As this contract: inscribe the record (the core checks the bytes against the hash and takes its fee
        ;; from this contract's balance), with the class's template declared as what it is built from.
        (minted (try! (as-contract (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
          mint-single-tx-recursive record-hash MIME size (list record) (var-get token-uri)
          (list (get template cfg))))))
        (id (get token-id minted))
        (edition (+ (get minted cfg) u1))
      )
      (asserts! (not (get existed minted)) ERR-UNEXPECTED)
      ;; ...and hand it to the hero. Everything above and below happens in this one transaction or not at all.
      (try! (as-contract (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
        transfer id tx-sender hero)))
      (map-set Classes { drop: drop, class: class } (merge cfg { minted: edition }))
      (map-set Awards id { drop: drop, class: class, edition: edition, number: number, plays: plays, hero: hero })
      (map-set ByNumber { drop: drop, number: number } id)
      (map-set ByHero { drop: drop, hero: hero } id)
      (print { event: "music-hero-award", version: u1, token-id: id, drop: drop, class: class, edition: edition,
               number: number, plays: plays, hero: hero, record: record-hash })
      (ok { token-id: id, edition: edition }))))

;; --- the owner ---

(define-private (assert-owner)
  (ok (asserts! (is-eq tx-sender (var-get contract-owner)) ERR-NOT-OWNER)))

;; Set or change a class. The cap can be raised or lowered, but never below what already exists.
(define-public (set-class (drop uint) (class uint) (template uint) (cap uint))
  (let ((minted (default-to u0 (get minted (map-get? Classes { drop: drop, class: class })))))
    (try! (assert-owner))
    (asserts! (>= cap minted) ERR-BAD-ARGS)
    (map-set Classes { drop: drop, class: class } { template: template, cap: cap, minted: minted })
    (print { event: "class-set", drop: drop, class: class, template: template, cap: cap })
    (ok true)))

(define-public (set-signer-hash (new-hash (optional (buff 20))))
  (begin
    (try! (assert-owner))
    (var-set signer-hash new-hash)
    (print { event: "signer-set", signer: new-hash })
    (ok true)))

(define-public (set-paused (value bool))
  (begin
    (try! (assert-owner))
    (var-set paused value)
    (ok true)))

(define-public (set-token-uri (value (string-ascii 256)))
  (begin
    (try! (assert-owner))
    (asserts! (> (len value) u0) ERR-BAD-ARGS)
    (var-set token-uri value)
    (ok true)))

;; Take back balance that is not needed. Anyone may add balance by sending STX to this contract.
(define-public (withdraw (amount uint) (recipient principal))
  (begin
    (try! (assert-owner))
    (asserts! (> amount u0) ERR-BAD-ARGS)
    (as-contract (stx-transfer? amount tx-sender recipient))))

;; An inscription sent to this contract by mistake can be sent on. Claims never leave one here.
(define-public (recover (id uint) (recipient principal))
  (begin
    (try! (assert-owner))
    (as-contract (contract-call? 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X.xtrata-v3-2-3
      transfer id tx-sender recipient))))

(define-public (transfer-contract-ownership (new-owner principal))
  (begin
    (try! (assert-owner))
    (var-set contract-owner new-owner)
    (ok true)))
