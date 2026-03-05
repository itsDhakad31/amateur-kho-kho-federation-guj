
const Database = require('better-sqlite3');
const db = new Database('database.sqlite');
const events = db.prepare("SELECT * FROM events").all();
console.log(JSON.stringify(events, null, 2));
