-- Anonymous daily cohorts survive deletion of individual browser sessions.
CREATE TABLE radio_daily (
 contract TEXT NOT NULL, token_id INTEGER NOT NULL, source TEXT NOT NULL,
 day INTEGER NOT NULL, starts INTEGER NOT NULL DEFAULT 0,
 plays INTEGER NOT NULL DEFAULT 0, completions INTEGER NOT NULL DEFAULT 0,
 seconds REAL NOT NULL DEFAULT 0, last_play INTEGER,
 PRIMARY KEY(contract,token_id,source,day)
);
CREATE TABLE radio_reporting_state (id INTEGER PRIMARY KEY CHECK(id=1), measured_since INTEGER NOT NULL);
INSERT INTO radio_reporting_state SELECT 1,COALESCE(MIN(created_at),CAST(strftime('%s','now') AS INTEGER)*1000) FROM radio_plays;
INSERT INTO radio_daily
 SELECT contract,token_id,source,CAST(created_at/86400000 AS INTEGER)*86400000,
 SUM(seconds>=2),SUM(qualified_at IS NOT NULL),SUM(completed_at IS NOT NULL),SUM(seconds),MAX(qualified_at)
 FROM radio_plays GROUP BY contract,token_id,source,CAST(created_at/86400000 AS INTEGER);
CREATE TRIGGER radio_daily_insert AFTER INSERT ON radio_plays BEGIN
 INSERT OR IGNORE INTO radio_daily(contract,token_id,source,day) VALUES(NEW.contract,NEW.token_id,NEW.source,CAST(NEW.created_at/86400000 AS INTEGER)*86400000);
END;
CREATE TRIGGER radio_daily_update AFTER UPDATE ON radio_plays BEGIN
 UPDATE radio_daily SET starts=starts+(NEW.seconds>=2)-(OLD.seconds>=2),
 plays=plays+(NEW.qualified_at IS NOT NULL)-(OLD.qualified_at IS NOT NULL),
 completions=completions+(NEW.completed_at IS NOT NULL)-(OLD.completed_at IS NOT NULL),
 seconds=seconds+NEW.seconds-OLD.seconds,
 last_play=CASE WHEN NEW.qualified_at IS NOT NULL THEN MAX(COALESCE(last_play,0),NEW.qualified_at) ELSE last_play END
 WHERE contract=NEW.contract AND token_id=NEW.token_id AND source=NEW.source AND day=CAST(NEW.created_at/86400000 AS INTEGER)*86400000;
END;
