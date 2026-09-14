CREATE TABLE radio_metadata (
 token_id INTEGER PRIMARY KEY, title TEXT, artist TEXT, checked_at INTEGER NOT NULL,
 status TEXT NOT NULL DEFAULT 'pending'
);
CREATE TABLE radio_like_browsers (
 browser_hash TEXT PRIMARY KEY, revision INTEGER NOT NULL, operation_id TEXT NOT NULL,
 updated_at INTEGER NOT NULL
);
CREATE TABLE radio_likes (
 browser_hash TEXT NOT NULL, token_id INTEGER NOT NULL,
 PRIMARY KEY(browser_hash,token_id)
);
CREATE INDEX radio_likes_token ON radio_likes(token_id);
