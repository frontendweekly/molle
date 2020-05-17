const path = require('path');
const fs = require('fs-extra');

const saveCacheManifest = require('../saveCacheManifest');

const PUBLISH_DIR = path.resolve(__dirname, '__dist');
const CACHE_PATH = '../.cache';
const cacheDir = path.resolve(PUBLISH_DIR, CACHE_PATH);
const outputFile = 'cache-preview.json';
const fixture = [
  '/Users/studiomohawk/Sync/Hack/sixtysix/dist/previews/ka9kyr19/preview.png',
  '/Users/studiomohawk/Sync/Hack/sixtysix/dist/previews/ka9ij8ni/preview.png',
  '/Users/studiomohawk/Sync/Hack/sixtysix/dist/previews/k9ul5949/preview.png',
];

describe('saveCacheManifest', () => {
  const mockcache = {
    list: jest.fn(),
  };

  beforeEach(() => {
    mockcache.list.mockClear();
    fs.removeSync(`${cacheDir}`);
  });

  test('it should return list of file name in an array', () => {
    // Arrange
    const expected = ['ka9kyr19', 'ka9ij8ni', 'k9ul5949'];
    mockcache.list.mockReturnValueOnce(fixture);

    // Act
    saveCacheManifest(PUBLISH_DIR, mockcache, outputFile, CACHE_PATH);
    const actual = fs.readJSONSync(`${cacheDir}/${outputFile}`);
    // Assert
    expect(actual).toStrictEqual(expected);
  });
});
