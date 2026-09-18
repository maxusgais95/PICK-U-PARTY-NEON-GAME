/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Gift, Star, Check, Sparkles, Calendar, Clock } from 'lucide-react';
import { SoundEngine, Haptics } from '../lib/audio';
import currencyStarImg from '../assets/images/Currency Star Sprite.png';
import {
  EconomyState,
  claimDailyLoginReward,
  getDailyRewardStatus,
  getTimeUntilMidnight,
  DAILY_LOGIN_REWARDS,
} from '../lib/economy';

interface RewardsModalProps {
  isOpen: boolean;
  economy: EconomyState;
  onClose: () => void;
  onEconomyUpdated: (state: EconomyState) => void;
}

export const RewardsModal: React.FC<RewardsModalProps> = ({
  isOpen,
  economy,
  onClose,
  onEconomyUpdated,
}) => {
  const [timeLeftStr, setTimeLeftStr] = useState<string>(() => getTimeUntilMidnight().formatted);
  const [justClaimedDay, setJustClaimedDay] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;
    const interval = window.setInterval(() => {
      setTimeLeftStr(getTimeUntilMidnight().formatted);
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  const status = getDailyRewardStatus(economy);
  const claimedDays = status.claimedDays;
  const currentAvailableDay = status.currentAvailableDay;

  const handleClaim = (day: number) => {
    SoundEngine.playTeamDivisionChime();
    Haptics.touchSuccess();

    const res = claimDailyLoginReward(day);
    if (res.success) {
      setJustClaimedDay(day);
      setToastMsg(`Claimed Day ${day} (+${res.starsAdded} ⭐)!`);
      onEconomyUpdated(res.updatedState);
      setTimeout(() => {
        setJustClaimedDay(null);
        setToastMsg(null);
      }, 3000);
    } else {
      setToastMsg(res.message);
      setTimeout(() => setToastMsg(null), 3000);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pt-[max(2.25rem,calc(env(safe-area-inset-top)+1.25rem))] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] px-3 sm:px-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="rewards-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-full flex flex-col rounded-[28px] bg-gradient-to-b from-[#24081c]/95 via-[#140410]/95 to-black/95 border-2 border-pink-500/40 shadow-[0_0_40px_rgba(236,72,153,0.3)] overflow-hidden text-white"
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
              <div className="flex items-center gap-1.5 text-[11px] text-pink-200/70 mt-1 font-body">
                <Calendar className="w-3 h-3 text-pink-400" />
                <span>7-Day Daily Login</span>
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
            <img src={currencyStarImg} alt="Stars" className="w-4 h-4 object-contain drop-shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
            <span>{economy.stars.toLocaleString()} Stars</span>
          </div>
        </div>

        {/* Next Unlock Banner */}
        <div className="px-5 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-xs">
          {status.allDaysClaimed ? (
            <span className="text-emerald-300 font-header font-bold flex items-center gap-1">
              <Check className="w-3.5 h-3.5" /> All 7 Days Claimed! Mastery Achieved!
            </span>
          ) : status.canClaimToday && currentAvailableDay ? (
            <span className="text-amber-300 font-header font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" /> Day {currentAvailableDay} Reward is Ready to Claim!
            </span>
          ) : (
            <div className="flex items-center gap-1.5 text-gray-300 font-body">
              <Clock className="w-3.5 h-3.5 text-pink-400" />
              <span>
                Today claimed! Day {(claimedDays.length + 1)} unlocks in <strong className="text-pink-300 font-mono">{timeLeftStr}</strong>
              </span>
            </div>
          )}
        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="px-4 py-2 bg-gradient-to-r from-pink-600 to-purple-600 text-white text-xs font-header font-bold text-center tracking-wide animate-pulse">
            {toastMsg}
          </div>
        )}

        {/* 7-Day Calendar Grid */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {DAILY_LOGIN_REWARDS.map((reward) => {
              const isClaimed = claimedDays.includes(reward.day);
              const isReady = reward.day === currentAvailableDay && status.canClaimToday;
              const isUpcoming = reward.day > claimedDays.length && !isReady;
              const isGrand = reward.isGrand;

              return (
                <div
                  key={reward.day}
                  className={`relative rounded-2xl p-3 flex flex-col items-center justify-between border transition-all text-center ${
                    isGrand ? 'col-span-3 sm:col-span-2' : 'col-span-1'
                  } ${
                    isClaimed
                      ? 'bg-neutral-900/40 border-white/5 opacity-60'
                      : isReady
                      ? 'bg-gradient-to-b from-pink-950/80 to-purple-950/80 border-pink-400/80 shadow-[0_0_18px_rgba(236,72,153,0.4)]'
                      : 'bg-black/40 border-white/10 opacity-75'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className="font-header text-[10px] uppercase font-bold text-gray-400 tracking-wider">
                      {reward.label}
                    </span>
                    {isClaimed && (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    )}
                  </div>

                  <div className="my-2 relative flex items-center justify-center">
                    {isGrand ? (
                      <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 via-pink-500 to-purple-600 flex items-center justify-center shadow-lg border border-yellow-200">
                        <Gift className="w-6 h-6 text-white" />
                      </div>
                    ) : (
                      <img
                        src={currencyStarImg}
                        alt="Stars"
                        className={`w-8 h-8 object-contain transition-all ${
                          isClaimed
                            ? 'grayscale opacity-30'
                            : isReady
                            ? 'drop-shadow-[0_0_12px_rgba(245,158,11,0.95)]'
                            : 'opacity-40 grayscale-[40%]'
                        }`}
                      />
                    )}
                  </div>

                  <span className="font-header text-xs font-bold text-amber-300 mb-2 flex items-center justify-center gap-1">
                    <span>+{reward.stars}</span>
                    <img src={currencyStarImg} alt="Stars" className="w-3.5 h-3.5 object-contain" />
                  </span>

                  {isClaimed ? (
                    <span className="text-[10px] font-header font-bold text-emerald-400 flex items-center gap-0.5">
                      <Check className="w-3 h-3" /> CLAIMED
                    </span>
                  ) : isReady ? (
                    <button
                      type="button"
                      onClick={() => handleClaim(reward.day)}
                      className="w-full py-1.5 rounded-xl bg-gradient-to-r from-amber-400 via-orange-400 to-pink-500 text-black font-header font-bold text-[11px] uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.6)] border border-yellow-200 active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer animate-glow-pulse"
                    >
                      <Sparkles className="w-3 h-3" /> CLAIM
                    </button>
                  ) : (
                    <span className="text-[10px] font-header text-gray-500 uppercase tracking-wider">
                      {isUpcoming ? (reward.day === claimedDays.length + 1 ? 'TOMORROW' : 'LOCKED') : 'LOCKED'}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
