-- Sync-stampede guard. Under traffic, several concurrent page views can each
-- trigger a background sync (directly via /index/<contract> GET, or indirectly
-- via /index/page firing POSTs), launching redundant chain reads/writes that
-- compete for the Worker subrequest budget.
--
-- sync_lock_until is a soft, self-expiring lock: sync() sets it to now+TTL
-- before doing work and releases it (0) at the end. A concurrent sync that finds
-- sync_lock_until > now backs off. The TTL means a crashed/timed-out sync can
-- never wedge the index permanently — the lock simply expires.
ALTER TABLE inscription_index_state ADD COLUMN sync_lock_until INTEGER DEFAULT 0;
