const path = require('path');
const signale = require('signale');

module.exports = async (PUBLISH_DIR, cache, screenshotDir) => {
  const getCacheDirs = (PUBLISH_DIR) => path.normalize(`${PUBLISH_DIR}/${screenshotDir}`);
  const cacheDir = getCacheDirs(PUBLISH_DIR);

  if (await cache.save(cacheDir)) {
    signale.success(`Stored the ${cacheDir} to speed up future builds.`);
  } else {
    signale.log('Nothing found.');
  }
};
