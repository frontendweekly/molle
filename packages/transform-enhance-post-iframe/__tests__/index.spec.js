const cheerio = require('cheerio');
const SUT = require('../index');

test(`it should wrap iframe with .o-video-player container`, () => {
  // Arrange
  const content = `
        <div class="c-post">
          <iframe data-testid="inline-jest" allowfullscreen>I'm video</iframe>
        </div>
      `;
  const outputPath = `dummy.html`;
  // Act
  const output = SUT(content, outputPath);
  const $ = cheerio.load(output, {_useHtmlParser2: true});

  const actual = $.html();
  // Assert
  expect(actual).toMatchInlineSnapshot(`
    "
            <div class=\\"c-post o-video-player\\">
              
            <iframe data-testid=\\"inline-jest\\" allowfullscreen>I'm video</iframe></div>
          "
  `);
});

test(`it should NOT wrap iframe with .c-video-player container`, () => {
  // Arrange
  const content = `
        <div class="c-post">
          <iframe data-testid="inline-jest">I'm video but no allowfullscreen</iframe>
        </div>
      `;
  const outputPath = `dummy.html`;
  // Act
  const output = SUT(content, outputPath);
  const $ = cheerio.load(output, {_useHtmlParser2: true});

  const actual = $.html();
  // Assert
  expect(actual).toMatchInlineSnapshot(`
    "
            <div class=\\"c-post\\">
              <iframe data-testid=\\"inline-jest\\">I'm video but no allowfullscreen</iframe>
            </div>
          "
  `);
});
