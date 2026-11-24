/**
 * Fidelity check: server-renders the React app and compares the resulting DOM
 * against the original static export, node by node.
 *
 * Run with: npm run verify
 */
import fs from 'node:fs';
import path from 'node:path';
import { build } from 'esbuild';
import { parse } from 'node-html-parser';

// kept inside the project so the bundle resolves this project's React copy
const outfile = path.resolve('node_modules/.cache/thejordans-ssr.mjs');
fs.mkdirSync(path.dirname(outfile), { recursive: true });

await build({
  entryPoints: ['src/App.jsx'],
  bundle: true,
  format: 'esm',
  platform: 'node',
  jsx: 'automatic',
  outfile,
  external: ['react', 'react-dom'],
  logLevel: 'error',
});

const { renderToStaticMarkup } = await import('react-dom/server');
const { default: App } = await import('file://' + outfile.replace(/\\/g, '/'));
const { createElement } = await import('react');

// useEffect never runs during static rendering, so the legacy loader is inert.
const rendered = renderToStaticMarkup(createElement(App));
fs.rmSync(outfile, { force: true });

const original = fs
  .readFileSync(path.resolve('../demo6.atlascargotransit.com/index.html'), 'utf8')
  .replace('</<cs>', '</cs>');
const bodyStart = original.indexOf('<body');
const originalBody = original.slice(original.indexOf('>', bodyStart) + 1, original.lastIndexOf('</body>'));

const SKIP_TAGS = new Set(['script', 'style', 'link', 'noscript']);
// the widget markup React owns; ids differ only by state-driven classes
const IGNORED_CLASS_HOSTS = new Set(['alx-overlay', 'alx-contact-container', 'alx-dropdown']);

// attributes that carry meaning for layout/behaviour and must survive the port
const CHECKED_ATTRS = ['src', 'href', 'style', 'alt', 'type', 'name', 'placeholder', 'role', 'target', 'width', 'height'];

// the port serves the same files from the web root, so paths differ by a slash
const normalisePath = (v) =>
  v
    .replace(/https:\/\/demo6\.atlascargotransit\.com\/(assets|uploads|wp-content|wp-includes)\//g, '$1/')
    .replace(/\/(assets|uploads|wp-content|wp-includes)\//g, '$1/');

// tracking links deliberately point at this site's /track page (see convert.mjs)
const normaliseValue = (v) =>
  normalisePath(v)
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/^(?:https:\/\/demo6\.atlascargotransit\.com\/)?track\/?$/, '/track');

// React re-serialises inline styles (no space after ':', empty declarations
// dropped), so compare declarations rather than the raw string
const normaliseStyle = (v) =>
  normalisePath(v)
    .split(';')
    .map((d) => d.trim())
    .filter((d) => d.includes(':') && d.split(/:(.*)/s)[1].trim())
    .map((d) => {
      const [prop, val] = d.split(/:(.*)/s);
      return prop.trim() + ':' + val.replace(/\s+/g, ' ').trim();
    })
    .sort()
    .join(';');

function attrSignature(node) {
  const parts = [];
  for (const attr of CHECKED_ATTRS) {
    const raw = node.getAttribute(attr);
    if (raw === undefined || raw === null) continue;
    parts.push(attr + '=' + (attr === 'style' ? normaliseStyle(raw) : normaliseValue(raw)));
  }
  for (const [name, value] of Object.entries(node.attributes)) {
    // the Industries carousel autoplay is a deliberate change (see convert.mjs)
    if (name.startsWith('data-')) parts.push(name + '=' + normaliseValue(value).replace('"autoplay":true', '"autoplay":false'));
  }
  return parts.length ? '[' + parts.sort().join('|') + ']' : '';
}

function skeleton(html) {
  const root = parse(html, { blockTextElements: { script: true, style: true } });
  const out = [];
  const walk = (node) => {
    for (const child of node.childNodes) {
      if (child.nodeType === 3) {
        const t = child.text.replace(/\s+/g, ' ').trim();
        if (t) out.push('#' + t);
        continue;
      }
      if (child.nodeType !== 1) continue;
      const tag = child.rawTagName.toLowerCase();
      if (SKIP_TAGS.has(tag)) continue;
      const id = child.getAttribute('id') || '';
      const cls = IGNORED_CLASS_HOSTS.has(id)
        ? ''
        : (child.getAttribute('class') || '').split(/\s+/).filter(Boolean).sort().join('.');
      out.push(tag + (id ? '#' + id : '') + (cls ? '.' + cls : '') + attrSignature(child));
      walk(child);
    }
  };
  walk(root);
  return out;
}

const a = skeleton(originalBody);
const b = skeleton(rendered);

let mismatches = 0;
const max = Math.max(a.length, b.length);
for (let i = 0, shown = 0; i < max; i++) {
  if (a[i] !== b[i]) {
    mismatches++;
    if (shown < 25) {
      console.log('#' + i + '\n  original: ' + (a[i] ?? '<end>') + '\n  react:    ' + (b[i] ?? '<end>'));
      shown++;
    }
  }
}

console.log('\noriginal nodes: ' + a.length);
console.log('react nodes:    ' + b.length);
console.log(mismatches ? 'differences:    ' + mismatches : 'DOM matches the original export exactly.');
process.exit(mismatches ? 1 : 0);
