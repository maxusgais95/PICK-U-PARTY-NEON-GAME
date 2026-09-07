/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import pickuPartyLogo from '../assets/images/PICK\'U PARTY LOGO E01.webp';
import chibiFingersImg from '../assets/images/Chibi Fingers Game.webp';
import chibiBottleImg from '../assets/images/Chibi Spinning Bottle.webp';
import chibiBombImg from '../assets/images/Chibi Bomb Game.webp';
import { getAssetUrl } from '../lib/assetPreloader';
import { AppSettings } from '../types';
import { SoundEngine, Haptics } from '../lib/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface LandingHubProps {
  settings: AppSettings;
  onSelectRoulette: () => void;
  onSelectBottle: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenVersionNotes?: () => void;
}

export const LandingHub: React.FC<LandingHubProps> = ({
  onSelectRoulette,
  onSelectBottle,
  onOpenVersionNotes,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Drag tracking state (works for both Touch & Mouse)
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  const hasDraggedFar = useRef(false);

  const handleTitleClick = () => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
  };

  const handleKaboomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    setToastMessage("💣 KABOOM Mode Coming Soon! Get ready...");
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Sync scroll position with active dot index
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const container = scrollRef.current;
    const index = Math.round(container.scrollLeft / (container.clientWidth * 0.75));
    if (index !== activeIndex && index >= 0 && index < 3) {
      setActiveIndex(index);
    }
  };

  const scrollToIndex = (index: number) => {
    if (!scrollRef.current) return;
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    scrollRef.current.scrollTo({
      left: (scrollRef.current.clientWidth * 0.75) * index,
      behavior: 'smooth',
    });
    setActiveIndex(index);
  };

  // --- Touch & Mouse Unified Drag Handlers ---
  const handleStart = (clientX: number) => {
    if (!scrollRef.current) return;
    isDragging.current = true;
    hasDraggedFar.current = false;
    startX.current = clientX - scrollRef.current.offsetLeft;
    scrollLeft.current = scrollRef.current.scrollLeft;
  };

  const handleMove = (clientX: number) => {
    if (!isDragging.current || !scrollRef.current) return;
    const x = clientX - scrollRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.2;
    
    if (Math.abs(walk) > 8) {
      hasDraggedFar.current = true;
    }
    scrollRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleEnd = () => {
    isDragging.current = false;
  };

  // Prevent accidental tap when user intends to swipe
  const handleCardClick = (e: React.MouseEvent, callback: () => void) => {
    if (hasDraggedFar.current) {
      e.stopPropagation();
      return;
    }
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    callback();
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto flex flex-col items-center justify-between pt-[max(1.5rem,calc(env(safe-area-inset-top)+1rem))] pb-3 overflow-hidden select-none">
      <style>{`
        @keyframes subtleScaleBounce {
          0%, 100% {
            transform: scale(1.02);
          }
          50% {
            transform: scale(0.98);
          }
        }
        .animate-subtle-bounce {
          animation: subtleScaleBounce 2.5s ease-in-out infinite;
        }
        .snap-custom {
          scroll-snap-type: x mandatory;
          scroll-snap-stop: normal;
          -webkit-overflow-scrolling: touch;
        }
      `}</style>

      {/* Toast notification */}
      {toastMessage && (
        <div className="fixed top-12 z-50 animate-bounce">
          <div className="px-4 py-2 rounded-full bg-orange-600/90 text-white font-bold text-xs shadow-[0_0_20px_rgba(249,115,22,0.6)] border border-orange-300/80 backdrop-blur-md flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Top Spacer */}
      <div className="flex-1 min-h-[10px]" />

      {/* Header Title */}
      <div className="text-center flex flex-col items-center select-none relative z-20 shrink-0 w-full px-4 mb-2">
        <div
          onClick={handleTitleClick}
          className="relative w-full max-w-[340px] sm:max-w-[400px] flex items-center justify-center cursor-pointer group"
          title="PICK'U PARTY"
        >
          <div className="relative w-full flex items-center justify-center animate-title-sweep-pulse">
            <img
              src={getAssetUrl(pickuPartyLogo)}
              alt="PICK'U PARTY"
              className="w-full h-auto max-h-[72px] sm:max-h-[86px] object-contain select-none pointer-events-none"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
        </div>

        <p className="text-[13px] sm:text-[15px] font-semibold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-2 mb-0">
          Swipe to select a game mode
        </p>
      </div>

      {/* Main Touch/Swipe Carousel Section */}
      <div className="w-full flex flex-col items-center shrink-0 mb-auto">
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          // Touch Events
          onTouchStart={(e) => handleStart(e.touches[0].clientX)}
          onTouchMove={(e) => handleMove(e.touches[0].clientX)}
          onTouchEnd={handleEnd}
          // Mouse Events
          onMouseDown={(e) => handleStart(e.clientX)}
          onMouseMove={(e) => handleMove(e.clientX)}
          onMouseUp={handleEnd}
          onMouseLeave={handleEnd}
          className="w-full flex overflow-x-auto snap-custom no-scrollbar px-[8vw] py-6 gap-4 touch-pan-x cursor-grab active:cursor-grabbing"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {/* Card 1: FINGER ROULETTE */}
          <div className="w-[84vw] max-w-[350px] shrink-0 snap-center">
            <div
              onClick={(e) => handleCardClick(e, onSelectRoulette)}
              className={`relative rounded-[22px] p-3.5 bg-black/40 backdrop-blur-[3px] border-[1.5px] border-cyan-400 shadow-[0_0_22px_rgba(6,182,212,0.4)] flex flex-col items-center justify-end text-center cursor-pointer overflow-hidden w-full aspect-video transition-all duration-300 ${
                activeIndex === 0 ? 'scale-100 animate-subtle-bounce' : 'scale-95 opacity-70'
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-20">
                <div
                  className="absolute top-[18px] -right-[34px] w-[124px] transform rotate-45 py-0.5 text-center font-black tracking-widest text-[8.5px] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.6)] border-y border-white/50"
                  style={{
                    background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 50%, #00e5ff 100%)',
                    color: '#ffffff',
                  }}
                >
                  Popular
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <img
                  src={getAssetUrl(chibiFingersImg)}
                  alt="Chibi Fingers Game"
                  className="w-full h-full object-cover object-top select-none"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)',
                  }}
                />
              </div>

              <div className="relative z-10 flex flex-col items-center w-full mt-auto">
                <h2 className="text-sm sm:text-base font-black tracking-wider uppercase bg-gradient-to-r from-cyan-200 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight">
                  FINGER ROULETTE
                </h2>
                <p className="text-[11px] sm:text-xs font-bold tracking-normal bg-gradient-to-r from-cyan-100 via-white to-sky-200 bg-clip-text text-transparent mt-0.5 mb-1.5 leading-tight">
                  Place your finger and have fun
                </p>
                <button
                  type="button"
                  onClick={(e) => handleCardClick(e, onSelectRoulette)}
                  className="relative w-full h-8 sm:h-9 rounded-full flex items-center justify-center shadow-[0_3px_16px_rgba(6,182,212,0.45)] border-[1.2px] border-white/70"
                  style={{
                    background: 'linear-gradient(90deg, #00e5ff 0%, #06b6d4 30%, #a855f7 70%, #d946ef 100%)',
                  }}
                >
                  <span className="relative z-20 text-[10px] sm:text-[11px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    PLAY PICKER
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: SPIN THE BOTTLE */}
          <div className="w-[84vw] max-w-[350px] shrink-0 snap-center">
            <div
              onClick={(e) => handleCardClick(e, onSelectBottle)}
              className={`relative rounded-[22px] p-3.5 bg-black/40 backdrop-blur-[3px] border-[1.5px] border-pink-500 shadow-[0_0_22px_rgba(236,72,153,0.4)] flex flex-col items-center justify-end text-center cursor-pointer overflow-hidden w-full aspect-video transition-all duration-300 ${
                activeIndex === 1 ? 'scale-100 animate-subtle-bounce' : 'scale-95 opacity-70'
              }`}
            >
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <img
                  src={getAssetUrl(chibiBottleImg)}
                  alt="Chibi Spinning Bottle"
                  className="w-full h-full object-cover object-top select-none"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)',
                  }}
                />
              </div>

              <div className="relative z-10 flex flex-col items-center w-full mt-auto">
                <h2 className="text-sm sm:text-base font-black tracking-wider uppercase bg-gradient-to-r from-pink-200 via-rose-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight">
                  SPIN THE BOTTLE
                </h2>
                <p className="text-[11px] sm:text-xs font-bold tracking-normal bg-gradient-to-r from-pink-100 via-white to-purple-200 bg-clip-text text-transparent mt-0.5 mb-1.5 leading-tight">
                  Flick or tap to spin the bottle
                </p>
                <button
                  type="button"
                  onClick={(e) => handleCardClick(e, onSelectBottle)}
                  className="relative w-full h-8 sm:h-9 rounded-full flex items-center justify-center shadow-[0_3px_16px_rgba(236,72,153,0.45)] border-[1.2px] border-white/70"
                  style={{
                    background: 'linear-gradient(90deg, #9333ea 0%, #a855f7 35%, #ec4899 75%, #f43f5e 100%)',
                  }}
                >
                  <span className="relative z-20 text-[10px] sm:text-[11px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    SPIN BOTTLE
                  </span>
                </button>
              </div>
            </div>
          </div>

          {/* Card 3: KABOOM */}
          <div className="w-[84vw] max-w-[350px] shrink-0 snap-center">
            <div
              onClick={(e) => handleCardClick(e, () => handleKaboomClick(e))}
              className={`relative rounded-[22px] p-3.5 bg-black/40 backdrop-blur-[3px] border-[1.5px] border-orange-500 shadow-[0_0_22px_rgba(249,115,22,0.4)] flex flex-col items-center justify-end text-center cursor-pointer overflow-hidden w-full aspect-video transition-all duration-300 ${
                activeIndex === 2 ? 'scale-100 animate-subtle-bounce' : 'scale-95 opacity-70'
              }`}
            >
              <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-20">
                <div
                  className="absolute top-[18px] -right-[34px] w-[124px] transform rotate-45 py-0.5 text-center font-black tracking-wider text-[8px] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.6)] border-y border-amber-200/40"
                  style={{
                    background: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ea580c 100%)',
                    color: '#ffffff',
                  }}
                >
                  Coming Soon
                </div>
              </div>

              <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                <img
                  src={getAssetUrl(chibiBombImg)}
                  alt="Chibi Bomb Game"
                  className="w-full h-full object-cover object-top select-none"
                />
                <div
                  className="absolute inset-0"
                  style={{
                    background: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.85) 100%)',
                  }}
                />
              </div>

              <div className="relative z-10 flex flex-col items-center w-full mt-auto">
                <h2 className="text-sm sm:text-base font-black tracking-wider uppercase bg-gradient-to-r from-amber-200 via-orange-300 to-red-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight">
                  KABOOM
                </h2>
                <p className="text-[11px] sm:text-xs font-bold tracking-normal bg-gradient-to-r from-amber-100 via-white to-orange-200 bg-clip-text text-transparent mt-0.5 mb-1.5 leading-tight">
                  Avoid the bomb and don't get exploded
                </p>
                <button
                  type="button"
                  onClick={(e) => handleCardClick(e, () => handleKaboomClick(e))}
                  className="relative w-full h-8 sm:h-9 rounded-full flex items-center justify-center shadow-[0_3px_16px_rgba(249,115,22,0.45)] border-[1.2px] border-white/70"
                  style={{
                    background: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ff5500 100%)',
                  }}
                >
                  <span className="relative z-20 text-[10px] sm:text-[11px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                    LET'S GO
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Swipe Indicator Dots */}
        <div className="flex items-center gap-2 mt-1 z-20">
          {[0, 1, 2].map((i) => (
            <button
              key={i}
              onClick={() => scrollToIndex(i)}
              className={`h-2.5 rounded-full transition-all duration-300 ${
                activeIndex === i
                  ? 'w-7 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                  : 'w-2.5 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer Version Notes */}
      <div className="shrink-0 mt-auto mb-1 flex flex-col items-center gap-1 select-none z-20">
        <PWAInstallButton variant="pill" />
        <button
          type="button"
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            if (onOpenVersionNotes) onOpenVersionNotes();
          }}
          className="text-[10px] sm:text-[11px] text-gray-400/80 hover:text-white transition-colors tracking-wide cursor-pointer focus:outline-none py-0.5"
        >
          Version notes: v1.3.001
        </button>
      </div>
    </div>
  );
};
