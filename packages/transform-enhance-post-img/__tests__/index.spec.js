const rewire = require('rewire');
const {DOMParser} = require('linkedom');

const SUTINTEGRATION = require('../index');
const SUT = rewire('../index');
const metadataMock = require('./metadata.mock');
const getImageMeta = SUT.__get__('getImageMeta');
const buildPictureElem = SUT.__get__('buildPictureElem');
const buildFigureElem = SUT.__get__('buildFigureElem');

test('getImageMeta returns metadata', async () => {
  // Arrange
  const image = `<img src="https://virga.frontendweekly.tokyo/images/63ea9cd0-750.png" alt="I am alt">`;
  const document = new DOMParser().parseFromString(image, 'text/html');
  const imageDOM = document.querySelector('img');
  const src = imageDOM.getAttribute('src');

  // Act
  const actual = await getImageMeta(src);

  // Assert
  expect(actual).toMatchSnapshot();
}, 15000);

test('buildPictureElem build picture', () => {
  // Arrange
  const image = `<img src="https://virga.frontendweekly.tokyo/images/63ea9cd0-750.png" alt="I am alt">`;
  const document = new DOMParser().parseFromString(image, 'text/html');
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
        height="493"
        loading="lazy"
        src="/images/10bbaf8e-750.png"
        width="750"
      />
      

    </picture>
  `);
});

test('buildFigureElem build figure', () => {
  // Arrange
  const image = `<img src="https://virga.frontendweekly.tokyo/images/63ea9cd0-750.png" alt="I am alt" title="title">`;
  const document = new DOMParser().parseFromString(image, 'text/html');
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
            <img src="https://virga.frontendweekly.tokyo/images/63ea9cd0-750.png" alt="I am alt" title="title">
            Hello image!
          </p>
          <p>
            <img src="https://virga.frontendweekly.tokyo/images/63ea9cd0-750.png" alt="I am alt">
            Hello image without title!
          </p>
        </div>
      `;
  const outputPath = `dummy.html`;

  // actual
  const actual = await SUTINTEGRATION(content, outputPath);

  expect(actual).toMatchInlineSnapshot(`
    "<!DOCTYPE html><html>
            <div class=\\"c-post\\">
              <p>
                <figure><picture>
      <source sizes=\\"(max-width: 768px) 100vw, 768px\\" srcset=\\"/images/fc3f538d-750.avif 750w\\" type=\\"image/avif\\">
      <source sizes=\\"(max-width: 768px) 100vw, 768px\\" srcset=\\"/images/fc3f538d-750.webp 750w\\" type=\\"image/webp\\">
      <img decoding=\\"async\\" loading=\\"lazy\\" alt=\\"I am alt\\" height=\\"493\\" width=\\"750\\" src=\\"/images/fc3f538d-750.png\\">
    </picture><figcaption>title</figcaption></figure>
                Hello image!
              </p>
              <p>
                <picture>
      <source sizes=\\"(max-width: 768px) 100vw, 768px\\" srcset=\\"/images/fc3f538d-750.avif 750w\\" type=\\"image/avif\\">
      <source sizes=\\"(max-width: 768px) 100vw, 768px\\" srcset=\\"/images/fc3f538d-750.webp 750w\\" type=\\"image/webp\\">
      <img decoding=\\"async\\" loading=\\"lazy\\" alt=\\"I am alt\\" height=\\"493\\" width=\\"750\\" src=\\"/images/fc3f538d-750.png\\">
    </picture>
                Hello image without title!
              </p>
            </div>
          </html>"
  `);
}, 25000);
