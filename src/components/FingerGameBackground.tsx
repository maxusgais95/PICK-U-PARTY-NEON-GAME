/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import rouletteBgImage from '../assets/images/Finger Roulette Background.webp';
import rouletteBgVideo from '../assets/videos/Finger Roulette Background Animation.mp4';
import { getAssetUrl } from '../lib/assetPreloader';
import { ThemeId, TouchPlayer } from '../types';
import { THEMES } from '../lib/themes';

export interface FingerGameBackgroundProps {
  theme: ThemeId;
  active?: boolean;
  gameState?: 'waiting' | 'countdown' | 'resolved';
  activeFingersCount?: number;
  minPlayers?: number;
  countdownSeconds?: number;
  touches?: TouchPlayer[];
  onVideoEnd?: () => void;
}

export const FingerGameBackground: React.FC<FingerGameBackgroundProps> = ({
  theme,
  active = true,
  gameState = 'waiting',
  activeFingersCount = 0,
  minPlayers = 2,
  countdownSeconds = 5,
  onVideoEnd,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const currentTheme = THEMES[theme] || THEMES['cyber-neon'];

  // Criteria states:
  // 1. Video is enabled ONLY when all players placed their fingers (during countdown)
  const isVideoActive = active && gameState === 'countdown';

  // 2. Subtle moving ambience lights gradient at the bleed of the screen:
  // Active during finger roulette gameplay.
  // - When idle: gentle atmospheric neon edge glow (opacity-50)
  // - When finger(s) are placed: surges to high-intensity vibrant radiance (opacity-100)
  // - In countdown: intense high-tension aura (opacity-85)
  const ambienceIntensityClass = !active
    ? 'opacity-0'
    : activeFingersCount > 0 && gameState === 'waiting'
    ? 'opacity-100'
    : gameState === 'countdown'
    ? 'opacity-85'
    : 'opacity-50';

  // Manage video playback rate and sync
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.playsInline = true;
    video.setAttribute('playsinline', 'true');
    video.setAttribute('webkit-playsinline', 'true');

    if (isVideoActive) {
      // Calculate speed criteria:
      // Video length is exactly 10s.
      // 1. 5s countdown: speed up (2.0x) so 10s video finishes in 5s
      // 2. 8s countdown: normal speed (1.25x) so 10s video finishes in 8s
      // 3. 10s countdown: speed down (1.0x) so 10s video finishes in 10s
      let playbackRate = 1.0;
      if (countdownSeconds === 5) {
        playbackRate = 2.0; // Speed up
      } else if (countdownSeconds === 8) {
        playbackRate = 1.25; // Normal speed to match end duration
      } else if (countdownSeconds === 10) {
        playbackRate = 1.0; // Speed down to match end duration
      } else {
        playbackRate = 10.0 / Math.max(1, countdownSeconds);
      }

      video.currentTime = 0;
      video.playbackRate = playbackRate;
      video.play().catch(() => {
        // Fallback for strict browser autoplay
        const onInteract = () => {
          video.currentTime = 0;
          video.playbackRate = playbackRate;
          video.play().catch(() => {});
        };
        window.addEventListener('touchstart', onInteract, { once: true });
        window.addEventListener('click', onInteract, { once: true });
      });
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isVideoActive, countdownSeconds]);

  // Pause when the whole roulette screen is inactive
  useEffect(() => {
    if (!active && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [active]);

  const handleEnded = () => {
    if (onVideoEnd) {
      onVideoEnd();
    }
  };

  return (
    <div
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none bg-black"
      style={{ backgroundColor: currentTheme.bgBase }}
    >
      {/* 1. Static Image Background: Finger Roulette Background.jpg */}
      {/* Active during idle and enabled back when video ends / round resolves */}
      <img
        src={getAssetUrl(rouletteBgImage)}
        alt="Finger Roulette Background"
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-0 transition-opacity duration-300 ${
          isVideoActive ? 'opacity-0' : 'opacity-100'
        }`}
        style={{
          filter: 'contrast(1.05) brightness(1.02)',
        }}
      />

      {/* 2. Top and Bottom Base Vignettes for Background Image Contrast */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-[1]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none z-[1]" />

      {/* 3. Animated Video Background: Finger Roulette Background Animation.mp4 */}
      {/* Enabled when all players place their fingers, plays until finished, then disabled */}
      <video
        ref={videoRef}
        src={getAssetUrl(rouletteBgVideo)}
        preload="auto"
        muted
        playsInline
        disablePictureInPicture
        controls={false}
        onEnded={handleEnded}
        className={`absolute inset-0 w-full h-full object-cover object-center pointer-events-none z-[2] transition-opacity duration-300 ${
          isVideoActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          filter: 'contrast(1.06) brightness(1.03)',
        }}
      />

      {/* 4. Moving Ambience Lights Gradient at the Bleed of the Screen */}
      <div
        className={`absolute inset-0 pointer-events-none z-[3] overflow-hidden transition-opacity duration-500 ${ambienceIntensityClass}`}
      >
        {/* Outer Pulsing Container */}
        <div className="absolute inset-0 pointer-events-none animate-bleed-pulse">
          {/* Inner Rotating Conic Aurora Centered with translate(-50%, -50%) */}
          <div
            className="absolute left-1/2 top-1/2 w-[150vmax] h-[150vmax] pointer-events-none animate-ambient-bleed"
            style={{
              background:
                'conic-gradient(from 0deg, #00f0ff 0deg, #a855f7 60deg, #ec4899 120deg, #f59e0b 180deg, #00f0ff 240deg, #3b82f6 300deg, #00f0ff 360deg)',
              WebkitMaskImage:
                'radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.4) 55%, black 75%)',
              maskImage:
                'radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.4) 55%, black 75%)',
              filter: 'blur(35px)',
              mixBlendMode: 'screen',
            }}
          />
        </div>

        {/* 4 Outer Edge Bleed Accent Light Beams */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-cyan-400/50 via-cyan-400/15 to-transparent pointer-events-none animate-bleed-shimmer" />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-fuchsia-500/50 via-fuchsia-500/15 to-transparent pointer-events-none animate-bleed-shimmer" />
        <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-purple-500/40 via-purple-500/10 to-transparent pointer-events-none animate-bleed-shimmer" />
        <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-amber-400/40 via-amber-400/10 to-transparent pointer-events-none animate-bleed-shimmer" />

        {/* Perimeter Inset Aura */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            boxShadow:
              'inset 0 0 45px 12px rgba(0, 240, 255, 0.4), inset 0 0 90px 24px rgba(236, 72, 153, 0.25)',
          }}
        />
      </div>
    </div>
  );
};

