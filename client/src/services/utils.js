export const alphabetically = (a, b, key) => {
  if (key) {
    if (a[key] < b[key]) return -1;
    if (a[key] > b[key]) return 1;
  }

  if (a < b) return -1;
  if (a > b) return 1;

  return 0;
};

export const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

export const range = num => [...Array(num).keys()];

export const guid = () => {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }

  return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
};
