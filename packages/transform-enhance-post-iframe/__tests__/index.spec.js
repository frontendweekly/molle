const SUT = require('../index');

test(`it should wrap iframe with .o-video-player container`, () => {
  // Arrange
  const content = `
        <div class="c-post">
          <iframe allowfullscreen>I'm video</iframe>
        </div>
      `;
  const outputPath = `dummy.html`;
  // Act
  const output = SUT(content, outputPath);

  // Assert
  expect(output).toMatchInlineSnapshot(`
    "<!DOCTYPE html><html>
            <div class=\\"c-post\\">
              <div class=\\"o-video-player\\"><iframe allowfullscreen>I&#39;m video</iframe></div>
            </div>
          </html>"
  `);
});

test(`it should NOT wrap iframe with .o-video-player container`, () => {
  // Arrange
  const content = `
        <div class="c-post">
          <iframe>I'm video but no allowfullscreen</iframe>
        </div>
      `;
  const outputPath = `dummy.html`;
  // Act
  const output = SUT(content, outputPath);

  // Assert
  expect(output).toMatchInlineSnapshot(`
    "<!DOCTYPE html><html>
            <div class=\\"c-post\\">
              <iframe>I&#39;m video but no allowfullscreen</iframe>
            </div>
          </html>"
  `);
});
