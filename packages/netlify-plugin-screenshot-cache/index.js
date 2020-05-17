const saveCacheManifest = require('./saveCacheManifest');
const saveScreenshotToCache = require('./saveScreenshotToCache');

module.exports = {
  async onPreBuild({
    constants: {PUBLISH_DIR},
    utils: {cache},
    inputs: {outputFile, cacheDirPath},
  }) {
    saveCacheManifest(PUBLISH_DIR, cache, outputFile, cacheDirPath);
  },
  async onPostBuild({constants: {PUBLISH_DIR}, utils: {cache}, inputs: {screenshotDir}}) {
    saveScreenshotToCache(PUBLISH_DIR, cache, screenshotDir);
  },
};
