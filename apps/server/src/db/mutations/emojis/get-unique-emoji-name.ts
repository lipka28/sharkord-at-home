import { emojiExists } from '../../queries/emojis/emoji-exists';

const getUniqueEmojiName = async (baseName: string): Promise<string> => {
  let emojiName = baseName.toLowerCase().replace(/\s+/g, '_');
  let counter = 1;

  while (await emojiExists(emojiName)) {
    emojiName = `${baseName.toLowerCase().replace(/\s+/g, '_')}_${counter}`;
    counter++;
  }

  return emojiName;
};

export { getUniqueEmojiName };
