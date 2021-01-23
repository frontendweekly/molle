# `transform-enhance-post-iframe`

An Eleventy Transform which wraps `iframe` with `allowfullscreen` attribute with `<div class="o-video-player">`

NOTE: It looks for `iframe[allowfullscreen]` within `.c-post` class.

## Usage

At your `.eleventy.js`, import this Transform.

```
const transformEnhancePostIframe = require('@frontendweekly/@frontendweekly/transform-enhance-post-iframe');

module.exports = function (eleventyConfig) {
  eleventyConfig.addTransform('transformEnhancePostIframe', transformEnhancePostIframe);
  ...
}
```
