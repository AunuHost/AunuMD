// AunuMD • penyimpanan JSON sederhana: cache di memori, tulis atomik (tmp + rename).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const dbDir = path.join(root, 'database');
fs.mkdirSync(dbDir, { recursive: true });

class Collection {
  constructor(name) {
    this.file = path.join(dbDir, `${name}.json`);
    this.data = {};
    this._timer = null;
    try {
      this.data = JSON.parse(fs.readFileSync(this.file, 'utf8')) || {};
    } catch { this.data = {}; }
  }
  get(key) { return this.data[key]; }
  set(key, value) { this.data[key] = value; this.schedule(); }
  delete(key) { delete this.data[key]; this.schedule(); }
  all() { return this.data; }
  schedule() {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => this.flush(), 200);
  }
  flush() {
    try {
      const tmp = `${this.file}.tmp`;
      fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
      fs.renameSync(tmp, this.file);
    } catch { /* kegagalan tulis tidak boleh mematikan bot */ }
  }
}

export const db = {
  users: new Collection('users'),
  groups: new Collection('groups'),
  settings: new Collection('settings')
};

// Pengaturan runtime (menimpa config.js bila pernah diubah lewat perintah owner).
export function getSetting(key, fallback) {
  const v = db.settings.get(key);
  return v === undefined ? fallback : v;
}

export default db;
