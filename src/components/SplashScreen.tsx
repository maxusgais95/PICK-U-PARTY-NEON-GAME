/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import pickuPartyLogo from '../assets/images/PICKU_PARTY_LOGO_ART.webp';
import splashBgVideo from '../assets/videos/Chibi Party Splash Screen Background Animation.mp4';
import { preloadAllAssets, getAssetUrl } from '../lib/assetPreloader';
import { SoundEngine, Haptics } from '../lib/audio';

interface SplashScreenProps {
  onComplete: () => void;
}

interface LoadingStage {
  targetProgress: number;
  title: string;
  subtitle: string;
  subdetail: string;
}

const TOTAL_SEGMENTS = 18;

const LOADING_STAGES: LoadingStage[] = [
  {
    targetProgress: 24,
    title: 'PREPARING THE PARTY...',
    subtitle: 'LOADING SHADERS & ASSETS...',
    subdetail: '(Finger Roulette, Spin Bottle, KABOOM)',
  },
  {
    targetProgress: 52,
    title: 'PREPARING THE PARTY...',
    subtitle: 'BUFFERING AUDIO & SFX...',
    subdetail: '(WebAudio Synthesizer & Spatial Cues)',
  },
  {
    targetProgress: 76,
    title: 'TUNING NEON STAGE...',
    subtitle: 'INITIALIZING 60FPS PHYSICS...',
    subdetail: '(Bottle Collision & Multi-Touch Sensors)',
  },
  {
    targetProgress: 94,
    title: 'OPTIMIZING PERFORMANCE...',
    subtitle: 'PRIMING OFFLINE RAM CACHE...',
    subdetail: '(Zero-Latency Service Worker)',
  },
  {
    targetProgress: 100,
    title: 'ALL SYSTEMS PRIMED!',
    subtitle: 'WELCOME TO PICK\'U PARTY...',
    subdetail: '(Tap anywhere to enter the suite)',
  },
];

// Returns interpolated neon color and glow for slanted segments across Cyan -> Blue -> Purple -> Hot Pink
const getSegmentColor = (index: number) => {
  const t = index / (TOTAL_SEGMENTS - 1);
  if (t < 0.28) {
    return {
      bg: 'linear-gradient(180deg, #a5f3fc 0%, #00f0ff 40%, #0284c7 100%)',
      glow: 'rgba(0, 240, 255, 0.75)',
    };
  } else if (t < 0.52) {
    return {
      bg: 'linear-gradient(180deg, #bfdbfe 0%, #3b82f6 40%, #1d4ed8 100%)',
      glow: 'rgba(59, 130, 246, 0.75)',
    };
  } else if (t < 0.76) {
    return {
      bg: 'linear-gradient(180deg, #e9d5ff 0%, #a855f7 40%, #7e22ce 100%)',
      glow: 'rgba(168, 85, 247, 0.75)',
    };
  } else {
    return {
      bg: 'linear-gradient(180deg, #fbcfe8 0%, #ec4899 40%, #be185d 100%)',
      glow: 'rgba(236, 72, 153, 0.75)',
    };
  }
};

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onOpenVersionNotes }) => {
  const [progress, setProgress] = useState<number>(0);
  const [currentStage, setCurrentStage] = useState<LoadingStage>(LOADING_STAGES[0]);
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let mounted = true;
    let assetsLoaded = false;
    const startTime = Date.now();
    const MIN_SPLASH_DURATION = 7200; // ~7.2 seconds duration for optimal pacing

    // Preload actual assets in background
    preloadAllAssets(() => {}).then(() => {
      assetsLoaded = true;
    });

    // Paced progress animation timer
    const interval = setInterval(() => {
      if (!mounted) return;
      const elapsed = Date.now() - startTime;
      const ratio = Math.min(elapsed / MIN_SPLASH_DURATION, 1);

      // Eased progress calculation
      const currentPct = Math.min(100, Math.round(ratio * 100));
      setProgress(currentPct);

      // Select dynamic stage text matching the benchmark
      for (const stage of LOADING_STAGES) {
        if (currentPct <= stage.targetProgress) {
          setCurrentStage(stage);
          break;
        }
      }

      // Check for completion
      if (ratio >= 1 && (assetsLoaded || elapsed >= MIN_SPLASH_DURATION + 1000)) {
        clearInterval(interval);
        setProgress(100);
        setCurrentStage(LOADING_STAGES[LOADING_STAGES.length - 1]);
        setIsReady(true);
        SoundEngine.playButtonClick();

        // Brief hold at 100% so player sees fully charged bar
        setTimeout(() => {
          if (!mounted) return;
          handleLaunch();
        }, 900);
      }
    }, 50);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const handleLaunch = () => {
    if (isLaunching) return;
    setIsLaunching(true);
    SoundEngine.playButtonClick();

    // Zoom out launch transition duration
    window.setTimeout(() => {
      onComplete();
    }, 600);
  };

  const filledSegmentsCount = Math.round((progress / 100) * TOTAL_SEGMENTS);

  return (
    <div
      onClick={isReady ? handleLaunch : undefined}
      className={`fixed inset-0 z-50 overflow-hidden flex flex-col justify-between items-center select-none bg-slate-950 transition-all duration-600 ${
        isLaunching
          ? 'scale-90 opacity-0 blur-md pointer-events-none'
          : 'scale-100 opacity-100'
      }`}
      style={{
        background: 'radial-gradient(ellipse 85% 65% at 50% 22%, #220e48 0%, #0f0525 45%, #050212 75%, #020108 100%)',
      }}
    >
      {/* Background Animated Video Layer with Crystal Clear Highlight Opening */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <video
          ref={videoRef}
          src={getAssetUrl(splashBgVideo)}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover object-center opacity-95 animate-bg-zoom-out"
        />

        {/* Cinematic Vignette: Crystal clear at highlight center, smoothly shading peripheral edges and bottom */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `
              radial-gradient(ellipse 85% 58% at 50% 28%, transparent 45%, rgba(4, 2, 16, 0.45) 75%, #020108 100%),
              linear-gradient(to bottom, transparent 0%, transparent 32%, rgba(2, 1, 8, 0.45) 58%, rgba(2, 1, 8, 0.94) 80%, #020108 100%)
            `,
          }}
        />
      </div>

      {/* Top Spacer to position DJ and lights appropriately above logo */}
      <div className="w-full h-[12vh] sm:h-[16vh] shrink-0 pointer-events-none" />

      {/* Middle Content Section: Logo, Description & Benchmark Progress Bar */}
      <div className="relative z-10 w-full max-w-md px-5 sm:px-6 flex flex-col items-center text-center">
        {/* Logo Bounce Pop Up with Continuous Neon Pulse Animation */}
        <div className="relative flex flex-col items-center animate-logo-bounce">
          {/* Ambient Contour Glow */}
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/25 via-purple-500/25 to-pink-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Clean RGBA Transparent Logo converted to .webp with Continuous Breathing Neon Pulse */}
          <img
            src={pickuPartyLogo}
            alt="PICK'U PARTY"
            className="relative z-10 w-72 sm:w-84 max-w-[90vw] h-auto object-contain animate-logo-pulse drop-shadow-[0_10px_25px_rgba(0,0,0,0.85)]"
          />
        </div>

        {/* Game Text Description under the logo (Matched to Reference Image) */}
        <div className="mt-3 sm:mt-4 max-w-[360px] px-2 animate-desc-popup">
          <p className="font-body text-xs sm:text-[13px] text-gray-200/90 font-medium leading-relaxed tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            The ultimate mobile party game hub! Test your luck in Finger Roulette, dodge penalties in Spin the Bottle, and risk it all in explosive KABOOM. Level up game night!
          </p>
        </div>

        {/* Slanted Segmented Neon Capsule Progress Bar Section (Matched to Benchmark) */}
        <div className="mt-5 sm:mt-6 w-full max-w-sm px-1 sm:px-2 animate-progress-popup flex flex-col items-center">
          {/* Progress Stage Header: PREPARING THE PARTY... [42%] */}
          <div className="w-full flex items-center justify-center gap-2 mb-2 sm:mb-2.5">
            <span className="font-header text-sm sm:text-base tracking-widest text-white/95 uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {currentStage.title}
            </span>
            <span className="font-header text-sm sm:text-base tracking-widest text-[#00f0ff] drop-shadow-[0_0_10px_rgba(0,240,255,0.85)]">
              [{progress}%]
            </span>
          </div>

          {/* Slanted Segmented Neon Capsule Bar Frame */}
          <div className="w-full relative p-[2px] rounded-2xl bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 shadow-[0_0_20px_rgba(0,240,255,0.4),0_0_25px_rgba(236,72,153,0.45)]">
            <div className="w-full h-11 sm:h-12 rounded-[14px] bg-[#070517]/95 p-1.5 sm:p-2 flex items-center justify-between gap-1 sm:gap-1.5 overflow-hidden">
              {Array.from({ length: TOTAL_SEGMENTS }).map((_, i) => {
                const isFilled = i < filledSegmentsCount;
                const isLeading = isFilled && i === filledSegmentsCount - 1;
                const colorInfo = getSegmentColor(i);

                return (
                  <div
                    key={i}
                    className={`h-full flex-1 -skew-x-[16deg] sm:-skew-x-[18deg] rounded-[3px] transition-all duration-200 relative overflow-hidden ${
                      isFilled ? '' : 'bg-[#141029]/80 border border-white/5'
                    }`}
                    style={
                      isFilled
                        ? {
                            background: colorInfo.bg,
                            boxShadow: `0 0 10px ${colorInfo.glow}`,
                          }
                        : undefined
                    }
                  >
                    {/* Glossy top specular reflection highlight */}
                    {isFilled && (
                      <div className="absolute inset-x-0 top-0 h-[45%] bg-gradient-to-b from-white/60 to-transparent pointer-events-none" />
                    )}
                    {/* Pulsing leading active edge segment */}
                    {isLeading && (
                      <div className="absolute inset-0 bg-white/45 animate-pulse pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Loading Shaders & Assets Subtext */}
          <div className="mt-2.5 sm:mt-3 w-full text-center flex flex-col items-center justify-center">
            <p className="font-header text-xs sm:text-sm font-bold text-white tracking-widest uppercase drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)]">
              {currentStage.subtitle}
            </p>
            <p className="font-subbody text-[11px] sm:text-xs text-gray-400 font-medium tracking-wide mt-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {currentStage.subdetail}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
