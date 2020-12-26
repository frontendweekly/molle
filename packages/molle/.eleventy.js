const filterDateOrdinalSuffix = require('@frontendweekly/filter-date-ordinal-suffix');
const filterDateIso = require('@frontendweekly/filter-date-iso');
const filterHead = require('@frontendweekly/filter-head');
const filterTagsToSentence = require('@frontendweekly/filter-tags-to-sentence');
const filterMarkdown = require('@frontendweekly/filter-markdown');

const transformHtmlMin = require('@frontendweekly/transform-htmlmin');
const transformEnhancePostHtml = require('@frontendweekly/transform-enhance-post-html');

const md = require('@frontendweekly/eleventy-plugin-markdown');

module.exports = function (eleventyConfig, options = {}) {
  eleventyConfig.addFilter('dateOrdinalSuffixFilter', filterDateOrdinalSuffix);
  eleventyConfig.addFilter('dateIsoFilter', filterDateIso);
  eleventyConfig.addFilter('head', filterHead);
  eleventyConfig.addFilter('tagsToSentence', filterTagsToSentence);
  eleventyConfig.addFilter('markdownFilter', filterMarkdown);
  eleventyConfig.addFilter('jsonify', (value) => JSON.stringify(value));

  eleventyConfig.addTransform('htmlmin', transformHtmlMin);
  eleventyConfig.addTransform('enhancePostHtml', transformEnhancePostHtml);
  eleventyConfig.setLibrary('md', md);
};
