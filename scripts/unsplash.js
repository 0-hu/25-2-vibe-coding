// Unsplash Source 이미지 로딩 모듈

import { getCategoryKeywords } from './categories.js';

const UNSPLASH_SOURCE_BASE = 'https://source.unsplash.com';
const IMAGE_WIDTH = 800;
const IMAGE_HEIGHT = 1000;

function generateSig() {
  return Math.random().toString(36).substring(2, 15);
}

function createUnsplashSourceUrl(keywords, sig) {
  const query = keywords.join(',');
  if (query) {
    return `${UNSPLASH_SOURCE_BASE}/random/${IMAGE_WIDTH}x${IMAGE_HEIGHT}?${query}&sig=${sig}`;
  }
  return `${UNSPLASH_SOURCE_BASE}/random/${IMAGE_WIDTH}x${IMAGE_HEIGHT}?sig=${sig}`;
}

function fetchImage(keywords, sig) {
  const url = createUnsplashSourceUrl(keywords, sig);

  return new Promise((resolve, reject) => {
    const img = new Image();
    const timeout = setTimeout(() => {
      reject(new Error('Image load timeout'));
    }, 10000);

    img.onload = () => {
      clearTimeout(timeout);
      resolve({
        id: sig,
        urlSmall: url,
        urlFull: url,
        sourceLink: 'https://unsplash.com',
      });
    };

    img.onerror = () => {
      clearTimeout(timeout);
      reject(new Error('Failed to load image'));
    };

    img.src = url;
  });
}

export async function fetchImagesForCategory(category, count = 32, onProgress = null) {
  const keywords = getCategoryKeywords(category);
  const images = [];
  const maxRetries = 3;
  let attempts = 0;

  while (images.length < count && attempts < count * maxRetries) {
    const sig = generateSig();
    try {
      const image = await fetchImage(keywords, sig);

      // Check for duplicates
      const isDuplicate = images.some((img) => img.urlSmall === image.urlSmall);
      if (!isDuplicate) {
        images.push(image);
        if (onProgress) {
          onProgress(images.length, count);
        }
      }
    } catch (error) {
      console.warn('Failed to fetch image:', error);
    }
    attempts++;
  }

  if (images.length < count) {
    throw new Error(`Only loaded ${images.length} out of ${count} images`);
  }

  return images;
}

export async function preloadImages(images, onProgress = null) {
  let loaded = 0;
  const promises = images.map((image) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        loaded++;
        if (onProgress) {
          onProgress(loaded, images.length);
        }
        resolve();
      };
      img.onerror = () => {
        loaded++;
        if (onProgress) {
          onProgress(loaded, images.length);
        }
        resolve();
      };
      img.src = image.urlSmall;
    });
  });

  await Promise.all(promises);
}
