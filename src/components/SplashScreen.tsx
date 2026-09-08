/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import pickuPartyLogo from '../assets/images/PICKU_PARTY_LOGO_ART.webp';
import splashBgVideo from '../assets/videos/Chibi Party Splash Screen Background Animation.mp4';
import { preloadAllAssets, getAssetUrl } from '../lib/assetPreloader';
import { SoundEngine, Haptics } from '../lib/audio';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
  onOpenVersionNotes?: () => void;
}

const LOADING_STAGES = [
  { targetProgress: 18, text: 'Initializing WebAudio & Cyber Neon Synthesizer...' },
  { targetProgress: 38, text: 'Decoding Chibi Party Animation & 60FPS Video Tracks...' },
  { targetProgress: 58, text: 'Buffering Finger Roulette & Bottle Physics Shaders...' },
  { targetProgress: 78, text: 'Compiling Offline Service Worker & Zero-Latency Cache...' },
  { targetProgress: 92, text: 'Calibrating Multi-Touch Sensors & Ambient Neon Bleed...' },
  { targetProgress: 100, text: 'All Systems Primed! Welcome to PICK\'U PARTY...' },
];

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete, onOpenVersionNotes }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Initializing game engine & storage...');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    let mounted = true;
    let assetsLoaded = false;
    const startTime = Date.now();
    const MIN_SPLASH_DURATION = 7200; // Guaranteed ~7.2 seconds duration (in the 5-10s range)

    // Preload actual assets in background
    preloadAllAssets(() => {
      // Background preload progress
    }).then(() => {
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

      // Select dynamic stage text
      for (const stage of LOADING_STAGES) {
        if (currentPct <= stage.targetProgress) {
          setStatusText(stage.text);
          break;
        }
      }

      // Check for completion
      if (ratio >= 1 && (assetsLoaded || elapsed >= MIN_SPLASH_DURATION + 1000)) {
        clearInterval(interval);
        setProgress(100);
        setStatusText('Ready! Launching PICK\'U PARTY suite...');
        setIsReady(true);
        SoundEngine.playButtonClick();

        // Brief hold at 100% so player sees full bar
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
              linear-gradient(to bottom, transparent 0%, transparent 32%, rgba(2, 1, 8, 0.45) 58%, rgba(2, 1, 8, 0.92) 80%, #020108 100%)
            `,
          }}
        />
      </div>

      {/* Top Spacer to position logo center at approximately 40% from top */}
      <div className="w-full h-[14vh] sm:h-[18vh] shrink-0 pointer-events-none" />

      {/* Middle Content Section: Logo, Description & Progress Bar */}
      <div className="relative z-10 w-full max-w-md px-6 flex flex-col items-center text-center">
        {/* Logo Bounce Pop Up with Continuous Neon Pulse Animation */}
        <div className="relative flex flex-col items-center animate-logo-bounce">
          {/* Ambient Contour Glow */}
          <div className="absolute inset-0 bg-cyan-500/25 rounded-full blur-3xl pointer-events-none animate-pulse" />

          {/* Clean RGBA Transparent Logo with Continuous Breathing Neon Pulse */}
          <img
            src={pickuPartyLogo}
            alt="PICK'U PARTY"
            className="relative z-10 w-64 sm:w-80 h-auto object-contain animate-logo-pulse"
          />
        </div>

        {/* Game Text Description under the logo */}
        <div className="mt-3.5 sm:mt-4.5 max-w-[360px] px-3 animate-desc-popup">
          <p className="text-xs sm:text-[13px] text-gray-200/90 font-medium leading-relaxed tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.85)]">
            The ultimate mobile party game hub! Test your luck in Finger Roulette, dodge penalties in Spin the Bottle, and risk it all in explosive KABOOM. Level up game night!
          </p>
        </div>

        {/* Follow by Progress Bar & Loading Descriptions Pop Up */}
        <div className="mt-5 sm:mt-6 w-full max-w-sm px-2 animate-progress-popup flex flex-col items-center">
          {/* Progress Info Header */}
          <div className="w-full flex items-center justify-between mb-2 text-xs">
            <span className="font-extrabold uppercase tracking-wider text-gray-300 flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {isReady ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="text-emerald-300">MEDIA BUFFERED IN RAM</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                  <span>BUFFERING GAME MEDIA</span>
                </>
              )}
            </span>
            <span className="font-mono font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
              {progress}%
            </span>
          </div>

          {/* Gradient Progress Bar (Blue, Cyan, Magenta, Purple, Orange) */}
          <div className="relative w-full h-3 bg-black/70 rounded-full p-0.5 border border-white/25 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300 ease-out relative overflow-hidden"
              style={{
                width: `${progress}%`,
                background:
                  'linear-gradient(90deg, #0066ff 0%, #00f0ff 25%, #ec4899 50%, #a855f7 75%, #f97316 100%)',
                boxShadow:
                  '0 0 16px rgba(0, 240, 255, 0.7), 0 0 24px rgba(236, 72, 153, 0.5)',
              }}
            >
              {/* Animated Specular Bar Shimmer */}
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-laser-scan-left opacity-75" />
            </div>
          </div>

          {/* Dynamic Loading / Buffering Description Under Progress Bar */}
          <div className="mt-2.5 w-full text-center min-h-[36px] flex flex-col items-center justify-center">
            <p className="text-[11px] sm:text-xs font-mono font-medium text-cyan-200/90 tracking-wide truncate max-w-full drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              {statusText}
            </p>
            <p className="text-[9.5px] text-gray-400/80 tracking-wider uppercase mt-0.5">
              {isReady
                ? 'Tap anywhere to launch immediately'
                : 'Zero-latency in-memory blob cache active'}
            </p>
          </div>
        </div>
      </div>

      {/* Version Notes at the Bottom of the Screen */}
      <div className="relative z-10 w-full pb-5 sm:pb-7 flex flex-col items-center animate-version-fadein">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            if (onOpenVersionNotes) onOpenVersionNotes();
          }}
          className="px-3.5 py-1.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-400/40 text-[11px] font-mono font-bold tracking-wider text-gray-400 hover:text-cyan-300 transition-all cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.6)] flex items-center gap-1.5 focus:outline-none"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          <span>Version notes: v1.4.001</span>
        </button>
      </div>
    </div>
  );
};
