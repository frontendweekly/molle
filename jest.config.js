const {defaults} = require('jest-config');
module.exports = {
  setupFiles: ['jest-date-mock'],
  projects: ['<rootDir>/packages/*'],
};
