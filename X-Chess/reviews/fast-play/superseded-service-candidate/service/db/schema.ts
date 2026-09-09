import { sqliteTable, integer, text } from 'drizzle-orm/sqlite-core';
export const matches = sqliteTable('matches', {
  game: integer('game').primaryKey(),
  revision: integer('revision').notNull(),
  record: text('record').notNull()
});
