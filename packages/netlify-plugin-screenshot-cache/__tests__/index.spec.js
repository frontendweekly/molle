const path = require('path');
const fs = require('fs');

const SUT = require('../index');

describe('onPreBuild', () => {
  const mockcache = {
    cache: {
      list: jest.fn(),
    },
  };

  afterEach(() => {
    mockcache.cache.list.mockClear();
  });

  test('it should return list of file name in an array', async () => {
    // Arrange
    const PUBLISH_DIR = path.resolve(__dirname, '.');
    const CACHE_PATH = '.cache';
    const inputs = {
      cacheDirPath: path.resolve(PUBLISH_DIR, CACHE_PATH),
      outputFile: 'cache-preview.json',
    }; // ?

    const fixture = [
      '/Users/studiomohawk/Sync/Hack/sixtysix/dist/previews/ka9kyr19/preview.png',
      '/Users/studiomohawk/Sync/Hack/sixtysix/dist/previews/ka9ij8ni/preview.png',
      '/Users/studiomohawk/Sync/Hack/sixtysix/dist/previews/k9ul5949/preview.png',
    ];

    mockcache.cache.list.mockReturnValueOnce(fixture);

    // Act
    await SUT.onPreBuild({constants: PUBLISH_DIR, utils: mockcache, inputs: inputs});
    const actual = await fs.promises.readFile(
      `${inputs.cacheDirPath}/${inputs.outputFile}`
    ); // ?

    // Assert
    expect(
      JSON.parse(
        actual,
        `
        Array [
          "ka9kyr19",
          "ka9ij8ni",
          "k9ul5949",
        ]
      `
      )
    ).toMatchInlineSnapshot(`
      Array [
        "ka9kyr19",
        "ka9ij8ni",
        "k9ul5949",
      ]
    `);
  });
});
