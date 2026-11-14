// AunuMD • handler pesan: serialisasi -> gerbang (mode/owner/grup/cooldown) -> jalankan plugin.
import config from '../config.js';
import { db, getSetting } from './database.js';
import { findCommand, listPlugins } from './loader.js';
import { smsg } from './smsg.js';
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

  // Antilink: hapus tautan grup lain dari non-admin bila fitur aktif di grup ini.
  if (m.isGroup && m.text && /chat\.whatsapp\.com/i.test(m.text) && !isOwner) {
    const g = db.groups.get(m.chat);
    if (g?.antilink) {
      let admin = false;
      try { admin = participantAdmin(await sock.groupMetadata(m.chat), m.sender, m.senderAlt); } catch {}
      if (!admin) {
        try {
          await sock.sendMessage(m.chat, { delete: raw.key });
          await sock.sendMessage(m.chat, {
            text: `🚫 @${extractNum(m.sender)}, tautan grup lain dilarang di sini.`,
            mentions: [m.sender]
          });
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
        await sock.sendMessage(event.id, {
          text: `👋 Selamat datang @${extractNum(jid)} di *${groupName || 'grup ini'}*!\n\nSemoga betah. Ketik .menu untuk melihat perintah bot.`,
          mentions: [jid]
        });
      } else if (event.action === 'remove') {
        await sock.sendMessage(event.id, {
          text: `👋 Selamat tinggal @${extractNum(jid)}. Semoga sukses di luar sana.`,
          mentions: [jid]
        });
      }
    } catch (e) { log?.warn(`welcome gagal: ${e.message}`); }
  }
}

export default { handleMessage, handleParticipants, effectiveConfig };
