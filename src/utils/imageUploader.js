// High-Speed Direct Image Cloud Hosting Utility for Stivi & Emma using FreeImageHost CDN

import { compressImage } from './imageCompressor';

const FREEIMAGE_API_KEY = '6d207e02198a847aa98d0a2a901485a5';

export const uploadImageToCloud = async (file) => {
  try {
    // 1. Compress image to high-quality crisp 800px JPEG base64
    const compressedDataUrl = await compressImage(file, 800, 800, 0.75);

    // Extract raw base64 string without data URI prefix
    const base64Content = compressedDataUrl.replace(/^data:image\/\w+;base64,/, '');

    // 2. Upload to global CDN (FreeImageHost)
    const formData = new FormData();
    formData.append('key', FREEIMAGE_API_KEY);
    formData.append('action', 'upload');
    formData.append('source', base64Content);
    formData.append('format', 'json');

    const res = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.image && data.image.url) {
        return data.image.url;
      }
    }
  } catch (err) {
    console.log('CDN upload error:', err);
  }

  // Backup fallback: try direct file upload if base64 upload fails
  try {
    const formData = new FormData();
    formData.append('key', FREEIMAGE_API_KEY);
    formData.append('action', 'upload');
    formData.append('source', file);
    formData.append('format', 'json');

    const res = await fetch('https://freeimage.host/api/1/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.image && data.image.url) {
        return data.image.url;
      }
    }
  } catch (e) {
    console.log('Fallback file upload error:', e);
  }

  // Emergency fallback
  return await compressImage(file, 600, 600, 0.5);
};
