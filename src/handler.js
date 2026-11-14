// AunuMD • handler pesan: serialisasi -> gerbang (mode/owner/grup/cooldown) -> jalankan plugin.
import config from '../config.js';
import { db, getSetting } from './database.js';
import { findCommand, listPlugins } from './loader.js';
import { smsg } from './smsg.js';
import { sendRichText } from './rich.js';
import { extractNum, isOwnerJid } from './helper.js';

const cooldowns = new Map();

export function effectiveConfig() {
  return {
    ...config,
    botName: getSetting('botName', config.botName),
    prefix: getSetting('prefix', config.prefix),
    mode: getSetting('mode', config.mode)
  };
}

function participantAdmin(meta, jid, altJid) {
  const parts = meta?.participants || [];
  const hit = parts.find((p) => p.id === jid || (altJid && p.id === altJid));
  return hit ? (hit.admin === 'admin' || hit.admin === 'superadmin') : false;
}

function findUserByNum(num) {
  for (const [key, value] of Object.entries(db.users.all())) {
    if (extractNum(key) === num) return value;
  }
  return null;
}

export async function handleMessage(sock, raw, log, pinoLogger) {
  if (!raw?.message) return;
  const m = smsg(sock, raw, pinoLogger);
  if (!m.chat || m.chat === 'status@broadcast') return;

  // Catat nama pengguna untuk fitur yang membutuhkan nama (mis. personal tagall).
  if (m.pushName && m.sender) {
    const u = db.users.get(m.sender) || {};
    if (u.name !== m.pushName) { u.name = m.pushName; db.users.set(m.sender, u); }
  }

  const cfg = effectiveConfig();
  const isOwner = m.fromMe || isOwnerJid(m.sender, config) || (m.senderAlt ? isOwnerJid(m.senderAlt, config) : false);

  // Penghitung pesan (untuk level/rank) + status AFK: pesan apa pun dari pengguna
  // yang sedang AFK mengembalikannya (kecuali perintah .afk itu sendiri).
  if (!m.fromMe && m.sender) {
    const u = db.users.get(m.sender) || {};
    u.msgs = (u.msgs || 0) + 1;
    if (u.afk) {
      delete u.afk;
      db.users.set(m.sender, u);
      if (!m.text || !m.text.startsWith(cfg.prefix + 'afk')) {
        sendRichText(sock, m.chat, `👋 @${extractNum(m.sender)} sudah kembali dari AFK.`, { title: cfg.botName }).catch(() => {});
      }
    } else {
      db.users.set(m.sender, u);
    }
  }

  // Bila seseorang yang disebut sedang AFK, beri tahu pengirimnya (maks 1x/menit per target).
  if (m.mentionedJid?.length) {
    for (const jid of m.mentionedJid) {
      const rec = findUserByNum(extractNum(jid));
      if (rec?.afk) {
        const key = `afk:${extractNum(jid)}`;
        const now = Date.now();
        if (now - (cooldowns.get(key) || 0) > 60000) {
          cooldowns.set(key, now);
          sendRichText(sock, m.chat, `💤 @${extractNum(jid)} sedang AFK: ${rec.afk.reason} (sejak ${new Date(rec.afk.at).toLocaleTimeString('id-ID')})`, { title: cfg.botName }).catch(() => {});
        }
      }
    }
  }

  // Antilink: hapus tautan grup lain dari non-admin bila fitur aktif di grup ini.
  if (m.isGroup && m.text && /chat\.whatsapp\.com/i.test(m.text) && !isOwner) {
    const g = db.groups.get(m.chat);
    if (g?.antilink) {
      let admin = false;
      try { admin = participantAdmin(await sock.groupMetadata(m.chat), m.sender, m.senderAlt); } catch {}
      if (!admin) {
        try {
          await sock.sendMessage(m.chat, { delete: raw.key });
          await sendRichText(sock, m.chat, `🚫 @${extractNum(m.sender)}, tautan grup lain dilarang di sini.`, { title: cfg.botName });
        } catch {}
        return;
      }
    }
  }

  if (!m.text || !m.text.startsWith(cfg.prefix)) return;
  const body = m.text.slice(cfg.prefix.length).trim();
  if (!body) return;
  const [cmdRaw, ...args] = body.split(/\s+/);
  const command = cmdRaw.toLowerCase();
  const text = body.slice(cmdRaw.length).trim();

  const entry = findCommand(command);
  if (!entry) return;
  const pc = entry.config;

  if (cfg.mode === 'self' && !isOwner) return;
  if (pc.isOwner && !isOwner) { await m.reply('⛔ Perintah ini khusus owner.'); return; }
  if (pc.isGroup && !m.isGroup) { await m.reply('⛔ Perintah ini hanya bisa dipakai di grup.'); return; }
  if (pc.isPrivate && m.isGroup) { await m.reply('⛔ Perintah ini hanya bisa dipakai di chat pribadi.'); return; }

  const cdMs = (pc.cooldown || 0) * 1000;
  if (cdMs && !isOwner) {
    const key = `${pc.name}:${m.sender}`;
    const now = Date.now();
    if (now - (cooldowns.get(key) || 0) < cdMs) return;
    cooldowns.set(key, now);
  }

  let isAdmin = false, isBotAdmin = false;
  if (m.isGroup) {
    try {
      const meta = await sock.groupMetadata(m.chat);
      isAdmin = participantAdmin(meta, m.sender, m.senderAlt);
      const meNum = extractNum(sock.user?.id || '');
      const meLid = sock.user?.lid || '';
      const botPart = (meta.participants || []).find((p) => extractNum(p.id) === meNum || (meLid && p.id === meLid) || (sock.user?.id && p.id === sock.user.id));
      isBotAdmin = botPart ? (botPart.admin === 'admin' || botPart.admin === 'superadmin') : false;
    } catch {}
  }

  const ctx = {
    sock, args, text, command,
    prefix: cfg.prefix,
    isOwner, isAdmin, isBotAdmin,
    reply: m.reply,
    db, config: cfg, listPlugins
  };
  try {
    await entry.run(m, ctx);
  } catch (e) {
    log?.error(`Plugin ${pc.name} error: ${e.stack || e.message}`);
    try { await m.reply(`❌ Error: ${e.message}`); } catch {}
  }
}

// Sambutan grup (welcome/leave) bila diaktifkan lewat perintah .welcome.
export async function handleParticipants(sock, event, log) {
  const g = db.groups.get(event.id);
  if (!g?.welcome) return;
  let groupName = '';
  try { groupName = (await sock.groupMetadata(event.id))?.subject || ''; } catch {}
  for (const jid of event.participants || []) {
    try {
      if (event.action === 'add') {
        await sendRichText(sock, event.id, `👋 Selamat datang @${extractNum(jid)} di *${groupName || 'grup ini'}*!\n\nSemoga betah. Ketik .menu untuk melihat perintah bot.`, { title: effectiveConfig().botName });
      } else if (event.action === 'remove') {
        await sendRichText(sock, event.id, `👋 Selamat tinggal @${extractNum(jid)}. Semoga sukses di luar sana.`, { title: effectiveConfig().botName });
      }
    } catch (e) { log?.warn(`welcome gagal: ${e.message}`); }
  }
}

export default { handleMessage, handleParticipants, effectiveConfig };
