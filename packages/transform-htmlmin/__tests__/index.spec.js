const SUT = require('../index');

describe('transform-htmlmin', () => {
  test('it should return content when output is not html', () => {
    // Arrange
    const content = `<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta http-equiv="X-UA-Compatible" content="ie=edge" />
          <title>I'm title</title>
          <link href="https://fonts.googleapis.com" rel="dns-prefetch" />
          <link href="https://fonts.googleapis.com" rel="preconnect" />
          <link
            href="https://fonts.googleapis.com/css2?family=IBM+Plex+Serif:ital,wght@0,400;0,700;1,400;1,700&display=optional"
            rel="stylesheet"
          />
          <style>
            .c-preview {
              color: red;
            }
          </style>
        </head>
        <body>
          <article class="c-preview h-entry">
            <span class="c-preview__logo">LOGO</span>
            <div class="c-preview__inner-wrapper">
              <figure class="c-blockquote">
                <blockquote>
                  <p>QUOTE</p>
                </blockquote>
                <figcaption class="c-blockquote__attribution">
                  FIGCAPTION
                </figcaption>
              </figure>
            </div>
          </article>
        </body>
      </html>`;
    const outputPath = `dummy.html`;
    // Act
    const actual = SUT(content, outputPath);
    // Assert
    expect(actual).toMatchSnapshot();
  });

  test('it should return content when output is not html', () => {
    // Arrange
    const content = `dummy content`;
    const outputPath = `dummy.html`;
    // Act
    const actual = SUT(content, outputPath);
    // Assert
    expect(actual).toMatchInlineSnapshot(`"dummy content"`);
  });
});
