# `transform-enhance-post-code-block`

An Eleventy Transform which wraps code blocks(`pre[class]`) with `<div class="o-code-block">`.

NOTE: It looks for `pre[class]` within `.c-post` class.

## Usage

At your `.eleventy.js`, import this Transform.

```
const transformEnhancePostCodeBlock = require('@frontendweekly/transform-enhance-post-code-block');

module.exports = function (eleventyConfig) {
eleventyConfig.addTransform('transformEnhancePostCodeBlock', transformEnhancePostCodeBlock);
...
}
```
