const {DOMParser} = require('linkedom');

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html');

module.exports = function (content, outputPath) {
  if (!shouldTransformHTML(outputPath)) {
    return content;
  }

  const document = new DOMParser().parseFromString(content, 'text/html');
  const articleEmbeds = [
    ...document.querySelectorAll('.c-post iframe[allowfullscreen]'),
  ];

  if (articleEmbeds.length) {
    articleEmbeds.forEach((embed) => {
      const player = document.createElement('div');
      player.classList.add('o-video-player');
      player.appendChild(embed.cloneNode(true));
      embed.replaceWith(player);
    });
  }

  return document.toString();
};
