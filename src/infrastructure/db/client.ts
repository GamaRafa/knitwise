import { drizzle } from 'drizzle-orm/expo-sqlite';
import { openDatabaseSync } from 'expo-sqlite';
import * as schema from './schema';

const expo = openDatabaseSync('knitwise.db');

expo.execSync("PRAGMA foreign_keys = ON;"); // Enable foreign key support

const db = drizzle(expo, { schema });

export default db;