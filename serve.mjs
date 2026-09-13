import http from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { stat, readFile } from 'node:fs/promises';

const root = fileURLToPath(new URL('./dist/', import.meta.url));
const portFlag = process.argv.indexOf('--port');
const port = portFlag === -1 ? 4177 : Number(process.argv[portFlag + 1]);
if (!Number.isInteger(port) || port < 1024 || port > 65535) throw new Error('Use an integer --port from 1024 to 65535.');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.md': 'text/plain; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.json': 'application/json; charset=utf-8' };
const server = http.createServer(async (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  if (!['GET', 'HEAD'].includes(req.method)) { res.writeHead(405); return res.end('Read-only static preview.'); }
  try {
    const url = new URL(req.url, 'http://127.0.0.1');
    if (url.pathname === '/favicon.ico') { res.writeHead(204); return res.end(); }
    const pathname = decodeURIComponent(url.pathname);
    if (pathname.includes('\0') || pathname.includes('\\')) { res.writeHead(400); return res.end('Invalid path.'); }
    const filename = path.resolve(root, '.' + (pathname.endsWith('/') ? pathname + 'index.html' : pathname));
    const relative = path.relative(root, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative)) { res.writeHead(403); return res.end('Outside static directory.'); }
    if (!(await stat(filename)).isFile()) { res.writeHead(404); return res.end('Not found.'); }
    const body = await readFile(filename);
    res.writeHead(200, { 'Content-Type': types[path.extname(filename)] || 'application/octet-stream', 'Content-Length': body.length });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch { res.writeHead(404); res.end('Not found.'); }
});
server.listen(port, '127.0.0.1', () => process.stdout.write(`Local: http://127.0.0.1:${port}\n`));
for (const event of ['SIGINT', 'SIGTERM']) process.on(event, () => server.close(() => process.exit(0)));
