const SUT = require('../index');

describe('filter-tags-to-sentence', () => {
  test('it should transform array to sentence', () => {
    // Arrange
    const array = ['apple', 'banana', 'pineapple'];
    // Act
    const actual = SUT(array); // ?
    // Assert
    const expected = `<a href="/tags/apple">apple</a>, <a href="/tags/banana">banana</a> and <a href="/tags/pineapple">pineapple</a>`;
    expect(actual).toEqual(expected);
  });

  test('it should still transform array to sentence', () => {
    // Arrange
    const array = ['apple', 'banana'];
    // Act
    const actual = SUT(array); // ?
    // Assert
    const expected = `<a href="/tags/apple">apple</a> and <a href="/tags/banana">banana</a>`;
    expect(actual).toEqual(expected);
  });

  test('it should still transform array to link', () => {
    // Arrange
    const array = ['apple'];
    // Act
    const actual = SUT(array); // ?
    // Assert
    const expected = `<a href="/tags/apple">apple</a>`;
    expect(actual).toEqual(expected);
  });

  test('it should do nothing when array length is zero', () => {
    // Arrange
    const array = [];
    // Act
    const actual = SUT(array); // ?
    // Assert
    const expected = undefined;
    expect(actual).toEqual(expected);
  });

  test('it should do nothing when value is not array', () => {
    // Arrange
    const array = 'apple';
    // Act
    const actual = SUT(array); // ?
    // Assert
    const expected = undefined;
    expect(actual).toEqual(expected);
  });
});
