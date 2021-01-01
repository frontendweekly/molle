const markdown = require('../index');

describe('filter-markdown', () => {
  test('it should convert URL to link', () => {
    // Arrange
    const content = `My http://example.com site`;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<p>My <a href=\\"http://example.com\\">http://example.com</a> site</p>
      "
    `);
  });

  test('it should allow html', () => {
    // Arrange
    const content = `My <div>http://example.com</div> site`;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<p>My <div><a href=\\"http://example.com\\">http://example.com</a></div> site</p>
      "
    `);
  });

  test('it should convert \\n in paragraphs into <br>', () => {
    // Arrange
    const content = `My <div>http://example.com</div> site
your <div>http://example.com</div> site`;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<p>My <div><a href=\\"http://example.com\\">http://example.com</a></div> site<br>
      your <div><a href=\\"http://example.com\\">http://example.com</a></div> site</p>
      "
    `);
  });

  test('it should do typographic replacements', () => {
    // Arrange
    const content = `(c)(tm)(r)+-(p)...????????-- → &ndash;`;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<p>©™®±§…???-- → –</p>
      "
    `);
  });

  test('it should render definition list', () => {
    // Arrange
    const content = `Term 1
: Definition 1
`;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<dl>
      <dt>Term 1</dt>
      <dd>Definition 1</dd>
      </dl>
      "
    `);
  });

  test('it should render class, id and data- attr', () => {
    // Arrange
    const content = `# I'm id{:#thisisid}
      paragraph *style me*{:.red} more text
      paragraph **style me**{:data-rad=true} more text
    `;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<h1 id=\\"thisisid\\">I’m id <a class=\\"o-heading-link\\" href=\\"#thisisid\\">#</a></h1>
      <p>paragraph <em class=\\"red\\">style me</em> more text<br>
      paragraph <strong data-rad=\\"true\\">style me</strong> more text</p>
      "
    `);
  });

  test('it should have anchor', () => {
    // Arrange
    const content = `## I'd have an anchor link`;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<h2 id=\\"id-have-an-anchor-link\\">I’d have an anchor link <a class=\\"o-heading-link\\" href=\\"#id-have-an-anchor-link\\">#</a></h2>
      "
    `);
  });

  test('it should have footnote', () => {
    // Arrange
    const content = `
    Here is a footnote reference,[^1] and another.[^longnote]
[^1]: Here is the footnote.
[^longnote]: Here's one with multiple blocks.
    `;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<p>Here is a footnote reference,<sup class=\\"footnote-ref\\"><a href=\\"#fn1\\" id=\\"fnref1\\">[1]</a></sup> and another.<sup class=\\"footnote-ref\\"><a href=\\"#fn2\\" id=\\"fnref2\\">[2]</a></sup></p>

      <section class=\\"o-footnotes\\">
      <ol class=\\"o-footnotes__list\\">
      <li id=\\"fn1\\" class=\\"footnote-item\\"><p>Here is the footnote. <a href=\\"#fnref1\\" class=\\"footnote-backref\\">↩︎</a></p>
      </li>
      <li id=\\"fn2\\" class=\\"footnote-item\\"><p>Here’s one with multiple blocks. <a href=\\"#fnref2\\" class=\\"footnote-backref\\">↩︎</a></p>
      </li>
      </ol>
      </section>
      "
    `);
  });

  test('it should convert block quotes sementically', () => {
    // Arrange
    const content = `> That's one small step for [a] man, one giant leap for mankind.
> — Neil Armstrong (1969, July 21)
    `;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<figure class=\\"c-blockquote\\">
      <blockquote>
      <p>That’s one small step for [a] man, one giant leap for mankind.</p>
      </blockquote>
      <figcaption class=\\"c-blockquote__attribution\\">— Neil Armstrong (1969, July 21)</figcaption>
      </figure>
      "
    `);
  });

  test('it should NOT convert indented code blocks', () => {
    // Arrange
    const content = `# Should not be code block
  const codeblock = require('code');
  codeblock.render();
    `;
    // Act
    const actual = markdown(content);
    // Assert
    expect(actual).toMatchInlineSnapshot(`
      "<h1 id=\\"should-not-be-code-block\\">Should not be code block <a class=\\"o-heading-link\\" href=\\"#should-not-be-code-block\\">#</a></h1>
      <p>const codeblock = require(‘code’);<br>
      codeblock.render();</p>
      "
    `);
  });
});
