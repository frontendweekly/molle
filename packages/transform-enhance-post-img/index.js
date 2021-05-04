const path = require('path');
const {URL} = require('url');
const {parseHTML} = require('linkedom');
const Image = require('@11ty/eleventy-img');

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html');

const isURL = (str) => {
  try {
    new URL(str);
    return true;
  } catch (e) {
    // invalid url OR local path
    return false;
  }
};

const imgOptions = {
  urlPath: '/images/',
  outputDir: './11ty/generated',
  widths: [1500, 750, null],
  formats: ['avif', 'webp'],
  dryRun: process.env.NODE_ENV === 'test',
  useCache: process.env.NODE_ENV === 'development',
  cacheOptions: {
    duration: '1d',
    directory: '.cache',
    removeUrlQueryParams: false,
  },
};

const setImagePath = (src) => {
  if (isURL(src)) {
    return src;
  } else {
    return path.join(process.cwd(), `/11ty/${src}`);
  }
};

const getImageMeta = (src, width, height) => {
  if (isURL(src)) {
    return Image.statsByDimensionsSync(src, width, height, imgOptions);
  } else {
    return Image.statsSync(src, imgOptions);
  }
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

module.exports = function (content, outputPath) {
  if (!shouldTransformHTML(outputPath)) {
    return content;
  }

  const {document} = parseHTML(content);
  const articleImages = [...document.querySelectorAll('.h-entry img')];

  if (articleImages.length) {
    articleImages.forEach((img) => {
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt');
      const title = img.getAttribute('title');
      const width = img.getAttribute('width');
      const height = img.getAttribute('height');
      const ext = path.extname(src).slice(1);

      imgOptions.formats.push(ext ? ext : 'png');

      Image(setImagePath(src), imgOptions);

      const metadata = getImageMeta(setImagePath(src), width, height);
      const picture = buildPictureElem(alt, metadata);

      // If an image has a title it means that the user added a caption
      // so replace the image with a figure containing that image and a caption
      if (title) {
        const figure = buildFigureElem(document, title, picture);
        img.replaceWith(figure);
      } else {
        img.replaceWith(picture);
      }
    });
  }

  return document.toString();
};
