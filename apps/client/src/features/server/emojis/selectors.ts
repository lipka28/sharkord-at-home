import type { IRootState } from '@/features/store';
import { getFileUrl } from '@/helpers/get-file-url';
import { createSelector } from '@reduxjs/toolkit';
import type { EmojiItem } from '@tiptap/extension-emoji';

export const emojisSelector = (state: IRootState) => state.server.emojis;

// const customEmojis: EmojiItem[] = [
//   {
//     name: "test",
//     shortcodes: ["test"],
//     tags: ["animal", "nature", "howl"],
//     group: "Custom",
//     fallbackImage: "https://i.imgur.com/890KTlM.jpeg",
//   },
// ];

export const customEmojisSelector = createSelector(
  [emojisSelector],
  (emojis) => {
    const items: EmojiItem[] = emojis.map((emoji) => ({
      name: emoji.name,
      shortcodes: [emoji.name],
      tags: ['custom'],
      group: 'Custom',
      fallbackImage: getFileUrl(emoji.file)
    }));

    return items;
  }
);
