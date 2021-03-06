module.exports = function (value = [], n) {
  if (value.length === 0 || !Array.isArray(value)) {
    return;
  }

  if (n < 0) {
    return value.slice(n);
  }

  return value.slice(0, n);
};
