const filterDateOrdinalSuffix = require('@frontendweekly/filter-date-ordinal-suffix');
const filterDateIso = require('@frontendweekly/filter-date-iso');
const transformHtmlMin = require('@frontendweekly/transform-htmlmin');
const transformEnhancePostHtml = require('@frontendweekly/transform-enhance-post-html');

module.exports = function (eleventyConfig) {
  eleventyConfig.addFilter('dateOrdinalSuffixFilter', filterDateOrdinalSuffix);
  eleventyConfig.addFilter('dateIsoFilter', filterDateIso);
  eleventyConfig.addTransform('htmlmin', transformHtmlMin);
  eleventyConfig.addTransform('enhancePostHtml', transformEnhancePostHtml);
};
