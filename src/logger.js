// AunuMD • logger konsol ringkas dengan penanda waktu.
const COLORS = {
  reset: '\x1b[0m', dim: '\x1b[2m', cyan: '\x1b[36m', green: '\x1b[32m',
  yellow: '\x1b[33m', red: '\x1b[31m', magenta: '\x1b[35m'
};

function stamp() {
  return new Date().toLocaleTimeString('id-ID', { hour12: false });
}

function write(color, tag, msg) {
  const text = msg instanceof Error ? (msg.stack || msg.message) : String(msg);
  console.log(`${COLORS.dim}${stamp()}${COLORS.reset} ${color}[${tag}]${COLORS.reset} ${text}`);
}

export const log = {
  info: (m) => write(COLORS.cyan, 'INFO', m),
  success: (m) => write(COLORS.green, 'OK', m),
  warn: (m) => write(COLORS.yellow, 'WARN', m),
  error: (m) => write(COLORS.red, 'ERROR', m),
  aunu: (m) => write(COLORS.magenta, 'AUNU', m)
};

export default log;
