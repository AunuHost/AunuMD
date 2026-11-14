// AunuMD • Email sementara via mail.tm (buat alamat + baca inbox, tersimpan per pengguna)
export const config = {
  name: 'tempmail',
  alias: ['tmpmail'],
  category: 'tools',
  description: 'Buat alamat email sementara (mail.tm) dan baca inbox-nya',
  usage: '.tempmail [create] | .tempmail inbox | .tempmail read <nomor>',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 5
};

const API = 'https://api.mail.tm';
const CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789';
const randomStr = (n, set = CHARS) => Array.from({ length: n }, () => set[Math.floor(Math.random() * set.length)]).join('');

async function api(pathname, { token, method = 'GET', body } = {}) {
  const res = await fetch(API + pathname, {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(20000)
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.detail || data.message || `mail.tm HTTP ${res.status}`);
  return data;
}

function getRecord(ctx, m) {
  return ctx.db.users.get(m.sender) || {};
}

export default async function (m, ctx) {
  const sub = (ctx.args[0] || 'create').toLowerCase();
  try {
    if (sub === 'create') {
      const domains = await api('/domains');
      const member = (domains['hydra:member'] || []).find((d) => d.isActive !== false) || domains['hydra:member']?.[0];
      if (!member?.domain) throw new Error('Tidak ada domain mail.tm yang tersedia.');
      const address = `${randomStr(10)}@${member.domain}`;
      const password = randomStr(12, CHARS + 'ABCDEFGHIJKLMNOPQRSTUVWXYZ');
      await api('/accounts', { method: 'POST', body: { address, password } });
      const tok = await api('/token', { method: 'POST', body: { address, password } });
      if (!tok.token) throw new Error('Gagal memperoleh token mail.tm.');
      const rec = getRecord(ctx, m);
      rec.tempmail = { address, token: tok.token, lastIds: [] };
      ctx.db.users.set(m.sender, rec);
      return ctx.reply(`📧 *Email sementara dibuat!*\n\nAlamat: ${address}\n\nGunakan alamat ini untuk menerima kode/verifikasi.\nCek inbox: ${ctx.prefix}tempmail inbox\nBaca pesan: ${ctx.prefix}tempmail read <nomor>`);
    }
    if (sub === 'inbox') {
      const rec = getRecord(ctx, m);
      const tm = rec.tempmail;
      if (!tm?.token) return ctx.reply(`Kamu belum punya email sementara. Buat dulu: ${ctx.prefix}tempmail`);
      const inbox = await api('/messages', { token: tm.token });
      const msgs = inbox['hydra:member'] || [];
      tm.lastIds = msgs.map((x) => x.id);
      rec.tempmail = tm;
      ctx.db.users.set(m.sender, rec);
      if (!msgs.length) return ctx.reply(`📭 Inbox ${tm.address} masih kosong.`);
      const lines = msgs.slice(0, 10).map((msg, i) => {
        const from = msg.from?.address || 'tidak dikenal';
        const subject = msg.subject || '(tanpa subjek)';
        const intro = (msg.intro || '').replace(/\s+/g, ' ').slice(0, 80);
        return `${i + 1}. Dari: ${from}\n   Subjek: ${subject}${intro ? `\n   ${intro}` : ''}`;
      });
      return ctx.reply(`📥 *Inbox ${tm.address}* (${msgs.length} pesan)\n\n${lines.join('\n\n')}\n\nBaca isi: ${ctx.prefix}tempmail read <nomor>`);
    }
    if (sub === 'read') {
      const rec = getRecord(ctx, m);
      const tm = rec.tempmail;
      if (!tm?.token) return ctx.reply(`Kamu belum punya email sementara. Buat dulu: ${ctx.prefix}tempmail`);
      const n = parseInt(ctx.args[1], 10);
      const id = Number.isInteger(n) ? tm.lastIds?.[n - 1] : undefined;
      if (!id) return ctx.reply(`Nomor pesan tidak valid. Buka daftar dulu: ${ctx.prefix}tempmail inbox`);
      const msg = await api(`/messages/${id}`, { token: tm.token });
      const bodyText = (msg.text || (Array.isArray(msg.html) ? msg.html.join('\n').replace(/<[^>]+>/g, ' ') : '') || '').trim();
      return ctx.reply(`✉️ *${msg.subject || '(tanpa subjek)'}*\nDari: ${msg.from?.address || '-'}\n\n${(bodyText || '(isi kosong)').slice(0, 3500)}`);
    }
    return ctx.reply('Pemakaian: ' + config.usage);
  } catch (e) {
    return ctx.reply('Error tempmail: ' + e.message);
  }
}
