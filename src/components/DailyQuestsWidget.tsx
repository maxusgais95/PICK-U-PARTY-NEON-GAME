/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Package, Sparkles } from 'lucide-react';
import { DailyQuest } from '../lib/economy';
import { SoundEngine, Haptics } from '../lib/audio';

interface DailyQuestsWidgetProps {
  quests: DailyQuest[];
  onOpenQuests: () => void;
}

export const DailyQuestsWidget: React.FC<DailyQuestsWidgetProps> = ({
  quests,
  onOpenQuests,
}) => {
  const total = quests.length || 5;
  const completed = quests.filter((q) => q.currentCount >= q.targetCount).length;
  const progressPercent = Math.min(100, Math.round((completed / total) * 100));
  const hasUnclaimed = quests.some(
    (q) => q.currentCount >= q.targetCount && !q.isClaimed
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    onOpenQuests();
  };

  return (
    <button
      type="button"
      id="daily-quests-widget-btn"
      onClick={handleClick}
      aria-label="Open Daily Quests"
      className="group relative flex flex-col justify-center px-3 py-2 rounded-[18px] bg-black/50 backdrop-blur-md border border-cyan-400/40 shadow-[0_0_16px_rgba(6,182,212,0.3)] hover:border-cyan-300 active:scale-95 transition-all text-left w-[110px] sm:w-[124px] cursor-pointer pointer-events-auto select-none"
    >
      {/* Subtle Cyan Ambient Glow */}
      <div className="absolute -inset-0.5 rounded-[18px] bg-cyan-400/10 blur-sm pointer-events-none group-hover:bg-cyan-400/20 transition-all" />

      {/* Unclaimed Notification Indicator Ping */}
      {hasUnclaimed && (
        <span className="absolute -top-1 -right-1 flex h-3 w-3">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
          <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-400 border-2 border-black" />
        </span>
      )}

      {/* Top Row: Progress Count & Chest Icon */}
      <div className="relative z-10 flex items-center justify-between w-full mb-1">
        <span className="font-header font-bold text-xs sm:text-sm text-cyan-300 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] leading-none">
          {completed}/{total}
        </span>

        <div className="relative flex items-center justify-center">
          {/* Animated Treasure Chest / Gift Badge */}
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-amber-500 via-yellow-400 to-purple-500 flex items-center justify-center shadow-[0_0_8px_rgba(245,158,11,0.6)] border border-yellow-200/60 transform group-hover:rotate-6 transition-transform">
            <Package className="w-3 h-3 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
          </div>
          {hasUnclaimed && (
            <Sparkles className="w-2.5 h-2.5 text-amber-300 absolute -top-1 -right-1 animate-pulse" />
          )}
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="relative z-10 w-full h-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/30 overflow-hidden mb-1">
        <div
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-cyan-200 shadow-[0_0_8px_rgba(6,182,212,0.9)] transition-all duration-500"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Bottom Label: DAILY QUESTS */}
      <span className="relative z-10 font-header font-bold text-[9px] sm:text-[10px] tracking-wider text-cyan-100/90 uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] leading-none text-center block w-full pt-0.5">
        DAILY QUESTS
      </span>
    </button>
  );
};
