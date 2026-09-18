/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BottleBuiltinStyle } from '../types';
import { BOTTLE_SKINS } from './bottleSkins';
import kaboomBombImg from '../assets/images/Bomb Sprite.png';
import kaboomBallImg from '../assets/images/Ball Sprite.png';

export type StoreCategory = 'bottles' | 'bombs' | 'balls' | 'accessories';

export interface StoreItem {
  id: string;
  category: StoreCategory;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary';
  badge?: string;
  accentGradient: string;
  borderGlow: string;
  iconType: 'bottle' | 'bomb' | 'ball' | 'accessory';
  builtInBottleStyle?: BottleBuiltinStyle;
  image?: string;
  cssFilter?: string;
}

export interface StarEarringsProgress {
  bombVictory: boolean;
  bottleSpin: boolean;
  fingerGame: boolean;
  unlocked: boolean;
  unlockedAt?: number;
}

export interface DailyLoginRewards {
  claimedDays: number[]; // [1, 2, ...] up to [1..7]. Each day 1-7 can be claimed just once.
  lastClaimDate: string; // 'YYYY-MM-DD' of the last day claimed
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  starReward: number;
  isClaimed: boolean;
  gameMode?: 'roulette' | 'bottle' | 'kaboom' | 'hub' | 'settings';
}

export interface EconomyState {
  stars: number;
  unlockedItems: string[];
  equippedSkins: {
    bottles: string;
    bombs: string;
    balls: string;
    accessories?: string;
  };
  starEarrings: StarEarringsProgress;
  dailyQuests: DailyQuest[];
  milestoneChestClaimed: boolean;
  lastDailyResetDate: string; // 'YYYY-MM-DD'
  lastDailyReset: number; // Unix timestamp
  dailyLoginRewards: DailyLoginRewards;
  claimedLoginDay?: number; // Kept for backwards compatibility
}

const STORAGE_KEY = 'picku_party_economy_v1';

export const STORE_CATALOGUE: Record<StoreCategory, StoreItem[]> = {
  bottles: [
    {
      id: 'bottle_btl_001',
      category: 'bottles',
      name: 'Neon Cyber Rush',
      subtitle: 'Classic Electro Rave',
      description: 'The iconic aerodynamic cyan glass decider, optimized for precision high-speed party spins.',
      price: 0,
      rarity: 'Common',
      badge: 'DEFAULT',
      accentGradient: 'from-cyan-400 to-blue-600',
      borderGlow: 'border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      iconType: 'bottle',
      builtInBottleStyle: 'btl_e_001',
      image: BOTTLE_SKINS[0].image,
    },
    {
      id: 'bottle_btl_002',
      category: 'bottles',
      name: 'Rosé Pulse Glam',
      subtitle: 'VIP Lounge Edition',
      description: 'Effervescent magenta bottle with shimmering neon bubbles and gentle warm party luminescence.',
      price: 350,
      rarity: 'Rare',
      accentGradient: 'from-pink-400 to-rose-600',
      borderGlow: 'border-pink-400/60 shadow-[0_0_15px_rgba(244,63,94,0.4)]',
      iconType: 'bottle',
      builtInBottleStyle: 'btl_e_002',
      image: BOTTLE_SKINS[1].image,
    },
    {
      id: 'bottle_btl_003',
      category: 'bottles',
      name: 'Hyper Violet Elixir',
      subtitle: 'Midnight Ultraviolet',
      description: 'Deep violet party potion glowing with electric purple streaks and hypnotic rotational aura.',
      price: 650,
      rarity: 'Epic',
      badge: 'POPULAR',
      accentGradient: 'from-purple-400 to-fuchsia-600',
      borderGlow: 'border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      iconType: 'bottle',
      builtInBottleStyle: 'btl_e_003',
      image: BOTTLE_SKINS[2].image,
    },
    {
      id: 'bottle_btl_004',
      category: 'bottles',
      name: 'Solar Amber Flare',
      subtitle: 'High Voltage Sunburst',
      description: 'Sun-forged golden crystal charged with solar flare particles for maximum celebratory impact.',
      price: 1000,
      rarity: 'Legendary',
      badge: 'EXCLUSIVE',
      accentGradient: 'from-amber-300 via-orange-400 to-yellow-500',
      borderGlow: 'border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.5)]',
      iconType: 'bottle',
      builtInBottleStyle: 'btl_e_004',
      image: BOTTLE_SKINS[3].image,
    },
  ],
  bombs: [
    {
      id: 'bomb_classic_tnt',
      category: 'bombs',
      name: 'Chibi TNT Explosive',
      subtitle: 'Classic Boom Box',
      description: 'The iconic chibi bomb character with a sizzling party fuse.',
      price: 0,
      rarity: 'Common',
      badge: 'DEFAULT',
      accentGradient: 'from-red-500 to-orange-600',
      borderGlow: 'border-red-400/60 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
      iconType: 'bomb',
      image: kaboomBombImg,
    },
    {
      id: 'bomb_plasma_core',
      category: 'bombs',
      name: 'Neon Plasma Core',
      subtitle: 'High Voltage Reactor',
      description: 'An unstable sci-fi plasma reactor that pulses to the party bass.',
      price: 300,
      rarity: 'Rare',
      accentGradient: 'from-cyan-400 to-blue-600',
      borderGlow: 'border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      iconType: 'bomb',
      image: kaboomBombImg,
      cssFilter: 'hue-rotate(185deg) saturate(1.8) brightness(1.2)',
    },
    {
      id: 'bomb_disco_mirror',
      category: 'bombs',
      name: 'Disco Mirror Sphere',
      subtitle: 'Sparkling Party Bomb',
      description: 'Reflects laser spotlights in every direction until the grand detonation.',
      price: 550,
      rarity: 'Epic',
      badge: 'PARTY',
      accentGradient: 'from-pink-400 via-purple-400 to-cyan-400',
      borderGlow: 'border-pink-400/70 shadow-[0_0_18px_rgba(236,72,153,0.5)]',
      iconType: 'bomb',
      image: kaboomBombImg,
      cssFilter: 'hue-rotate(285deg) saturate(1.6) brightness(1.15)',
    },
    {
      id: 'bomb_molten_magma',
      category: 'bombs',
      name: 'Molten Magma Core',
      subtitle: 'Volcanic Blast',
      description: 'Crackling volcanic rock oozing incandescent lava ready to erupt.',
      price: 850,
      rarity: 'Legendary',
      badge: 'HOT',
      accentGradient: 'from-amber-400 via-orange-500 to-red-600',
      borderGlow: 'border-orange-500/80 shadow-[0_0_22px_rgba(249,115,22,0.6)]',
      iconType: 'bomb',
      image: kaboomBombImg,
      cssFilter: 'hue-rotate(25deg) saturate(2.2) contrast(1.2) brightness(1.1)',
    },
    {
      id: 'bomb_toxic_radioactive',
      category: 'bombs',
      name: 'Toxic Hazard Bomb',
      subtitle: 'Bio-Electric Fume',
      description: 'Bio-luminescent lime reactor radiating intense electromagnetic party waves.',
      price: 400,
      rarity: 'Rare',
      badge: 'NEW',
      accentGradient: 'from-lime-400 to-emerald-600',
      borderGlow: 'border-lime-400/60 shadow-[0_0_15px_rgba(132,204,22,0.4)]',
      iconType: 'bomb',
      image: kaboomBombImg,
      cssFilter: 'hue-rotate(65deg) saturate(2.2) brightness(1.2)',
    },
    {
      id: 'bomb_frostbite_cryo',
      category: 'bombs',
      name: 'Glacial Cryo Core',
      subtitle: 'Sub-Zero Freeze',
      description: 'Crystalline frozen blast capsule encased in perpetual sub-zero diamond rime.',
      price: 450,
      rarity: 'Rare',
      accentGradient: 'from-sky-300 via-cyan-400 to-blue-500',
      borderGlow: 'border-sky-400/60 shadow-[0_0_16px_rgba(56,189,248,0.45)]',
      iconType: 'bomb',
      image: kaboomBombImg,
      cssFilter: 'hue-rotate(160deg) saturate(1.7) brightness(1.3)',
    },
    {
      id: 'bomb_cosmic_void',
      category: 'bombs',
      name: 'Cosmic Singularity',
      subtitle: 'Deep Space Graviton',
      description: 'Interstellar dark matter core surrounded by a rotating purple event horizon.',
      price: 700,
      rarity: 'Epic',
      badge: 'COSMIC',
      accentGradient: 'from-indigo-400 via-purple-500 to-pink-500',
      borderGlow: 'border-purple-400/70 shadow-[0_0_20px_rgba(168,85,247,0.5)]',
      iconType: 'bomb',
      image: kaboomBombImg,
      cssFilter: 'hue-rotate(240deg) saturate(2.2) brightness(1.25)',
    },
    {
      id: 'bomb_hyper_cyberpunk',
      category: 'bombs',
      name: 'Cyber Glitch Bomb',
      subtitle: 'Neon Matrix Overload',
      description: 'Overclocked quantum processor pulsing with synthetic electro rave frequencies.',
      price: 950,
      rarity: 'Legendary',
      badge: 'ELITE',
      accentGradient: 'from-fuchsia-500 via-pink-500 to-rose-600',
      borderGlow: 'border-fuchsia-500/80 shadow-[0_0_22px_rgba(217,70,239,0.6)]',
      iconType: 'bomb',
      image: kaboomBombImg,
      cssFilter: 'hue-rotate(315deg) saturate(2.5) contrast(1.2) brightness(1.2)',
    },
  ],
  balls: [
    {
      id: 'ball_cyan_orbs',
      category: 'balls',
      name: 'Cyan Pulse Spheres',
      subtitle: 'Standard Grid Tiles',
      description: 'Vibrant neon blue kinetic orbs with tactile impact feedback.',
      price: 0,
      rarity: 'Common',
      badge: 'DEFAULT',
      accentGradient: 'from-cyan-400 to-teal-500',
      borderGlow: 'border-cyan-400/60 shadow-[0_0_15px_rgba(6,182,212,0.4)]',
      iconType: 'ball',
      image: kaboomBallImg,
    },
    {
      id: 'ball_golden_sparkle',
      category: 'balls',
      name: 'Golden Disco Orbs',
      subtitle: 'VIP Gilded Spheres',
      description: 'Polished brass and gold spheres with shimmering glitter particles.',
      price: 300,
      rarity: 'Rare',
      accentGradient: 'from-amber-300 to-yellow-500',
      borderGlow: 'border-amber-400/60 shadow-[0_0_15px_rgba(245,158,11,0.4)]',
      iconType: 'ball',
      image: kaboomBallImg,
      cssFilter: 'hue-rotate(185deg) saturate(2.4) brightness(1.25)',
    },
    {
      id: 'ball_violet_surge',
      category: 'balls',
      name: 'Electric Ultraviolet',
      subtitle: 'High-Frequency Wave',
      description: 'Charged amethyst energy bubbles radiating high-frequency purple pulses.',
      price: 400,
      rarity: 'Rare',
      badge: 'NEW',
      accentGradient: 'from-purple-400 to-fuchsia-500',
      borderGlow: 'border-purple-400/60 shadow-[0_0_15px_rgba(168,85,247,0.4)]',
      iconType: 'ball',
      image: kaboomBallImg,
      cssFilter: 'hue-rotate(60deg) saturate(2.2) brightness(1.2)',
    },
    {
      id: 'ball_crimson_ruby',
      category: 'balls',
      name: 'Ruby Laser Orbs',
      subtitle: 'Thermal Red Glint',
      description: 'Cut crimson ruby spheres with glowing laser diffraction patterns.',
      price: 450,
      rarity: 'Rare',
      accentGradient: 'from-red-500 to-rose-600',
      borderGlow: 'border-red-400/60 shadow-[0_0_15px_rgba(239,68,68,0.4)]',
      iconType: 'ball',
      image: kaboomBallImg,
      cssFilter: 'hue-rotate(345deg) saturate(2.4) brightness(1.15)',
    },
    {
      id: 'ball_hologram_crystal',
      category: 'balls',
      name: 'Prism Hologram Bubbles',
      subtitle: 'Crystal Refraction',
      description: 'Translucent diamond facets splitting nightclub lights into rainbow spectrums.',
      price: 550,
      rarity: 'Epic',
      badge: 'PARTY',
      accentGradient: 'from-fuchsia-400 via-purple-400 to-indigo-500',
      borderGlow: 'border-fuchsia-400/70 shadow-[0_0_18px_rgba(217,70,239,0.5)]',
      iconType: 'ball',
      image: kaboomBallImg,
      cssFilter: 'hue-rotate(95deg) saturate(1.6) brightness(1.2)',
    },
    {
      id: 'ball_opal_aurora',
      category: 'balls',
      name: 'Opal Aurora Bubbles',
      subtitle: 'Iridescent Sky Reflection',
      description: 'Soft iridescent pastel orbs that shimmer like polar auroras on impact.',
      price: 700,
      rarity: 'Epic',
      badge: 'AURORA',
      accentGradient: 'from-teal-300 via-sky-300 to-pink-300',
      borderGlow: 'border-teal-300/70 shadow-[0_0_18px_rgba(94,234,212,0.45)]',
      iconType: 'ball',
      image: kaboomBallImg,
      cssFilter: 'hue-rotate(130deg) saturate(1.4) brightness(1.35)',
    },
    {
      id: 'ball_retro_pixel',
      category: 'balls',
      name: 'Retro 8-Bit Cubes',
      subtitle: 'Arcade Nostalgia',
      description: 'Pixelated green arcade spheres that blink like vintage synth synthesizers.',
      price: 800,
      rarity: 'Legendary',
      badge: 'RETRO',
      accentGradient: 'from-emerald-400 via-teal-400 to-cyan-500',
      borderGlow: 'border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.5)]',
      iconType: 'ball',
      image: kaboomBallImg,
      cssFilter: 'hue-rotate(295deg) saturate(2) brightness(1.15)',
    },
    {
      id: 'ball_stellar_void',
      category: 'balls',
      name: 'Dark Matter Spheres',
      subtitle: 'Antimatter Resonance',
      description: 'Deep onyx celestial orbs that bend ambient nightclub lighting.',
      price: 900,
      rarity: 'Legendary',
      badge: 'MYTHIC',
      accentGradient: 'from-violet-500 via-indigo-600 to-slate-800',
      borderGlow: 'border-indigo-500/80 shadow-[0_0_22px_rgba(99,102,241,0.55)]',
      iconType: 'ball',
      image: kaboomBallImg,
      cssFilter: 'hue-rotate(230deg) saturate(2.2) contrast(1.25) brightness(1.1)',
    },
  ],
  accessories: [
    {
      id: 'accessory_star_earrings',
      category: 'accessories',
      name: 'Star Earrings',
      subtitle: 'Trophy of Triple Mastery',
      description: 'Radiant celestial star earrings forged from pure party starlight. Awarded by fulfilling the mastery condition: Win Bomb Game, Complete Bottle Spin, and Complete Finger Game.',
      price: 0,
      rarity: 'Legendary',
      badge: 'SPECIAL',
      accentGradient: 'from-amber-300 via-yellow-400 to-amber-500',
      borderGlow: 'border-amber-300/80 shadow-[0_0_22px_rgba(251,191,36,0.7)]',
      iconType: 'accessory',
    },
  ],
};

export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function getTimeUntilMidnight(): {
  hours: number;
  minutes: number;
  seconds: number;
  totalMs: number;
  formatted: string;
} {
  const now = new Date();
  const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0, 0);
  const diffMs = Math.max(0, midnight.getTime() - now.getTime());
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diffMs % (1000 * 60)) / 1000);
  const formatted = `${hours}h ${String(minutes).padStart(2, '0')}m ${String(seconds).padStart(2, '0')}s`;
  return { hours, minutes, seconds, totalMs: diffMs, formatted };
}

export function createDefaultQuests(): DailyQuest[] {
  return [
    {
      id: 'quest_daily_party',
      title: 'Party Attendance',
      description: 'Check in to the party club today to earn daily stars.',
      targetCount: 1,
      currentCount: 1, // Ready to claim immediately on daily login!
      starReward: 50,
      isClaimed: false,
      gameMode: 'hub',
    },
    {
      id: 'quest_bottle_spin',
      title: 'Bottle Spin Party',
      description: 'Spin the bottle 3 times with party friends.',
      targetCount: 3,
      currentCount: 0,
      starReward: 50,
      isClaimed: false,
      gameMode: 'bottle',
    },
    {
      id: 'quest_roulette_picker',
      title: 'Finger Picker Host',
      description: 'Complete 2 rounds of Finger Roulette selection.',
      targetCount: 2,
      currentCount: 0,
      starReward: 50,
      isClaimed: false,
      gameMode: 'roulette',
    },
    {
      id: 'quest_kaboom_tiles',
      title: 'Safe Tile Sweeper',
      description: 'Reveal 5 safe ball tiles in KABOOM mode without detonating.',
      targetCount: 5,
      currentCount: 0,
      starReward: 75,
      isClaimed: false,
      gameMode: 'kaboom',
    },
    {
      id: 'quest_kaboom_victory',
      title: 'Kaboom Champion',
      description: 'Safely clear a board or avoid bombs to win 1 KABOOM round.',
      targetCount: 1,
      currentCount: 0,
      starReward: 100,
      isClaimed: false,
      gameMode: 'kaboom',
    },
  ];
}

export const MILESTONE_CHEST_REWARD = 250;

export interface DailyLoginRewardTier {
  day: number;
  stars: number;
  label: string;
  isGrand?: boolean;
}

export const DAILY_LOGIN_REWARDS: DailyLoginRewardTier[] = [
  { day: 1, stars: 100, label: 'Day 1' },
  { day: 2, stars: 150, label: 'Day 2' },
  { day: 3, stars: 200, label: 'Day 3' },
  { day: 4, stars: 250, label: 'Day 4' },
  { day: 5, stars: 300, label: 'Day 5' },
  { day: 6, stars: 400, label: 'Day 6' },
  { day: 7, stars: 750, label: 'Grand Day 7', isGrand: true },
];

const DEFAULT_STATE: EconomyState = {
  stars: 1250,
  unlockedItems: [
    'bottle_btl_001',
    'bomb_classic_tnt',
    'ball_cyan_orbs',
  ],
  equippedSkins: {
    bottles: 'bottle_btl_001',
    bombs: 'bomb_classic_tnt',
    balls: 'ball_cyan_orbs',
    accessories: '',
  },
  starEarrings: {
    bombVictory: false,
    bottleSpin: false,
    fingerGame: false,
    unlocked: false,
  },
  dailyQuests: createDefaultQuests(),
  milestoneChestClaimed: false,
  lastDailyResetDate: getTodayDateString(),
  lastDailyReset: Date.now(),
  dailyLoginRewards: {
    claimedDays: [],
    lastClaimDate: '',
  },
  claimedLoginDay: 1,
};

export function getEconomyState(): EconomyState {
  if (typeof window === 'undefined') return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_STATE));
      return DEFAULT_STATE;
    }
    const parsed = JSON.parse(raw);
    const todayStr = getTodayDateString();
    
    // Ensure default unlocked bottle is present
    let rawUnlocked: string[] = Array.isArray(parsed.unlockedItems) ? parsed.unlockedItems : DEFAULT_STATE.unlockedItems;
    if (!rawUnlocked.includes('bottle_btl_001')) {
      rawUnlocked.push('bottle_btl_001');
    }

    // Filter out obsolete/deleted prototype IDs
    const validBottleIds = STORE_CATALOGUE.bottles.map((b) => b.id);
    const validBombIds = STORE_CATALOGUE.bombs.map((b) => b.id);
    const validBallIds = STORE_CATALOGUE.balls.map((b) => b.id);
    const validAccessoryIds = STORE_CATALOGUE.accessories.map((a) => a.id);
    const allValidIds = new Set([...validBottleIds, ...validBombIds, ...validBallIds, ...validAccessoryIds, 'btl_e_001']);

    // Parse Star Earrings Condition progress
    const rawEarrings = parsed.starEarrings || {};
    const bombVictory = Boolean(rawEarrings.bombVictory);
    const bottleSpin = Boolean(rawEarrings.bottleSpin);
    const fingerGame = Boolean(rawEarrings.fingerGame);
    const isUnlocked = Boolean(rawEarrings.unlocked || (bombVictory && bottleSpin && fingerGame));

    const starEarrings: StarEarringsProgress = {
      bombVictory,
      bottleSpin,
      fingerGame,
      unlocked: isUnlocked,
      unlockedAt: rawEarrings.unlockedAt,
    };

    if (isUnlocked && !rawUnlocked.includes('accessory_star_earrings')) {
      rawUnlocked.push('accessory_star_earrings');
    }

    const cleanUnlocked = rawUnlocked.filter((id) => allValidIds.has(id));

    let equippedBottles = parsed.equippedSkins?.bottles;
    if (!validBottleIds.includes(equippedBottles)) {
      equippedBottles = 'bottle_btl_001';
    }

    // Daily reset check: compare stored reset date with today's local date
    const lastResetDate = typeof parsed.lastDailyResetDate === 'string' ? parsed.lastDailyResetDate : '';
    const isNewDay = lastResetDate !== todayStr;

    let dailyQuests: DailyQuest[];
    let milestoneChestClaimed = Boolean(parsed.milestoneChestClaimed);

    if (isNewDay) {
      // It's a new day! Reset all quests and milestone chest
      dailyQuests = createDefaultQuests();
      milestoneChestClaimed = false;
    } else {
      // Same day: ensure standard 5 quests exist and keep progress
      const defaultQuests = createDefaultQuests();
      const existingQuests: DailyQuest[] = Array.isArray(parsed.dailyQuests) ? parsed.dailyQuests : [];
      
      dailyQuests = defaultQuests.map((defQ) => {
        const found = existingQuests.find((q) => q.id === defQ.id);
        if (found) {
          return {
            ...defQ,
            currentCount: typeof found.currentCount === 'number' ? found.currentCount : defQ.currentCount,
            isClaimed: Boolean(found.isClaimed),
          };
        }
        return defQ;
      });
    }

    // Daily Login Rewards normalization
    const rawDailyRewards = parsed.dailyLoginRewards || {};
    const claimedDays: number[] = Array.isArray(rawDailyRewards.claimedDays)
      ? rawDailyRewards.claimedDays.filter((d: any) => typeof d === 'number' && d >= 1 && d <= 7)
      : [];
    const lastClaimDate: string = typeof rawDailyRewards.lastClaimDate === 'string'
      ? rawDailyRewards.lastClaimDate
      : '';

    const dailyLoginRewards: DailyLoginRewards = {
      claimedDays,
      lastClaimDate,
    };

    const currentState: EconomyState = {
      stars: typeof parsed.stars === 'number' ? parsed.stars : DEFAULT_STATE.stars,
      unlockedItems: cleanUnlocked.length > 0 ? cleanUnlocked : DEFAULT_STATE.unlockedItems,
      equippedSkins: {
        bottles: equippedBottles,
        bombs: parsed.equippedSkins?.bombs || DEFAULT_STATE.equippedSkins.bombs,
        balls: parsed.equippedSkins?.balls || DEFAULT_STATE.equippedSkins.balls,
        accessories: parsed.equippedSkins?.accessories || (isUnlocked ? 'accessory_star_earrings' : ''),
      },
      starEarrings,
      dailyQuests,
      milestoneChestClaimed,
      lastDailyResetDate: todayStr,
      lastDailyReset: isNewDay ? Date.now() : (parsed.lastDailyReset || Date.now()),
      dailyLoginRewards,
      claimedLoginDay: claimedDays.length,
    };

    if (isNewDay) {
      // Persist the reset state immediately
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentState));
    }

    return currentState;
  } catch (e) {
    return DEFAULT_STATE;
  }
}

export function saveEconomyState(state: EconomyState): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    window.dispatchEvent(new CustomEvent('picku_economy_updated', { detail: state }));
  } catch (e) {}
}

export function checkAndResetDailyQuests(): EconomyState {
  const current = getEconomyState();
  const today = getTodayDateString();
  if (current.lastDailyResetDate !== today) {
    const updated: EconomyState = {
      ...current,
      dailyQuests: createDefaultQuests(),
      milestoneChestClaimed: false,
      lastDailyResetDate: today,
      lastDailyReset: Date.now(),
    };
    saveEconomyState(updated);
    return updated;
  }
  return current;
}

export function recordDailyQuestProgress(
  type: 'bottle_spin' | 'roulette_round' | 'kaboom_tile' | 'kaboom_victory',
  amount: number = 1
): { updatedState: EconomyState; completedQuests: DailyQuest[] } {
  const state = checkAndResetDailyQuests();

  const idMap: Record<string, string> = {
    bottle_spin: 'quest_bottle_spin',
    roulette_round: 'quest_roulette_picker',
    kaboom_tile: 'quest_kaboom_tiles',
    kaboom_victory: 'quest_kaboom_victory',
  };

  const targetId = idMap[type];
  if (!targetId) return { updatedState: state, completedQuests: [] };

  const questIndex = state.dailyQuests.findIndex((q) => q.id === targetId);
  if (questIndex === -1) return { updatedState: state, completedQuests: [] };

  const quest = state.dailyQuests[questIndex];
  if (quest.currentCount >= quest.targetCount) {
    return { updatedState: state, completedQuests: [] };
  }

  const nextCount = Math.min(quest.targetCount, quest.currentCount + amount);
  const updatedQuests = [...state.dailyQuests];
  updatedQuests[questIndex] = {
    ...quest,
    currentCount: nextCount,
  };

  const updatedState: EconomyState = {
    ...state,
    dailyQuests: updatedQuests,
  };

  saveEconomyState(updatedState);

  const completedNow = nextCount >= quest.targetCount && quest.currentCount < quest.targetCount;
  return {
    updatedState,
    completedQuests: completedNow ? [updatedQuests[questIndex]] : [],
  };
}

export function claimMilestoneChest(): {
  success: boolean;
  starsAdded: number;
  updatedState: EconomyState;
  message: string;
} {
  const state = getEconomyState();
  if (state.milestoneChestClaimed) {
    return {
      success: false,
      starsAdded: 0,
      updatedState: state,
      message: 'Milestone chest already claimed today!',
    };
  }

  const allCompleted =
    state.dailyQuests.length > 0 &&
    state.dailyQuests.every((q) => q.currentCount >= q.targetCount);

  if (!allCompleted) {
    return {
      success: false,
      starsAdded: 0,
      updatedState: state,
      message: 'Complete all 5 daily quests to open the chest!',
    };
  }

  const updatedState: EconomyState = {
    ...state,
    stars: state.stars + MILESTONE_CHEST_REWARD,
    milestoneChestClaimed: true,
  };

  saveEconomyState(updatedState);
  return {
    success: true,
    starsAdded: MILESTONE_CHEST_REWARD,
    updatedState,
    message: 'Rave Crate opened! +250 Stars claimed!',
  };
}

export function resetDailyQuestsForTesting(): EconomyState {
  const state = getEconomyState();
  const updated: EconomyState = {
    ...state,
    dailyQuests: createDefaultQuests(),
    milestoneChestClaimed: false,
    lastDailyResetDate: getTodayDateString(),
    lastDailyReset: Date.now(),
  };
  saveEconomyState(updated);
  return updated;
}

// 7-DAY LOGIN REWARDS LOGIC (From Day 1 to Day 7, each day can be claimed just once)
export function getDailyRewardStatus(customState?: EconomyState): {
  claimedDays: number[];
  currentAvailableDay: number | null;
  canClaimToday: boolean;
  allDaysClaimed: boolean;
  nextDay: number | null;
  nextDayUnlocksAtMidnight: boolean;
} {
  const state = customState || getEconomyState();
  const today = getTodayDateString();
  const claimed = Array.isArray(state.dailyLoginRewards?.claimedDays)
    ? [...state.dailyLoginRewards.claimedDays]
    : [];
  const lastDate = state.dailyLoginRewards?.lastClaimDate || '';

  const totalClaimed = claimed.length;

  if (totalClaimed >= 7) {
    return {
      claimedDays: claimed,
      currentAvailableDay: null,
      canClaimToday: false,
      allDaysClaimed: true,
      nextDay: null,
      nextDayUnlocksAtMidnight: false,
    };
  }

  // If already claimed today:
  if (lastDate === today) {
    const nextDay = totalClaimed + 1;
    return {
      claimedDays: claimed,
      currentAvailableDay: null,
      canClaimToday: false,
      allDaysClaimed: false,
      nextDay: nextDay <= 7 ? nextDay : null,
      nextDayUnlocksAtMidnight: true,
    };
  }

  // Not claimed today yet: next sequential day (1..7) is available
  const nextDay = totalClaimed + 1;
  return {
    claimedDays: claimed,
    currentAvailableDay: nextDay <= 7 ? nextDay : null,
    canClaimToday: nextDay <= 7,
    allDaysClaimed: false,
    nextDay: nextDay <= 7 ? nextDay : null,
    nextDayUnlocksAtMidnight: false,
  };
}

export function claimDailyLoginReward(day: number): {
  success: boolean;
  starsAdded: number;
  updatedState: EconomyState;
  message: string;
} {
  const state = getEconomyState();
  const today = getTodayDateString();
  const claimed = state.dailyLoginRewards?.claimedDays || [];
  const lastDate = state.dailyLoginRewards?.lastClaimDate || '';

  if (day < 1 || day > 7) {
    return { success: false, starsAdded: 0, updatedState: state, message: 'Invalid reward day.' };
  }

  // "From day 1 to day 7, the rewards can be claimed just once."
  if (claimed.includes(day)) {
    return {
      success: false,
      starsAdded: 0,
      updatedState: state,
      message: `Day ${day} reward has already been claimed! Each day can only be claimed once.`,
    };
  }

  if (lastDate === today) {
    return {
      success: false,
      starsAdded: 0,
      updatedState: state,
      message: 'You have already claimed today’s reward! Come back tomorrow for the next day.',
    };
  }

  const expectedDay = claimed.length + 1;
  if (day !== expectedDay) {
    return {
      success: false,
      starsAdded: 0,
      updatedState: state,
      message: `Please claim Day ${expectedDay} first.`,
    };
  }

  const tier = DAILY_LOGIN_REWARDS.find((t) => t.day === day);
  const starAmount = tier ? tier.stars : 100;

  const updatedClaimedDays = [...claimed, day];
  const updatedLoginRewards: DailyLoginRewards = {
    claimedDays: updatedClaimedDays,
    lastClaimDate: today,
  };

  const updatedState: EconomyState = {
    ...state,
    stars: state.stars + starAmount,
    dailyLoginRewards: updatedLoginRewards,
    claimedLoginDay: updatedClaimedDays.length,
  };

  saveEconomyState(updatedState);
  return {
    success: true,
    starsAdded: starAmount,
    updatedState,
    message: `Day ${day} reward claimed! +${starAmount} Stars!`,
  };
}

export function resetDailyLoginRewardsForTesting(): EconomyState {
  const state = getEconomyState();
  const updated: EconomyState = {
    ...state,
    dailyLoginRewards: {
      claimedDays: [],
      lastClaimDate: '',
    },
    claimedLoginDay: 0,
  };
  saveEconomyState(updated);
  return updated;
}

export function purchaseItem(itemId: string): { success: boolean; message: string; updatedState: EconomyState } {
  const state = getEconomyState();
  if (state.unlockedItems.includes(itemId)) {
    return { success: true, message: 'Item already unlocked!', updatedState: state };
  }

  let foundItem: StoreItem | null = null;
  for (const cat of Object.keys(STORE_CATALOGUE) as StoreCategory[]) {
    const match = STORE_CATALOGUE[cat].find((i) => i.id === itemId);
    if (match) {
      foundItem = match;
      break;
    }
  }

  if (!foundItem) {
    return { success: false, message: 'Item not found.', updatedState: state };
  }

  if (itemId === 'accessory_star_earrings') {
    if (!state.starEarrings?.unlocked) {
      return {
        success: false,
        message: 'Master all 3 games (Bomb Victory, Bottle Spin & Finger Game) to unlock!',
        updatedState: state,
      };
    }
  }

  if (state.stars < foundItem.price) {
    return { success: false, message: `Need ${foundItem.price - state.stars} more Stars!`, updatedState: state };
  }

  const updated: EconomyState = {
    ...state,
    stars: state.stars - foundItem.price,
    unlockedItems: [...state.unlockedItems, itemId],
    equippedSkins: {
      ...state.equippedSkins,
      [foundItem.category]: itemId,
    },
  };

  saveEconomyState(updated);
  return { success: true, message: `Purchased and equipped ${foundItem.name}!`, updatedState: updated };
}

export function equipItem(category: StoreCategory, itemId: string): { success: boolean; updatedState: EconomyState } {
  const state = getEconomyState();
  if (!state.unlockedItems.includes(itemId)) {
    return { success: false, updatedState: state };
  }

  const updated: EconomyState = {
    ...state,
    equippedSkins: {
      ...state.equippedSkins,
      [category]: itemId,
    },
  };

  saveEconomyState(updated);
  return { success: true, updatedState: updated };
}

export function claimQuestReward(questId: string): { success: boolean; starsAdded: number; updatedState: EconomyState } {
  const state = getEconomyState();
  const questIndex = state.dailyQuests.findIndex((q) => q.id === questId);
  if (questIndex === -1) {
    return { success: false, starsAdded: 0, updatedState: state };
  }

  const quest = state.dailyQuests[questIndex];
  if (quest.isClaimed || quest.currentCount < quest.targetCount) {
    return { success: false, starsAdded: 0, updatedState: state };
  }

  const updatedQuests = [...state.dailyQuests];
  updatedQuests[questIndex] = { ...quest, isClaimed: true };

  const updatedState: EconomyState = {
    ...state,
    stars: state.stars + quest.starReward,
    dailyQuests: updatedQuests,
  };

  saveEconomyState(updatedState);
  return { success: true, starsAdded: quest.starReward, updatedState };
}

export function addStars(amount: number): EconomyState {
  const state = getEconomyState();
  const updated: EconomyState = {
    ...state,
    stars: Math.max(0, state.stars + amount),
  };
  saveEconomyState(updated);
  return updated;
}

export function refillPrototypeStars(amount: number = 1000): { starsAdded: number; updatedState: EconomyState } {
  const updated = addStars(amount);
  return { starsAdded: amount, updatedState: updated };
}

/**
 * Update Star Earrings condition progress:
 * Star earrings unlocked when:
 * 1. Bomb game victory (bombVictory)
 * 2. Complete bottle spin (bottleSpin)
 * 3. Complete finger game (fingerGame)
 */
export function recordStarEarringsCondition(
  condition: 'bombVictory' | 'bottleSpin' | 'fingerGame'
): { updatedState: EconomyState; newlyUnlocked: boolean } {
  const state = getEconomyState();
  const current = state.starEarrings || {
    bombVictory: false,
    bottleSpin: false,
    fingerGame: false,
    unlocked: false,
  };

  // If already unlocked and this condition is already true, no-op
  if (current[condition] && current.unlocked) {
    return { updatedState: state, newlyUnlocked: false };
  }

  const nextProgress: StarEarringsProgress = {
    ...current,
    [condition]: true,
  };

  const wasUnlocked = current.unlocked;
  const isNowUnlocked =
    nextProgress.bombVictory &&
    nextProgress.bottleSpin &&
    nextProgress.fingerGame;

  const newlyUnlocked = !wasUnlocked && isNowUnlocked;
  if (newlyUnlocked) {
    nextProgress.unlocked = true;
    nextProgress.unlockedAt = Date.now();
  } else if (wasUnlocked) {
    nextProgress.unlocked = true;
  }

  const unlockedItems = [...state.unlockedItems];
  if (nextProgress.unlocked && !unlockedItems.includes('accessory_star_earrings')) {
    unlockedItems.push('accessory_star_earrings');
  }

  const updatedState: EconomyState = {
    ...state,
    starEarrings: nextProgress,
    unlockedItems,
    equippedSkins: {
      ...state.equippedSkins,
      ...(newlyUnlocked ? { accessories: 'accessory_star_earrings' } : {}),
    },
  };

  saveEconomyState(updatedState);

  if (newlyUnlocked && typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('star_earrings_unlocked', { detail: nextProgress })
    );
  }

  return { updatedState, newlyUnlocked };
}

export function equipStarEarrings(equip: boolean): EconomyState {
  const state = getEconomyState();
  if (!state.starEarrings?.unlocked) return state;

  const updatedState: EconomyState = {
    ...state,
    equippedSkins: {
      ...state.equippedSkins,
      accessories: equip ? 'accessory_star_earrings' : '',
    },
  };

  saveEconomyState(updatedState);
  return updatedState;
}

