const path = require('path');
const cheerio = require('cheerio');
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
  const fallback = metadata.png[0];
  const sizes = `(max-width: 768px) 100vw, 768px`;

  return `<picture>
    ${Object.values(metadata)
      .map((imageFormat) => {
        return `  <source type="${
          imageFormat[0].sourceType
        }" srcset="${imageFormat
          .map((entry) => entry.srcset)
          .join(', ')}" sizes="${sizes}">`;
      })
      .join('\n')}
      <img
        src="${fallback.url}"
        width="${fallback.width}"
        height="${fallback.height}"
        alt="${alt}"
        loading="lazy"
        decoding="async">
    </picture>`;
};

const buildFigureElem = (title, picture) => {
  return `<figure>
    ${picture}
    <figcaption>${title}</figcaption>
  </figure>`;
};

module.exports = async function (content, outputPath) {
  if (!shouldTransformHTML(outputPath)) {
    return content;
  }

  const $ = cheerio.load(content, {_useHtmlParser2: true});
  const articleImages = [...$('.c-post img')];

  if (articleImages.length) {
    await Promise.all(
      articleImages.map(async (image) => {
        const $image = $(image);
        const src = $image.attr('src');
        const alt = $image.attr('alt');
        const title = $image.attr('title');

        const metadata = await getImageMeta(src);
        const picture = buildPictureElem(alt, metadata);

        // If an image has a title it means that the user added a caption
        // so replace the image with a figure containing that image and a caption
        if (title) {
          const $figure = $(buildFigureElem(title, picture));
          $image.replaceWith($figure);
        } else {
          $image.replaceWith($(picture));
        }
      })
    );
  }

  return $.html();
};
