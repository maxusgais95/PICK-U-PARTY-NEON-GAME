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

interface GameCard {
  id: string;
  title: string;
  subtitle: string;
  buttonText: string;
  image: string;
  badge?: string;
  borderColor: string;
  shadowColor: string;
  btnGradient: string;
  titleGradient: string;
  subGradient: string;
  badgeGradient: string;
  onClick: (e: React.MouseEvent) => void;
}

export const LandingHub: React.FC<LandingHubProps> = ({
  onSelectRoulette,
  onSelectBottle,
  onOpenVersionNotes,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Touch/Drag physics refs
  const [dragOffset, setDragOffset] = useState(0);
  const [isSwiping, setIsSwiping] = useState(false);
  const startX = useRef(0);
  const currentX = useRef(0);
  const isDragging = useRef(false);

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

  // Card definitions
  const cards: GameCard[] = [
    {
      id: 'roulette',
      title: 'FINGER ROULETTE',
      subtitle: 'Place your finger and have fun',
      buttonText: 'PLAY PICKER',
      image: chibiFingersImg,
      badge: 'Popular',
      borderColor: 'border-cyan-400',
      shadowColor: 'shadow-[0_0_22px_rgba(6,182,212,0.4)]',
      btnGradient: 'linear-gradient(90deg, #00e5ff 0%, #06b6d4 30%, #a855f7 70%, #d946ef 100%)',
      titleGradient: 'from-cyan-200 via-sky-300 to-fuchsia-300',
      subGradient: 'from-cyan-100 via-white to-sky-200',
      badgeGradient: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 50%, #00e5ff 100%)',
      onClick: () => {
        SoundEngine.playButtonClick();
        Haptics.buttonClick();
        onSelectRoulette();
      },
    },
    {
      id: 'bottle',
      title: 'SPIN THE BOTTLE',
      subtitle: 'Flick or tap to spin the bottle',
      buttonText: 'SPIN BOTTLE',
      image: chibiBottleImg,
      borderColor: 'border-pink-500',
      shadowColor: 'shadow-[0_0_22px_rgba(236,72,153,0.4)]',
      btnGradient: 'linear-gradient(90deg, #9333ea 0%, #a855f7 35%, #ec4899 75%, #f43f5e 100%)',
      titleGradient: 'from-pink-200 via-rose-300 to-purple-300',
      subGradient: 'from-pink-100 via-white to-purple-200',
      badgeGradient: '',
      onClick: () => {
        SoundEngine.playButtonClick();
        Haptics.buttonClick();
        onSelectBottle();
      },
    },
    {
      id: 'kaboom',
      title: 'KABOOM',
      subtitle: "Avoid the bomb and don't get exploded",
      buttonText: "LET'S GO",
      image: chibiBombImg,
      badge: 'Coming Soon',
      borderColor: 'border-orange-500',
      shadowColor: 'shadow-[0_0_22px_rgba(249,115,22,0.4)]',
      btnGradient: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ff5500 100%)',
      titleGradient: 'from-amber-200 via-orange-300 to-red-400',
      subGradient: 'from-amber-100 via-white to-orange-200',
      badgeGradient: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ea580c 100%)',
      onClick: handleKaboomClick,
    },
  ];

  // Helper for infinite circular index wrapping
  const getWrappedIndex = (index: number) => {
    const total = cards.length;
    return ((index % total) + total) % total;
  };

  // --- Infinite Drag Gesture Handlers ---
  const handleTouchStart = (clientX: number) => {
    isDragging.current = true;
    startX.current = clientX;
    currentX.current = clientX;
    setIsSwiping(true);
  };

  const handleTouchMove = (clientX: number) => {
    if (!isDragging.current) return;
    currentX.current = clientX;
    const deltaX = clientX - startX.current;
    setDragOffset(deltaX);
  };

  const handleTouchEnd = () => {
    if (!isDragging.current) return;
    isDragging.current = false;
    setIsSwiping(false);

    const deltaX = currentX.current - startX.current;
    const threshold = 60; // minimum swipe distance to snap to next/prev card

    if (deltaX < -threshold) {
      // Swiped Left -> Next Card
      SoundEngine.playButtonClick();
      Haptics.buttonClick();
      setCurrentIndex((prev) => getWrappedIndex(prev + 1));
    } else if (deltaX > threshold) {
      // Swiped Right -> Previous Card
      SoundEngine.playButtonClick();
      Haptics.buttonClick();
      setCurrentIndex((prev) => getWrappedIndex(prev - 1));
    }
    setDragOffset(0);
  };

  const handleDotClick = (targetIndex: number) => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    setCurrentIndex(targetIndex);
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto flex flex-col items-center justify-start pt-[max(1rem,calc(env(safe-area-inset-top)+0.5rem))] pb-2 overflow-hidden select-none">
      <style>{`
        @keyframes subtleScaleBounce {
          0%, 100% { transform: scale(1.02); }
          50% { transform: scale(0.98); }
        }
        .animate-subtle-bounce {
          animation: subtleScaleBounce 2.5s ease-in-out infinite;
        }
      `}</style>

      {/* Darkened/Blurred Overlay for lower section depth */}
      <div 
        className="absolute bottom-0 left-0 right-0 h-1/2 pointer-events-none z-0 backdrop-blur-[4px]"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.9) 100%)',
          maskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 25%)',
        }}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-12 z-50 animate-bounce">
          <div className="px-4 py-2 rounded-full bg-orange-600/90 text-white font-bold text-xs shadow-[0_0_20px_rgba(249,115,22,0.6)] border border-orange-300/80 backdrop-blur-md flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Raised Top Layout Position */}
      <div className="w-full flex flex-col items-center z-20 shrink-0 px-4 mt-2 mb-2">
        <div
          onClick={handleTitleClick}
          className="relative w-full max-w-[320px] sm:max-w-[360px] flex items-center justify-center cursor-pointer group"
          title="PICK'U PARTY"
        >
          <div className="relative w-full flex items-center justify-center animate-title-sweep-pulse">
            <img
              src={getAssetUrl(pickuPartyLogo)}
              alt="PICK'U PARTY"
              className="w-full h-auto max-h-[66px] sm:max-h-[78px] object-contain select-none pointer-events-none"
              style={{ mixBlendMode: 'screen' }}
            />
          </div>
        </div>

        <p className="text-[12px] sm:text-[14px] font-semibold tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] mt-1 mb-0">
          Swipe to select a game mode
        </p>
      </div>

      {/* Infinite Carousel Area */}
      <div 
        className="w-full flex flex-col items-center z-20 my-auto py-2 touch-pan-y"
        onTouchStart={(e) => handleTouchStart(e.touches[0].clientX)}
        onTouchMove={(e) => handleTouchMove(e.touches[0].clientX)}
        onTouchEnd={handleTouchEnd}
        onMouseDown={(e) => handleTouchStart(e.clientX)}
        onMouseMove={(e) => handleTouchMove(e.clientX)}
        onMouseUp={handleTouchEnd}
        onMouseLeave={handleTouchEnd}
      >
        <div className="relative w-full h-[180px] sm:h-[200px] flex items-center justify-center overflow-hidden">
          {[-1, 0, 1].map((offset) => {
            const cardIndex = getWrappedIndex(currentIndex + offset);
            const card = cards[cardIndex];
            const isCenter = offset === 0;

            // Compute continuous horizontal position shift based on drag physics
            const cardWidth = 310;
            const translateX = offset * cardWidth + dragOffset;

            return (
              <div
                key={`${card.id}-${offset}`}
                className={`absolute w-[80vw] max-w-[310px] aspect-video transition-transform ${
                  isSwiping ? 'duration-0' : 'duration-300 ease-out'
                }`}
                style={{
                  transform: `translateX(${translateX}px) scale(${
                    isCenter ? (Math.abs(dragOffset) > 20 ? 0.98 : 1) : 0.88
                  })`,
                  opacity: isCenter ? 1 : 0.45,
                  zIndex: isCenter ? 30 : 10,
                }}
              >
                <div
                  onClick={(e) => {
                    if (Math.abs(dragOffset) < 10 && isCenter) {
                      card.onClick(e);
                    }
                  }}
                  className={`relative rounded-[22px] p-3 bg-black/50 backdrop-blur-[4px] border-[1.5px] ${card.borderColor} ${card.shadowColor} flex flex-col items-center justify-end text-center cursor-pointer overflow-hidden w-full h-full transition-all duration-300 ${
                    isCenter && !isSwiping ? 'animate-subtle-bounce' : ''
                  }`}
                >
                  {/* Ribbon Badge */}
                  {card.badge && (
                    <div className="absolute top-0 right-0 w-24 h-24 overflow-hidden pointer-events-none z-20">
                      <div
                        className="absolute top-[18px] -right-[34px] w-[124px] transform rotate-45 py-0.5 text-center font-black tracking-widest text-[8px] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.6)] border-y border-white/50"
                        style={{
                          background: card.badgeGradient,
                          color: '#ffffff',
                        }}
                      >
                        {card.badge}
                      </div>
                    </div>
                  )}

                  {/* Card Background Image */}
                  <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
                    <img
                      src={getAssetUrl(card.image)}
                      alt={card.title}
                      className="w-full h-full object-cover object-top select-none"
                    />
                    <div
                      className="absolute inset-0"
                      style={{
                        background: 'linear-gradient(to bottom, transparent 35%, rgba(0,0,0,0.85) 100%)',
                      }}
                    />
                  </div>

                  {/* Card Actions */}
                  <div className="relative z-10 flex flex-col items-center w-full mt-auto">
                    <h2 className={`text-xs sm:text-sm font-black tracking-wider uppercase bg-gradient-to-r ${card.titleGradient} bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight`}>
                      {card.title}
                    </h2>
                    <p className={`text-[10px] sm:text-[11px] font-bold tracking-normal bg-gradient-to-r ${card.subGradient} bg-clip-text text-transparent mt-0.5 mb-1.5 leading-tight`}>
                      {card.subtitle}
                    </p>
                    <button
                      type="button"
                      className="relative w-full h-7 sm:h-8 rounded-full flex items-center justify-center shadow-[0_3px_14px_rgba(0,0,0,0.4)] border-[1.2px] border-white/70"
                      style={{ background: card.btnGradient }}
                    >
                      <span className="relative z-20 text-[9.5px] sm:text-[10px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                        {card.buttonText}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Dynamic Pagination Indicator Dots */}
        <div className="flex items-center gap-2 mt-3 z-20">
          {cards.map((_, i) => (
            <button
              key={i}
              onClick={() => handleDotClick(i)}
              className={`h-2 rounded-full transition-all duration-300 ${
                currentIndex === i
                  ? 'w-6 bg-cyan-400 shadow-[0_0_10px_rgba(6,182,212,0.8)]'
                  : 'w-2 bg-white/30 hover:bg-white/50'
              }`}
              aria-label={`Go to slide ${i + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Footer Version Notes & PWA Button */}
      <div className="shrink-0 mt-auto mb-2 flex flex-col items-center gap-1 select-none z-20">
        <PWAInstallButton variant="pill" />
        <button
          type="button"
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            if (onOpenVersionNotes) onOpenVersionNotes();
          }}
          className="text-[10px] sm:text-[11px] text-gray-300/80 hover:text-white transition-colors tracking-wide cursor-pointer focus:outline-none py-0.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]"
        >
          Version notes: v1.3.001
        </button>
      </div>
    </div>
  );
};
