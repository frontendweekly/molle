const molle = require('../.eleventy.js');

module.exports = function (config) {
  config.addPlugin(molle);
  config.addLayoutAlias('base', 'layouts/base.njk');

  return {
    templateFormats: ['njk', 'md', '11ty.js'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: 'njk',
    passthroughFileCopy: true,
  };
};
