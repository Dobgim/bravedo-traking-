/**
 * Converts the original static export of the TheJordans site
 * (../demo6.atlascargotransit.com/index.html) into React components.
 *
 * Markup, class names, asset paths and stylesheet order are preserved
 * one-to-one so the rendered result matches the original exactly.
 *
 * Run with: npm run convert
 */
import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'node-html-parser';

const SRC = path.resolve('../demo6.atlascargotransit.com/index.html');
const PUBLIC = path.resolve('public');
const SRC_DIR = path.resolve('src');
const COMP = path.join(SRC_DIR, 'components');
const SECTIONS = path.join(COMP, 'sections');

// Only the fully generated directories are wiped; src/components also holds
// hand-written components (ContactWidget), so it is written into, not cleared.
for (const d of [path.join(PUBLIC, 'css'), path.join(PUBLIC, 'js'), SECTIONS]) {
  fs.rmSync(d, { recursive: true, force: true });
}
for (const d of [path.join(PUBLIC, 'css'), path.join(PUBLIC, 'js'), COMP, SECTIONS]) {
  fs.mkdirSync(d, { recursive: true });
}

/* ------------------------------------------------------------------ */
/* Asset URL rewriting: the export uses document-relative paths, the   */
/* React app serves the same files from the web root.                  */
/* ------------------------------------------------------------------ */
const LOCAL_ROOTS = ['assets/', 'uploads/', 'wp-content/', 'wp-includes/'];
// a handful of assets were hard-coded to the demo host; they are served locally too
const ORIGIN = 'https://demo6.atlascargotransit.com/';

function absUrl(url) {
  if (!url) return url;
  let u = url.trim();
  if (u.startsWith(ORIGIN) && LOCAL_ROOTS.some((r) => u.slice(ORIGIN.length).startsWith(r))) {
    u = u.slice(ORIGIN.length);
  }
  if (LOCAL_ROOTS.some((r) => u.startsWith(r))) return '/' + u;
  if (u.startsWith('./') && LOCAL_ROOTS.some((r) => u.slice(2).startsWith(r))) return '/' + u.slice(2);
  return url;
}

function rewriteUrlList(value) {
  // srcset / imagesrcset: "a.png 300w, b.png 600w"
  return value
    .split(',')
    .map((part) => {
      const m = part.match(/^(\s*)(\S+)(.*)$/);
      return m ? m[1] + absUrl(m[2]) + m[3] : part;
    })
    .join(',');
}

function rewriteCss(css) {
  return css.replace(/url\((\s*['"]?)([^'")]+)(['"]?\s*)\)/g, (all, q1, url, q2) => 'url(' + q1 + absUrl(url) + q2 + ')');
}

/* ------------------------------------------------------------------ */
/* HTML -> JSX                                                         */
/* ------------------------------------------------------------------ */
const VOID_TAGS = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);

const INLINE_TAGS = new Set(['a', 'abbr', 'b', 'br', 'button', 'cite', 'code', 'cs', 'em', 'i', 'img', 'input', 'label', 'mark', 'q', 's', 'small', 'span', 'strong', 'sub', 'sup', 'svg', 'time', 'u']);

// html attribute -> JSX attribute (only where the two differ)
const ATTR_MAP = {
  class: 'className',
  for: 'htmlFor',
  srcset: 'srcSet',
  imagesrcset: 'imageSrcSet',
  imagesizes: 'imageSizes',
  colspan: 'colSpan',
  rowspan: 'rowSpan',
  tabindex: 'tabIndex',
  maxlength: 'maxLength',
  minlength: 'minLength',
  readonly: 'readOnly',
  contenteditable: 'contentEditable',
  spellcheck: 'spellCheck',
  crossorigin: 'crossOrigin',
  novalidate: 'noValidate',
  autoplay: 'autoPlay',
  autofocus: 'autoFocus',
  autocomplete: 'autoComplete',
  playsinline: 'playsInline',
  frameborder: 'frameBorder',
  allowfullscreen: 'allowFullScreen',
  'accept-charset': 'acceptCharset',
  'http-equiv': 'httpEquiv',
  datetime: 'dateTime',
  usemap: 'useMap',
  cellpadding: 'cellPadding',
  cellspacing: 'cellSpacing',
  enctype: 'encType',
  formaction: 'formAction',
  marginwidth: 'marginWidth',
  marginheight: 'marginHeight',
  // svg
  viewbox: 'viewBox',
  preserveaspectratio: 'preserveAspectRatio',
  gradientunits: 'gradientUnits',
  gradienttransform: 'gradientTransform',
  patternunits: 'patternUnits',
  patterncontentunits: 'patternContentUnits',
  clippathunits: 'clipPathUnits',
  maskunits: 'maskUnits',
  maskcontentunits: 'maskContentUnits',
  spreadmethod: 'spreadMethod',
  textanchor: 'textAnchor',
  'xmlns:xlink': 'xmlnsXlink',
  'xlink:href': 'xlinkHref',
  'xml:space': 'xmlSpace',
  'xml:lang': 'xmlLang',
  requiredfeatures: 'requiredFeatures',
  requiredextensions: 'requiredExtensions',
  systemlanguage: 'systemLanguage',
  attributename: 'attributeName',
  attributetype: 'attributeType',
  repeatcount: 'repeatCount',
  repeatdur: 'repeatDur',
  calcmode: 'calcMode',
  keytimes: 'keyTimes',
  keysplines: 'keySplines',
  keypoints: 'keyPoints',
  pathlength: 'pathLength',
  startoffset: 'startOffset',
  lengthadjust: 'lengthAdjust',
  textlength: 'textLength',
  markerwidth: 'markerWidth',
  markerheight: 'markerHeight',
  markerunits: 'markerUnits',
  refx: 'refX',
  refy: 'refY',
};

// dashed SVG presentation attributes React expects in camelCase
const SVG_DASHED = new Set([
  'stroke-width', 'stroke-linecap', 'stroke-linejoin', 'stroke-dasharray', 'stroke-dashoffset',
  'stroke-opacity', 'stroke-miterlimit', 'fill-opacity', 'fill-rule', 'clip-rule', 'clip-path',
  'color-interpolation', 'color-interpolation-filters', 'flood-color', 'flood-opacity',
  'stop-color', 'stop-opacity', 'font-family', 'font-size', 'font-weight', 'font-style',
  'letter-spacing', 'word-spacing', 'text-anchor', 'text-decoration', 'dominant-baseline',
  'alignment-baseline', 'baseline-shift', 'shape-rendering', 'image-rendering', 'paint-order',
  'pointer-events', 'vector-effect', 'writing-mode', 'marker-start', 'marker-mid', 'marker-end',
  'transform-origin', 'enable-background', 'stroke-width',
]);

const BOOLEAN_ATTRS = new Set(['checked', 'disabled', 'selected', 'required', 'readonly', 'multiple', 'autoplay', 'controls', 'loop', 'muted', 'open', 'reversed', 'default', 'novalidate', 'allowfullscreen', 'autofocus', 'itemscope', 'playsinline', 'defer', 'async', 'hidden']);

const URL_ATTRS = new Set(['src', 'href', 'poster', 'data-src', 'data-bg', 'data-background', 'data-image', 'data-large_image', 'data-thumb', 'data-pxl-bg', 'data-jarallax-image']);

function camel(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function toJsxAttrName(name) {
  const lower = name.toLowerCase();
  if (lower.startsWith('data-') || lower.startsWith('aria-')) return name;
  if (ATTR_MAP[lower]) return ATTR_MAP[lower];
  if (SVG_DASHED.has(lower)) return camel(lower);
  if (lower.includes('-') || lower.includes(':')) return name; // leave exotic attrs alone
  return lower;
}

function styleToObject(styleText) {
  const out = [];
  for (const decl of styleText.split(';')) {
    const idx = decl.indexOf(':');
    if (idx < 0) continue;
    const prop = decl.slice(0, idx).trim();
    const value = decl.slice(idx + 1).trim();
    if (!prop || !value) continue;
    const key = prop.startsWith('--') || !/^[a-z-]+$/i.test(prop) ? JSON.stringify(prop) : camel(prop);
    out.push(key + ': ' + JSON.stringify(rewriteCss(value)));
  }
  return out.length ? '{{ ' + out.join(', ') + ' }}' : '{{}}';
}

const SIMPLE_ATTR_VALUE = /^[^"'{}\\\n<>]*$/;
const TRACK_LINK = /^(?:https:\/\/demo6\.atlascargotransit\.com\/)?track\/?$/;

function attrToJsx(rawName, rawValue, tagName) {
  const lower = rawName.toLowerCase();
  if (lower.startsWith('on')) return null; // inline handlers are re-implemented in React
  if (lower === 'style') return 'style=' + styleToObject(rawValue);

  // the theme's own scripts drive these fields, so they stay uncontrolled
  if (tagName === 'input' || tagName === 'textarea' || tagName === 'select') {
    if (lower === 'value') return 'defaultValue=' + JSON.stringify(rawValue);
    if (lower === 'checked') return 'defaultChecked={true}';
  }

  const name = toJsxAttrName(rawName);
  let value = rawValue;

  // every tracking link / form leads to this site's own /track page (the
  // export pointed at "track", which does not exist, or at the demo host)
  if ((lower === 'href' || lower === 'action') && TRACK_LINK.test(value.trim())) value = '/track';
  else if (URL_ATTRS.has(lower)) value = absUrl(value);
  else if (lower === 'srcset' || lower === 'imagesrcset' || lower === 'data-srcset') value = rewriteUrlList(value);

  if (BOOLEAN_ATTRS.has(lower)) {
    if (value === '' || value.toLowerCase() === lower || value.toLowerCase() === 'true') return name + '={true}';
    if (value.toLowerCase() === 'false') return name + '={false}';
  }
  if (value === '') return name + '=""';
  if (SIMPLE_ATTR_VALUE.test(value)) return name + '="' + value + '"';
  return name + '={' + JSON.stringify(value) + '}';
}

function escapeJsxText(text) {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\{/g, '&#123;')
    .replace(/\}/g, '&#125;');
}

const isElement = (n) => n.nodeType === 1;
const isText = (n) => n.nodeType === 3;

function nodeToJsx(node, indent) {
  const pad = '  '.repeat(indent);

  if (isText(node)) {
    const collapsed = node.text.replace(/\s+/g, ' ');
    if (!collapsed.trim()) return null; // handled by the whitespace pass in childrenToJsx
    // keep the leading/trailing space when the node sits next to inline content
    if (collapsed !== collapsed.trim()) return pad + '{' + JSON.stringify(collapsed) + '}';
    return pad + escapeJsxText(collapsed);
  }

  if (!isElement(node)) return null;

  const tag = node.rawTagName;
  const lower = tag.toLowerCase();
  if (lower === 'script' || lower === 'style' || lower === 'link' || lower === 'noscript') return null;

  const attrs = [];
  for (const [name, value] of Object.entries(node.attributes)) {
    const a = attrToJsx(name, value, lower);
    if (a) attrs.push(a);
  }

  const attrText = attrs.length ? ' ' + attrs.join(' ') : '';
  const attrMultiline = attrText.length > 110;
  const open = attrMultiline
    ? pad + '<' + tag + '\n' + attrs.map((a) => pad + '  ' + a).join('\n') + '\n' + pad
    : pad + '<' + tag + attrText;

  if (VOID_TAGS.has(lower)) return open + ' />';

  const children = childrenToJsx(node, indent + 1);
  if (!children) return open + '></' + tag + '>';

  // a single short text child stays on one line
  const meaningful = node.childNodes.filter((c) => isElement(c) || (isText(c) && c.text.trim()));
  const onlyText = meaningful.length > 0 && meaningful.every(isText);
  if (onlyText && !attrMultiline && !children.includes('\n') && children.trim().length < 90) {
    return open + '>' + children.trim() + '</' + tag + '>';
  }
  return open + '>\n' + children + '\n' + pad + '</' + tag + '>';
}

function childrenToJsx(node, indent) {
  const kids = node.childNodes;
  const parts = [];
  const inline = (n) => n && (isText(n) || INLINE_TAGS.has(n.rawTagName.toLowerCase()));
  for (let i = 0; i < kids.length; i++) {
    const kid = kids[i];
    if (isText(kid) && !kid.text.trim()) {
      // whitespace between two inline elements is meaningful - keep one space
      const prev = kids.slice(0, i).reverse().find((n) => isElement(n) || (isText(n) && n.text.trim()));
      const next = kids.slice(i + 1).find((n) => isElement(n) || (isText(n) && n.text.trim()));
      if (prev && next && inline(prev) && inline(next) && /\s/.test(kid.text)) {
        parts.push('  '.repeat(indent) + '{" "}');
      }
      continue;
    }
    const jsx = nodeToJsx(kid, indent);
    if (jsx) parts.push(jsx);
  }
  return parts.join('\n');
}

const toJsx = (node, indent = 0) => nodeToJsx(node, indent);

/* ------------------------------------------------------------------ */
/* Read + normalise the source document                                */
/* ------------------------------------------------------------------ */
let html = fs.readFileSync(SRC, 'utf8');
html = html.replace('</<cs>', '</cs>'); // malformed tag in the export

const headHtml = html.slice(html.indexOf('<head'), html.indexOf('</head>'));
const bodyStart = html.indexOf('<body');
const bodyHtml = html.slice(html.indexOf('>', bodyStart) + 1, html.lastIndexOf('</body>'));

const bodyClass = html.slice(bodyStart, html.indexOf('>', bodyStart)).match(/class="([^"]*)"/)[1];
const title = (html.match(/<title>([^<]*)<\/title>/) || [, 'TheJordans'])[1]
  .replace(/&#8211;/g, '–')
  .replace(/&amp;/g, '&');

const headRoot = parse(headHtml, { blockTextElements: { script: true, style: true } });
const head = headRoot.querySelector('head') || headRoot;
const root = parse(bodyHtml, { blockTextElements: { script: true, style: true } });

/* ------------------------------------------------------------------ */
/* 1. Stylesheets - preserve the original cascade order exactly        */
/* ------------------------------------------------------------------ */
const headLinks = [];
let cssIndex = 0;

function emitInlineCss(styleNode, where) {
  const css = rewriteCss(styleNode.innerHTML);
  if (!css.trim()) return;
  const id = (styleNode.getAttribute('id') || 'inline').replace(/[^a-z0-9_-]/gi, '-');
  const file = 'css/' + String(cssIndex++).padStart(2, '0') + '-' + where + '-' + id + '.css';
  fs.writeFileSync(path.join(PUBLIC, file), css);
  headLinks.push('    <link rel="stylesheet" href="/' + file + '" />');
}

const decodeEntities = (s) => (s || '').replace(/&#0?38;/g, '&').replace(/&amp;/g, '&');

for (const node of head.childNodes.filter(isElement)) {
  const tag = node.rawTagName.toLowerCase();
  const rel = node.getAttribute('rel') || '';
  if (tag === 'link' && rel.includes('stylesheet')) {
    let href = decodeEntities(node.getAttribute('href'));
    if (href.startsWith('//')) href = 'https:' + href;
    const media = node.getAttribute('media');
    headLinks.push('    <link rel="stylesheet" href="' + absUrl(href) + '"' + (media && media !== 'all' ? ' media="' + media + '"' : '') + ' />');
  } else if (tag === 'style') {
    emitInlineCss(node, 'head');
  } else if (tag === 'link' && /(^|\s)icon(\s|$)/.test(rel)) {
    const sizes = node.getAttribute('sizes');
    headLinks.push(
      '    <link rel="' + rel + '" href="' + absUrl(decodeEntities(node.getAttribute('href'))) + '"' + (sizes ? ' sizes="' + sizes + '"' : '') + ' />'
    );
  } else if (tag === 'link' && ['preconnect', 'dns-prefetch', 'preload'].includes(rel)) {
    let href = decodeEntities(node.getAttribute('href'));
    if (href.startsWith('//')) href = 'https:' + href;
    headLinks.push('    <link rel="' + rel + '" href="' + href + '"' + (node.hasAttribute('crossorigin') ? ' crossorigin' : '') + ' />');
  }
}

// styles + stylesheet links the export left inside <body>
for (const node of root.querySelectorAll('style')) emitInlineCss(node, 'body');
for (const node of root.querySelectorAll('link')) {
  if ((node.getAttribute('rel') || '').includes('stylesheet')) {
    let href = decodeEntities(node.getAttribute('href'));
    if (href.startsWith('//')) href = 'https:' + href;
    headLinks.push('    <link rel="stylesheet" href="' + absUrl(href) + '" />');
  }
}

/* ------------------------------------------------------------------ */
/* 2. Scripts - kept in document order, inline blocks become files     */
/* ------------------------------------------------------------------ */
const scripts = [];
let inlineIndex = 0;
const SKIP_INLINE = [/wp-emoji-loader/, /function alxToggle/, /googletagmanager/];

function collectScript(node) {
  const type = (node.getAttribute('type') || '').toLowerCase();
  if (type && !['text/javascript', 'module', 'application/javascript'].includes(type)) return;
  const src = node.getAttribute('src');
  if (src) {
    // the wishlist plugin polls a WordPress-only AJAX endpoint that does not exist here
    if (/woo-smart-wishlist\/assets\/js\/frontend\.js/.test(src)) return;
    scripts.push(absUrl(decodeEntities(src)));
    return;
  }
  const code = node.innerHTML;
  if (!code.trim()) return;
  if (SKIP_INLINE.some((re) => re.test(code))) return;
  const id = (node.getAttribute('id') || 'inline-' + inlineIndex).replace(/[^a-z0-9_-]/gi, '-');
  const file = 'js/' + String(inlineIndex++).padStart(2, '0') + '-' + id + '.js';
  fs.writeFileSync(path.join(PUBLIC, file), code);
  scripts.push('/' + file);
}

for (const node of head.querySelectorAll('script')) collectScript(node);
for (const node of root.querySelectorAll('script')) collectScript(node);

/* ------------------------------------------------------------------ */
/* 3. Components                                                       */
/* ------------------------------------------------------------------ */
function writeComponent(dir, name, node) {
  const jsx = toJsx(node, 2);
  fs.writeFileSync(
    path.join(dir, name + '.jsx'),
    'export default function ' + name + '() {\n  return (\n' + jsx + '\n  );\n}\n'
  );
}

const wrapper = root.querySelector('#pxl-wapper');
const mainContent = wrapper.querySelector('.elementor-18');

writeComponent(COMP, 'Header', wrapper.querySelector('#pxl-header-elementor'));
writeComponent(COMP, 'Footer', wrapper.querySelector('#pxl-footer-elementor'));

const SECTION_NAMES = [
  'Hero', 'TrackShipment', 'GetStarted', 'ServicesIntro', 'BusinessServices',
  'EcommerceServices', 'IndustriesIntro', 'Industries', 'AboutUs', 'Capacity',
  'Expertise', 'DeliveryFlexibility', 'Sustainability', 'RoadFreight', 'Testimonials',
  'Partners', 'RequestQuote', 'Insights', 'Faq',
];

const sectionNodes = mainContent.childNodes.filter(isElement);
if (sectionNodes.length !== SECTION_NAMES.length) {
  console.warn('! expected ' + SECTION_NAMES.length + ' sections, found ' + sectionNodes.length);
}
const sectionComponentNames = sectionNodes.map((_, i) => SECTION_NAMES[i] || 'Section' + i);
sectionNodes.forEach((node, i) => writeComponent(SECTIONS, sectionComponentNames[i], node));

// Deliberate changes from the original export, re-applied on every run:
// the Industries carousel slides on its own (pauses on hover).
{
  const file = path.join(SECTIONS, 'Industries.jsx');
  const src = fs.readFileSync(file, 'utf8');
  fs.writeFileSync(file, src.replace('\\"autoplay\\":false,', '\\"autoplay\\":true,'));
}

// overlays / popups that live outside the header, page and footer
const OVERLAYS = [
  ['ScrollToTop', '.pxl-scroll-top'],
  ['SidePanel', '.pxl-hidden-panel-popup'],
  ['SearchPopup', '#pxl-search-popup'],
  ['WishlistPopup', '.woosw-popup'],
];
for (const [name, selector] of OVERLAYS) {
  const node = root.querySelector(selector);
  if (node) writeComponent(COMP, name, node);
  else console.warn('! overlay not found: ' + selector);
}

const cartNodes = root.querySelectorAll('#pxl-cart-sidebar');
if (cartNodes.length) {
  const jsx = cartNodes.map((n) => toJsx(n, 3)).join('\n');
  fs.writeFileSync(
    path.join(COMP, 'CartSidebar.jsx'),
    'export default function CartSidebar() {\n  return (\n    <>\n' + jsx + '\n    </>\n  );\n}\n'
  );
}

/* ------------------------------------------------------------------ */
/* 4. Generated support files                                          */
/* ------------------------------------------------------------------ */
fs.writeFileSync(
  path.join(SRC_DIR, 'legacyScripts.js'),
  "// Generated by tools/convert.mjs - the original theme's scripts, in document order.\n" +
    '// Loaded sequentially after React has painted the markup (see useLegacyScripts).\n\n' +
    'export const LEGACY_SCRIPTS = [\n' +
    scripts.map((s) => '  ' + JSON.stringify(s) + ',').join('\n') +
    '\n];\n'
);

// Home mirrors the original #pxl-main subtree; every top-level Elementor
// section inside it is swapped for the component generated from that section.
mainContent.set_content(
  sectionNodes.map((_, i) => '<div data-generated-section="' + i + '"></div>').join('\n')
);
let homeJsx = toJsx(wrapper.querySelector('#pxl-main'), 2);
sectionComponentNames.forEach((name, i) => {
  homeJsx = homeJsx.replace('<div data-generated-section="' + i + '"></div>', '<' + name + ' />');
});

const homeImports = sectionComponentNames
  .map((n) => "import " + n + " from './sections/" + n + ".jsx';")
  .join('\n');

fs.writeFileSync(
  path.join(COMP, 'Home.jsx'),
  homeImports + '\n\nexport default function Home() {\n  return (\n' + homeJsx + '\n  );\n}\n'
);

fs.writeFileSync(
  path.resolve('index.html'),
  '<!DOCTYPE html>\n<html lang="en-US">\n  <head>\n' +
    '    <meta charset="UTF-8" />\n' +
    '    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />\n' +
    '    <title>' + title.replace(/&/g, '&amp;') + '</title>\n' +
    headLinks.join('\n') +
    '\n  </head>\n  <body class="' + bodyClass + '">\n' +
    '    <div id="root"></div>\n' +
    '    <script type="module" src="/src/main.jsx"></script>\n' +
    '  </body>\n</html>\n'
);

console.log('stylesheets: ' + headLinks.length);
console.log('scripts:     ' + scripts.length);
console.log('sections:    ' + sectionNodes.length);
