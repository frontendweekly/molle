const path = require('path');
const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const Image = require('@11ty/eleventy-img');

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html');

// eslint-disable-next-line sonarjs/cognitive-complexity
module.exports = async function (content, outputPath) {
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
      await Promise.all(
        articleImages.map(async (image) => {
          const imagePath = path.join(
            process.cwd(),
            `/11ty/${image.getAttribute('src')}`
          );

          const metadata = await Image(imagePath, {
            urlPath: '/images/',
            outputDir: './11ty/images/generated',
            widths: [1500, 750],
            formats: ['avif', 'webp', 'png'],
          });

          const fallback = metadata.png[0];
          const sizes = `(max-width: 768px) 100vw, 768px`;

          let picture = document.createElement('picture');

          Object.values(metadata).map((imageFormat) => {
            let source = Object.assign(document.createElement('source'), {
              type: `${imageFormat[0].sourceType}`,
              srcset: `${imageFormat.map((entry) => entry.srcset).join(', ')}`,
              sizes: sizes,
            });
            picture.appendChild(source);
          });

          image.setAttribute('loading', 'lazy');
          image.setAttribute('decoding', 'async');

          Object.assign(image, {
            src: fallback.url,
            width: fallback.width,
            height: fallback.height,
          });

          picture.appendChild(image.cloneNode(true));
          image.replaceWith(picture);

          // If an image has a title it means that the user added a caption
          // so replace the image with a figure containing that image and a caption
          if (image.hasAttribute('title')) {
            let figure = document.createElement('figure');
            let figCaption = document.createElement('figcaption');

            figCaption.innerHTML = image.getAttribute('title');
            image.removeAttribute('title');
            figure.appendChild(picture.cloneNode(true));
            figure.appendChild(figCaption);
            picture.replaceWith(figure);
          }
        })
      );
    }

    // Look for videos are wrap them in a container element
    if (articleEmbeds.length) {
      await Promise.all(
        articleEmbeds.map((embed) => {
          if (embed.hasAttribute('allowfullscreen')) {
            const player = document.createElement('div');
            player.classList.add('o-video-player');
            player.appendChild(embed.cloneNode(true));
            embed.replaceWith(player);
          }
        })
      );
    }

    // Look for code block and wrap them in a container element
    if (articleCodeBlocks.length) {
      await Promise.all(
        articleCodeBlocks.map((codeBlock) => {
          const container = document.createElement('div');
          container.classList.add('o-code-block');
          container.appendChild(codeBlock.cloneNode(true));
          codeBlock.replaceWith(container);
        })
      );
    }

    return '<!DOCTYPE html>\r\n' + document.documentElement.outerHTML;
  }
  return content;
};
