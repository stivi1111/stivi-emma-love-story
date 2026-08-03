// High-Speed Direct Image Cloud Hosting Utility for Stivi & Emma
import { compressImage } from './imageCompressor';

export const uploadImageToCloud = async (file) => {
  try {
    // 1. Compress image on canvas to crisp 1000px JPEG
    const compressedDataUrl = await compressImage(file, 1000, 1000, 0.78);

    // Convert data URL to Blob for HTTP multipart upload
    const response = await fetch(compressedDataUrl);
    const blob = await response.blob();

    // 2. Upload to permanent CDN (catbox.moe)
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', blob, `photo_${Date.now()}.jpg`);

    const res = await fetch('https://catbox.moe/user/api.php', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      const cdnUrl = await res.text();
      if (cdnUrl && cdnUrl.startsWith('http')) {
        return cdnUrl.trim();
      }
    }
  } catch (err) {
    console.log('CDN upload error, falling back to optimized data URL:', err);
  }

  // Fallback to optimized compressed data URL if CDN is unreachable
  return await compressImage(file, 800, 800, 0.65);
};
