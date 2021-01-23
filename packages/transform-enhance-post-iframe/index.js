const cheerio = require('cheerio');

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html');

module.exports = function (content, outputPath) {
  if (!shouldTransformHTML(outputPath)) {
    return content;
  }

  const $ = cheerio.load(content, {_useHtmlParser2: true});
  const articleEmbeds = [...$('.c-post iframe[allowfullscreen]')];

  if (articleEmbeds.length) {
    articleEmbeds.forEach((embed) => {
      const $embed = $(embed);
      const $player = $('div').addClass('o-video-player');

      $player.append($embed);
    });
  }

  return $.html();
};
