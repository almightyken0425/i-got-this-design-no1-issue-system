const fs = require('node:fs');
const path = require('node:path');
const root = __dirname;
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const page = `<!doctype html><html lang="zh-Hant"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline'; style-src 'unsafe-inline'; img-src data:; connect-src 'none';"><style>${read('runtime.css')}\n${read('directions.css')}</style></head><body data-direction="a"><div id="root"></div><script>${read('snapshot.js')}</script><script>${read('runtime.js')}</script></body></html>`;
const payload = {
  app: Buffer.from(page).toString('base64'),
  references: JSON.parse(read('references.json')).map(reference => ({
    ...reference,
    data: `data:image/${reference.file.endsWith('.png') ? 'png' : 'webp'};base64,${fs.readFileSync(path.join(root, 'assets', reference.file)).toString('base64')}`,
  })),
};
fs.writeFileSync(path.join(root, 'index.html'), read('compare.template.html').replace('__PAYLOAD__', JSON.stringify(payload)));
console.log('F4 comparison rebuilt from local sources.');
