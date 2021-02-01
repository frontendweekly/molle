const path = require('path');
const {DOMParser, parseHTML} = require('linkedom');
const Image = require('@11ty/eleventy-img');

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html');

const isURL = (str) => {
  const pattern = new RegExp(
    '^(https?:\\/\\/)?' + // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
      '(\\#[-a-z\\d_]*)?$',
    'i'
  ); // fragment locator
  return !!pattern.test(str);
};

const getImageMeta = async (src) => {
  const imagePath = isURL(src) ? src : path.join(process.cwd(), `/11ty/${src}`);

  return await Image(imagePath, {
    urlPath: '/images/',
    outputDir: './11ty/images/generated',
    widths: [1500, 750],
    formats: ['avif', 'webp', 'png'],
    dryRun: process.env.NODE_ENV === 'test',
    useCache: process.env.NODE_ENV === 'development',
  });
};

const buildPictureElem = (alt, metadata) => {
  const imageAttributes = {
    alt: alt,
    sizes: `(max-width: 768px) 100vw, 768px`,
    loading: `lazy`,
    decoding: `async`,
  };

  const {document} = parseHTML(Image.generateHTML(metadata, imageAttributes));
  return document.querySelector('picture');
};

const buildFigureElem = (document, title, picture) => {
  const figure = document.createElement('figure');
  const figCaption = document.createElement('figcaption');

  figCaption.innerHTML = title;
  figure.appendChild(picture.cloneNode(true));
  figure.appendChild(figCaption);
  picture.replaceWith(figure);
  return figure;
};

module.exports = async function (content, outputPath) {
  if (!shouldTransformHTML(outputPath)) {
    return content;
  }

  const document = new DOMParser().parseFromString(content, 'text/html');
  const articleImages = [...document.querySelectorAll('.c-post img')];

  if (articleImages.length) {
    await Promise.all(
      articleImages.map(async (image) => {
        const src = image.getAttribute('src');
        const alt = image.getAttribute('alt');
        const title = image.getAttribute('title');

        const metadata = await getImageMeta(src);
        const picture = buildPictureElem(alt, metadata);

        // If an image has a title it means that the user added a caption
        // so replace the image with a figure containing that image and a caption
        if (title) {
          const figure = buildFigureElem(document, title, picture);
          image.replaceWith(figure);
        } else {
          image.replaceWith(picture);
        }
      })
    );
  }

  return document.toString();
};
