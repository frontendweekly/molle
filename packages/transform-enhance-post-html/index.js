const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const slugify = require('slugify');

const minify = (input) => input.replace(/\s{2,}/g, '').replace(/'/g, '"');
const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html');

module.exports = function (content, outputPath) {
  if (shouldTransformHTML(outputPath)) {
    const DOM = new JSDOM(content, {
      resources: 'usable',
    });

    const document = DOM.window.document;
    const articleImages = [...document.querySelectorAll('.c-post img')];
    const articleHeadings = [
      ...document.querySelectorAll(
        '.c-post h2, .c-post h3, .c-post h4, .c-post h5, .c-post h6'
      ),
    ];
    const articleEmbeds = [...document.querySelectorAll('.c-post iframe')];
    const articleCodeBlocks = [
      ...document.querySelectorAll('.c-post pre[class]'),
    ];

    if (articleImages.length) {
      articleImages.forEach((image) => {
        image.setAttribute('loading', 'lazy');

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
          player.classList.add('c-video-player');
          player.appendChild(embed.cloneNode(true));
          embed.replaceWith(player);
        }
      });
    }

    // Look for code block and wrap them in a container element
    if (articleCodeBlocks.length) {
      articleCodeBlocks.forEach((codeBlock) => {
        const container = document.createElement('div');
        container.classList.add('c-code-block');
        container.appendChild(codeBlock.cloneNode(true));
        codeBlock.replaceWith(container);
      });
    }

    return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
  }
  return content;
};
