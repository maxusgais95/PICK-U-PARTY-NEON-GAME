/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
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
import { getStats } from '../lib/db';
import { EconomyState, addStars, getEconomyState } from '../lib/economy';
import { SoundEngine, Haptics } from '../lib/audio';
import currencyStarImg from '../assets/images/Currency Star Sprite.png';

interface AchievementsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: AppStats;
  economy: EconomyState;
  onEconomyUpdated?: (economy: EconomyState) => void;
}

/**
 * Trophy Dynamic Shine Star Sparkles
 * Generates sparkling faceted star glints corresponding directly to the trophy's tier color!
 */
// Platinum full shine: 8 multifaceted brilliant diamond facet glints across the trophy
const PLATINUM_DIAMOND_SPARKLES = [
  { top: '16%', left: '26%', size: 28, delay: '0.1s', duration: '2.4s' },
  { top: '22%', left: '72%', size: 32, delay: '0.8s', duration: '2.8s' },
  { top: '38%', left: '16%', size: 24, delay: '1.5s', duration: '2.2s' },
  { top: '46%', left: '80%', size: 30, delay: '0.4s', duration: '2.6s' },
  { top: '62%', left: '28%', size: 26, delay: '1.1s', duration: '2.5s' },
  { top: '68%', left: '68%', size: 34, delay: '1.9s', duration: '3.0s' },
  { top: '28%', left: '50%', size: 30, delay: '0.6s', duration: '2.3s' },
  { top: '54%', left: '52%', size: 24, delay: '1.3s', duration: '2.7s' },
];

// Gold little shine: 3 delicate, subtle diamond glints
const GOLD_DIAMOND_SPARKLES = [
  { top: '22%', left: '32%', size: 18, delay: '0.2s', duration: '3.2s' },
  { top: '36%', left: '70%', size: 20, delay: '1.4s', duration: '3.6s' },
  { top: '64%', left: '44%', size: 17, delay: '2.2s', duration: '3.0s' },
];

/**
 * Realistic Diamond Shine with blending mode (screen)
 * Renders ONLY for gold and platinum tiers!
 * - Gold: subtle, gentle diamond sparkles ("Gold little")
 * - Platinum: brilliant multifaceted diamond flares with anamorphic flare streak ("Platinum full shine")
 */
const DiamondShineSparkles: React.FC<{ tier: TrophyTier; isReached?: boolean }> = ({
  tier,
  isReached = true,
}) => {
  // Diamond shine for gold and platinum only!
  if (!isReached || (tier !== 'gold' && tier !== 'platinum')) return null;

  const isPlatinum = tier === 'platinum';
  const sparkles = isPlatinum ? PLATINUM_DIAMOND_SPARKLES : GOLD_DIAMOND_SPARKLES;

  const gradId = isPlatinum ? 'platinumDiamondShineGrad' : 'goldDiamondShineGrad';
  const dropFilter = isPlatinum
    ? 'drop-shadow(0 0 10px rgba(165,243,252,0.95)) drop-shadow(0 0 20px rgba(56,189,248,0.7))'
    : 'drop-shadow(0 0 8px rgba(254,240,138,0.85)) drop-shadow(0 0 16px rgba(234,179,8,0.6))';

  const gradStops = isPlatinum
    ? { c1: '#ffffff', c2: '#cffafe', c3: '#38bdf8' }
    : { c1: '#ffffff', c2: '#fef08a', c3: '#eab308' };

  return (
    <div
      className="absolute inset-0 pointer-events-none z-20 overflow-hidden"
      style={{ mixBlendMode: 'screen' }}
    >
      {sparkles.map((sparkle, idx) => (
        <svg
          key={idx}
          viewBox="0 0 32 32"
          className="absolute animate-diamond-shine"
          style={{
            top: sparkle.top,
            left: sparkle.left,
            width: `${sparkle.size}px`,
            height: `${sparkle.size}px`,
            filter: dropFilter,
            mixBlendMode: 'screen',
            ['--shine-delay' as any]: sparkle.delay,
            ['--shine-duration' as any]: sparkle.duration,
          }}
        >
          {/* Anamorphic horizontal lens streak for realistic diamond glint */}
          <ellipse cx="16" cy="16" rx="15" ry="1.2" fill="#ffffff" opacity={isPlatinum ? '0.85' : '0.65'} />

          {/* Primary 4-point diamond needle spikes */}
          <polygon
            points="16,0 17.6,14.4 32,16 17.6,17.6 16,32 14.4,17.6 0,16 14.4,14.4"
            fill={`url(#${gradId}-${tier})`}
          />

          {/* Secondary 4-point diagonal diamond facet spikes */}
          <polygon
            points="16,5 17.4,14.6 27,7 17.4,17.4 27,25 14.6,17.4 5,27 14.6,14.6"
            fill={`url(#${gradId}-${tier})`}
            opacity={isPlatinum ? '0.9' : '0.7'}
          />

          {/* Core diamond brilliance hotspot */}
          <circle cx="16" cy="16" r={isPlatinum ? 2.8 : 2.2} fill="#ffffff" />

          <defs>
            <linearGradient
              id={`${gradId}-${tier}`}
              x1="0"
              y1="0"
              x2="32"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={gradStops.c1} />
              <stop offset="40%" stopColor={gradStops.c2} />
              <stop offset="100%" stopColor={gradStops.c3} />
            </linearGradient>
          </defs>
        </svg>
      ))}
    </div>
  );
};


// Radiant neon glowing aura style matching trophy colors (no dark drop shadows!)
const TIER_GLOW_STYLES: Record<TrophyTier, string> = {
  bronze: 'drop-shadow(0 0 14px rgba(245,158,11,0.85)) drop-shadow(0 0 28px rgba(180,83,9,0.5))',
  silver: 'drop-shadow(0 0 14px rgba(241,245,249,0.85)) drop-shadow(0 0 28px rgba(148,163,184,0.5))',
  gold: 'drop-shadow(0 0 18px rgba(250,204,21,0.9)) drop-shadow(0 0 36px rgba(234,179,8,0.55))',
  platinum: 'drop-shadow(0 0 20px rgba(6,182,212,0.9)) drop-shadow(0 0 40px rgba(34,211,238,0.55))',
  locked: 'none',
};

const TIER_AURA_BACKGROUNDS: Record<TrophyTier, string> = {
  bronze: 'bg-gradient-to-tr from-amber-600/35 via-amber-500/25 to-yellow-600/20 blur-2xl animate-pulse',
  silver: 'bg-gradient-to-tr from-slate-300/30 via-slate-100/20 to-sky-300/20 blur-2xl animate-pulse',
  gold: 'bg-gradient-to-tr from-yellow-400/40 via-amber-400/30 to-yellow-200/25 blur-2xl animate-pulse',
  platinum: 'bg-gradient-to-tr from-cyan-400/40 via-sky-400/30 to-teal-300/25 blur-2xl animate-pulse',
  locked: 'bg-transparent',
};

const TIER_DETAILS_MAP: Record<
  TrophyTier,
  {
    name: string;
    badgeBg: string;
    badgeBorder: string;
    badgeText: string;
    activeRing: string;
    activeBorder: string;
    activeBg: string;
    textActiveColor: string;
  }
> = {
  bronze: {
    name: 'Bronze',
    badgeBg: 'bg-amber-950/60',
    badgeBorder: 'border-amber-600/60',
    badgeText: 'text-amber-400',
    activeRing: 'ring-amber-500/80',
    activeBorder: 'border-amber-400',
    activeBg: 'bg-amber-500/15',
    textActiveColor: 'text-amber-300',
  },
  silver: {
    name: 'Silver',
    badgeBg: 'bg-slate-900/60',
    badgeBorder: 'border-slate-400/60',
    badgeText: 'text-slate-200',
    activeRing: 'ring-slate-300/80',
    activeBorder: 'border-slate-300',
    activeBg: 'bg-slate-400/15',
    textActiveColor: 'text-slate-100',
  },
  gold: {
    name: 'Gold',
    badgeBg: 'bg-yellow-950/60',
    badgeBorder: 'border-yellow-500/60',
    badgeText: 'text-yellow-300',
    activeRing: 'ring-yellow-400/80',
    activeBorder: 'border-yellow-400',
    activeBg: 'bg-yellow-400/15',
    textActiveColor: 'text-yellow-200',
  },
  platinum: {
    name: 'Platinum',
    badgeBg: 'bg-cyan-950/60',
    badgeBorder: 'border-cyan-400/60',
    badgeText: 'text-cyan-300',
    activeRing: 'ring-cyan-400/80',
    activeBorder: 'border-cyan-400',
    activeBg: 'bg-cyan-500/15',
    textActiveColor: 'text-cyan-200',
  },
  locked: {
    name: 'Locked',
    badgeBg: 'bg-neutral-900/60',
    badgeBorder: 'border-white/10',
    badgeText: 'text-gray-400',
    activeRing: 'ring-white/20',
    activeBorder: 'border-white/20',
    activeBg: 'bg-white/5',
    textActiveColor: 'text-gray-400',
  },
};

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
  const [inspectedTier, setInspectedTier] = useState<TrophyTier | null>(null);

  // Live real-time stats and economy synchronization
  const [liveStats, setLiveStats] = useState<AppStats>(stats);
  const [liveEconomy, setLiveEconomy] = useState<EconomyState>(economy);

  useEffect(() => {
    setLiveStats(stats);
  }, [stats]);

  useEffect(() => {
    setLiveEconomy(economy);
  }, [economy]);

  // Synchronize immediately with custom events and persistent DB
  useEffect(() => {
    if (!isOpen) return;

    // Refresh immediately when opened
    getStats().then(setLiveStats);
    setLiveEconomy(getEconomyState());
    setClaimMap(getTrophyClaimMap());

    const handleStatsEvent = (e: Event) => {
      const ce = e as CustomEvent<AppStats>;
      if (ce.detail) {
        setLiveStats(ce.detail);
      } else {
        getStats().then(setLiveStats);
      }
    };

    const handleEconomyEvent = (e: Event) => {
      const ce = e as CustomEvent<EconomyState>;
      if (ce.detail) {
        setLiveEconomy(ce.detail);
      } else {
        setLiveEconomy(getEconomyState());
      }
    };

    const handleClaimEvent = () => {
      setClaimMap(getTrophyClaimMap());
    };

    window.addEventListener('picku_stats_updated', handleStatsEvent);
    window.addEventListener('picku_economy_updated', handleEconomyEvent);
    window.addEventListener('picku_trophy_claimed', handleClaimEvent);

    return () => {
      window.removeEventListener('picku_stats_updated', handleStatsEvent);
      window.removeEventListener('picku_economy_updated', handleEconomyEvent);
      window.removeEventListener('picku_trophy_claimed', handleClaimEvent);
    };
  }, [isOpen]);

  // When a trophy is selected for inspection, default to its highest unlocked tier (or bronze)
  useEffect(() => {
    if (selectedTrophy) {
      const statsCtx = {
        totalRouletteRounds: liveStats.totalRouletteRounds || 0,
        totalBottleSpins: liveStats.totalBottleSpins || 0,
        totalKaboomRounds: liveStats.totalKaboomRounds || 0,
        kaboomVictories: liveStats.kaboom?.victories || 0,
        kaboomBonusCollected: liveStats.kaboom?.bonusCollected || 0,
        unlockedItemCount: liveEconomy.unlockedItems?.length || 1,
      };
      const p = calculateTrophyProgress(selectedTrophy, statsCtx, claimMap);
      setInspectedTier(p.currentTier !== 'locked' ? p.currentTier : 'bronze');
    } else {
      setInspectedTier(null);
    }
  }, [selectedTrophy]);

  if (!isOpen) return null;

  const statsContext = {
    totalRouletteRounds: liveStats.totalRouletteRounds || 0,
    totalBottleSpins: liveStats.totalBottleSpins || 0,
    totalKaboomRounds: liveStats.totalKaboomRounds || 0,
    kaboomVictories: liveStats.kaboom?.victories || 0,
    kaboomBonusCollected: liveStats.kaboom?.bonusCollected || 0,
    unlockedItemCount: liveEconomy.unlockedItems?.length || 1,
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
      Haptics.reward();
      const updatedEco = addStars(res.starsAwarded);
      setLiveEconomy(updatedEco);
      if (onEconomyUpdated) onEconomyUpdated(updatedEco);
      setClaimMap(getTrophyClaimMap());
      window.dispatchEvent(new CustomEvent('picku_trophy_claimed'));
      window.dispatchEvent(
        new CustomEvent('app-confetti', {
          detail: { count: 35, colors: ['#f59e0b', '#06b6d4', '#eab308'] },
        })
      );
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
        className="relative w-full max-w-lg h-[min(88vh,720px)] flex flex-col rounded-[28px] bg-gradient-to-b from-[#140b22]/98 via-[#0d0718]/98 to-black/98 border-2 border-amber-500/40 shadow-[0_0_40px_rgba(245,158,11,0.3)] overflow-hidden text-white"
      >
        {/* Top Header Bar */}
        <div className="relative px-5 pt-4 pb-3 border-b border-amber-500/20 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 flex items-center justify-center shadow-[0_0_15px_rgba(245,158,11,0.5)] border border-yellow-200/60 text-black shrink-0">
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
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95 cursor-pointer shrink-0"
            aria-label="Close Achievements"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Primary Category Tabs */}
        <div className="relative bg-black/60 border-b border-white/10 shrink-0">
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
        <div className="flex items-center gap-1.5 px-3 py-1.5 overflow-x-auto no-scrollbar bg-black/40 border-b border-white/5 text-[11px] shrink-0">
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
              {filteredTrophies.map((trophy, index) => {
                const progress = calculateTrophyProgress(trophy, statsContext, claimMap);
                const pedestal = getTierPedestalStyle(progress.currentTier);
                const isLocked = progress.currentTier === 'locked';
                const isPlatinum = progress.currentTier === 'platinum';

                return (
                  <div
                    key={trophy.id}
                    onClick={() => {
                      SoundEngine.playButtonClick();
                      Haptics.buttonClick();
                      setSelectedTrophy(trophy);
                    }}
                    style={{
                      animationDelay: `${Math.min(index * 45, 400)}ms`,
                    }}
                    className={`group relative rounded-2xl ${pedestal.glowCardClass} ${pedestal.cardBg} p-3.5 flex flex-col justify-between transition-all duration-300 hover:scale-[1.02] cursor-pointer overflow-hidden animate-trophy-entrance`}
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
                        className={`absolute w-44 h-44 sm:w-48 sm:h-48 rounded-full pointer-events-none transition-all duration-300 ${
                          isLocked
                            ? 'bg-transparent'
                            : `${TIER_AURA_BACKGROUNDS[progress.currentTier]} ${
                                progress.currentTier === 'platinum' ? 'animate-platinum-aura-surge' : ''
                              }`
                        }`}
                      />

                      {/* Trophy Image / Icon with Hover Float - 3x Size */}
                      <div className="relative z-10 transform group-hover:-translate-y-1.5 transition-transform duration-300 flex items-center justify-center min-h-[176px] sm:min-h-[192px]">
                        {/* Shimmering diamond shines on gold and platinum trophies */}
                        <DiamondShineSparkles tier={progress.currentTier} isReached={!isLocked} />

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
                                  style={{
                                    filter: TIER_GLOW_STYLES[progress.currentTier],
                                  }}
                                  className={`w-44 h-44 sm:w-48 sm:h-48 object-contain transition-transform duration-300 group-hover:scale-105 ${
                                    progress.currentTier === 'platinum' ? 'animate-platinum-surge' : ''
                                  }`}
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
      </div>

      {/* Selected Trophy Detailed Inspection Modal */}
      {selectedTrophy && (() => {
        const p = calculateTrophyProgress(selectedTrophy, statsContext, claimMap);
        const currentInspectedTier: TrophyTier =
          inspectedTier || (p.currentTier !== 'locked' ? p.currentTier : 'bronze');
        const tCfg = selectedTrophy.tiers[currentInspectedTier];
        const isCurrentReached = p.currentValue >= tCfg.threshold;
        const tierDetails = TIER_DETAILS_MAP[currentInspectedTier];
        const pedestal = getTierPedestalStyle(currentInspectedTier);
        const currentImg = tCfg.image || getTrophyImage(selectedTrophy, currentInspectedTier);

        return (
          <div
            className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-xl animate-fade-in"
            onClick={() => setSelectedTrophy(null)}
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-sm sm:max-w-md h-[min(88vh,610px)] flex flex-col justify-between rounded-[26px] ${pedestal.glowCardClass} ${pedestal.cardBg} p-4 sm:p-5 text-white overflow-hidden`}
            >
              {/* Radial Glow Overlay */}
              <div className={`absolute inset-0 pointer-events-none ${pedestal.radialOverlay}`} />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  SoundEngine.playButtonClick();
                  setSelectedTrophy(null);
                }}
                className="absolute top-3.5 right-3.5 z-30 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white cursor-pointer transition-all active:scale-95"
                aria-label="Close Showcase"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Top Bar (Header) - Compact */}
              <div className="relative z-10 shrink-0 pr-8">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-header font-bold text-gray-300 tracking-wider uppercase px-2 py-0.5 rounded-md bg-black/60 border border-white/10">
                    {selectedTrophy.categoryLabel}
                  </span>
                  <h3 className="font-header text-lg sm:text-xl font-bold text-white tracking-wide truncate">
                    {selectedTrophy.title}
                  </h3>
                </div>
                <p className="text-[11px] text-gray-300 line-clamp-1 mt-0.5 font-body">
                  {selectedTrophy.description}
                </p>
              </div>

              {/* Center Stage: Trophy Display with Glow & Shine (No Drop Shadow) */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center min-h-0 py-1 sm:py-2">
                <div className="relative flex items-center justify-center">
                  {/* Glowing Aura Behind Trophy */}
                  <div
                    className={`absolute w-36 h-36 sm:w-44 sm:h-44 rounded-full pointer-events-none transition-all duration-300 ${
                      isCurrentReached
                        ? `${TIER_AURA_BACKGROUNDS[currentInspectedTier]} ${
                            currentInspectedTier === 'platinum' ? 'animate-platinum-aura-surge' : ''
                          }`
                        : 'bg-transparent'
                    }`}
                  />

                  {/* Diamond Shine Sparkles */}
                  <DiamondShineSparkles tier={currentInspectedTier} isReached={isCurrentReached} />

                  {/* Trophy Image */}
                  <div className="relative z-10 flex items-center justify-center">
                    <img
                      src={currentImg}
                      alt={`${selectedTrophy.title} - ${currentInspectedTier}`}
                      style={{
                        filter: isCurrentReached
                          ? TIER_GLOW_STYLES[currentInspectedTier]
                          : 'grayscale(100%) opacity(25%) brightness(50%)',
                      }}
                      className={`w-32 h-32 sm:w-36 sm:h-36 object-contain transition-all duration-300 hover:scale-105 ${
                        isCurrentReached && currentInspectedTier === 'platinum'
                          ? 'animate-platinum-surge'
                          : ''
                      }`}
                    />

                    {!isCurrentReached && (
                      <div className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-neutral-950/90 border border-white/20 flex items-center justify-center shadow-xl">
                        <Lock className="w-5 h-5 text-gray-400" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Inspected Tier Status Badge */}
                <div className="mt-2 flex items-center gap-2">
                  <div
                    className={`px-3 py-0.5 rounded-full text-xs font-header font-bold uppercase tracking-wider border shadow-md flex items-center gap-1.5 ${tierDetails.badgeBg} ${tierDetails.badgeBorder} ${tierDetails.badgeText}`}
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Viewing: {tCfg.badgeName}</span>
                    <span className="opacity-75 font-normal">({tCfg.title})</span>
                  </div>
                </div>

                {/* Score vs Goal */}
                <div className="mt-1 text-[11px] font-header font-semibold text-gray-300 flex items-center gap-1.5 bg-black/40 px-3 py-0.5 rounded-full border border-white/10">
                  <span>Score:</span>
                  <span className="text-amber-300 font-bold">{p.currentValue}</span>
                  <span className="text-gray-500">/</span>
                  <span className="text-white">{tCfg.threshold} {selectedTrophy.metricLabel}</span>
                </div>
              </div>

              {/* Bottom 4 Tiers List - Compact, No Need To Scroll! */}
              <div className="relative z-10 shrink-0 space-y-1.5 pt-2 border-t border-white/10">
                <div className="text-[10px] uppercase tracking-wider text-gray-400 font-header font-semibold flex items-center justify-between px-1">
                  <span>Trophy Tiers</span>
                  <span className="text-amber-300/80 lowercase text-[10px]">click any tier to view</span>
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {(['bronze', 'silver', 'gold', 'platinum'] as TrophyTier[]).map((tKey) => {
                    const tierCfg = selectedTrophy.tiers[tKey];
                    const isReached = p.currentValue >= tierCfg.threshold;
                    const isClaimed = (claimMap[selectedTrophy.id] || []).includes(tKey);
                    const canClaim = isReached && !isClaimed;
                    const isInspected = currentInspectedTier === tKey;
                    const def = TIER_DETAILS_MAP[tKey];

                    return (
                      <div
                        key={tKey}
                        onClick={() => {
                          SoundEngine.playButtonClick();
                          Haptics.buttonClick();
                          setInspectedTier(tKey);
                        }}
                        className={`py-1.5 px-2.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                          isInspected
                            ? `${def.activeBorder} ${def.activeBg} ring-2 ${def.activeRing} shadow-md`
                            : isReached
                            ? 'bg-white/5 border-white/10 hover:bg-white/10'
                            : 'bg-black/30 border-white/5 opacity-55 hover:opacity-80'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={tierCfg.image}
                            alt={tierCfg.badgeName}
                            className="w-6 h-6 object-contain"
                            style={{
                              filter: isReached ? TIER_GLOW_STYLES[tKey] : 'grayscale(100%) opacity(30%)',
                            }}
                          />
                          <div className="leading-tight">
                            <div className="flex items-center gap-1.5">
                              <span className={`font-header font-bold text-xs capitalize ${isInspected ? def.textActiveColor : 'text-white'}`}>
                                {tierCfg.badgeName}
                              </span>
                              <span className="text-[10px] text-gray-400 font-normal">
                                ({tierCfg.title})
                              </span>
                            </div>
                            <div className="text-[10px] text-gray-400">
                              Goal: {tierCfg.threshold} {selectedTrophy.metricLabel}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {canClaim ? (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleClaim(selectedTrophy.id, tKey, e);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-amber-400 text-black font-header font-black text-xs hover:bg-yellow-300 transition-all cursor-pointer shadow-[0_0_8px_rgba(245,158,11,0.8)] animate-glow-pulse flex items-center gap-1"
                            >
                              <span>Claim +{tierCfg.starBonus}</span>
                              <img src={currencyStarImg} alt="Stars" className="w-3 h-3 object-contain inline" />
                            </button>
                          ) : isClaimed ? (
                            <span className="flex items-center gap-1 text-emerald-400 font-medium text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Claimed
                            </span>
                          ) : isReached ? (
                            <span className="text-amber-300 font-medium text-[11px]">Unlocked</span>
                          ) : (
                            <span className="text-gray-500 text-[10px] flex items-center gap-1">
                              <Lock className="w-3 h-3 text-gray-500" />
                              {tierCfg.threshold - p.currentValue} left
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
