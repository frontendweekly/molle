const transformEnhancePostIframe = require('@frontendweekly/transform-enhance-post-iframe');
const transformEnhancePostCodeBlock = require('@frontendweekly/transform-enhance-post-code-block');
const transformEnhancePostImg = require('@frontendweekly/transform-enhance-post-img');

module.exports = function (eleventyConfig) {
  eleventyConfig.addTransform('enhancePostIframe', transformEnhancePostIframe);
  eleventyConfig.addTransform(
    'enhancePostCodeBlock',
    transformEnhancePostCodeBlock
  );
  eleventyConfig.addTransform('enhancePostImg', transformEnhancePostImg);
};
