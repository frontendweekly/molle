const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {queryByTestId} = require('@testing-library/dom');
const {toHaveAttribute} = require('@testing-library/jest-dom/matchers');

const SUT = require('../index');

expect.extend({toHaveAttribute});

describe('transform-enhance-post-html', () => {
  test('it should return content when output is not html', async () => {
    // Arrange
    const content = `dummy content`;
    const outputPath = `dummy.txt`;
    // Act
    const actual = await SUT(content, outputPath);
    // Assert
    expect(actual).toMatchInlineSnapshot(`"dummy content"`);
  });

  test.skip(`it should create picture`, async () => {
    // Arrange
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const targetElem = 'inline-jest';
    const content = `
        <div class="c-post">
          <img data-testid="inline-jest" src="dummy.png">
        </div>
      `;
    const outputPath = `image-lazy.html`;
    // Act
    const output = await SUT(content, outputPath);
    const DOM = new JSDOM(output, {
      resources: 'usable',
    });
    const actual = queryByTestId(DOM.window.document, targetElem);
    // Assert
    expect(actual).toMatchInlineSnapshot();
  });

  test.skip(`it should wrap picture with figure if img has title`, async () => {
    // Arrange
    const targetElem = 'inline-jest';
    const content = `
        <div class="c-post">
          <img data-testid="inline-jest" src="/images/dummy.png" title="dummy">
        </div>
      `;
    const outputPath = `dummy.html`;
    // Act
    const output = await SUT(content, outputPath);
    const DOM = new JSDOM(output, {
      resources: 'usable',
    });
    const actual = queryByTestId(DOM.window.document, targetElem).parentNode;
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      <figure>
        <img
          data-testid="inline-jest"
          decoding="async"
          loading="lazy"
          src="dummy"
        />
        <figcaption>
          dummy
        </figcaption>
      </figure>
    `);
  });

  test(`it should wrap iframe with .c-video-player container`, async () => {
    // Arrange
    const targetElem = 'inline-jest';
    const content = `
        <div class="c-post">
          <iframe data-testid="inline-jest" allowfullscreen>I'm video</iframe>
        </div>
      `;
    const outputPath = `dummy.html`;
    // Act
    const output = await SUT(content, outputPath);
    const DOM = new JSDOM(output, {
      resources: 'usable',
    });

    const actual = queryByTestId(DOM.window.document, targetElem).parentNode;
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      <div
        class="o-video-player"
      >
        <iframe
          allowfullscreen=""
          data-testid="inline-jest"
        >
          I'm video
        </iframe>
      </div>
    `);
  });

  test(`it should wrap pre[class] with .c-code-block container`, async () => {
    // Arrange
    const targetElem = 'inline-jest';
    const content = `
        <div class="c-post">
          <pre data-testid="inline-jest" class="inline-jest">I'm code block</pre>
        </div>
      `;
    const outputPath = `dummy.html`;
    // Act
    const output = await SUT(content, outputPath);
    const DOM = new JSDOM(output, {
      resources: 'usable',
    });

    const actual = queryByTestId(DOM.window.document, targetElem).parentNode;
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      <div
        class="o-code-block"
      >
        <pre
          class="inline-jest"
          data-testid="inline-jest"
        >
          I'm code block
        </pre>
      </div>
    `);
  });
});
