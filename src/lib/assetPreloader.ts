/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Asset Imports
import neonPartyVideo from '../assets/videos/Chibi DJ Neon Party Animation.mp4';
import rouletteBgVideo from '../assets/videos/Finger Roulette Background Animation.mp4';
import spectrumVideo from '../assets/videos/Music Visualizer Spectrum Circle Animated.mp4';

import rouletteBgImage from '../assets/images/Finger Roulette Background.webp';
import chibiFingersGame from '../assets/images/Chibi Fingers Game.webp';
import chibiSpinningBottle from '../assets/images/Chibi Spinning Bottle.webp';
import chibiBombGame from '../assets/images/Chibi Bomb Game.webp';
import pickuPartyLogo from '../assets/images/PICK\'U PARTY LOGO E01.webp';
import pickuPartyIcon from '../assets/images/PICK\'U PARTY APP ICON.webp';
import btl001 from '../assets/images/Btl_E_001.webp';
import btl002 from '../assets/images/Btl_E_002.webp';
import btl003 from '../assets/images/Btl_E_003.webp';
import btl004 from '../assets/images/Btl_E_004.webp';

// In-Memory Blob URL registry (original URL -> blob: URL)
const assetBlobMap = new Map<string, string>();
let isLoadedFlag = false;

export function getAssetUrl(originalUrl: string): string {
  if (!originalUrl) return '';
  return assetBlobMap.get(originalUrl) || originalUrl;
}

export function isAssetsLoaded(): boolean {
  return isLoadedFlag;
}

interface PreloadItem {
  name: string;
  url: string;
  type: 'video' | 'image';
  description: string;
}

const PRELOAD_QUEUE: PreloadItem[] = [
  {
    name: 'Party DJ Animation',
    url: neonPartyVideo,
    type: 'video',
    description: 'Buffering Chibi DJ Neon Party Video (1/3)...',
  },
  {
    name: 'Roulette Countdown Video',
    url: rouletteBgVideo,
    type: 'video',
    description: 'Buffering Finger Roulette Dynamic Animation (2/3)...',
  },
  {
    name: 'Spectrum Visualizer Video',
    url: spectrumVideo,
    type: 'video',
    description: 'Buffering Music Visualizer Spectrum Video (3/3)...',
  },
  {
    name: 'Roulette Background Image',
    url: rouletteBgImage,
    type: 'image',
    description: 'Decoding Ultra-HD Roulette Background...',
  },
  {
    name: 'Chibi Fingers Game',
    url: chibiFingersGame,
    type: 'image',
    description: 'Loading Finger Roulette Game Panel...',
  },
  {
    name: 'Chibi Spinning Bottle',
    url: chibiSpinningBottle,
    type: 'image',
    description: 'Loading Bottle Spin Game Panel...',
  },
  {
    name: 'Chibi Bomb Game',
    url: chibiBombGame,
    type: 'image',
    description: 'Loading Kaboom Game Panel...',
  },
  {
    name: 'Picku Party Logo',
    url: pickuPartyLogo,
    type: 'image',
    description: 'Pre-rendering Specular Logo Art...',
  },
  {
    name: 'Picku Party App Icon',
    url: pickuPartyIcon,
    type: 'image',
    description: 'Buffering UI Badges & App Icons...',
  },
  {
    name: 'Neon Bottle Classic',
    url: btl001,
    type: 'image',
    description: 'Decoding Neon Bottle Sprites (1/4)...',
  },
  {
    name: 'Neon Bottle Cyber',
    url: btl002,
    type: 'image',
    description: 'Decoding Neon Bottle Sprites (2/4)...',
  },
  {
    name: 'Neon Bottle Laser',
    url: btl003,
    type: 'image',
    description: 'Decoding Neon Bottle Sprites (3/4)...',
  },
  {
    name: 'Neon Bottle Matrix',
    url: btl004,
    type: 'image',
    description: 'Decoding Neon Bottle Sprites (4/4)...',
  },
];

/**
 * Preload all video and image assets into browser Blob URLs.
 * Videos loaded as blob: URLs live in local memory; seeking, playbackRate changes,
 * and restarts will have 0ms network latency, zero buffering, and zero blank frames.
 */
export async function preloadAllAssets(
  onProgress?: (progress: number, statusText: string) => void
): Promise<void> {
  if (isLoadedFlag) {
    onProgress?.(100, 'Assets already buffered and ready!');
    return;
  }

  const total = PRELOAD_QUEUE.length;
  let completed = 0;

  onProgress?.(5, 'Initializing memory buffer & audio engine...');

  // Try to use CacheStorage if supported for persistent local caching
  let cache: Cache | null = null;
  try {
    if (typeof window !== 'undefined' && 'caches' in window) {
      cache = await caches.open('picku-party-asset-cache-v1');
    }
  } catch {
    // CacheStorage not allowed in some sandboxed iframes, fallback gracefully to fetch
    cache = null;
  }

  // Preload items sequentially or in small parallel batches to avoid main thread contention
  for (const item of PRELOAD_QUEUE) {
    try {
      let blob: Blob | null = null;

      if (cache) {
        try {
          const cachedResponse = await cache.match(item.url);
          if (cachedResponse) {
            blob = await cachedResponse.blob();
          }
        } catch {
          blob = null;
        }
      }

      if (!blob) {
        const response = await fetch(item.url);
        if (response.ok) {
          if (cache) {
            try {
              await cache.put(item.url, response.clone());
            } catch {
              // ignore cache put errors
            }
          }
          blob = await response.blob();
        }
      }

      if (blob) {
        // Create in-memory object URL for zero-buffering playback
        const blobUrl = URL.createObjectURL(blob);
        assetBlobMap.set(item.url, blobUrl);

        // If it's an image, decode it immediately into GPU memory
        if (item.type === 'image') {
          const img = new Image();
          img.src = blobUrl;
          if ('decode' in img) {
            await img.decode().catch(() => {});
          }
        }
      }
    } catch (err) {
      console.warn(`[Preloader] Fallback to original URL for ${item.name}:`, err);
    }

    completed++;
    const percent = Math.min(96, Math.round(5 + (completed / total) * 91));
    onProgress?.(percent, item.description);
  }

  isLoadedFlag = true;
  onProgress?.(100, 'All media buffered! Initializing Party Suite...');
}
