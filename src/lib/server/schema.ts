// src/lib/server/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
import type { InferModel } from 'drizzle-orm/orm';

export const users = sqliteTable('users', {
  id: integer('id').primaryKey(),
  username: text('username').notNull().unique(),
  password: text('password').notNull(),
});

// (ถ้าจะใช้ type)
export type User = InferModel<typeof users>;
export type NewUser = InferModel<typeof users, 'insert'>;
