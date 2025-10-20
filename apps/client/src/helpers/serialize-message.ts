import {
  imageExtensions,
  type TFile,
  type TMessageMetadata
} from '@sharkord/shared';
import { getFileUrl } from './get-file-url';

const serializeMessage = (
  content: string | null,
  metadata: TMessageMetadata[],
  files: TFile[]
) => {
  const serializedContent: string | null = content;

  if (!metadata && !files.length) return serializedContent ?? '';

  const serializedMetadata: string[] = [];

  metadata?.forEach((meta) => {
    const { mediaType, url } = meta;

    if (mediaType.includes('image') || url.match(/.png|.jpg|.jpeg/)) {
      if (meta?.images?.[0]) {
        serializedMetadata.push(`![${meta.title ?? ''}](${meta.images[0]})`);
      } else {
        serializedMetadata.push(`![${meta.title ?? ''}](${meta.url})`);
      }
    } else if (url.match(/youtube.com/)) {
      serializedMetadata.push(`<Youtube url="${meta.url}" />`);
    } else if (url.match(/twitter.com/) || url.match(/x.com/)) {
      serializedMetadata.push(`<Twitter url="${meta.url}" />`);
    }
  });

  files?.forEach((file) => {
    if (imageExtensions.includes(file.extension)) {
      const imageUrl = getFileUrl(file);

      serializedMetadata.push(`![${file.name}](${imageUrl})`);
    }
  });

  return `${serializedContent}\n${serializedMetadata.join('\n')}`;
};

export { serializeMessage };
