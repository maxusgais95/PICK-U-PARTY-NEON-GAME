/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Check, Star, Bomb, Shield } from 'lucide-react';
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
  // Alternating neon checkerboard colors matching reference UI
  // Row 0: Pink, Cyan, Pink, Cyan...
  // Row 1: Cyan, Pink, Cyan, Pink...
  const isPink = (tile.row + tile.col) % 2 === 0;

  // Responsive corner radiuses based on grid dimension
  const getRadiusClasses = () => {
    if (dimension <= 3) {
      return {
        outer: 'rounded-2xl',
        inner: 'rounded-xl',
        inset: 'inset-[4px] sm:inset-[5px]',
      };
    }
    if (dimension === 4) {
      return {
        outer: 'rounded-xl sm:rounded-2xl',
        inner: 'rounded-lg sm:rounded-xl',
        inset: 'inset-[3px] sm:inset-[4px]',
      };
    }
    return {
      outer: 'rounded-lg sm:rounded-xl',
      inner: 'rounded-md sm:rounded-lg',
      inset: 'inset-[2px] sm:inset-[3px]',
    };
  };

  const { outer: outerRadius, inner: innerRadius, inset: insetClass } = getRadiusClasses();

  const handleClick = (e: React.MouseEvent | React.TouchEvent) => {
    if (tile.revealed || disabled) return;
    onTap(tile, e);
  };

  // 1. REVEALED STATE
  if (tile.revealed) {
    // A. BOMB
    if (tile.type === 'bomb') {
      if (tile.isDefused) {
        return (
          <div
            id={`kaboom-tile-${tile.id}`}
            className={`relative w-full aspect-square ${outerRadius} flex items-center justify-center border-2 border-emerald-400 bg-[#03150d]/90 shadow-[0_0_20px_rgba(16,185,129,0.8),inset_0_0_10px_rgba(16,185,129,0.4)] animate-bonus-bounce`}
          >
            <div className={`absolute ${insetClass} ${innerRadius} border border-emerald-300/60 flex items-center justify-center bg-emerald-950/40`}>
              <Bomb className="w-1/2 h-1/2 text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              <Shield className="absolute -top-1 -right-1 w-4 h-4 text-emerald-200 animate-pulse" />
            </div>
          </div>
        );
      }

      return (
        <div
          id={`kaboom-tile-${tile.id}`}
          className={`relative w-full aspect-square ${outerRadius} flex items-center justify-center transition-all duration-300 ${
            tile.isDetonated
              ? 'border-2 border-red-500 bg-red-950/95 shadow-[0_0_30px_rgba(239,68,68,0.95),inset_0_0_14px_rgba(239,68,68,0.6)] animate-screen-shake'
              : 'border border-red-500/60 bg-red-950/70 shadow-[0_0_15px_rgba(239,68,68,0.4)]'
          }`}
        >
          <div className={`absolute ${insetClass} ${innerRadius} border border-red-500/60 flex items-center justify-center bg-black/40 overflow-hidden`}>
            <div className="absolute inset-0 bg-red-600/20 animate-ping opacity-75" />
            <Bomb className="w-1/2 h-1/2 text-red-200 drop-shadow-[0_0_12px_rgba(255,255,255,0.9)] animate-pulse" />
          </div>
        </div>
      );
    }

    // B. BONUS: "flash, flicker, hyper speed" with specific bonus sprite
    if (tile.type === 'bonus') {
      const bonus = tile.bonusItem;
      const borderColor = bonus?.borderColor || 'border-amber-300';
      const glowColor = bonus?.glowColor || 'rgba(255, 230, 0, 0.95)';

      return (
        <div
          id={`kaboom-tile-${tile.id}`}
          className="relative z-30 w-full aspect-square flex items-center justify-center overflow-visible"
        >
          {/* Expanded Soft Radial Glow Aura - Generous bounding box ensures light diffuses smoothly without any square clipping */}
          <div
            className="absolute -inset-4 sm:-inset-6 -z-10 rounded-full pointer-events-none opacity-80 blur-xl animate-pulse"
            style={{
              background: `radial-gradient(circle, ${glowColor} 20%, rgba(0, 240, 255, 0.45) 55%, transparent 75%)`,
            }}
          />

          {/* Inner Bonus Tile Frame */}
          <div
            className={`relative w-full h-full ${outerRadius} flex items-center justify-center border-2 ${borderColor} bg-black/95 overflow-hidden animate-hyper-flicker`}
            style={{
              boxShadow: `0 0 25px ${glowColor}, inset 0 0 12px ${glowColor}`,
            }}
          >
            {/* Rotating Hyper-Speed Light Rays */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden rounded-[inherit]">
              <div
                className="w-[190%] h-[190%] rounded-full animate-spin-hyper opacity-80"
                style={{
                  background:
                    'conic-gradient(from 0deg, transparent 0deg, #ffe600 20deg, transparent 40deg, #ff007f 60deg, transparent 80deg, #00f0ff 100deg, transparent 120deg, #ffe600 140deg, transparent 160deg, #ff007f 180deg, transparent 200deg, #00f0ff 220deg, transparent 240deg, #ffe600 260deg, transparent 280deg, #ff007f 300deg, transparent 320deg, #00f0ff 340deg, transparent 360deg)',
                }}
              />
            </div>

            {/* Inner Recessed Frame */}
            <div className={`absolute ${insetClass} ${innerRadius} border border-yellow-200/90 flex flex-col items-center justify-center bg-black/70 backdrop-blur-xs z-10 overflow-hidden`}>
              {bonus ? (
                <img
                  src={bonus.image}
                  alt={bonus.name}
                  className="w-full h-full object-cover rounded-[inherit] relative z-10 transform scale-105"
                />
              ) : (
                <Star className="w-1/2 h-1/2 fill-amber-300 text-amber-200 animate-hyper-pulse drop-shadow-[0_0_16px_rgba(255,230,0,1)] relative z-10" />
              )}

              {/* Glowing Bonus Badge with Star Currency amount */}
              <div className="absolute bottom-0.5 inset-x-0.5 flex justify-center z-20">
                <span className="px-1.5 py-0.2 rounded-full bg-black/90 border border-amber-300/80 text-[7px] sm:text-[8px] font-black text-amber-300 uppercase tracking-tight shadow-[0_0_8px_rgba(255,230,0,0.8)] leading-tight flex items-center gap-0.5 whitespace-nowrap">
                  <Star className="w-2 h-2 fill-amber-300 text-amber-300 inline" />
                  +{bonus?.starReward || 10}
                </span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    // C. SAFE TILE REVEALED
    return (
      <div
        id={`kaboom-tile-${tile.id}`}
        className={`relative w-full aspect-square ${outerRadius} flex items-center justify-center border-2 border-emerald-400 bg-emerald-950/80 shadow-[0_0_16px_rgba(16,185,129,0.5),inset_0_0_8px_rgba(16,185,129,0.3)] animate-ball-pop`}
      >
        <div className={`absolute ${insetClass} ${innerRadius} border border-emerald-400/60 bg-[#02130b]/80 backdrop-blur-sm flex items-center justify-center`}>
          <Check className="w-1/2 h-1/2 stroke-[3] text-emerald-300 drop-shadow-[0_0_8px_rgba(52,211,153,0.85)]" />
        </div>
      </div>
    );
  }

  // 2. UNREVEALED BUT GAME OVER (Ghost state)
  if (isGameOver) {
    return (
      <div
        id={`kaboom-tile-${tile.id}`}
        className={`relative w-full aspect-square ${outerRadius} flex items-center justify-center opacity-45 border ${
          isPink ? 'border-[#ff2a85]/40 bg-[#ff2a85]/5' : 'border-[#00f0ff]/40 bg-[#00f0ff]/5'
        }`}
      >
        <div
          className={`absolute ${insetClass} ${innerRadius} border ${
            isPink ? 'border-[#ff2a85]/30' : 'border-[#00f0ff]/30'
          } flex items-center justify-center overflow-hidden`}
        >
          {tile.type === 'bonus' && (
            tile.bonusItem ? (
              <img
                src={tile.bonusItem.image}
                alt={tile.bonusItem.name}
                className="w-full h-full object-cover rounded-[inherit] opacity-70"
              />
            ) : (
              <Star className="w-1/2 h-1/2 text-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
            )
          )}
          {tile.type === 'bomb' && (
            <Bomb className="w-1/2 h-1/2 text-red-400 drop-shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
          )}
          {tile.type === 'safe' && (
            <div className="w-[62%] h-[62%] rounded-full border border-emerald-400/40 bg-emerald-950/30 flex items-center justify-center">
              <Check className="w-1/2 h-1/2 text-emerald-400/50" />
            </div>
          )}
        </div>
      </div>
    );
  }

  // 3. UNREVEALED: NEON GRID TILE (Reference UI) WITH 3D BALL SPRITE SITTING ON IT
  return (
    <div
      id={`kaboom-tile-${tile.id}`}
      className={`relative w-full aspect-square ${outerRadius} flex items-center justify-center select-none overflow-hidden ${
        isPink
          ? 'border-[2px] sm:border-[2.5px] border-[#ff2a85] bg-[#06020c] animate-neon-breathing-pink shadow-[0_0_12px_rgba(255,42,133,0.75),inset_0_0_8px_rgba(255,42,133,0.35)]'
          : 'border-[2px] sm:border-[2.5px] border-[#00f0ff] bg-[#01040d] animate-neon-breathing-cyan shadow-[0_0_12px_rgba(0,240,255,0.75),inset_0_0_8px_rgba(0,240,255,0.35)]'
      }`}
    >
      {/* Outer Recessed Bevel / Inner Neon Chamber Border (from reference image) */}
      <div
        className={`absolute ${insetClass} ${innerRadius} border ${
          isPink
            ? 'border-[#ff2a85]/70 shadow-[inset_0_0_6px_rgba(255,42,133,0.4)]'
            : 'border-[#00f0ff]/70 shadow-[inset_0_0_6px_rgba(0,240,255,0.4)]'
        } bg-gradient-to-b from-[#08031a] via-[#040612] to-[#010206] flex items-center justify-center overflow-hidden`}
      >
        {/* Deep Perspective Ambient Radial Glow in center cavity */}
        <div
          className="absolute inset-0 pointer-events-none opacity-60"
          style={{
            background: isPink
              ? 'radial-gradient(circle at 50% 50%, rgba(255,42,133,0.2) 0%, rgba(255,42,133,0.04) 65%, transparent 85%)'
              : 'radial-gradient(circle at 50% 50%, rgba(0,240,255,0.2) 0%, rgba(0,240,255,0.04) 65%, transparent 85%)',
          }}
        />

        {/* Gloss Reflection across upper half of tile */}
        <div className="absolute top-0 left-0 right-0 h-[45%] bg-gradient-to-b from-white/[0.12] to-transparent pointer-events-none rounded-t-[inherit]" />

        {/* Shimmer Lights Animation Beam sweeping continuously across the tile */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]">
          <div
            className="absolute -inset-full w-[260%] h-[260%] bg-gradient-to-r from-transparent via-white/20 to-transparent animate-neon-tile-shimmer"
            style={{
              animationDelay: `${((tile.row * dimension + tile.col) % 7) * 0.38}s`,
            }}
          />
        </div>

        {/* Drop shadow cast by the ball onto the tile floor */}
        <div className="absolute bottom-[9%] w-[58%] h-[16%] rounded-full bg-black/85 blur-[3px] pointer-events-none" />
      </div>

      {/* 3D TACTILE BALL SPRITE SITTING ON TOP OF THE TILE */}
      <button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        aria-label={`Tap ball at row ${tile.row + 1}, column ${tile.col + 1}`}
        className="group relative z-10 w-[74%] h-[74%] rounded-full flex items-center justify-center cursor-pointer select-none transition-all duration-150 transform active:scale-90 active:translate-y-1 hover:scale-105 focus:outline-none"
        style={{
          // 3D Spherical Lighting with rich tactile depth
          background:
            'radial-gradient(circle at 35% 28%, #fed7aa 0%, #fb923c 25%, #ea580c 55%, #c2410c 80%, #7c2d12 100%)',
          boxShadow: isPink
            ? '0 6px 14px rgba(0,0,0,0.85), inset 0 2px 4px rgba(255,255,255,0.75), inset 0 -4px 8px rgba(0,0,0,0.7), 0 0 10px rgba(255,42,133,0.4)'
            : '0 6px 14px rgba(0,0,0,0.85), inset 0 2px 4px rgba(255,255,255,0.75), inset 0 -4px 8px rgba(0,0,0,0.7), 0 0 10px rgba(0,240,255,0.4)',
        }}
      >
        {/* Specular White Gloss Glare on top-left of sphere */}
        <div
          className="absolute top-[10%] left-[16%] w-[38%] h-[32%] rounded-full pointer-events-none opacity-85 group-hover:opacity-100 transition-opacity"
          style={{
            background:
              'radial-gradient(circle at 50% 35%, rgba(255,255,255,0.98) 0%, rgba(255,255,255,0.45) 45%, transparent 80%)',
            transform: 'rotate(-25deg)',
          }}
        />

        {/* Ambient rim reflection from the glowing neon tile underneath */}
        <div
          className="absolute bottom-0 inset-x-[15%] h-[25%] rounded-b-full pointer-events-none opacity-60 blur-[1px]"
          style={{
            background: isPink
              ? 'radial-gradient(ellipse at bottom, rgba(255,42,133,0.75) 0%, transparent 75%)'
              : 'radial-gradient(ellipse at bottom, rgba(0,240,255,0.75) 0%, transparent 75%)',
          }}
        />

        {/* Cyber Neon Core Pin on the ball */}
        <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-white/60 shadow-[0_0_8px_rgba(255,255,255,0.9)] opacity-70 group-hover:scale-125 transition-transform border border-white/60" />

        {/* Hover glow sheen ring */}
        <div className="absolute inset-0 rounded-full border border-orange-200/40 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
    </div>
  );
};
