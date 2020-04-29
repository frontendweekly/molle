const {advanceTo, clear} = require('jest-date-mock');

const dateISO = require('../index');

describe('dateISO', () => {
  test('it should output date in ISO format', () => {
    // Arrange
    advanceTo(new Date(2020, 3, 1, 0, 0, 0));
    const date = Date.now();
    // Act
    const actual = dateISO(date);
    // Assert
    const expected = `2020-03-31T15:00:00.000Z`;
    expect(actual).toEqual(expected);
  });
});
