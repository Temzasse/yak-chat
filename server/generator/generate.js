import dictionary from './dictionary';

const _getRandomIndex = arrayLength => {
  return Math.floor(Math.random() * arrayLength);
};

const generateChannelId = () => {
  const { adjectives, nouns } = dictionary;
  const adjective = adjectives[_getRandomIndex(adjectives.length)];
  const noun = nouns[_getRandomIndex(nouns.length)];
  const generatedChannelId = `${adjective}-${noun}`;
  // TODO Verify that this channel id is not used already
  return generatedChannelId;
};

export default generateChannelId;
