/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Gift, Star, Check, Sparkles, Calendar } from 'lucide-react';
import { SoundEngine, Haptics } from '../lib/audio';
import { EconomyState, addStars, saveEconomyState } from '../lib/economy';

interface RewardsModalProps {
  isOpen: boolean;
  economy: EconomyState;
  onClose: () => void;
  onEconomyUpdated: (state: EconomyState) => void;
}

const DAILY_LOGIN_REWARDS = [
  { day: 1, stars: 100, label: 'Day 1' },
  { day: 2, stars: 150, label: 'Day 2' },
  { day: 3, stars: 200, label: 'Day 3' },
  { day: 4, stars: 250, label: 'Day 4' },
  { day: 5, stars: 300, label: 'Day 5' },
  { day: 6, stars: 400, label: 'Day 6' },
  { day: 7, stars: 750, label: 'Grand Day 7', isGrand: true },
];

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  economy,
  onClose,
  onEconomyUpdated,
}) => {
  const [claimedDays, setClaimedDays] = useState<number[]>([1]); // Day 1 default claimed
  const [justClaimed, setJustClaimed] = useState<number | null>(null);

  if (!isOpen) return null;

  const currentLoginDay = 2; // Simulating day 2 ready to claim

  const handleClaim = (day: number, stars: number) => {
    SoundEngine.playTeamDivisionChime();
    Haptics.touchSuccess();
    setClaimedDays((prev) => [...prev, day]);
    setJustClaimed(day);

    const updated = addStars(stars);
    onEconomyUpdated(updated);

    setTimeout(() => {
      setJustClaimed(null);
    }, 2500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="rewards-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-[28px] bg-gradient-to-b from-[#24081c]/95 via-[#140410]/95 to-black/95 border-2 border-pink-500/40 shadow-[0_0_40px_rgba(236,72,153,0.3)] overflow-hidden text-white"
      >
        {/* Top Header Bar */}
        <div className="relative px-5 pt-4 pb-3 border-b border-pink-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-pink-500 via-rose-500 to-amber-400 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-300/60 text-white">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-header text-xl sm:text-2xl font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-200 via-rose-300 to-amber-300 leading-none">
                PARTY REWARDS
              </h2>
              <div className="text-[11px] text-pink-200/70 mt-1 font-body">
                Daily Check-in & Login Streak
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
            aria-label="Close Rewards"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Balance Ribbon */}
        <div className="px-5 py-2.5 bg-pink-950/30 border-b border-pink-500/10 flex items-center justify-between">
          <span className="text-xs text-pink-200/80 font-header tracking-wider">YOUR BALANCE</span>
          <div className="flex items-center gap-1.5 font-header font-bold text-sm text-amber-300">
            <Star className="w-4 h-4 fill-amber-400" />
            <span>{economy.stars.toLocaleString()} Stars</span>
          </div>
        </div>

        {/* 7-Day Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="flex items-center gap-2 mb-3">
            <Calendar className="w-4 h-4 text-pink-400" />
            <h3 className="font-header text-xs font-bold uppercase tracking-wider text-pink-200">
              7-Day Party Starter Streak
            </h3>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {DAILY_LOGIN_REWARDS.map((reward) => {
              const isClaimed = claimedDays.includes(reward.day);
              const isReady = reward.day === currentLoginDay && !isClaimed;
              const isLocked = reward.day > currentLoginDay;

              return (
                <div
                  key={reward.day}
                  className={`relative rounded-2xl p-3 flex flex-col items-center justify-between border transition-all text-center ${
                    reward.isGrand ? 'col-span-3 sm:col-span-2' : 'col-span-1'
                  } ${
                    isClaimed
                      ? 'bg-neutral-900/40 border-white/5 opacity-60'
                      : isReady
                      ? 'bg-gradient-to-b from-pink-950/80 to-purple-950/80 border-pink-400/80 shadow-[0_0_18px_rgba(236,72,153,0.4)] animate-pulse'
                      : 'bg-black/40 border-white/10'
                  }`}
                >
                  <span className="font-header text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                    {reward.label}
                  </span>

                  <div className="my-2 relative flex items-center justify-center">
                    {reward.isGrand ? (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg border border-yellow-200">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <Star
                        className={`w-7 h-7 ${
                          isClaimed
                            ? 'text-gray-500'
                            : isReady
                            ? 'text-amber-300 fill-amber-400 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                            : 'text-amber-500/40'
                        }`}
                      />
                    )}
                  </div>

                  <span className="font-header text-xs font-bold text-amber-300 mb-2">
                    +{reward.stars} ⭐
                  </span>

                  {isClaimed ? (
                    <span className="text-[10px] font-header font-bold text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> CLAIMED
                    </span>
                  ) : isReady ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(reward.day, reward.stars)}
                      className="w-full py-1 rounded-full bg-gradient-to-r from-pink-500 to-amber-500 text-white font-header font-bold text-[10px] uppercase tracking-wider shadow-md active:scale-95 transition-all"
                    >
                      CLAIM
                    </button>
                  ) : (
                    <span className="text-[10px] font-header text-gray-500">LOCKED</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="p-3 bg-black/60 border-t border-white/10 text-center text-[11px] text-gray-400">
          Check in every day to claim bonus Stars for party skins!
        </div>
      </div>
    </div>
  );
};
