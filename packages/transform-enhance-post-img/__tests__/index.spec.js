const rewire = require('rewire');
const cheerio = require('cheerio');

const SUTINTEGRATION = require('../index');
const SUT = rewire('../index');
const metadataMock = require('./metadata.mock');
const getImageMeta = SUT.__get__('getImageMeta');
const buildPictureElem = SUT.__get__('buildPictureElem');
const buildFigureElem = SUT.__get__('buildFigureElem');

test('getImageMeta returns metadata', async () => {
  // Arrange
  const image = `<img src="https://virga.frontendweekly.tokyo/images/2021-01-09-indieweb-posse-using-eleventy-and-netlify-functions.fig1.png" alt="I am alt">`;
  const $ = cheerio.load(image, {_useHtmlParser2: true});
  const src = $('img').attr('src'); //?

  // Act
  const actual = await getImageMeta(src);

  // Assert
  expect(actual).toMatchInlineSnapshot(`
    Object {
      "avif": Array [
        Object {
          "filename": "10bbaf8e-750.avif",
          "format": "avif",
          "height": 493,
          "outputPath": "11ty/images/generated/10bbaf8e-750.avif",
          "size": undefined,
          "sourceType": "image/avif",
          "srcset": "/images/10bbaf8e-750.avif 750w",
          "url": "/images/10bbaf8e-750.avif",
          "width": 750,
        },
        Object {
          "filename": "10bbaf8e-1500.avif",
          "format": "avif",
          "height": 986,
          "outputPath": "11ty/images/generated/10bbaf8e-1500.avif",
          "size": undefined,
          "sourceType": "image/avif",
          "srcset": "/images/10bbaf8e-1500.avif 1500w",
          "url": "/images/10bbaf8e-1500.avif",
          "width": 1500,
        },
      ],
      "png": Array [
        Object {
          "filename": "10bbaf8e-750.png",
          "format": "png",
          "height": 493,
          "outputPath": "11ty/images/generated/10bbaf8e-750.png",
          "size": undefined,
          "sourceType": "image/png",
          "srcset": "/images/10bbaf8e-750.png 750w",
          "url": "/images/10bbaf8e-750.png",
          "width": 750,
        },
        Object {
          "filename": "10bbaf8e-1500.png",
          "format": "png",
          "height": 986,
          "outputPath": "11ty/images/generated/10bbaf8e-1500.png",
          "size": undefined,
          "sourceType": "image/png",
          "srcset": "/images/10bbaf8e-1500.png 1500w",
          "url": "/images/10bbaf8e-1500.png",
          "width": 1500,
        },
      ],
      "webp": Array [
        Object {
          "filename": "10bbaf8e-750.webp",
          "format": "webp",
          "height": 493,
          "outputPath": "11ty/images/generated/10bbaf8e-750.webp",
          "size": undefined,
          "sourceType": "image/webp",
          "srcset": "/images/10bbaf8e-750.webp 750w",
          "url": "/images/10bbaf8e-750.webp",
          "width": 750,
        },
        Object {
          "filename": "10bbaf8e-1500.webp",
          "format": "webp",
          "height": 986,
          "outputPath": "11ty/images/generated/10bbaf8e-1500.webp",
          "size": undefined,
          "sourceType": "image/webp",
          "srcset": "/images/10bbaf8e-1500.webp 1500w",
          "url": "/images/10bbaf8e-1500.webp",
          "width": 1500,
        },
      ],
    }
  `);
}, 15000);

test('buildPictureElem build picture', () => {
  // Arrange
  const image = `<img src="https://virga.frontendweekly.tokyo/images/2021-01-09-indieweb-posse-using-eleventy-and-netlify-functions.fig1.png" alt="I am alt">`;
  const $ = cheerio.load(image, {_useHtmlParser2: true});
  const alt = $('img').attr('alt');

  // Act
  const actual = buildPictureElem(alt, metadataMock);

  // Assert
  expect(actual).toMatchInlineSnapshot(`
    "<picture>
          <source type=\\"image/avif\\" srcset=\\"/images/10bbaf8e-750.avif 750w, /images/10bbaf8e-1500.avif 1500w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\">
      <source type=\\"image/webp\\" srcset=\\"/images/10bbaf8e-750.webp 750w, /images/10bbaf8e-1500.webp 1500w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\">
      <source type=\\"image/png\\" srcset=\\"/images/10bbaf8e-750.png 750w, /images/10bbaf8e-1500.png 1500w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\">
          <img
            src=\\"/images/10bbaf8e-750.png\\"
            width=\\"750\\"
            height=\\"493\\"
            alt=\\"I am alt\\"
            loading=\\"lazy\\"
            decoding=\\"async\\">
        </picture>"
  `);
});

test('buildFigureElem build figure', () => {
  // Arrange
  const image = `<img src="https://virga.frontendweekly.tokyo/images/2021-01-09-indieweb-posse-using-eleventy-and-netlify-functions.fig1.png" alt="I am alt" title="title">`;
  const $ = cheerio.load(image, {_useHtmlParser2: true});
  const $img = $('img');
  const title = $img.attr('title');
  const picture = `<picture></picture>`;

  // Act
  const actual = buildFigureElem(title, picture);

  // Assert
  expect(actual).toMatchInlineSnapshot(`
    "<figure>
        <picture></picture>
        <figcaption>title</figcaption>
      </figure>"
  `);
});

test('Integration', async () => {
  // Arrange
  const content = `
        <div class="c-post">
          <p>
            <img src="https://virga.frontendweekly.tokyo/images/2021-01-09-indieweb-posse-using-eleventy-and-netlify-functions.fig1.png" alt="I am alt" title="title">
            Hello image!
          </p>
          <p>
            <img src="https://virga.frontendweekly.tokyo/images/2021-01-09-indieweb-posse-using-eleventy-and-netlify-functions.fig1.png" alt="I am alt">
            Hello image without title!
          </p>
        </div>
      `;
  const outputPath = `dummy.html`;

  // actual
  const actual = await SUTINTEGRATION(content, outputPath);

  expect(actual).toMatchInlineSnapshot(`
    "
            <div class=\\"c-post\\">
              <p>
                <figure>
        <picture>
          <source type=\\"image/avif\\" srcset=\\"/images/10bbaf8e-750.avif 750w, /images/10bbaf8e-1500.avif 1500w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\">
      <source type=\\"image/webp\\" srcset=\\"/images/10bbaf8e-750.webp 750w, /images/10bbaf8e-1500.webp 1500w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\">
      <source type=\\"image/png\\" srcset=\\"/images/10bbaf8e-750.png 750w, /images/10bbaf8e-1500.png 1500w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\">
          <img src=\\"/images/10bbaf8e-750.png\\" width=\\"750\\" height=\\"493\\" alt=\\"I am alt\\" loading=\\"lazy\\" decoding=\\"async\\">
        </picture>
        <figcaption>title</figcaption>
      </figure>
                Hello image!
              </p>
              <p>
                <picture>
          <source type=\\"image/avif\\" srcset=\\"/images/10bbaf8e-750.avif 750w, /images/10bbaf8e-1500.avif 1500w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\">
      <source type=\\"image/webp\\" srcset=\\"/images/10bbaf8e-750.webp 750w, /images/10bbaf8e-1500.webp 1500w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\">
      <source type=\\"image/png\\" srcset=\\"/images/10bbaf8e-750.png 750w, /images/10bbaf8e-1500.png 1500w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\">
          <img src=\\"/images/10bbaf8e-750.png\\" width=\\"750\\" height=\\"493\\" alt=\\"I am alt\\" loading=\\"lazy\\" decoding=\\"async\\">
        </picture>
                Hello image without title!
              </p>
            </div>
          "
  `);
}, 25000);
