// AunuMD • plugin loader: memindai plugins/<kategori>/*.js dan mendaftarkan setiap perintah.
import { readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const pluginsDir = path.join(root, 'plugins');

export const entries = [];            // semua plugin yang berhasil dimuat
export const registry = new Map();    // nama/alias (huruf kecil) -> entry
export const categories = new Map();  // kategori -> [entry]

export async function loadPlugins(log) {
  entries.length = 0;
  registry.clear();
  categories.clear();
  let catDirs = [];
  try { catDirs = (await readdir(pluginsDir, { withFileTypes: true })).filter((d) => d.isDirectory()); }
  catch { return entries; }
  for (const catDir of catDirs.sort((a, b) => a.name.localeCompare(b.name))) {
    const dirPath = path.join(pluginsDir, catDir.name);
    const files = (await readdir(dirPath)).filter((f) => f.endsWith('.js')).sort();
    for (const file of files) {
      const full = path.join(dirPath, file);
      try {
        const mod = await import(pathToFileURL(full).href);
        const cfg = mod.config;
        if (!cfg?.name || typeof mod.default !== 'function') {
          log?.warn(`Plugin dilewati (kontrak tidak lengkap): ${catDir.name}/${file}`);
          continue;
        }
        const entry = { config: cfg, run: mod.default, file: `${catDir.name}/${file}` };
        const key = String(cfg.name).toLowerCase();
        if (registry.has(key)) { log?.warn(`Nama perintah ganda, yang pertama dipertahankan: ${key}`); continue; }
        registry.set(key, entry);
        for (const alias of cfg.alias || []) {
          const a = String(alias).toLowerCase();
          if (!registry.has(a)) registry.set(a, entry);
        }
        entries.push(entry);
        if (!categories.has(cfg.category || catDir.name)) categories.set(cfg.category || catDir.name, []);
        categories.get(cfg.category || catDir.name).push(entry);
      } catch (e) {
        // Satu plugin rusak tidak boleh mematikan bot.
        log?.error(`Plugin gagal dimuat: ${catDir.name}/${file} — ${e.message}`);
      }
    }
  }
  return entries;
}

export function findCommand(name) {
  return registry.get(String(name || '').toLowerCase()) || null;
}

export function listPlugins() {
  return { total: entries.length, categories };
}

export default { loadPlugins, findCommand, listPlugins, entries, registry, categories };
