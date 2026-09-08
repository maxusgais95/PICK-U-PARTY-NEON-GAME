/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, Star, Bomb, Sparkles, Flame } from 'lucide-react';
import { KaboomTile } from '../../types';

interface KaboomBallProps {
  tile: KaboomTile;
  dimension: number;
  disabled: boolean;
  onTap: (tile: KaboomTile, event: React.MouseEvent | React.TouchEvent) => void;
  isGameOver: boolean;
}

export const KaboomBall: React.FC<KaboomBallProps> = ({
  tile,
  dimension,
  disabled,
  onTap,
  isGameOver,
}) => {
  // Sizing adjustments based on dimension to ensure perfect fit on mobile screens
  const getBallSizeClass = () => {
    switch (dimension) {
      case 2:
        return 'w-24 h-24 sm:w-28 sm:h-28 text-2xl';
      case 3:
        return 'w-20 h-20 sm:w-24 sm:h-24 text-xl';
      case 4:
        return 'w-16 h-16 sm:w-18 sm:h-18 text-base';
      case 5:
        return 'w-12 h-12 sm:w-14 sm:h-14 text-sm';
      case 6:
        return 'w-10 h-10 sm:w-12 sm:h-12 text-xs';
      default:
        return 'w-16 h-16 text-base';
    }
  };

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (tile.revealed || disabled) return;
    onTap(tile, e);
  };

  // 1. REVEALED STATE
  if (tile.revealed) {
    if (tile.type === 'bomb') {
      if (tile.isDefused) {
        return (
          <div
            id={`kaboom-tile-${tile.id}`}
            className={`relative rounded-full flex items-center justify-center bg-gradient-to-tr from-emerald-500 via-teal-400 to-amber-300 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.8)] border-2 border-amber-300 animate-bonus-bounce ${getBallSizeClass()}`}
          >
            <Bomb className="w-1/2 h-1/2 text-slate-950 drop-shadow-[0_1px_2px_rgba(255,255,255,0.5)]" />
            <Sparkles className="absolute -top-1 -right-1 w-5 h-5 text-amber-200 animate-ping" />
          </div>
        );
      }

      return (
        <div
          id={`kaboom-tile-${tile.id}`}
          className={`relative rounded-full flex items-center justify-center transition-all duration-300 ${getBallSizeClass()} ${
            tile.isDetonated
              ? 'animate-screen-shake bg-gradient-to-br from-red-500 via-orange-600 to-red-900 shadow-[0_0_35px_rgba(239,68,68,0.95)] border-2 border-amber-300'
              : 'bg-red-950/80 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
          }`}
        >
          <div className="absolute inset-0 rounded-full bg-red-500/20 animate-ping opacity-75" />
          <Bomb className="w-1/2 h-1/2 text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.9)] animate-pulse" />
          <Flame className="absolute -top-1 -right-1 w-5 h-5 text-amber-300 animate-bounce" />
        </div>
      );
    }

    if (tile.type === 'bonus') {
      return (
        <div
          id={`kaboom-tile-${tile.id}`}
          className={`relative rounded-full flex items-center justify-center bg-gradient-to-tr from-amber-500 via-yellow-400 to-orange-400 text-slate-950 shadow-[0_0_25px_rgba(245,158,11,0.7)] border-2 border-yellow-200 animate-bonus-bounce ${getBallSizeClass()}`}
        >
          <Star className="w-1/2 h-1/2 fill-current drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)] animate-spin-slow" />
          <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-yellow-100 animate-ping" />
        </div>
      );
    }

    // SAFE BALL REVEALED
    return (
      <div
        id={`kaboom-tile-${tile.id}`}
        className={`relative rounded-full flex items-center justify-center bg-emerald-950/70 border-2 border-emerald-400/60 shadow-[0_0_15px_rgba(16,185,129,0.35)] animate-ball-pop ${getBallSizeClass()}`}
      >
        {/* Recessed socket metallic rim */}
        <div className="absolute inset-1 rounded-full border border-emerald-500/20 bg-emerald-900/40 backdrop-blur-sm flex items-center justify-center">
          <Check className="w-1/2 h-1/2 stroke-[3] text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
        </div>
      </div>
    );
  }

  // 2. UNREVEALED BUT GAME OVER (Show ghost outline of what was there)
  if (isGameOver) {
    return (
      <div
        id={`kaboom-tile-${tile.id}`}
        className={`relative rounded-full flex items-center justify-center opacity-40 border border-purple-500/30 bg-purple-950/20 ${getBallSizeClass()}`}
      >
        {tile.type === 'bonus' && <Star className="w-1/3 h-1/3 text-amber-400/60" />}
        {tile.type === 'bomb' && <Bomb className="w-1/3 h-1/3 text-red-400/60" />}
        {tile.type === 'safe' && <div className="w-2 h-2 rounded-full bg-purple-400/30" />}
      </div>
    );
  }

  // 3. UNREVEALED INTERACTIVE 3D TACTILE SPHERE
  return (
    <button
      id={`kaboom-tile-${tile.id}`}
      type="button"
      onClick={handleClick}
      disabled={disabled}
      aria-label={`Grid ball row ${tile.row + 1}, column ${tile.col + 1}`}
      className={`group relative rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-150 transform active:scale-90 active:translate-y-1 focus:outline-none ${getBallSizeClass()}`}
      style={{
        // 3D Spherical Lighting: Highlight top-left, rich radial saturation, deep shadow bottom-right
        background:
          'radial-gradient(circle at 35% 30%, #fb923c 0%, #ea580c 40%, #c2410c 75%, #7c2d12 100%)',
        boxShadow:
          '0 8px 18px rgba(0,0,0,0.55), inset 0 2px 5px rgba(255,255,255,0.7), inset 0 -5px 10px rgba(0,0,0,0.65), 0 0 12px rgba(234,88,12,0.3)',
      }}
    >
      {/* Specular White Gloss Glare on top-left of sphere */}
      <div
        className="absolute top-[12%] left-[18%] w-[38%] h-[32%] rounded-full pointer-events-none opacity-80 group-hover:opacity-95 transition-opacity"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.4) 40%, transparent 80%)',
          transform: 'rotate(-25deg)',
        }}
      />

      {/* Cyber Neon Ring Core */}
      <div className="w-2.5 h-2.5 rounded-full bg-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)] opacity-60 group-hover:scale-125 transition-transform" />

      {/* Subtle outer neon pulse ring on hover */}
      <div className="absolute inset-0 rounded-full border border-orange-300/30 opacity-0 group-hover:opacity-100 transition-opacity" />
    </button>
  );
};
