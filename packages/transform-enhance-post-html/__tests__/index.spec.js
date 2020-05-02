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
    const expected = `dummy content`;
    expect(actual).toEqual(expected);
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
    const actual = queryByTestId(DOM.window.document, 'inline-jest').parentNode.tagName;
    // Assert
    expect(actual).toEqual('FIGURE');
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
    expect(actual).toBeTruthy();
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

    const actual = queryByTestId(DOM.window.document, 'inline-jest').parentNode.className;
    // Assert
    expect(actual).toEqual('c-video-player');
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

    const actual = queryByTestId(DOM.window.document, 'inline-jest').parentNode.className;
    // Assert
    expect(actual).toEqual('c-code-block');
  });
});