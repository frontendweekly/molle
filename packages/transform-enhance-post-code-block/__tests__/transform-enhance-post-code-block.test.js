const cheerio = require('cheerio');
const SUT = require('../index');

test(`it should wrap pre[class] with .o-code-block container`, () => {
  // Arrange
  const content = `
        <div class="c-post">
          <pre data-testid="inline-jest" class="inline-jest">I'm code block</pre>
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
              <div class=\\"o-code-block\\"><pre data-testid=\\"inline-jest\\" class=\\"inline-jest\\">I&apos;m code block</pre></div>
            </div>
          "
  `);
});
