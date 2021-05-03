const rewire = require('rewire');
const {parseHTML} = require('linkedom');

const SUTINTEGRATION = require('../index');
const SUT = rewire('../index');
const metadataMock = require('./metadata.mock');
const IMG_SRC = 'https://dummyimage.com/600x400/000/fff';
const getImageMeta = SUT.__get__('getImageMeta');
const buildPictureElem = SUT.__get__('buildPictureElem');
const buildFigureElem = SUT.__get__('buildFigureElem');

test('getImageMeta returns metadata', async () => {
  // Arrange
  const image = `<img src="${IMG_SRC}" alt="I am alt">`;
  const {document} = parseHTML(image);

  const imageDOM = document.querySelector('img');
  const src = imageDOM.getAttribute('src');

  // Act
  const actual = await getImageMeta(src);

  // Assert
  expect(actual).toMatchSnapshot();
}, 30000);

test('buildPictureElem build picture', () => {
  // Arrange
  const image = `<img src="${IMG_SRC}" alt="I am alt">`;
  const {document} = parseHTML(image);
  const imageDOM = document.querySelector('img');
  const alt = imageDOM.getAttribute('alt');

  // Act
  const actual = buildPictureElem(alt, metadataMock);

  // Assert
  expect(actual).toMatchInlineSnapshot(`
    <picture>
      <source
        sizes="(max-width: 768px) 100vw, 768px"
        srcset="/images/10bbaf8e-750.avif 750w, /images/10bbaf8e-1500.avif 1500w"
        type="image/avif"
      />
      <source
        sizes="(max-width: 768px) 100vw, 768px"
        srcset="/images/10bbaf8e-750.webp 750w, /images/10bbaf8e-1500.webp 1500w"
        type="image/webp"
      />
      <source
        sizes="(max-width: 768px) 100vw, 768px"
        srcset="/images/10bbaf8e-750.png 750w, /images/10bbaf8e-1500.png 1500w"
        type="image/png"
      />
      <img
        alt="I am alt"
        decoding="async"
        height="986"
        loading="lazy"
        src="/images/10bbaf8e-750.png"
        width="1500"
      />
    </picture>
  `);
});

test('buildFigureElem build figure', () => {
  // Arrange
  const image = `<img src="${IMG_SRC}" alt="I am alt" title="title">`;
  const {document} = parseHTML(image);
  const imageDOM = document.querySelector('img');
  const title = imageDOM.getAttribute('title');
  const picture = document.createElement('picture');

  // Act
  const actual = buildFigureElem(document, title, picture);

  // Assert
  expect(actual).toMatchInlineSnapshot(`
    <figure>
      <picture />
      <figcaption>
        title
      </figcaption>
    </figure>
  `);
});

test('Integration', async () => {
  // Arrange
  const content = `
        <div class="c-post">
          <p>
            <img src="${IMG_SRC}" alt="I am alt" title="title">
            Hello image!
          </p>
          <p>
            <img src="${IMG_SRC}" alt="I am alt">
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
                <figure><picture><source type=\\"image/avif\\" srcset=\\"/images/ee6eed7-600.avif 600w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\"><source type=\\"image/webp\\" srcset=\\"/images/ee6eed7-600.webp 600w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\"><img alt=\\"I am alt\\" loading=\\"lazy\\" decoding=\\"async\\" src=\\"/images/ee6eed7-600.png\\" width=\\"600\\" height=\\"400\\"></picture><figcaption>title</figcaption></figure>
                Hello image!
              </p>
              <p>
                <picture><source type=\\"image/avif\\" srcset=\\"/images/ee6eed7-600.avif 600w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\"><source type=\\"image/webp\\" srcset=\\"/images/ee6eed7-600.webp 600w\\" sizes=\\"(max-width: 768px) 100vw, 768px\\"><img alt=\\"I am alt\\" loading=\\"lazy\\" decoding=\\"async\\" src=\\"/images/ee6eed7-600.png\\" width=\\"600\\" height=\\"400\\"></picture>
                Hello image without title!
              </p>
            </div>
          "
  `);
}, 30000);
