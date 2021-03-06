# MOLLE

A packs of Eleventy plugins that I use on my blogs.

## Installation

Available on [GitHub Package](https://github.com/orgs/frontendweekly/packages).

```
npm install @frontendweekly/molle --save
```

Open up your Eleventy config file (probably `.eleventy.js`) and use addPlugin:

```
const molle = require('@frontendweekly/molle');
module.exports = function (config) {
  config.addPlugin(molle);
};
```

## Usage

### Filters: date related

- `dateIsoFilter` — returns `date.toISOString()`
- `dateOrdinalSuffixFilter` — returns date as 28th April 2020

```
<time datetime="{{ date | dateIsoFilter }}"
      class="dt-published">{{ date | dateOrdinalSuffixFilter }}</time>
```

which yields

```
<time datetime="2020-05-02T00:00:00.000Z" class="dt-published">2nd May 2020</time>
```

### Filters: array related

- `tagsToSentence` — when tags are given this yields something like `<a href="${ slug(tag) }">tag</a>, <a href="${ slug(tag) }">tag</a> and <a href="${ slug(tag) }">tag</a>`
- `head` — returns specified head from array

### Filters: misc

- `markdownFilter` — converts markdown into HTML
- `jsonify` — returns `JSON.stringify(value)`

### Transforms: html related

#### `htmlmin`

This minifies HTML when `ELEVENTY_ENV=production`

#### `enhancePostHtml`

This enhances HTML within `.c-post` class as follow:

- Adds `loading="lazy"` attribute to all `<img>` tags
- Wraps `<img>` with `title` attribute with `<figure>` and inserts `<figcaption>${value of title attribute}</figcaption>`
- Inserts anchor links to h2, h3, h4, h5 and h6
- Wraps `<iframe>` with `allowfullscreen` attribute with `<div class="c-video-player">`
- Wrap code block with `<div class="c-code-block">`
