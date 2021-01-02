const markdownIt = require('markdown-it');
const uslug = require('uslug');

const md = markdownIt({
  html: true,
  breaks: true,
  linkify: true,
  typographer: true,
})
  .use(require('markdown-it-deflist'))
  .use(require('markdown-it-attrs'), {
    leftDelimiter: '{:',
    rightDelimiter: '}',
    allowedAttributes: ['id', 'class', /^data-.*$/],
  })
  .use(require('markdown-it-anchor'), {
    slugify: (s) => uslug(s),
    level: 1,
    permalink: true,
    permalinkClass: 'o-heading-link',
    permalinkSymbol: '#',
  })
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-attribution'), {
    classNameContainer: 'o-blockquote',
    classNameAttribution: 'o-blockquote__attribution',
    removeMarker: false,
    marker: '—',
  })
  // Disable indented code blocks.
  // We only support fenced code blocks.
  .disable('code');

// Change markdown-it-footnote markup
md.renderer.rules.footnote_block_open = () => `
<section class="o-footnotes">
<ol class="o-footnotes__list">
`;

module.exports = md;
