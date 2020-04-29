const htmlmin = require('html-minifier');

const shouldTransformHTML = (outputPath) =>
  outputPath && outputPath.endsWith('.html') && process.env.ELEVENTY_ENV === 'production';

module.exports = function (content, outputPath) {
  if (shouldTransformHTML(outputPath)) {
    return htmlmin.minify(content, {
      useShortDoctype: true,
      removeComments: true,
      collapseWhitespace: true,
      minifyCSS: true,
    });
  }
  return content;
};
