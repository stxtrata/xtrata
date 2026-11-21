import { decodeDocumentBytes } from './read-document.js';
self.onmessage = async ({ data }) => {
  try {
    self.postMessage({ result: await decodeDocumentBytes(data.bytes, { limits: data.limits }) });
  } catch (error) {
    self.postMessage({
      error: {
        code: error.code || 'INVALID_DOCUMENT',
        message: error.message,
        path: error.path || ''
      }
    });
  }
};
