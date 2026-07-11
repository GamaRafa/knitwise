/**
 * projects
  id           TEXT PRIMARY KEY
  name         TEXT NOT NULL
  created_at   INTEGER NOT NULL
  updated_at   INTEGER NOT NULL

counters
  id             TEXT PRIMARY KEY
  project_id     TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE
  type           TEXT NOT NULL        -- 'simple' | 'pattern'
  name           TEXT NOT NULL
  value          INTEGER NOT NULL DEFAULT 1
  pattern_length INTEGER              -- NULL for simple counters
  created_at     INTEGER NOT NULL
 */

import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable('projects', {
  id: text('id').primaryKey(),  // maybe use uuidv4() for generating unique ids
  name: text('name').notNull(),
  createdAt: integer('created_at').notNull(),
  updatedAt: integer('updated_at').notNull()
});

export const counters = sqliteTable('counters', {
  id: text('id').primaryKey(),  // maybe use uuidv4() for generating unique ids
  project_id: text('project_id').notNull().references(() => projects.id, { onDelete: 'cascade' }),
  type: text('type').notNull(),  // 'simple' | 'pattern'
  name: text('name').notNull(),
  value: integer('value').notNull().default(1),
  pattern_length: integer('pattern_length'),  // NULL for simple counters
  createdAt: integer('created_at').notNull()
})