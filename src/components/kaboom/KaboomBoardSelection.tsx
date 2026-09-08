/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { KaboomGridDimension } from '../../types';
import { SoundEngine, Haptics } from '../../lib/audio';
import chibiBombImg from '../../assets/images/Chibi Bomb Game.webp';

// Preload the image asset once at module level so the browser caches and never re-fetches
if (typeof window !== 'undefined') {
  const imgPreload = new Image();
  imgPreload.src = chibiBombImg;
}

interface KaboomBoardSelectionProps {
  onSelectGrid: (dimension: KaboomGridDimension) => void;
  onBackToHub?: () => void;
}

interface CardConfig {
  dim: KaboomGridDimension;
  label: string;
  dimText: string;
  bottomGradient: string;
  borderColor: string;
  hoverBorderColor: string;
  glowStyle: string;
  hoverGlowStyle: string;
  bgPosition: string;
  isWide?: boolean;
}

// Exact cards benchmarked from the game neon palette
const CARDS: CardConfig[] = [
  {
    dim: 2,
    label: 'QUICK',
    dimText: '2 X 2',
    bottomGradient: 'linear-gradient(to top, #00d2ff 0%, rgba(0, 180, 255, 0.75) 45%, transparent 85%)',
    borderColor: 'border-[#00e5ff]/60',
    hoverBorderColor: 'hover:border-[#00f0ff]',
    glowStyle: '0 0 20px rgba(0, 229, 255, 0.4), 0 8px 25px rgba(0, 0, 0, 0.7)',
    hoverGlowStyle: '0 0 35px rgba(0, 240, 255, 0.7), 0 10px 30px rgba(0, 0, 0, 0.85)',
    bgPosition: '78% 25%',
  },
  {
    dim: 3,
    label: 'CLASSIC',
    dimText: '3 X 3',
    bottomGradient: 'linear-gradient(to top, #0051ff 0%, rgba(30, 80, 255, 0.75) 45%, transparent 85%)',
    borderColor: 'border-[#1e50ff]/60',
    hoverBorderColor: 'hover:border-[#3b82f6]',
    glowStyle: '0 0 20px rgba(30, 80, 255, 0.45), 0 8px 25px rgba(0, 0, 0, 0.7)',
    hoverGlowStyle: '0 0 35px rgba(59, 130, 246, 0.7), 0 10px 30px rgba(0, 0, 0, 0.85)',
    bgPosition: '32% 25%',
  },
  {
    dim: 4,
    label: 'STAKES',
    dimText: '4 X 4',
    bottomGradient: 'linear-gradient(to top, #ff007f 0%, rgba(220, 0, 130, 0.75) 45%, transparent 85%)',
    borderColor: 'border-[#ff007f]/60',
    hoverBorderColor: 'hover:border-[#ff3399]',
    glowStyle: '0 0 20px rgba(255, 0, 127, 0.45), 0 8px 25px rgba(0, 0, 0, 0.7)',
    hoverGlowStyle: '0 0 35px rgba(255, 0, 127, 0.7), 0 10px 30px rgba(0, 0, 0, 0.85)',
    bgPosition: '78% 25%',
  },
  {
    dim: 5,
    label: 'CHAOS',
    dimText: '5 X 5',
    bottomGradient: 'linear-gradient(to top, #8000ff 0%, rgba(130, 0, 230, 0.75) 45%, transparent 85%)',
    borderColor: 'border-[#a855f7]/60',
    hoverBorderColor: 'hover:border-[#c084fc]',
    glowStyle: '0 0 20px rgba(168, 85, 247, 0.45), 0 8px 25px rgba(0, 0, 0, 0.7)',
    hoverGlowStyle: '0 0 35px rgba(168, 85, 247, 0.75), 0 10px 30px rgba(0, 0, 0, 0.85)',
    bgPosition: '32% 25%',
  },
  {
    dim: 6,
    label: 'HELL',
    dimText: '6 X 6',
    bottomGradient: 'linear-gradient(to top, #ff7b00 0%, rgba(245, 120, 0, 0.75) 45%, transparent 85%)',
    borderColor: 'border-[#ff7b00]/70',
    hoverBorderColor: 'hover:border-[#fb923c]',
    glowStyle: '0 0 25px rgba(255, 123, 0, 0.5), 0 8px 25px rgba(0, 0, 0, 0.7)',
    hoverGlowStyle: '0 0 40px rgba(255, 123, 0, 0.8), 0 10px 30px rgba(0, 0, 0, 0.85)',
    bgPosition: '50% 35%',
    isWide: true,
  },
];

export const KaboomBoardSelection: React.FC<KaboomBoardSelectionProps> = ({
  onSelectGrid,
}) => {
  const handleCardClick = (dim: KaboomGridDimension) => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    onSelectGrid(dim);
  };

  return (
    <div className="relative w-full h-full flex flex-col justify-between overflow-y-auto custom-scrollbar bg-[#070312] text-white select-none">
      {/* Top Hero Art Banner Background (Hardware accelerated CSS background, never flashes) */}
      <div
        className="absolute top-0 left-0 right-0 h-72 sm:h-80 bg-cover bg-top pointer-events-none z-0 filter brightness-110 contrast-105"
        style={{
          backgroundImage: `url("${chibiBombImg}")`,
        }}
      >
        {/* Seamless gradient fade from the bottom of the hero banner into deep canvas */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#070312]/50 to-[#070312]" />
      </div>

      {/* Main Content Container: Clean, vertical flow with generous spacing */}
      <div className="relative z-10 w-full max-w-sm sm:max-w-md mx-auto flex flex-col justify-between min-h-full px-4 pt-28 sm:pt-32 pb-8">
        {/* 3D Header: SELECT BOARD & Subtitle */}
        <div className="text-center mb-6">
          <h1 className="font-lilita text-4xl sm:text-5xl tracking-wide uppercase text-transparent bg-clip-text bg-gradient-to-b from-[#ffd24c] via-[#f97316] to-[#c2410c] text-shadow-3d-orange leading-none py-1">
            SELECT BOARD
          </h1>
          <p className="text-xs sm:text-sm font-medium text-white/95 mt-1 tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.85)]">
            Pick you grid size and take turn tapping ball !
          </p>
        </div>

        {/* Board Cards Grid: 2 Rows 2 Columns + 1 Wide Card */}
        <div className="grid grid-cols-2 gap-3.5 sm:gap-4 my-auto">
          {CARDS.map((card) => {
            const isWide = card.isWide;

            return (
              <div
                key={card.dim}
                id={`kaboom-board-card-${card.dim}`}
                onClick={() => handleCardClick(card.dim)}
                className={`group relative overflow-hidden rounded-[26px] cursor-pointer transition-all duration-200 border-2 ${card.borderColor} ${card.hoverBorderColor} active:scale-[0.97] ${
                  isWide ? 'col-span-2 h-32 sm:h-38' : 'col-span-1 h-40 sm:h-44'
                } flex flex-col justify-end items-center text-center p-3 sm:p-4`}
                style={{
                  boxShadow: card.glowStyle,
                }}
              >
                {/* Card Background Art using CSS background - 0 reload/rebuff, GPU composited */}
                <div
                  className="absolute inset-0 z-0 bg-cover pointer-events-none filter brightness-95 group-hover:scale-105 transition-transform duration-300"
                  style={{
                    backgroundImage: `url("${chibiBombImg}")`,
                    backgroundPosition: card.bgPosition,
                  }}
                />

                {/* Bottom Color Wash Gradient matched from game theme */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background: card.bottomGradient,
                  }}
                />

                {/* Subtle top vignette */}
                <div className="absolute inset-0 bg-gradient-to-t from-transparent via-transparent to-black/30 pointer-events-none" />

                {/* Dynamic hover glow overlay for instant tactile feedback */}
                <div
                  className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                  style={{
                    boxShadow: `inset ${card.hoverGlowStyle}`,
                  }}
                />

                {/* Card Content: Mode Title + Giant Rounded Dimension */}
                <div className="relative z-10 flex flex-col items-center justify-center leading-none">
                  {/* Mode Label (QUICK, CLASSIC, STAKES, CHAOS, HELL) */}
                  <div className="font-lilita text-xl sm:text-2xl tracking-wider text-[#ffba08] text-shadow-label mb-0.5">
                    {card.label}
                  </div>

                  {/* Dimension Text (2 X 2, 3 X 3, 4 X 4, 5 X 5, 6 X 6) */}
                  <div className="font-lilita text-4xl sm:text-5xl text-white tracking-normal text-shadow-dimension">
                    {card.dimText}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtle bottom spacing placeholder for balanced vertical rhythm */}
        <div className="h-4" />
      </div>
    </div>
  );
};
