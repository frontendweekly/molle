const cheerio = require('cheerio');

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html');

module.exports = function (content, outputPath) {
  if (!shouldTransformHTML(outputPath)) {
    return content;
  }

  const $ = cheerio.load(content, {_useHtmlParser2: true});
  const articleCodeBlocks = [...$('.c-post pre[class]')];

  if (articleCodeBlocks.length) {
    articleCodeBlocks.forEach((codeblock) => {
      const $codeblock = $(codeblock);
      const $container = $('<div class="o-code-block"></div>');

      $codeblock.wrap($container);
    });
  }

  return $.html();
};
