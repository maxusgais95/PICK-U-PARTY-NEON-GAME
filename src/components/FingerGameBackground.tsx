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

  // 2. Subtle ambience lights gradient moving at the bleed of the screen:
  //    Active when player place finger(s), but not yet reach the player number yet
  const isBleedAmbienceActive =
    active &&
    gameState === 'waiting' &&
    activeFingersCount > 0 &&
    activeFingersCount < minPlayers;

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

      {/* 2. Subtle Moving Ambience Lights Gradient at the Bleed of the Screen */}
      {/* Active when 1 <= activeFingersCount < minPlayers, not in countdown/resolved */}
      <div
        className={`absolute inset-0 pointer-events-none z-[1] overflow-hidden transition-opacity duration-500 ${
          isBleedAmbienceActive ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Rotating Conic Gradient Masked to Screen Bleed Perimeter */}
        <div
          className="absolute top-1/2 left-1/2 w-[220vmax] h-[220vmax] pointer-events-none animate-ambient-bleed animate-bleed-pulse"
          style={{
            background:
              'conic-gradient(from 0deg, rgba(0, 240, 255, 0.75) 0deg, rgba(168, 85, 247, 0.7) 60deg, rgba(255, 0, 128, 0.75) 120deg, rgba(255, 170, 0, 0.7) 180deg, rgba(0, 240, 255, 0.75) 240deg, rgba(59, 130, 246, 0.7) 300deg, rgba(0, 240, 255, 0.75) 360deg)',
            WebkitMaskImage:
              'radial-gradient(ellipse at center, transparent 70%, rgba(0, 0, 0, 0.7) 85%, black 100%)',
            maskImage:
              'radial-gradient(ellipse at center, transparent 70%, rgba(0, 0, 0, 0.7) 85%, black 100%)',
          }}
        />

        {/* 4 Outer Edge Bleed Accent Light Beams */}
        {/* Top Bleed */}
        <div className="absolute inset-x-0 top-0 h-12 bg-gradient-to-b from-cyan-400/35 via-cyan-400/10 to-transparent pointer-events-none animate-bleed-shimmer" />
        {/* Bottom Bleed */}
        <div className="absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-fuchsia-500/35 via-fuchsia-500/10 to-transparent pointer-events-none animate-bleed-shimmer" />
        {/* Left Bleed */}
        <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-purple-500/30 via-purple-500/08 to-transparent pointer-events-none animate-bleed-shimmer" />
        {/* Right Bleed */}
        <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-amber-400/30 via-amber-400/08 to-transparent pointer-events-none animate-bleed-shimmer" />
      </div>

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

      {/* 4. Subtle Top and Bottom Edge Vignettes for Header and Dock Contrast */}
      <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/60 via-black/20 to-transparent pointer-events-none z-[3]" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 via-black/25 to-transparent pointer-events-none z-[3]" />
    </div>
  );
};

