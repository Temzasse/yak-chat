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

export const generateGradient = () => {
  const hexValues = [
    '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e',
  ];

  function hexcolor() {
    return range(6).reduce(acc => {
      const i = Math.round(Math.random() * 14);
      return `${acc}${hexValues[i]}`;
    }, '#');
  }

  const c1 = hexcolor();
  const c2 = hexcolor();
  const angle = Math.round(Math.random() * 360);

  return `linear-gradient(${angle}deg, ${c1}, ${c2})`;
};

const gradientsByUser = {};

export const getAvatarGradient = userId => {
  const existing = gradientsByUser[userId];
  if (existing) return existing;

  const gradient = generateGradient();
  gradientsByUser[userId] = gradient;

  return gradient;
};
