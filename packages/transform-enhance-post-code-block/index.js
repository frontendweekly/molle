const {parseHTML} = require('linkedom');

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html');

module.exports = function (content, outputPath) {
  if (!shouldTransformHTML(outputPath)) {
    return content;
  }

  const {document} = parseHTML(content);

  const articleCodeBlocks = [
    ...document.querySelectorAll('.c-post pre[class]'),
  ];

  if (articleCodeBlocks.length) {
    articleCodeBlocks.forEach((codeblock) => {
      const container = document.createElement('div');
      container.classList.add('o-code-block');
      container.appendChild(codeblock.cloneNode(true));
      codeblock.replaceWith(container);
    });
  }

  return document.toString();
};
