// AunuMD — WhatsApp Multi-Device bot di atas @aunucore/baileys (AunuBaileys).
// Oleh AunuCore Creative Network.
import { loadPlugins, entries, categories } from './src/loader.js';
import { startConnection } from './src/connection.js';
import log from './src/logger.js';

process.on('uncaughtException', (e) => log.error(`uncaughtException: ${e.message}`));
process.on('unhandledRejection', (e) => log.error(`unhandledRejection: ${e?.message || e}`));

console.log('');
console.log('   ╔══════════════════════════════════════════╗');
console.log('   ║   AunuMD — WhatsApp Multi-Device Bot     ║');
console.log('   ║   Powered by @aunucore/baileys           ║');
console.log('   ║   AunuCore Creative Network              ║');
console.log('   ╚══════════════════════════════════════════╝');
console.log('');

await loadPlugins(log);
log.info(`${entries.length} plugin dimuat dari ${categories.size} kategori.`);
await startConnection(log);
