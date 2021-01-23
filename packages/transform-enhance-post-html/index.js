const transformEnhancePostIframe = require('@frontendweekly/transform-enhance-post-iframe');
const transformEnhancePostCodeblock = require('@frontendweekly/transform-enhance-post-code-block');
const transformEnhancePostImg = require('@frontendweekly/transform-enhance-post-img');

module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.addTransform(
    'transformEnhancePostIframe',
    transformEnhancePostIframe
  );
  eleventyConfig.addTransform(
    'transformEnhancePostCodeblock',
    transformEnhancePostCodeblock
  );
  eleventyConfig.addTransform(
    'transformEnhancePostImg',
    transformEnhancePostImg
  );
};
