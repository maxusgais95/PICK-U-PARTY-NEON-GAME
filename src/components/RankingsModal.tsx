/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Crown, Trophy, Medal, Flame, Star } from 'lucide-react';
import { SoundEngine, Haptics } from '../lib/audio';

interface RankingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const LEADERBOARD_CATEGORIES = [
  { id: 'roulette', label: 'ROULETTE STREAKS' },
  { id: 'bottle', label: 'SPIN KINGS' },
  { id: 'kaboom', label: 'BOMB DEFUSERS' },
];

const LEADERBOARD_DATA = {
  roulette: [
    { rank: 1, name: 'DJ NeonViper', score: '42 Wins', stars: 2500, avatar: '🎧' },
    { rank: 2, name: 'PixelQueen', score: '38 Wins', stars: 1950, avatar: '👑' },
    { rank: 3, name: 'BassDrop99', score: '35 Wins', stars: 1600, avatar: '⚡' },
    { rank: 4, name: 'PartySamurai', score: '29 Wins', stars: 1200, avatar: '🔥' },
    { rank: 5, name: 'You (Party Host)', score: '12 Wins', stars: 1250, avatar: '⭐', isUser: true },
  ],
  bottle: [
    { rank: 1, name: 'ChampagneChibi', score: '184 Spins', stars: 3200, avatar: '🍾' },
    { rank: 2, name: 'VortexMaster', score: '156 Spins', stars: 2400, avatar: '🌀' },
    { rank: 3, name: 'DiscoFever', score: '132 Spins', stars: 1800, avatar: '✨' },
    { rank: 4, name: 'You (Party Host)', score: '45 Spins', stars: 1250, avatar: '⭐', isUser: true },
    { rank: 5, name: 'RaveBunny', score: '39 Spins', stars: 900, avatar: '🐰' },
  ],
  kaboom: [
    { rank: 1, name: 'BombSquadPro', score: '6x6 Cleared', stars: 4500, avatar: '💣' },
    { rank: 2, name: 'TacticalRave', score: '5x5 Cleared', stars: 3100, avatar: '🛡️' },
    { rank: 3, name: 'LuckyFingers', score: '4x4 Cleared', stars: 2200, avatar: '🍀' },
    { rank: 4, name: 'You (Party Host)', score: '4x4 Cleared', stars: 1250, avatar: '⭐', isUser: true },
    { rank: 5, name: 'BoomBuster', score: '3x3 Cleared', stars: 1100, avatar: '🧨' },
  ],
};

export const RankingsModal: React.FC<RankingsModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState<'roulette' | 'bottle' | 'kaboom'>('roulette');

  if (!isOpen) return null;

  const currentList = LEADERBOARD_DATA[activeTab];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="rankings-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-[28px] bg-gradient-to-b from-[#1c1204]/95 via-[#120a00]/95 to-black/95 border-2 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden text-white"
      >
        {/* Top Header Bar */}
        <div className="relative px-5 pt-4 pb-3 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-yellow-200/60 text-black">
              <Crown className="w-5 h-5 stroke-[2.2]" />
            </div>
            <div>
              <h2 className="font-header text-xl sm:text-2xl font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 leading-none">
                HALL OF FAME
              </h2>
              <div className="text-[11px] text-amber-200/70 mt-1 font-body">
                Global party rankings & records
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              SoundEngine.playButtonClick();
              Haptics.buttonClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95 cursor-pointer"
            aria-label="Close Rankings"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center justify-around px-2 py-2.5 bg-black/60 border-b border-white/10">
          {LEADERBOARD_CATEGORIES.map((cat) => {
            const isActive = activeTab === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => {
                  SoundEngine.playButtonClick();
                  Haptics.buttonClick();
                  setActiveTab(cat.id as any);
                }}
                className={`px-3 py-1.5 rounded-full text-xs font-header font-bold tracking-wider uppercase transition-all active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-black shadow-[0_0_12px_rgba(245,158,11,0.5)] border border-yellow-200 font-bold'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Podium Top 3 Mini Display */}
        <div className="p-4 bg-amber-950/20 border-b border-amber-500/10 flex items-end justify-center gap-3 pt-6">
          {/* #2 */}
          <div className="flex flex-col items-center">
            <span className="text-xl mb-1">{currentList[1]?.avatar}</span>
            <div className="w-20 h-16 rounded-t-xl bg-slate-800/80 border border-slate-400/50 flex flex-col items-center justify-center p-1 text-center">
              <Medal className="w-4 h-4 text-slate-300" />
              <span className="text-[10px] font-header font-bold text-slate-200 truncate w-full">
                {currentList[1]?.name}
              </span>
              <span className="text-[9px] text-amber-300 font-mono">{currentList[1]?.score}</span>
            </div>
          </div>

          {/* #1 */}
          <div className="flex flex-col items-center">
            <Crown className="w-5 h-5 text-amber-300 animate-bounce mb-0.5" />
            <span className="text-2xl mb-1">{currentList[0]?.avatar}</span>
            <div className="w-24 h-22 rounded-t-xl bg-gradient-to-b from-amber-500/40 to-yellow-600/30 border-2 border-amber-400/80 flex flex-col items-center justify-center p-1 text-center shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <Trophy className="w-5 h-5 text-amber-300 mb-0.5" />
              <span className="text-[11px] font-header font-bold text-amber-200 truncate w-full">
                {currentList[0]?.name}
              </span>
              <span className="text-[10px] text-amber-300 font-mono font-bold">
                {currentList[0]?.score}
              </span>
            </div>
          </div>

          {/* #3 */}
          <div className="flex flex-col items-center">
            <span className="text-xl mb-1">{currentList[2]?.avatar}</span>
            <div className="w-20 h-14 rounded-t-xl bg-amber-950/80 border border-amber-700/50 flex flex-col items-center justify-center p-1 text-center">
              <Medal className="w-4 h-4 text-amber-600" />
              <span className="text-[10px] font-header font-bold text-amber-300 truncate w-full">
                {currentList[2]?.name}
              </span>
              <span className="text-[9px] text-amber-300 font-mono">{currentList[2]?.score}</span>
            </div>
          </div>
        </div>

        {/* Scrollable Player List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5 custom-scrollbar">
          {currentList.map((entry) => (
            <div
              key={entry.rank}
              className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                entry.isUser
                  ? 'bg-amber-500/20 border-amber-400/70 shadow-[0_0_15px_rgba(245,158,11,0.25)]'
                  : 'bg-black/40 border-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span
                  className={`w-6 text-center font-header font-bold text-sm ${
                    entry.rank === 1
                      ? 'text-amber-300'
                      : entry.rank === 2
                      ? 'text-slate-300'
                      : entry.rank === 3
                      ? 'text-amber-600'
                      : 'text-gray-400'
                  }`}
                >
                  #{entry.rank}
                </span>

                <span className="text-lg">{entry.avatar}</span>

                <div>
                  <div className="font-header text-xs font-bold text-white flex items-center gap-1.5">
                    <span>{entry.name}</span>
                    {entry.isUser && (
                      <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-400 text-black font-bold">
                        YOU
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-gray-400 font-mono">{entry.score}</div>
                </div>
              </div>

              <div className="flex items-center gap-1 text-xs font-header font-bold text-amber-300">
                <Star className="w-3.5 h-3.5 fill-amber-400" />
                <span>{entry.stars.toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="p-3 bg-black/60 border-t border-white/10 text-center text-[11px] text-gray-400">
          Rankings update live as party rounds are concluded!
        </div>
      </div>
    </div>
  );
};
