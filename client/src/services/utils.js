export const alphabetically = (a, b, key) => {
  if (key) {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
  }

  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
};

export const foo = 'bar';
