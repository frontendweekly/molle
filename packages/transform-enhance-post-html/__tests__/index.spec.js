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
    const actual = queryByTestId(DOM.window.document, 'inline-jest');
    // Assert
    expect(actual).toHaveAttribute('loading', 'lazy');
  });

  test(`it should wrap img with figure if img has title`, () => {
    // Arrange
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
    const actual = queryByTestId(DOM.window.document, 'inline-jest').parentNode;
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

    const actual = queryByTestId(DOM.window.document, 'inline-jest').querySelector('a');
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      <a
        class="c-heading-permalink"
        href="#heading-h2"
      >
        <span
          class="u-visually-hidden"
        >
           permalink
        </span>
        <svg
          aria-hidden="true"
          fill="currentColor"
          focusable="false"
          height="1em"
          viewBox="0 0 24 24"
          width="1em"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.199 13.599a5.99 5.99 0 0 0 3.949 2.345 5.987 5.987 0 0 0 5.105-1.702l2.995-2.994a5.992 5.992 0 0 0 1.695-4.285 5.976 5.976 0 0 0-1.831-4.211 5.99 5.99 0 0 0-6.431-1.242 6.003 6.003 0 0 0-1.905 1.24l-1.731 1.721a.999.999 0 1 0 1.41 1.418l1.709-1.699a3.985 3.985 0 0 1 2.761-1.123 3.975 3.975 0 0 1 2.799 1.122 3.997 3.997 0 0 1 .111 5.644l-3.005 3.006a3.982 3.982 0 0 1-3.395 1.126 3.987 3.987 0 0 1-2.632-1.563A1 1 0 0 0 9.201 13.6zm5.602-3.198a5.99 5.99 0 0 0-3.949-2.345 5.987 5.987 0 0 0-5.105 1.702l-2.995 2.994a5.992 5.992 0 0 0-1.695 4.285 5.976 5.976 0 0 0 1.831 4.211 5.99 5.99 0 0 0 6.431 1.242 6.003 6.003 0 0 0 1.905-1.24l1.723-1.723a.999.999 0 1 0-1.414-1.414L9.836 19.81a3.985 3.985 0 0 1-2.761 1.123 3.975 3.975 0 0 1-2.799-1.122 3.997 3.997 0 0 1-.111-5.644l3.005-3.006a3.982 3.982 0 0 1 3.395-1.126 3.987 3.987 0 0 1 2.632 1.563 1 1 0 0 0 1.602-1.198z"
          />
        </svg>
      </a>
    `);
  });

  test(`it should wrap iframe with .c-video-player container`, () => {
    // Arrange
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

    const actual = queryByTestId(DOM.window.document, 'inline-jest').parentNode;
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      <div
        class="c-video-player"
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

    const actual = queryByTestId(DOM.window.document, 'inline-jest').parentNode;
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      <div
        class="c-code-block"
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
