const md = require('@frontendweekly/eleventy-plugin-markdown');

module.exports = function markdown(value) {
  return md.render(value);
};
