import { SessionStorageKey } from '@/types';
import { UploadHeaders, type TTempFile } from '@sharkord/shared';
import { getUrlFromServer } from './get-file-url';

const uploadFile = async (file: File) => {
  const url = getUrlFromServer();

  const res = await fetch(`${url}/upload`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/octet-stream',
      [UploadHeaders.TYPE]: file.type,
      [UploadHeaders.CONTENT_LENGTH]: file.size.toString(),
      [UploadHeaders.ORIGINAL_NAME]: file.name,
      [UploadHeaders.TOKEN]:
        sessionStorage.getItem(SessionStorageKey.TOKEN) ?? ''
    },
    body: file
  });

  if (!res.ok) throw new Error('Upload failed');

  const tempFile: TTempFile = await res.json();

  return tempFile;
};

const uploadFiles = async (files: File[]) => {
  const uploadedFiles: TTempFile[] = [];

  for (const file of files) {
    const uploadedFile = await uploadFile(file);

    uploadedFiles.push(uploadedFile);
  }

  return uploadedFiles;
};

export { uploadFile, uploadFiles };
