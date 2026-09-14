-- NULL = not inspected; empty string = checked and no album supplied.
ALTER TABLE radio_metadata ADD COLUMN album TEXT;
