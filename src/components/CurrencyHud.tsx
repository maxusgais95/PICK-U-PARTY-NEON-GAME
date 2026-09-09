/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Star, Plus, Info, X, Sparkles, CheckCircle2 } from 'lucide-react';
import { SoundEngine, Haptics } from '../lib/audio';
import { refillPrototypeStars, EconomyState } from '../lib/economy';

interface CurrencyHudProps {
  stars: number;
  onOpenStore: () => void;
  onEconomyUpdated?: (state: EconomyState) => void;
  onRefillStars?: (amount: number) => void;
}

export const CurrencyHud: React.FC<CurrencyHudProps> = ({
  stars,
  onOpenStore,
  onEconomyUpdated,
  onRefillStars,
}) => {
  const [showInfo, setShowInfo] = useState(false);
  const [refillToast, setRefillToast] = useState<string | null>(null);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    onOpenStore();
  };

  const handlePlusClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    setShowInfo(true);
  };

  const handleInfoClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    setShowInfo((prev) => !prev);
  };

  const handleRefill = (amount: number) => {
    SoundEngine.playTeamDivisionChime();
    Haptics.touchSuccess();
    const result = refillPrototypeStars(amount);
    if (onEconomyUpdated) {
      onEconomyUpdated(result.updatedState);
    }
    if (onRefillStars) {
      onRefillStars(amount);
    }
    setRefillToast(`+${amount.toLocaleString()} Stars Refilled!`);
    setTimeout(() => {
      setRefillToast(null);
    }, 2000);
  };

  return (
    <div className="relative pointer-events-auto flex items-center justify-center">
      {/* Centered Top Star Currency Pill */}
      <div
        id="star-currency-hud"
        onClick={handleClick}
        className="group relative flex items-center gap-1.5 sm:gap-2 px-3 sm:px-3.5 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-400/50 shadow-[0_0_16px_rgba(245,158,11,0.35)] hover:border-amber-300 active:scale-95 transition-all cursor-pointer select-none"
        title="Star Currency - Tap to open Store"
      >
        {/* Ambient Gold Radial Glow behind Star */}
        <div className="absolute -left-1 w-7 h-7 rounded-full bg-amber-400/20 blur-md pointer-events-none group-hover:bg-amber-400/35 transition-all" />

        {/* 3D Radiant Star Icon */}
        <div className="relative flex items-center justify-center">
          <Star className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-amber-300 fill-amber-400 stroke-amber-200 drop-shadow-[0_0_6px_rgba(251,191,36,0.9)] animate-pulse" />
        </div>

        {/* Star Currency Balance */}
        <span className="font-header font-bold text-xs sm:text-sm tracking-wider text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)] leading-none pt-0.5">
          {stars.toLocaleString()}
        </span>

        {/* Mini Plus Button (Opens Star Refill) */}
        <button
          type="button"
          onClick={handlePlusClick}
          className="w-4 h-4 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-110 flex items-center justify-center text-black shadow-[0_0_6px_rgba(245,158,11,0.8)] ml-0.5 cursor-pointer active:scale-90 transition-transform"
          title="Refill Stars"
          aria-label="Refill Stars"
        >
          <Plus className="w-3 h-3 stroke-[3]" />
        </button>

        {/* Mini Info Trigger Button */}
        <button
          type="button"
          onClick={handleInfoClick}
          className="text-amber-300/70 hover:text-amber-200 ml-0.5 p-0.5 transition-colors cursor-pointer"
          title="Currency Info & Refill"
          aria-label="Star Currency Info"
        >
          <Info className="w-3 h-3 stroke-[2.2]" />
        </button>
      </div>

      {/* Currency Info & Prototype Refill Dialog */}
      {showInfo && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4 animate-fadeIn"
          onClick={() => setShowInfo(false)}
        >
          <div
            className="relative w-full max-w-sm rounded-[24px] bg-neutral-950/95 border border-amber-400/60 p-5 shadow-[0_0_40px_rgba(245,158,11,0.35)] text-white text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowInfo(false)}
              className="absolute top-3.5 right-3.5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="w-12 h-12 rounded-full bg-gradient-to-b from-amber-400/20 to-amber-600/30 border border-amber-400/60 flex items-center justify-center mx-auto mb-2.5 shadow-[0_0_20px_rgba(245,158,11,0.5)]">
              <Star className="w-6 h-6 text-amber-300 fill-amber-400 animate-pulse" />
            </div>

            <h3 className="font-header text-lg font-bold tracking-wide uppercase text-amber-300 mb-1">
              Star Currency
            </h3>
            <p className="text-xs text-gray-300 mb-3">
              Use Stars in the Party Store to unlock exclusive skins for Bottles, Bombs, Balls, and Bonus cards!
            </p>

            {/* Currency Specs Table */}
            <div className="bg-black/50 rounded-xl p-3 border border-white/10 mb-3 text-left space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Current Balance:</span>
                <span className="font-bold text-amber-300 flex items-center gap-1 font-header">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {stars.toLocaleString()} Stars
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-gray-400">Earning condition:</span>
                <span className="text-gray-400 italic">—</span>
              </div>
            </div>

            {/* Prototype Star Refill Faucet */}
            <div className="bg-gradient-to-b from-amber-500/15 to-orange-500/10 rounded-2xl p-3.5 border border-amber-400/40 mb-4 text-left">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-xs font-header font-bold text-amber-300 uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>PROTOTYPE STAR REFILL</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-amber-400/20 text-[10px] font-bold text-amber-200 border border-amber-400/30">
                  Instant Free
                </span>
              </div>
              <p className="text-[11px] text-gray-300 mb-3 leading-relaxed">
                Need more Stars to test unlocking bottle skins, bombs, and spheres? Tap any refill button below:
              </p>

              {/* Refill Quick Buttons */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleRefill(500)}
                  className="py-2 px-1 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-amber-400/40 text-amber-300 font-header font-bold text-xs active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-[10px] text-gray-400 font-normal">Add</span>
                  <span>+500 ⭐</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRefill(1000)}
                  className="py-2 px-1 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 hover:brightness-110 text-neutral-950 font-header font-bold text-xs active:scale-95 transition-all shadow-[0_0_12px_rgba(245,158,11,0.5)] flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-[10px] text-neutral-800 font-medium">Popular</span>
                  <span>+1,000 ⭐</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRefill(5000)}
                  className="py-2 px-1 rounded-xl bg-neutral-900/90 hover:bg-neutral-800 border border-amber-400/40 text-amber-300 font-header font-bold text-xs active:scale-95 transition-all shadow-[0_2px_8px_rgba(0,0,0,0.4)] flex flex-col items-center justify-center cursor-pointer"
                >
                  <span className="text-[10px] text-gray-400 font-normal">Max</span>
                  <span>+5,000 ⭐</span>
                </button>
              </div>

              {/* Toast Feedback */}
              {refillToast && (
                <div className="mt-2.5 py-1 px-2.5 rounded-lg bg-emerald-500/20 border border-emerald-400/50 flex items-center justify-center gap-1.5 text-xs text-emerald-300 font-medium animate-fadeIn">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{refillToast}</span>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => {
                setShowInfo(false);
                onOpenStore();
              }}
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:brightness-110 text-white font-header font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.4)] border border-amber-300/60 active:scale-95 transition-all cursor-pointer"
            >
              Open Party Store
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

