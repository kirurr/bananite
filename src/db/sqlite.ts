import Database from 'better-sqlite3';

const db = new Database('./db.sqlite');

db.exec(`
	CREATE TABLE IF NOT EXISTS mods (
		name TEXT PRIMARY KEY
	);
`);

export default db;
