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
    level: 2,
    permalink: true,
    permalinkClass: 'heading-link',
    permalinkSymbol: '#',
  })
  .use(require('markdown-it-footnote'))
  .use(require('markdown-it-attribution'), {
    removeMarker: false,
  })
  // Disable indented code blocks.
  // We only support fenced code blocks.
  .disable('code');

module.exports = md;
