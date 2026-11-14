// AunuMD • Konversi kode ESM -> CommonJS (transformasi regex lokal)
export const config = {
  name: 'esmtocjs',
  alias: [],
  category: 'tools',
  description: 'Ubah kode ESM menjadi CommonJS (import → require, export → module.exports)',
  usage: '.esmtocjs <kode ESM> (atau reply pesan berisi kode)',
  isOwner: false, isGroup: false, isPrivate: false,
  cooldown: 3
};

function fixNamedImports(names) {
  // 'a as b' (ESM) -> 'a: b' (destructuring CJS)
  return names.replace(/([\w$]+)\s+as\s+([\w$]+)/g, '$1: $2');
}

export function convertEsmToCjs(code) {
  let out = String(code);
  // import X, { a } from 'm' -> const X = require('m'); const { a } = require('m')
  out = out.replace(/import\s+([\w$]+)\s*,\s*\{([^}]+)\}\s*from\s*(['"])([^'"]+)\3\s*;?/g,
    (mm, def, names, q, mod) => `const ${def} = require('${mod}');\nconst {${fixNamedImports(names)}} = require('${mod}');`);
  // import { a, b } from 'm' -> const { a, b } = require('m')
  out = out.replace(/import\s*\{([^}]+)\}\s*from\s*(['"])([^'"]+)\2\s*;?/g,
    (mm, names, q, mod) => `const {${fixNamedImports(names)}} = require('${mod}');`);
  // import * as X from 'm' -> const X = require('m')
  out = out.replace(/import\s*\*\s*as\s+([\w$]+)\s*from\s*(['"])([^'"]+)\2\s*;?/g,
    (mm, name, q, mod) => `const ${name} = require('${mod}');`);
  // import X from 'm' -> const X = require('m')
  out = out.replace(/import\s+([\w$]+)\s+from\s*(['"])([^'"]+)\2\s*;?/g,
    (mm, name, q, mod) => `const ${name} = require('${mod}');`);
  // import 'm' -> require('m')
  out = out.replace(/^([ \t]*)import\s*(['"])([^'"]+)\2\s*;?/gm,
    (mm, indent, q, mod) => `${indent}require('${mod}');`);
  // export { a, b } -> module.exports = { a, b }
  out = out.replace(/export\s*\{([^}]+)\}\s*;?/g,
    (mm, names) => `module.exports = {${names}};`);
  // export default X -> module.exports = X
  out = out.replace(/export\s+default\s+/g, 'module.exports = ');
  // export const/let/var foo = -> exports.foo =
  out = out.replace(/export\s+(?:const|let|var)\s+([\w$]+)\s*=/g, 'exports.$1 =');
  // export function foo( -> exports.foo = function foo(
  out = out.replace(/export\s+function\s+([\w$]+)\s*\(/g, 'exports.$1 = function $1(');
  // export class Foo -> exports.Foo = class Foo
  out = out.replace(/export\s+class\s+([\w$]+)/g, 'exports.$1 = class $1');
  return out;
}

export default async function (m, ctx) {
  const code = (ctx.text || m.quoted?.text || '').trim();
  if (!code) return ctx.reply('Pemakaian: ' + config.usage);
  const result = convertEsmToCjs(code);
  return ctx.reply('📦 *Hasil konversi ESM → CJS:*\n\n```js\n' + result.slice(0, 3900) + '\n```');
}
