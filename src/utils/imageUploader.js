// Bulletproof Self-Contained Photo Processing Utility for Stivi & Emma
import { compressImage } from './imageCompressor';

export const uploadImageToCloud = async (file) => {
  try {
    // Produce crisp, ultra-lightweight self-contained JPEG data URL (~18KB)
    const compressedUrl = await compressImage(file, 450, 450, 0.62);
    return compressedUrl;
  } catch (e) {
    console.log('Image compression error:', e);
    return null;
  }
};
