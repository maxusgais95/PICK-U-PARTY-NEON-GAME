/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Check, Star, Clock, Gift, ArrowRight, Sparkles } from 'lucide-react';
import { DailyQuest, claimQuestReward, EconomyState, equipStarEarrings } from '../lib/economy';
import { SoundEngine, Haptics } from '../lib/audio';
import { ScreenView } from '../types';

interface DailyQuestsModalProps {
  isOpen: boolean;
  quests: DailyQuest[];
  economy?: EconomyState;
  onClose: () => void;
  onNavigateToGame?: (view: ScreenView) => void;
  onEconomyUpdated: (state: EconomyState) => void;
}

export const DailyQuestsModal: React.FC<DailyQuestsModalProps> = ({
  isOpen,
  quests,
  economy,
  onClose,
  onNavigateToGame,
  onEconomyUpdated,
}) => {
  if (!isOpen) return null;

  const completedCount = quests.filter((q) => q.currentCount >= q.targetCount).length;
  const totalCount = quests.length || 5;
  const progressPercent = Math.min(100, Math.round((completedCount / totalCount) * 100));

  const earringsProgress = economy?.starEarrings || {
    bombVictory: false,
    bottleSpin: false,
    fingerGame: false,
    unlocked: false,
  };
  const isEarringsEquipped = economy?.equippedSkins?.accessories === 'accessory_star_earrings';

  const handleClaim = (questId: string) => {
    SoundEngine.playTeamDivisionChime();
    Haptics.touchSuccess();
    const res = claimQuestReward(questId);
    if (res.success) {
      onEconomyUpdated(res.updatedState);
    }
  };

  const handleToggleEarrings = () => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    const updated = equipStarEarrings(!isEarringsEquipped);
    onEconomyUpdated(updated);
  };

  const handleGoToQuest = (gameMode?: ScreenView) => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    onClose();
    if (gameMode && onNavigateToGame) {
      onNavigateToGame(gameMode);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/75 backdrop-blur-md animate-fade-in"
      onClick={onClose}
    >
      <div
        id="daily-quests-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-md max-h-[90vh] flex flex-col rounded-[28px] bg-gradient-to-b from-neutral-900/95 via-[#120824]/95 to-black/95 border-2 border-cyan-400/50 shadow-[0_0_40px_rgba(6,182,212,0.35)] overflow-hidden text-white"
      >
        {/* Top Header Bar */}
        <div className="relative px-5 pt-5 pb-3 border-b border-cyan-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-300/60">
              <Gift className="w-5 h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>
            <div>
              <h2 className="font-header text-xl sm:text-2xl font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-300 to-fuchsia-300 leading-none">
                DAILY QUESTS
              </h2>
              <div className="flex items-center gap-1.5 text-[11px] text-cyan-200/70 mt-1 font-body">
                <Clock className="w-3 h-3 text-cyan-400" />
                <span>Resets in 14h 22m</span>
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
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95 cursor-pointer"
            aria-label="Close Daily Quests"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Milestone Progress Banner */}
        <div className="p-4 bg-cyan-950/30 border-b border-cyan-500/10">
          <div className="flex items-center justify-between text-xs font-header mb-1.5">
            <span className="text-cyan-200 tracking-wider uppercase">
              MILESTONE CHEST REWARD
            </span>
            <span className="text-cyan-400 font-bold">
              {completedCount} / {totalCount} Completed
            </span>
          </div>

          <div className="relative w-full h-3 rounded-full bg-black/60 border border-cyan-500/40 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 shadow-[0_0_12px_rgba(6,182,212,0.8)] transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <p className="text-[11px] text-gray-300 mt-2 flex items-center justify-between">
            <span>Complete all 5 daily quests to unlock the Grand Party Chest!</span>
            <span className="font-header font-bold text-amber-300 flex items-center gap-1 shrink-0 ml-2">
              <Star className="w-3 h-3 fill-amber-400 text-amber-300" />
              +250 ⭐
            </span>
          </p>
        </div>

        {/* Quests Scrollable List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {/* SPECIAL LEGENDARY MASTERY CONDITION: STAR EARRINGS */}
          <div className="relative rounded-2xl p-3.5 border border-amber-400/60 bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-black/60 shadow-[0_0_20px_rgba(245,158,11,0.25)]">
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="font-header text-sm font-bold tracking-wide text-amber-200 truncate flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Star Earrings (Triple Mastery)</span>
                  </h4>
                  <span className="px-1.5 py-0.5 rounded-full text-[9px] font-header font-bold bg-amber-500/20 text-amber-300 border border-amber-400/50 uppercase tracking-widest shrink-0">
                    SPECIAL
                  </span>
                </div>
                <p className="text-xs text-gray-300 font-body mt-1 leading-snug">
                  Unlock radiant celestial Star Earrings by completing all 3 party feats:
                </p>
              </div>

              {earringsProgress.unlocked ? (
                <button
                  type="button"
                  onClick={handleToggleEarrings}
                  className={`shrink-0 px-3 py-1.5 rounded-full font-header font-bold text-xs tracking-wider transition-all active:scale-95 border ${
                    isEarringsEquipped
                      ? 'bg-cyan-950/80 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-amber-500/20 hover:bg-amber-500/30 border-amber-400 text-amber-200'
                  }`}
                >
                  {isEarringsEquipped ? 'EQUIPPED' : 'EQUIP'}
                </button>
              ) : (
                <span className="shrink-0 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-header text-gray-400">
                  {[earringsProgress.bombVictory, earringsProgress.bottleSpin, earringsProgress.fingerGame].filter(Boolean).length}/3 Done
                </span>
              )}
            </div>

            {/* Condition Checkboxes */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-1.5 pt-1 border-t border-amber-400/20">
              <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                <span className="text-gray-300">💣 Bomb Victory</span>
                {earringsProgress.bombVictory ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Done
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleGoToQuest('kaboom')}
                    className="text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
                  >
                    Play
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                <span className="text-gray-300">🍾 Bottle Spin</span>
                {earringsProgress.bottleSpin ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Done
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleGoToQuest('bottle')}
                    className="text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
                  >
                    Play
                  </button>
                )}
              </div>

              <div className="flex items-center justify-between px-2 py-1 rounded-lg bg-black/40 border border-white/5 text-[11px]">
                <span className="text-gray-300">☝️ Finger Game</span>
                {earringsProgress.fingerGame ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-0.5">
                    <Check className="w-3 h-3" /> Done
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleGoToQuest('roulette')}
                    className="text-amber-300 hover:text-amber-200 underline font-semibold cursor-pointer"
                  >
                    Play
                  </button>
                )}
              </div>
            </div>
          </div>

          {quests.map((quest) => {
            const isCompleted = quest.currentCount >= quest.targetCount;
            const canClaim = isCompleted && !quest.isClaimed;

            return (
              <div
                key={quest.id}
                className={`relative rounded-2xl p-3.5 border transition-all ${
                  quest.isClaimed
                    ? 'bg-neutral-900/40 border-white/5 opacity-70'
                    : canClaim
                    ? 'bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                    : 'bg-black/40 border-white/10'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-header text-sm font-bold tracking-wide text-white truncate">
                        {quest.title}
                      </h4>
                      <span className="font-header text-xs font-bold text-amber-300 flex items-center gap-0.5 bg-amber-400/10 px-2 py-0.5 rounded-full border border-amber-400/30 shrink-0">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-300" />
                        +{quest.starReward}
                      </span>
                    </div>

                    <p className="text-xs text-gray-300/90 font-body mt-0.5 leading-snug">
                      {quest.description}
                    </p>

                    {/* Progress indicator */}
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-24 h-1.5 rounded-full bg-black/70 border border-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${
                            isCompleted ? 'bg-cyan-400' : 'bg-purple-500'
                          }`}
                          style={{
                            width: `${Math.min(
                              100,
                              Math.round((quest.currentCount / quest.targetCount) * 100)
                            )}%`,
                          }}
                        />
                      </div>
                      <span className="text-[10px] text-gray-400 font-mono">
                        {Math.min(quest.currentCount, quest.targetCount)} / {quest.targetCount}
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="shrink-0 flex items-center justify-center self-center">
                    {quest.isClaimed ? (
                      <div className="flex items-center gap-1 text-xs font-header text-emerald-400 bg-emerald-950/40 px-3 py-1.5 rounded-full border border-emerald-500/30">
                        <Check className="w-3.5 h-3.5" />
                        <span>CLAIMED</span>
                      </div>
                    ) : canClaim ? (
                      <button
                        type="button"
                        onClick={() => handleClaim(quest.id)}
                        className="relative px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-black font-header font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.6)] border border-yellow-200 active:scale-95 transition-all flex items-center gap-1 animate-pulse"
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>CLAIM</span>
                      </button>
                    ) : quest.gameMode ? (
                      <button
                        type="button"
                        onClick={() => handleGoToQuest(quest.gameMode)}
                        className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cyan-300 font-header font-bold text-xs tracking-wider border border-cyan-400/40 active:scale-95 transition-all flex items-center gap-1"
                      >
                        <span>GO</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    ) : (
                      <span className="text-xs text-gray-500 font-header">0/{quest.targetCount}</span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-3.5 bg-black/60 border-t border-white/10 text-center">
          <p className="text-[11px] text-gray-400">
            Quests refresh every 24 hours. Play party rounds to earn Star currency!
          </p>
        </div>
      </div>
    </div>
  );
};
