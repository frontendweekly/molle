const jsdom = require('jsdom');
const {JSDOM} = jsdom;
const {queryByTestId} = require('@testing-library/dom');
const {toHaveAttribute} = require('@testing-library/jest-dom/matchers');

const SUT = require('../index');

expect.extend({toHaveAttribute});

describe('transform-enhance-post-html', () => {
  test('it should return content when output is not html', () => {
    // Arrange
    const content = `dummy content`;
    const outputPath = `dummy.txt`;
    // Act
    const actual = SUT(content, outputPath);
    // Assert
    expect(actual).toMatchInlineSnapshot(`"dummy content"`);
  });

  test(`it should add lazy="loading to img`, () => {
    // Arrange
    // eslint-disable-next-line sonarjs/no-duplicate-string
    const targetElem = 'inline-jest';
    const content = `
        <div class="c-post">
          <img data-testid="inline-jest" src="dummy">
        </div>
      `;
    const outputPath = `image-lazy.html`;
    // Act
    const output = SUT(content, outputPath);
    const DOM = new JSDOM(output, {
      resources: 'usable',
    });
    const actual = queryByTestId(DOM.window.document, targetElem);
    // Assert
    expect(actual).toHaveAttribute('loading', 'lazy');
  });

  test(`it should wrap img with figure if img has title`, () => {
    // Arrange
    const targetElem = 'inline-jest';
    const content = `
        <div class="c-post">
          <img data-testid="inline-jest" src="dummy" title="dummy">
        </div>
      `;
    const outputPath = `dummy.html`;
    // Act
    const output = SUT(content, outputPath);
    const DOM = new JSDOM(output, {
      resources: 'usable',
    });
    const actual = queryByTestId(DOM.window.document, targetElem).parentNode;
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      <figure>
        <img
          data-testid="inline-jest"
          loading="lazy"
          src="dummy"
        />
        <figcaption>
          dummy
        </figcaption>
      </figure>
    `);
  });

  test(`it should add anchor to heading`, () => {
    // Arrange
    const targetElem = 'inline-jest';
    const content = `
        <div class="c-post">
          <h2 data-testid="inline-jest">h2</h2>
        </div>
      `;
    const outputPath = `dummy.html`;
    // Act
    const output = SUT(content, outputPath);
    const DOM = new JSDOM(output, {
      resources: 'usable',
    });

    const actual = queryByTestId(DOM.window.document, targetElem).querySelector(
      'a'
    );
    // Assert
    expect(actual).toMatchInlineSnapshot(`null`);
  });

  test(`it should wrap iframe with .c-video-player container`, () => {
    // Arrange
    const targetElem = 'inline-jest';
    const content = `
        <div class="c-post">
          <iframe data-testid="inline-jest" allowfullscreen>I'm video</iframe>
        </div>
      `;
    const outputPath = `dummy.html`;
    // Act
    const output = SUT(content, outputPath);
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

  test(`it should wrap pre[class] with .c-code-block container`, () => {
    // Arrange
    const targetElem = 'inline-jest';
    const content = `
        <div class="c-post">
          <pre data-testid="inline-jest" class="inline-jest">I'm code block</pre>
        </div>
      `;
    const outputPath = `dummy.html`;
    // Act
    const output = SUT(content, outputPath);
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
