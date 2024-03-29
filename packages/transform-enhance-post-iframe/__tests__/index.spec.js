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
"
        <div class=\\"c-post\\">
          <div class=\\"o-video-player\\"><iframe allowfullscreen>I'm video</iframe></div>
        </div>
      "
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
"
        <div class=\\"c-post\\">
          <iframe>I'm video but no allowfullscreen</iframe>
        </div>
      "
`);
});
