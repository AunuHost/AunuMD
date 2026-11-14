// AunuMD • Konversi kode CommonJS -> ESM (transformasi regex lokal)
export const config = {
  name: 'cjstoesm',
  alias: [],
  category: 'tools',
  description: 'Ubah kode CommonJS menjadi ESM (require → import, module.exports → export)',
  usage: '.cjstoesm <kode CJS> (atau reply pesan berisi kode)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

export function convertCjsToEsm(code) {
  let out = String(code);
  // const { a, b } = require('m') -> import { a, b } from 'm'
  out = out.replace(/(?:const|let|var)\s*\{([^}]+)\}\s*=\s*require\(\s*(['"])([^'"]+)\2\s*\)\s*;?/g,
    (mm, names, q, mod) => `import {${names}} from '${mod}';`);
  // const X = require('m') -> import X from 'm'
  out = out.replace(/(?:const|let|var)\s*([\w$]+)\s*=\s*require\(\s*(['"])([^'"]+)\2\s*\)\s*;?/g,
    (mm, name, q, mod) => `import ${name} from '${mod}';`);
  // module.exports = X -> export default X
  out = out.replace(/module\.exports\s*=\s*/g, 'export default ');
  // exports.foo = ... -> export const foo = ...
  out = out.replace(/(?<![\w$.])exports\.([\w$]+)\s*=\s*/g, 'export const $1 = ');
  // require('m') polos sebagai satu pernyataan penuh -> import 'm'
  // (rantai seperti require('dotenv').config() sengaja dibiarkan apa adanya)
  out = out.replace(/^([ \t]*)require\(\s*(['"])([^'"]+)\2\s*\)\s*;?[ \t]*$/gm,
    (mm, indent, q, mod) => `${indent}import '${mod}';`);
  return out;
}

export default async function (m, ctx) {
  const code = (ctx.text || m.quoted?.text || '').trim();
  if (!code) return ctx.reply('Pemakaian: ' + config.usage);
  const result = convertCjsToEsm(code);
  return ctx.reply('📦 *Hasil konversi CJS → ESM:*\n\n```js\n' + result.slice(0, 3900) + '\n```');
}
