const path = require('path');
const fs = require('fs-extra');
const signale = require('signale');

module.exports = (PUBLISH_DIR, cache, outputFile, cacheDirPath) => {
  const cacheManifestDir = path.resolve(PUBLISH_DIR, cacheDirPath);
  const cacheManifestPath = path.join(cacheManifestDir, outputFile);

  const files = cache.list();
  const sliceBySlash = (item) => item.split('/');
  const fileSlug = files.map(sliceBySlash).map((items) => items[items.length - 2]);

  fs.outputJsonSync(cacheManifestPath, fileSlug, {
    spaces: 2,
  });

  signale.success(`Cache manifest saved to ${cacheManifestPath}`);
  signale.info(`Cache file count: ${files.length}`);
};
