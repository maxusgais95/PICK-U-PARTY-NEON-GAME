/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import pickuPartyLogo from '../assets/images/PICK\'U PARTY LOGO ART.png';
import { preloadAllAssets } from '../lib/assetPreloader';
import { SoundEngine } from '../lib/audio';
import { Sparkles, Flame, Zap, CheckCircle2 } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState<number>(0);
  const [statusText, setStatusText] = useState<string>('Initializing game engine & storage...');
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isLaunching, setIsLaunching] = useState<boolean>(false);

  useEffect(() => {
    let mounted = true;

    async function startBuffering() {
      await preloadAllAssets((percent, text) => {
        if (!mounted) return;
        setProgress(percent);
        setStatusText(text);
      });

      if (!mounted) return;
      setIsReady(true);
      SoundEngine.playButtonClick();

      // Launch automatically after a brief pause so player sees 100% completion
      window.setTimeout(() => {
        if (!mounted) return;
        handleLaunch();
      }, 700);
    }

    startBuffering();

    return () => {
      mounted = false;
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
        background: 'radial-gradient(ellipse at 50% 35%, #180d38 0%, #080415 60%, #020108 100%)',
      }}
    >
      {/* Dynamic Ambient Background Glow Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Rotating Cyan / Magenta background aura */}
        <div
          className="absolute -top-1/4 -left-1/4 w-[150vw] h-[150vw] rounded-full opacity-20 pointer-events-none animate-ambient-bleed"
          style={{
            background:
              'conic-gradient(from 0deg, #00f0ff 0deg, #ec4899 120deg, #a855f7 240deg, #00f0ff 360deg)',
            filter: 'blur(70px)',
          }}
        />
        {/* Grid dots */}
        <div
          className="absolute inset-0 opacity-15 pointer-events-none"
          style={{
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.35) 1px, transparent 1px)',
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      {/* Top 2/3 of the Vertical Screen: Pop Up Big Title Logo & Game Modes Intro */}
      <div className="relative z-10 w-full max-w-md px-6 pt-10 sm:pt-14 flex flex-col items-center text-center">
        {/* Big Pop-Up Title Logo */}
        <div className="relative flex flex-col items-center animate-title-popup">
          {/* Pulsing Backlight */}
          <div className="absolute inset-0 -inset-x-8 bg-cyan-500/25 rounded-full blur-2xl animate-pulse pointer-events-none" />

          <div className="relative group overflow-hidden rounded-2xl py-2 px-3">
            <img
              src={pickuPartyLogo}
              alt="PICK'U PARTY"
              className="w-56 sm:w-72 h-auto object-contain drop-shadow-[0_0_25px_rgba(0,240,255,0.7)] drop-shadow-[0_0_45px_rgba(236,72,153,0.4)] transform active:scale-95 transition-transform"
            />
            {/* Occasional Specular Light Sweep */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
              <div className="absolute -inset-y-4 w-1/2 animate-title-sweep bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[-25deg] blur-[1px]" />
            </div>
          </div>

          {/* Game Tagline */}
          <div className="mt-2.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 border border-cyan-400/30 shadow-[0_0_12px_rgba(6,182,212,0.25)]">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
            <span className="text-[10px] sm:text-[11px] font-black tracking-widest text-cyan-300 uppercase">
              The Ultimate Multiplayer Cyber Party Suite
            </span>
          </div>

          <p className="mt-2 text-xs sm:text-[13px] text-gray-300/90 max-w-[320px] font-medium leading-relaxed">
            Multiplayer touch roulette, physics bottle spins & intense party showdowns with real-time neon FX.
          </p>
        </div>

        {/* Game Modes Introduction Cards */}
        <div className="mt-5 w-full space-y-2 text-left animate-fadeIn">
          {/* Finger Roulette Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(6,182,212,0.4)]">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white tracking-wide">FINGER ROULETTE</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">POPULAR</span>
              </div>
              <p className="text-[10.5px] text-gray-300/80 leading-tight mt-0.5 truncate">
                Place fingers, dynamic video countdown & shockwave elimination.
              </p>
            </div>
          </div>

          {/* Spin the Bottle Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-fuchsia-500/30 shadow-[0_0_15px_rgba(236,72,153,0.15)]">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(236,72,153,0.4)]">
              <Flame className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white tracking-wide">SPIN THE BOTTLE</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30">INTERACTIVE</span>
              </div>
              <p className="text-[10.5px] text-gray-300/80 leading-tight mt-0.5 truncate">
                Authentic physics, neon bottle skins & orbiting light table.
              </p>
            </div>
          </div>

          {/* Kaboom Party Card */}
          <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-black/40 backdrop-blur-md border border-orange-500/30 shadow-[0_0_15px_rgba(249,115,22,0.15)] opacity-85">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(249,115,22,0.4)]">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-white tracking-wide">KABOOM PARTY</span>
                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-orange-500/20 text-orange-300 border border-orange-400/30">COMING SOON</span>
              </div>
              <p className="text-[10.5px] text-gray-300/80 leading-tight mt-0.5 truncate">
                Pass the ticking bomb before detonation in high-tension chaos.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section: Gradient Progress Bar & Dynamic Buffering Descriptions */}
      <div className="relative z-10 w-full max-w-sm px-6 pb-8 sm:pb-12 flex flex-col items-center">
        {/* Progress Info Header */}
        <div className="w-full flex items-center justify-between mb-2 text-xs">
          <span className="font-extrabold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
            {isReady ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">MEDIA BUFFERED IN RAM</span>
              </>
            ) : (
              'BUFFERING GAME MEDIA'
            )}
          </span>
          <span className="font-mono font-black text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">
            {progress}%
          </span>
        </div>

        {/* Gradient Progress Bar (Blue, Cyan, Magenta, Purple, Orange) */}
        <div className="relative w-full h-3 bg-black/60 rounded-full p-0.5 border border-white/20 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] overflow-hidden">
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
        <div className="mt-3 w-full text-center min-h-[38px] flex flex-col items-center justify-center">
          <p className="text-[11px] sm:text-xs font-mono font-medium text-cyan-200/90 tracking-wide truncate max-w-full">
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
  );
};
