/* eslint-disable @typescript-eslint/no-require-imports -- Postman handlers use CommonJS. */
// Contract subset used by Payload: PutObject, HeadObject, GetObject and DeleteObject.
// Test-only server: checks SigV4 header presence, not cryptographic signatures.
const http = require('node:http');
const { createHash } = require('node:crypto');

function createS3Server() {
  const objects = new Map();
  const calls = [];
  let failWrites = false;
  const xmlError = (res, status, code) => {
    res.writeHead(status, { 'Content-Type': 'application/xml' });
    res.end(`<Error><Code>${code}</Code><Message>Local S3 test response</Message></Error>`);
  };
  return http.createServer(async (req, res) => {
    try {
      const route = new URL(req.url, 'http://localhost').pathname;
      if (route === '/__control/fail-writes') { failWrites = req.method === 'POST'; res.end('ok'); return; }
      if (route === '/__control/state') {
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify({ keys: [...objects.keys()], calls })); return;
      }
      calls.push({ method: req.method, path: route });
      if (!String(req.headers.authorization || '').startsWith('AWS4-HMAC-SHA256 ')) { xmlError(res, 403, 'AccessDenied'); return; }
      if (!route.startsWith('/pazelgreen-test/')) { xmlError(res, 501, 'NotImplemented'); return; }
      if (req.method === 'PUT') {
        if (failWrites) { xmlError(res, 503, 'ServiceUnavailable'); return; }
        if (req.headers['if-none-match'] === '*' && objects.has(route)) { xmlError(res, 412, 'PreconditionFailed'); return; }
        let body;
        if (req.body !== undefined) body = Buffer.isBuffer(req.body) ? req.body : Buffer.from(typeof req.body === 'string' ? req.body : JSON.stringify(req.body));
        else { const chunks = []; for await (const chunk of req) chunks.push(chunk); body = Buffer.concat(chunks); }
        const etag = `"${createHash('md5').update(body).digest('hex')}"`;
        objects.set(route, { body, etag, type: req.headers['content-type'] || 'application/octet-stream' });
        res.setHeader('ETag', etag); res.end(); return;
      }
      if (req.method === 'DELETE') { objects.delete(route); res.writeHead(204); res.end(); return; }
      if (!['GET', 'HEAD'].includes(req.method)) { xmlError(res, 501, 'NotImplemented'); return; }
      const object = objects.get(route);
      if (!object) { xmlError(res, 404, 'NoSuchKey'); return; }
      let body = object.body;
      res.setHeader('Content-Type', object.type); res.setHeader('ETag', object.etag);
      if (req.headers.range) {
        const match = /^bytes=(\d+)-(\d*)$/.exec(req.headers.range);
        if (!match) { res.writeHead(416); res.end(); return; }
        const start = Number(match[1]), end = match[2] ? Number(match[2]) : body.length - 1;
        res.statusCode = 206; res.setHeader('Content-Range', `bytes ${start}-${end}/${body.length}`);
        body = body.subarray(start, end + 1);
      }
      res.setHeader('Content-Length', body.length);
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { if (!res.headersSent) xmlError(res, 500, 'InternalError'); else res.end(); }
  });
}
module.exports = { createS3Server };
if (require.main === module || process.env.PORT) createS3Server().listen(Number(process.env.PORT || 4103), '127.0.0.1');
