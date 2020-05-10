const path = require('path');

module.exports = {
  rootDir: path.join(__dirname, '..'),
  watchPlugins: ['jest-watch-select-projects'],
  setupFiles: ['jest-date-mock'],
  testPathIgnorePatterns: ['<rootDir>/__scaffold/'],
};
