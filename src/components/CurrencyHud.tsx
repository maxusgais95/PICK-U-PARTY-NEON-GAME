/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Star } from 'lucide-react';
import { SoundEngine, Haptics } from '../lib/audio';
import { EconomyState } from '../lib/economy';

interface CurrencyHudProps {
  stars: number;
  onOpenStore: () => void;
  onEconomyUpdated?: (state: EconomyState) => void;
  onRefillStars?: (amount: number) => void;
}

export const CurrencyHud: React.FC<CurrencyHudProps> = ({
  stars,
  onOpenStore,
}) => {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    onOpenStore();
  };

  return (
    <div className="relative pointer-events-auto flex items-center justify-center select-none">
      {/* Centered Top Star Currency Pill */}
      <button
        id="star-currency-hud"
        type="button"
        onClick={handleClick}
        className="group relative flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/50 shadow-[0_0_14px_rgba(245,158,11,0.35)] hover:border-amber-300 active:scale-95 transition-all cursor-pointer shrink-0"
        title="Star Currency • Tap to open Party Store"
        aria-label={`Star balance: ${stars.toLocaleString()}`}
      >
        {/* Ambient Gold Radial Glow behind Star */}
        <div className="absolute -left-1 w-6 h-6 rounded-full bg-amber-400/20 blur-md pointer-events-none group-hover:bg-amber-400/35 transition-all" />

        {/* 3D Radiant Star Icon */}
        <div className="relative flex items-center justify-center shrink-0">
          <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-300 fill-amber-400 stroke-amber-200 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse" />
        </div>

        {/* Star Currency Balance */}
        <span className="font-header font-bold text-xs sm:text-sm tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] leading-none pt-0.5 whitespace-nowrap">
          {stars.toLocaleString()}
        </span>
      </button>
    </div>
  );
};
