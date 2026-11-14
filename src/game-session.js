// AunuMD • sesi permainan per pengguna (di memori, kedaluwarsa otomatis).
// Dipakai plugin game: pembuat soal menyimpan jawaban di sini, perintah .jawab memeriksanya.
const sessions = new Map();

export function sessionKey(m) {
  return `${m.chat}:${m.sender}`;
}

export function setSession(key, data, ttlMs = 180000) {
  sessions.set(key, { ...data, expires: Date.now() + ttlMs });
}

export function getSession(key) {
  const s = sessions.get(key);
  if (!s) return null;
  if (Date.now() > s.expires) { sessions.delete(key); return null; }
  return s;
}

export function clearSession(key) {
  sessions.delete(key);
}

export default { setSession, getSession, clearSession, sessionKey };
