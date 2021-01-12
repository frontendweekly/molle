const jsdom = require('jsdom');
const {JSDOM} = jsdom;

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html');

module.exports = function (content, outputPath) {
  if (shouldTransformHTML(outputPath)) {
    const DOM = new JSDOM(content, {
      resources: 'usable',
    });

    const document = DOM.window.document;
    const articleImages = [...document.querySelectorAll('.c-post img')];
    const articleEmbeds = [...document.querySelectorAll('.c-post iframe')];
    const articleCodeBlocks = [
      ...document.querySelectorAll('.c-post pre[class]'),
    ];

    if (articleImages.length) {
      articleImages.forEach((image) => {
        image.setAttribute('loading', 'lazy');
        image.setAttribute('decoding', 'async');

        // If an image has a title it means that the user added a caption
        // so replace the image with a figure containing that image and a caption
        if (image.hasAttribute('title')) {
          const figure = document.createElement('figure');
          const figCaption = document.createElement('figcaption');

          figCaption.innerHTML = image.getAttribute('title');
          image.removeAttribute('title');
          figure.appendChild(image.cloneNode(true));
          figure.appendChild(figCaption);
          image.replaceWith(figure);
        }
      });
    }

    // Look for videos are wrap them in a container element
    if (articleEmbeds.length) {
      articleEmbeds.forEach((embed) => {
        if (embed.hasAttribute('allowfullscreen')) {
          const player = document.createElement('div');
          player.classList.add('o-video-player');
          player.appendChild(embed.cloneNode(true));
          embed.replaceWith(player);
        }
      });
    }

    // Look for code block and wrap them in a container element
    if (articleCodeBlocks.length) {
      articleCodeBlocks.forEach((codeBlock) => {
        const container = document.createElement('div');
        container.classList.add('o-code-block');
        container.appendChild(codeBlock.cloneNode(true));
        codeBlock.replaceWith(container);
      });
    }

    return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
  }
  return content;
};
