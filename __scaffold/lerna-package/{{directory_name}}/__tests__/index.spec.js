const {advanceTo, clear} = require('jest-date-mock');

const SUT = require('../index');

describe('{{directory_name}}', () => {
  test('it should FILLME', () => {
    // Arrange
    advanceTo(new Date(2020, 3, 1, 0, 0, 0));
    const date = Date.now();
    // Act
    const actual = SUT(date);
    // Assert
    const expected = `2020-03-31T15:00:00.000Z`;
    expect(actual).toEqual(expected);
  });
});
