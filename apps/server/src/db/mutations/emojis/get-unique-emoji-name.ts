import { emojiExists } from '../../queries/emojis/emoji-exists';

const getUniqueEmojiName = async (baseName: string): Promise<string> => {
  const MAX_LENGTH = 24;
  let normalizedBase = baseName.toLowerCase().replace(/\s+/g, '_');

  if (normalizedBase.length > MAX_LENGTH - 3) {
    normalizedBase = normalizedBase.substring(0, MAX_LENGTH - 3);
  }

  let emojiName = normalizedBase.substring(0, MAX_LENGTH);
  let counter = 1;

  while (await emojiExists(emojiName)) {
    const suffix = `_${counter}`;
    const maxBaseLength = MAX_LENGTH - suffix.length;
    emojiName = `${normalizedBase.substring(0, maxBaseLength)}${suffix}`;
    counter++;
  }

  return emojiName;
};

export { getUniqueEmojiName };
