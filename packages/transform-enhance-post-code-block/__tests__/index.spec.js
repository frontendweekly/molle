const {DOMParser} = require('linkedom');
const SUT = require('../index');

test(`it should wrap pre[class] with .o-code-block container`, () => {
  // Arrange
  const content = `
        <div class="c-post">
          <pre class="inline-jest">I'm code block</pre>
        </div>
      `;
  const outputPath = `dummy.html`;
  // Act
  const output = SUT(content, outputPath);
  const document = new DOMParser().parseFromString(output, 'text/html');

  const actual = document.toString();
  // Assert
  expect(actual).toMatchInlineSnapshot(`
    "<!DOCTYPE html><html>
            <div class=\\"c-post\\">
              <div class=\\"o-code-block\\"><pre class=\\"inline-jest\\">I&#39;m code block</pre></div>
            </div>
          </html>"
  `);
});
