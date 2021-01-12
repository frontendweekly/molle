const fs = require('fs');
const path = require('path');

/**
 * @param {string} path
 * @returns {boolean} returns true when pathExist
 */
async function pathExist(path) {
  try {
    await fs.promises.access(path);
    return true;
  } catch (_) {
    return false;
  }
}

module.exports = {
  async onPreBuild({constants, utils, inputs}) {
    const {PUBLISH_DIR} = constants;
    const {cache} = utils;

    const files = await cache.list();

    if (files.length) {
      const cacheManifestDir = path.resolve(PUBLISH_DIR, inputs.cacheDirPath);
      const cacheManifestPath = path.join(cacheManifestDir, inputs.outputFile);

      if (!(await pathExist(cacheManifestDir))) {
        console.log(`${cacheManifestDir} isn't there so let's make one.`);
        await fs.promises.mkdir(cacheManifestDir);
      }

      const fileSlug = files
        .map((item) => item.split('/'))
        .map((items) => items[items.length - 2]);

      await fs.promises.writeFile(
        cacheManifestPath,
        JSON.stringify(fileSlug, null, 2),
        'utf-8'
      );

      console.log(`Cache manifest saved to ${cacheManifestPath}`);
      console.log(`Cache file count: ${files.length}`);
    } else {
      console.log('There is no cache available for now.');
    }
  },
  async onPostBuild({
    constants: {PUBLISH_DIR},
    utils: {cache},
    inputs: {screenshotDir},
  }) {
    const cacheDir = path.normalize(`${PUBLISH_DIR}/${screenshotDir}`);

    if (await cache.save(`${cacheDir}`)) {
      console.log(`Stored the ${cacheDir} to speed up future builds.`);
    } else {
      console.log('Nothing found.');
    }
  },
};
