/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Trophy,
  Award,
  Sparkles,
  Lock,
  CheckCircle2,
  X,
  Star,
  Flame,
  Target,
  Crown,
  Bomb,
  ChevronRight,
} from 'lucide-react';
import {
  TROPHY_DEFINITIONS,
  AchievementTrophy,
  TrophyTier,
  TrophyProgress,
  getTrophyClaimMap,
  claimTrophyReward,
  calculateTrophyProgress,
  getTrophyImage,
} from '../lib/trophies';
import { AppStats } from '../types';
import { EconomyState, addStars } from '../lib/economy';
import { SoundEngine, Haptics } from '../lib/audio';
import currencyStarImg from '../assets/images/Currency Star Sprite.png';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: AppStats;
  economy: EconomyState;
  onEconomyUpdated?: (economy: EconomyState) => void;
}

const CATEGORY_TABS: Array<{
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}> = [
  { id: 'all', label: 'All Modes', icon: Trophy },
  { id: 'roulette', label: 'Roulette', icon: Target },
  { id: 'bottle', label: 'Spin Bottle', icon: Sparkles },
  { id: 'kaboom', label: 'Kaboom', icon: Bomb },
  { id: 'party', label: 'Party Host', icon: Crown },
  { id: 'collector', label: 'Collections', icon: Flame },
];

const TIER_FILTERS: Array<{ id: string; label: string; dotColor?: string }> = [
  { id: 'all', label: 'All Tiers' },
  { id: 'claimable', label: 'Rewards Ready' },
  { id: 'platinum', label: 'Platinum', dotColor: 'bg-cyan-400 shadow-[0_0_6px_rgba(6,182,212,0.8)]' },
  { id: 'gold', label: 'Gold', dotColor: 'bg-yellow-400 shadow-[0_0_6px_rgba(234,179,8,0.8)]' },
  { id: 'silver', label: 'Silver', dotColor: 'bg-slate-300 shadow-[0_0_6px_rgba(203,213,225,0.8)]' },
  { id: 'bronze', label: 'Bronze', dotColor: 'bg-amber-600 shadow-[0_0_6px_rgba(180,83,9,0.8)]' },
];

export const AchievementsModal: React.FC<AchievementsModalProps> = ({
  isOpen,
  onClose,
  stats,
  economy,
  onEconomyUpdated,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activeTierFilter, setActiveTierFilter] = useState<string>('all');
  const [claimMap, setClaimMap] = useState<Record<string, TrophyTier[]>>(() =>
    getTrophyClaimMap()
  );
  const [selectedTrophy, setSelectedTrophy] = useState<AchievementTrophy | null>(null);

  if (!isOpen) return null;

  const statsContext = {
    totalRouletteRounds: stats.totalRouletteRounds || 0,
    totalBottleSpins: stats.totalBottleSpins || 0,
    totalKaboomRounds: stats.totalKaboomRounds || 0,
    kaboomVictories: stats.kaboom?.victories || 0,
    kaboomBonusCollected: stats.kaboom?.bonusCollected || 0,
    unlockedItemCount: economy.unlockedItems?.length || 1,
  };

  const progressList = TROPHY_DEFINITIONS.map((trophy) =>
    calculateTrophyProgress(trophy, statsContext, claimMap)
  );

  const progressMap = new Map(progressList.map((p) => [p.trophyId, p]));

  const totalTrophies = TROPHY_DEFINITIONS.length;
  const unlockedTrophiesCount = progressList.filter((p) => p.currentTier !== 'locked').length;
  const platinumCount = progressList.filter((p) => p.currentTier === 'platinum').length;
  const goldCount = progressList.filter((p) => p.currentTier === 'gold').length;
  const silverCount = progressList.filter((p) => p.currentTier === 'silver').length;
  const bronzeCount = progressList.filter((p) => p.currentTier === 'bronze').length;
  const totalUnclaimedTiersCount = progressList.reduce(
    (acc, p) => acc + p.unclaimedTiers.length,
    0
  );

  // Category counts and unclaim flags
  const categoryMeta = CATEGORY_TABS.map((cat) => {
    const list =
      cat.id === 'all'
        ? TROPHY_DEFINITIONS
        : TROPHY_DEFINITIONS.filter((t) => t.category === cat.id);
    const hasUnclaimed = list.some((t) => {
      const p = progressMap.get(t.id);
      return p ? p.unclaimedTiers.length > 0 : false;
    });
    return {
      id: cat.id,
      count: list.length,
      hasUnclaimed,
    };
  });

  const filteredTrophies = TROPHY_DEFINITIONS.filter((t) => {
    const matchCategory = activeCategory === 'all' || t.category === activeCategory;
    if (!matchCategory) return false;

    const p = progressMap.get(t.id);
    if (!p) return true;

    if (activeTierFilter === 'claimable') {
      return p.unclaimedTiers.length > 0;
    }
    if (activeTierFilter === 'platinum') return p.currentTier === 'platinum';
    if (activeTierFilter === 'gold') return p.currentTier === 'gold';
    if (activeTierFilter === 'silver') return p.currentTier === 'silver';
    if (activeTierFilter === 'bronze') return p.currentTier === 'bronze';

    return true;
  });

  const handleClaim = (trophyId: string, tier: TrophyTier, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const res = claimTrophyReward(trophyId, tier);
    if (res.success && res.starsAwarded > 0) {
      SoundEngine.playBonusFanfare();
      SoundEngine.playHudCoinBeep();
      Haptics.buttonClick();
      const updatedEco = addStars(res.starsAwarded);
      if (onEconomyUpdated) onEconomyUpdated(updatedEco);
      setClaimMap(getTrophyClaimMap());
    }
  };

  const getTrophyIcon = (
    type: AchievementTrophy['iconType'],
    tier: TrophyTier,
    sizeClass = 'w-7 h-7'
  ) => {
    const isLocked = tier === 'locked';
    switch (type) {
      case 'target':
        return (
          <Target
            className={`${sizeClass} ${
              isLocked ? 'text-gray-500' : 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
            }`}
          />
        );
      case 'sparkles':
        return (
          <Sparkles
            className={`${sizeClass} ${
              isLocked ? 'text-gray-500' : 'text-fuchsia-300 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)]'
            }`}
          />
        );
      case 'bomb':
        return (
          <Bomb
            className={`${sizeClass} ${
              isLocked ? 'text-gray-500' : 'text-rose-400 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]'
            }`}
          />
        );
      case 'crown':
        return (
          <Crown
            className={`${sizeClass} ${
              isLocked ? 'text-gray-500' : 'text-yellow-300 drop-shadow-[0_0_8px_rgba(234,179,8,0.8)]'
            }`}
          />
        );
      case 'flame':
        return (
          <Flame
            className={`${sizeClass} ${
              isLocked ? 'text-gray-500' : 'text-orange-400 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]'
            }`}
          />
        );
      default:
        return (
          <Trophy
            className={`${sizeClass} ${
              isLocked ? 'text-gray-500' : 'text-amber-300 drop-shadow-[0_0_8px_rgba(245,158,11,0.8)]'
            }`}
          />
        );
    }
  };

  const getTierPedestalStyle = (tier: TrophyTier) => {
    switch (tier) {
      case 'platinum':
        return {
          glowCardClass: 'trophy-card-platinum',
          cardBg: 'bg-gradient-to-b from-cyan-950/70 via-[#0a192f]/90 to-black/95',
          radialOverlay: 'bg-[radial-gradient(ellipse_at_top,_rgba(6,182,212,0.22),_transparent_70%)]',
          pedestal: 'bg-gradient-to-t from-cyan-950 via-cyan-800 to-cyan-400 border border-cyan-200 shadow-[0_0_18px_rgba(6,182,212,0.9)]',
          badgeText: 'text-cyan-300',
          badgeBg: 'bg-cyan-950/70 border border-cyan-400/50 shadow-[0_0_10px_rgba(6,182,212,0.4)]',
          tierLabel: 'PLATINUM',
          accentText: 'text-cyan-300',
        };
      case 'gold':
        return {
          glowCardClass: 'trophy-card-gold',
          cardBg: 'bg-gradient-to-b from-amber-950/70 via-[#1f1607]/90 to-black/95',
          radialOverlay: 'bg-[radial-gradient(ellipse_at_top,_rgba(234,179,8,0.22),_transparent_70%)]',
          pedestal: 'bg-gradient-to-t from-amber-950 via-amber-700 to-yellow-400 border border-yellow-200 shadow-[0_0_18px_rgba(234,179,8,0.9)]',
          badgeText: 'text-yellow-300',
          badgeBg: 'bg-amber-950/70 border border-yellow-400/50 shadow-[0_0_10px_rgba(234,179,8,0.4)]',
          tierLabel: 'GOLD',
          accentText: 'text-yellow-300',
        };
      case 'silver':
        return {
          glowCardClass: 'trophy-card-silver',
          cardBg: 'bg-gradient-to-b from-slate-900/70 via-[#151c28]/90 to-black/95',
          radialOverlay: 'bg-[radial-gradient(ellipse_at_top,_rgba(203,213,225,0.18),_transparent_70%)]',
          pedestal: 'bg-gradient-to-t from-slate-900 via-slate-700 to-slate-200 border border-slate-100 shadow-[0_0_14px_rgba(203,213,225,0.8)]',
          badgeText: 'text-slate-200',
          badgeBg: 'bg-slate-800/70 border border-slate-300/50 shadow-[0_0_8px_rgba(148,163,184,0.3)]',
          tierLabel: 'SILVER',
          accentText: 'text-slate-200',
        };
      case 'bronze':
        return {
          glowCardClass: 'trophy-card-bronze',
          cardBg: 'bg-gradient-to-b from-[#3a1d08]/70 via-[#1a0e05]/90 to-black/95',
          radialOverlay: 'bg-[radial-gradient(ellipse_at_top,_rgba(180,83,9,0.22),_transparent_70%)]',
          pedestal: 'bg-gradient-to-t from-amber-950 via-amber-850 to-amber-600 border border-amber-400 shadow-[0_0_12px_rgba(180,83,9,0.7)]',
          badgeText: 'text-amber-400',
          badgeBg: 'bg-amber-950/70 border border-amber-600/50 shadow-[0_0_8px_rgba(180,83,9,0.3)]',
          tierLabel: 'BRONZE',
          accentText: 'text-amber-400',
        };
      default:
        return {
          glowCardClass: 'trophy-card-locked',
          cardBg: 'bg-gradient-to-b from-neutral-950/80 via-black/90 to-black',
          radialOverlay: 'bg-transparent',
          pedestal: 'bg-neutral-900 border border-white/10 shadow-none',
          badgeText: 'text-gray-400',
          badgeBg: 'bg-neutral-900/80 border border-white/10',
          tierLabel: 'LOCKED',
          accentText: 'text-gray-400',
        };
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center pt-[max(2.25rem,calc(env(safe-area-inset-top)+1.25rem))] pb-[max(1.5rem,calc(env(safe-area-inset-bottom)+1rem))] px-3 sm:px-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="achievements-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl max-h-full flex flex-col rounded-[28px] bg-gradient-to-b from-[#140b22]/95 via-[#0d0718]/95 to-black/95 border-2 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden text-white"
      >
        {/* Top Header Bar */}
        <div className="relative px-5 pt-4 pb-3 border-b border-amber-500/20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-yellow-200/60 text-black">
              <Trophy className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-header text-xl sm:text-2xl font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-orange-400 leading-none">
                  TROPHY GALLERY
                </h2>
                {totalUnclaimedTiersCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-header font-black text-[10px] animate-bounce shadow-[0_0_8px_rgba(245,158,11,0.8)]">
                    {totalUnclaimedTiersCount} REWARD{totalUnclaimedTiersCount > 1 ? 'S' : ''}
                  </span>
                )}
              </div>
              <div className="text-[11px] text-amber-200/70 mt-1 font-body">
                Earn & tier up trophies as you complete party tasks
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
            aria-label="Close Achievements"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gallery Showcase Stats Bar */}
        <div className="grid grid-cols-2 gap-2 px-4 py-3 bg-black/60 border-b border-white/10 text-center text-xs">
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Unlocked</span>
            <span className="font-header font-bold text-base text-amber-300 mt-0.5">
              {unlockedTrophiesCount} / {totalTrophies}
            </span>
          </div>
          <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] text-gray-400 uppercase tracking-wider">Platinum Trophies</span>
            <span className="font-header font-bold text-base text-cyan-300 mt-0.5 flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-cyan-400" />
              {platinumCount}
            </span>
          </div>
        </div>

        {/* Primary Category Tabs */}
        <div className="relative bg-black/60 border-b border-white/10">
          <div className="flex items-center gap-1.5 px-3 py-2 overflow-x-auto no-scrollbar">
            {categoryMeta.map((cat) => {
              const tabDef = CATEGORY_TABS.find((t) => t.id === cat.id)!;
              const Icon = tabDef.icon;
              const isActive = activeCategory === cat.id;

              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    SoundEngine.playButtonClick();
                    Haptics.buttonClick();
                    setActiveCategory(cat.id);
                  }}
                  className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-header font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-amber-500/30 via-yellow-500/25 to-amber-500/20 text-yellow-300 border border-amber-400/80 shadow-[0_0_14px_rgba(245,158,11,0.45)]'
                      : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-yellow-300' : 'text-gray-400'}`} />
                  <span>{tabDef.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive ? 'bg-amber-400/30 text-amber-200' : 'bg-white/5 text-gray-500'
                    }`}
                  >
                    {cat.count}
                  </span>

                  {cat.hasUnclaimed && (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500" />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Secondary Tier / Status Filter Bar */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar bg-black/40 border-b border-white/5 text-[11px]">
          {TIER_FILTERS.map((tierFilter) => {
            const isActive = activeTierFilter === tierFilter.id;
            let filterCount = 0;

            if (tierFilter.id === 'all') {
              filterCount = filteredTrophies.length;
            } else if (tierFilter.id === 'claimable') {
              filterCount = totalUnclaimedTiersCount;
            } else if (tierFilter.id === 'platinum') {
              filterCount = platinumCount;
            } else if (tierFilter.id === 'gold') {
              filterCount = goldCount;
            } else if (tierFilter.id === 'silver') {
              filterCount = silverCount;
            } else if (tierFilter.id === 'bronze') {
              filterCount = bronzeCount;
            }

            return (
              <button
                key={tierFilter.id}
                type="button"
                onClick={() => {
                  SoundEngine.playButtonClick();
                  Haptics.buttonClick();
                  setActiveTierFilter(tierFilter.id);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-header font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-400 text-black font-bold shadow-[0_0_10px_rgba(245,158,11,0.6)]'
                    : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5'
                }`}
              >
                {tierFilter.dotColor && (
                  <span className={`w-2 h-2 rounded-full ${tierFilter.dotColor}`} />
                )}
                {tierFilter.id === 'claimable' && totalUnclaimedTiersCount > 0 && (
                  <Sparkles className={`w-3 h-3 ${isActive ? 'text-black' : 'text-amber-400 animate-spin'}`} />
                )}
                <span>{tierFilter.label}</span>
                <span className={`text-[10px] opacity-75`}>({filterCount})</span>
              </button>
            );
          })}
        </div>

        {/* Trophy Gallery Grid */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 scrollable-panel">
          {filteredTrophies.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Trophy className="w-12 h-12 text-gray-600 mb-2" />
              <p className="font-header font-bold text-gray-300">No trophies match this filter</p>
              <p className="text-xs text-gray-500 mt-1 max-w-xs">
                Try switching the mode or tier filter to explore other available trophies.
              </p>
              <button
                type="button"
                onClick={() => {
                  setActiveCategory('all');
                  setActiveTierFilter('all');
                }}
                className="mt-3 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-xs text-amber-300 font-header font-bold border border-white/10 cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredTrophies.map((trophy) => {
                const progress = calculateTrophyProgress(trophy, statsContext, claimMap);
                const pedestal = getTierPedestalStyle(progress.currentTier);
                const isLocked = progress.currentTier === 'locked';

                return (
                  <div
                    key={trophy.id}
                    onClick={() => {
                      SoundEngine.playButtonClick();
                      Haptics.buttonClick();
                      setSelectedTrophy(trophy);
                    }}
                    className={`group relative rounded-2xl ${pedestal.glowCardClass} ${pedestal.cardBg} p-3.5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden`}
                  >
                    {/* Radial Ambient Beam */}
                    <div className={`absolute inset-0 pointer-events-none ${pedestal.radialOverlay}`} />

                    {/* Category Pill & Unclaimed Reward Badge */}
                    <div className="relative z-10 flex items-center justify-between mb-2">
                      <span className="text-[10px] font-header font-bold text-gray-300 tracking-wider uppercase px-2 py-0.5 rounded-md bg-black/60 border border-white/10">
                        {trophy.categoryLabel}
                      </span>

                      {progress.unclaimedTiers.length > 0 && (
                        <span className="px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black font-header font-black text-[9px] uppercase tracking-wide animate-glow-pulse shadow-[0_0_12px_rgba(245,158,11,0.9)] flex items-center gap-1">
                          <Sparkles className="w-2.5 h-2.5" />
                          CLAIM REWARD
                        </span>
                      )}
                    </div>

                    {/* 3D Pedestal and Trophy Icon with Tier Aura */}
                    <div className="relative z-10 py-3 flex flex-col items-center justify-center">
                      {/* Distinct Glowing Aura Behind Trophy */}
                      <div
                        className={`absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full blur-2xl pointer-events-none transition-opacity ${
                          isLocked
                            ? 'bg-transparent'
                            : progress.currentTier === 'platinum'
                            ? 'bg-cyan-400/35 animate-pulse'
                            : progress.currentTier === 'gold'
                            ? 'bg-yellow-400/35 animate-pulse'
                            : progress.currentTier === 'silver'
                            ? 'bg-slate-300/30'
                            : 'bg-amber-600/35'
                        }`}
                      />

                      {/* Trophy Image / Icon with Hover Float - 3x Size */}
                      <div className="relative z-10 transform group-hover:-translate-y-1.5 transition-transform duration-300 flex items-center justify-center min-h-[176px] sm:min-h-[192px]">
                        {(() => {
                          const hasImages = !!trophy.images;
                          if (hasImages) {
                            if (isLocked) {
                              return (
                                <div className="relative w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                                  <img
                                    src={trophy.tiers.bronze.image}
                                    alt={`${trophy.title} - Locked`}
                                    className="w-44 h-44 sm:w-48 sm:h-48 object-contain filter grayscale opacity-25 brightness-50 contrast-125"
                                  />
                                  <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-neutral-950/90 border border-white/15 flex items-center justify-center shadow-lg">
                                    <Lock className="w-6 h-6 text-gray-400" />
                                  </div>
                                </div>
                              );
                            }
                            const trophyImg = getTrophyImage(trophy, progress.currentTier);
                            return (
                              <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                                <img
                                  src={trophyImg}
                                  alt={`${trophy.title} - ${progress.currentTier}`}
                                  className="w-44 h-44 sm:w-48 sm:h-48 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] filter transition-transform duration-300 group-hover:scale-105"
                                />
                              </div>
                            );
                          }
                          // The rest: leave blank for now
                          return (
                            <div className="w-44 h-44 sm:w-48 sm:h-48 flex items-center justify-center">
                              {isLocked && (
                                <div className="w-12 h-12 rounded-full bg-neutral-900/90 border border-white/10 flex items-center justify-center">
                                  <Lock className="w-6 h-6 text-gray-500" />
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>

                    {/* Trophy Details - Centered */}
                    <div className="relative z-10 mt-2 text-center flex flex-col items-center">
                      <h3 className="font-header font-bold text-base text-white group-hover:text-amber-300 transition-colors flex items-center justify-center gap-1.5 text-center">
                        <span>{trophy.title}</span>
                        {progress.currentTier === 'platinum' && (
                          <span className="text-[10px] text-cyan-300 font-normal px-1.5 py-0.5 rounded bg-cyan-950/60 border border-cyan-400/40">MAX</span>
                        )}
                      </h3>
                      <p className="text-xs text-gray-300 text-center line-clamp-2 mt-1 max-w-sm">
                        {progress.currentTierConfig ? progress.currentTierConfig.title : trophy.description}
                      </p>
                    </div>

                    {/* Progress Bar & Next Tier Objective */}
                    <div className="relative z-10 mt-3 pt-2.5 border-t border-white/10">
                      <div className="flex items-center justify-between text-[10px] mb-1">
                        <span className="text-gray-400">
                          {progress.nextTierConfig ? (
                            <>
                              Next: <span className="text-white font-medium">{progress.nextTierConfig.badgeName}</span> ({progress.nextTierConfig.threshold})
                            </>
                          ) : (
                            <span className="text-cyan-300 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-cyan-400" /> Max Tier Achieved
                            </span>
                          )}
                        </span>
                        <span className="font-header font-bold text-amber-300">
                          {progress.currentValue} / {progress.nextTierConfig ? progress.nextTierConfig.threshold : progress.currentValue}
                        </span>
                      </div>

                      <div className="w-full h-1.5 rounded-full bg-black/70 border border-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            progress.currentTier === 'platinum'
                              ? 'bg-gradient-to-r from-cyan-500 to-sky-300 shadow-[0_0_8px_rgba(6,182,212,0.8)]'
                              : progress.currentTier === 'gold'
                              ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.8)]'
                              : progress.currentTier === 'silver'
                              ? 'bg-gradient-to-r from-slate-400 to-slate-200'
                              : 'bg-gradient-to-r from-amber-700 to-amber-500'
                          }`}
                          style={{ width: `${progress.progressPercent}%` }}
                        />
                      </div>

                      {/* Multi-tier Milestone Dots */}
                      <div className="grid grid-cols-4 gap-1 mt-2 text-center text-[9px]">
                        {(['bronze', 'silver', 'gold', 'platinum'] as TrophyTier[]).map((tierKey) => {
                          const tierCfg = trophy.tiers[tierKey];
                          const isReached = progress.currentValue >= tierCfg.threshold;
                          const isClaimed = (claimMap[trophy.id] || []).includes(tierKey);
                          const canClaim = isReached && !isClaimed;

                          return (
                            <button
                              key={tierKey}
                              type="button"
                              onClick={(e) => {
                                if (canClaim) handleClaim(trophy.id, tierKey, e);
                              }}
                              className={`p-1 rounded flex flex-col items-center justify-center transition-all ${
                                canClaim
                                  ? 'bg-amber-400 text-black font-bold animate-glow-pulse hover:bg-yellow-300 cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.9)]'
                                  : isClaimed
                                  ? 'bg-white/10 text-gray-300'
                                  : isReached
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-400/40'
                                  : 'bg-black/40 text-gray-600'
                              }`}
                              title={`${tierCfg.badgeName}: ${tierCfg.threshold} ${trophy.metricLabel}`}
                            >
                              <span className="capitalize">{tierKey.slice(0, 3)}</span>
                              {canClaim ? (
                                <span className="text-[8px] font-black leading-none flex items-center gap-0.5">
                                  <span>+{tierCfg.starBonus}</span>
                                  <img src={currencyStarImg} alt="Stars" className="w-2.5 h-2.5 object-contain inline" />
                                </span>
                              ) : isClaimed ? (
                                <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 mt-0.5" />
                              ) : (
                                <span className="text-[8px] text-gray-500">{tierCfg.threshold}</span>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer info note */}
        <div className="p-3 bg-black/70 border-t border-amber-500/20 text-center text-[11px] text-amber-200/80">
          Play matches, spin bottles, and defuse party bombs to tier up your trophies from Bronze to Platinum!
        </div>
      </div>

      {/* Selected Trophy Detailed Inspection Modal */}
      {selectedTrophy && (() => {
        const p = calculateTrophyProgress(selectedTrophy, statsContext, claimMap);
        const pedestal = getTierPedestalStyle(p.currentTier);

        return (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-lg animate-fade-in"
            onClick={() => setSelectedTrophy(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-sm rounded-[24px] ${pedestal.glowCardClass} ${pedestal.cardBg} p-5 text-white overflow-hidden`}
            >
              {/* Radial Glow Overlay */}
              <div className={`absolute inset-0 pointer-events-none ${pedestal.radialOverlay}`} />

              <button
                type="button"
                onClick={() => setSelectedTrophy(null)}
                className="absolute top-4 right-4 z-20 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-400 hover:text-white cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>

              {/* Inspect Header */}
              <div className="relative z-10">
                <div className="flex flex-col items-center text-center">
                  <div className="relative py-3">
                    <div
                      className={`w-48 h-48 sm:w-52 sm:h-52 rounded-full blur-2xl absolute inset-0 m-auto ${
                        p.currentTier === 'platinum'
                          ? 'bg-cyan-400/30'
                          : p.currentTier === 'gold'
                          ? 'bg-yellow-400/30'
                          : p.currentTier === 'silver'
                          ? 'bg-slate-300/25'
                          : p.currentTier === 'bronze'
                          ? 'bg-amber-600/30'
                          : 'bg-transparent'
                      }`}
                    />
                    <div className="relative z-10 flex items-center justify-center">
                      {(() => {
                        const hasImages = !!selectedTrophy.images;
                        const isSelectedLocked = p.currentTier === 'locked';
                        if (hasImages) {
                          if (isSelectedLocked) {
                            return (
                              <div className="relative w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                                <img
                                  src={selectedTrophy.tiers.bronze.image}
                                  alt={`${selectedTrophy.title} - Locked`}
                                  className="w-48 h-48 sm:w-52 sm:h-52 object-contain filter grayscale opacity-25 brightness-50 contrast-125"
                                />
                                <div className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-neutral-950/90 border border-white/20 flex items-center justify-center shadow-xl">
                                  <Lock className="w-7 h-7 text-gray-400" />
                                </div>
                              </div>
                            );
                          }
                          const currentImg = getTrophyImage(selectedTrophy, p.currentTier);
                          return (
                            <img
                              src={currentImg}
                              alt={`${selectedTrophy.title} - ${p.currentTier}`}
                              className="w-48 h-48 sm:w-52 sm:h-52 object-contain drop-shadow-[0_8px_24px_rgba(0,0,0,0.85)] filter transition-transform duration-300 hover:scale-105"
                            />
                          );
                        }
                        // The rest: leave blank for now
                        return (
                          <div className="w-48 h-48 sm:w-52 sm:h-52 flex items-center justify-center">
                            {isSelectedLocked && (
                              <div className="w-14 h-14 rounded-full bg-neutral-900/90 border border-white/10 flex items-center justify-center">
                                <Lock className="w-7 h-7 text-gray-500" />
                              </div>
                            )}
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  <h3 className="font-header text-xl font-bold text-white mt-2">
                    {selectedTrophy.title}
                  </h3>
                  <p className="text-xs text-gray-300 mt-1 max-w-[260px]">
                    {selectedTrophy.description}
                  </p>
                  <div className="mt-2 text-xs font-header font-bold text-amber-300 bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/30">
                    Current Score: {p.currentValue} {selectedTrophy.metricLabel}
                  </div>
                </div>

                {/* Tier Ladder */}
                <div className="mt-4 space-y-2 max-h-[220px] overflow-y-auto pr-1 scrollable-panel">
                    {(['bronze', 'silver', 'gold', 'platinum'] as TrophyTier[]).map((tKey) => {
                      const tCfg = selectedTrophy.tiers[tKey];
                      const isReached = p.currentValue >= tCfg.threshold;
                      const isClaimed = (claimMap[selectedTrophy.id] || []).includes(tKey);
                      const canClaim = isReached && !isClaimed;

                      return (
                        <div
                          key={tKey}
                          className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                            isReached
                              ? 'bg-white/5 border-amber-400/40'
                              : 'bg-black/30 border-white/5 opacity-60'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {tCfg.image ? (
                              <img
                                src={tCfg.image}
                                alt={tCfg.badgeName}
                                className={`w-8 h-8 object-contain drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)] ${
                                  isReached ? '' : 'grayscale opacity-30'
                                }`}
                              />
                            ) : (
                              <div className="w-8 h-8 flex items-center justify-center" />
                            )}
                            <div>
                              <div className="font-header font-bold capitalize text-white flex items-center gap-1.5">
                                <span>{tCfg.badgeName}</span>
                                <span className="text-gray-400 font-normal text-[11px]">({tCfg.title})</span>
                              </div>
                              <div className="text-[10px] text-gray-400">
                                Goal: {tCfg.threshold} {selectedTrophy.metricLabel}
                              </div>
                            </div>
                          </div>

                          <div>
                            {canClaim ? (
                              <button
                                type="button"
                                onClick={() => handleClaim(selectedTrophy.id, tKey)}
                                className="px-2.5 py-1 rounded-lg bg-amber-400 text-black font-header font-black text-xs hover:bg-yellow-300 transition-all cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-glow-pulse flex items-center gap-1"
                              >
                                <span>Claim +{tCfg.starBonus}</span>
                                <img src={currencyStarImg} alt="Stars" className="w-3.5 h-3.5 object-contain inline" />
                              </button>
                            ) : isClaimed ? (
                              <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                              </span>
                            ) : isReached ? (
                              <span className="text-amber-300 font-medium text-[11px]">Achieved</span>
                            ) : (
                              <span className="text-gray-500 text-[11px]">
                                {tCfg.threshold - p.currentValue} left
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}
    </div>
  );
};
