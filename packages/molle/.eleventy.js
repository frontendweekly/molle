const filterDateOrdinalSuffix = require('../filter-date-with-ordinal-suffix');
const filterDateIso = require('../filter-date-iso');
const transformHtmlMin = require('../transform-htmlmin');
const transformEnhancePostHtml = require('../transform-enhance-post-html');

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter('dateOrdinalSuffixFilter', filterDateOrdinalSuffix);
  eleventyConfig.addFilter('dateIsoFilter', filterDateIso);
  eleventyConfig.addTransform('htmlmin', transformHtmlMin);
  eleventyConfig.addTransform('enhancePostHtml', transformEnhancePostHtml);
};
