import type { TEmojiItem } from '@/components/tiptap-input/types';
import { Input } from '@/components/ui/input';
import type { EmojiItem } from '@tiptap/extension-emoji';
import { useState } from 'react';

interface CustomEmojiTabProps {
  customEmojis: EmojiItem[];
  onEmojiSelect: (emoji: TEmojiItem) => void;
}

const CustomEmojiTab = ({
  customEmojis,
  onEmojiSelect
}: CustomEmojiTabProps) => {
  const [search, setSearch] = useState('');

  // Convert custom emojis to TEmojiItem format
  const convertedEmojis: TEmojiItem[] = customEmojis.map((emoji) => ({
    name: emoji.name,
    shortcodes: emoji.shortcodes,
    fallbackImage: emoji.fallbackImage,
    emoji: emoji.emoji
  }));

  // Filter emojis based on search
  const filteredEmojis = convertedEmojis.filter(
    (emoji) =>
      emoji.name.toLowerCase().includes(search.toLowerCase()) ||
      emoji.shortcodes.some((shortcode) =>
        shortcode.toLowerCase().includes(search.toLowerCase())
      )
  );

  // No grouping - use filtered emojis directly

  const handleEmojiClick = (emoji: TEmojiItem) => {
    onEmojiSelect(emoji);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-3 border-b">
        <Input
          placeholder="Search custom emojis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="h-9"
        />
      </div>
      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="p-3">
          {customEmojis.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              No custom emojis available
            </div>
          ) : filteredEmojis.length === 0 ? (
            <div className="text-center text-muted-foreground py-6">
              No emojis found
            </div>
          ) : (
            <div className="grid grid-cols-8 gap-1 w-full max-w-full">
              {filteredEmojis.map((emoji) => (
                <button
                  key={`${emoji.name}-${emoji.shortcodes[0]}`}
                  onClick={() => handleEmojiClick(emoji)}
                  className="w-8 h-8 flex items-center justify-center hover:bg-accent rounded-sm transition-colors shrink-0"
                  title={`${emoji.name} (${emoji.shortcodes[0]})`}
                >
                  {emoji.emoji ? (
                    <span className="text-lg">{emoji.emoji}</span>
                  ) : emoji.fallbackImage ? (
                    <img
                      src={emoji.fallbackImage}
                      alt={emoji.name}
                      className="w-5 h-5 object-contain"
                    />
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      {emoji.shortcodes[0]}
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { CustomEmojiTab };
