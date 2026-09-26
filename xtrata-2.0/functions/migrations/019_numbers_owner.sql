-- One-off data fix (approved by Jim, 2026-09-26): the Numbers 1–10 website record
-- lists the disposable setup wallet as its creator, while its contract
-- (xtrata-collection-mint-v1-6) is owned on-chain by the Xtrata owner wallet.
-- Align the record with the contract owner so the owner can manage it once
-- sign-in is enforced. Guarded: changes nothing unless the old value is present.
-- Run: npx wrangler d1 execute xtrata-manage --remote --file functions/migrations/019_numbers_owner.sql
-- Undo: swap the two addresses below and run again.
UPDATE collections
   SET artist_address = 'SP3JNSEXAZP4BDSHV0DN3M8R3P0MY0EEBQQZX743X',
       updated_at = CAST(strftime('%s','now') AS INTEGER) * 1000
 WHERE id = 'b403e9c4-a57e-4769-93da-e3e4eaf4f115'
   AND artist_address = 'SP3P8VYRTXYVEH2R85YKASHTD65Z4E4RC13MY7X6M';
