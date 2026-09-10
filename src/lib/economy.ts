/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BottleBuiltinStyle } from '../types';
import { BOTTLE_SKINS } from './bottleSkins';

export type StoreCategory = 'bottles' | 'bombs' | 'balls';

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
  iconType: 'bottle' | 'bomb' | 'ball';
  builtInBottleStyle?: BottleBuiltinStyle;
  image?: string;
}

export interface DailyQuest {
  id: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  starReward: number;
  isClaimed: boolean;
  gameMode?: 'roulette' | 'bottle' | 'kaboom' | 'settings';
}

export interface EconomyState {
  stars: number;
  unlockedItems: string[];
  equippedSkins: {
    bottles: string;
    bombs: string;
    balls: string;
  };
  dailyQuests: DailyQuest[];
  lastDailyReset: number;
  claimedLoginDay: number;
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
    },
    {
      id: 'ball_hologram_crystal',
      category: 'balls',
      name: 'Prism Hologram Bubbles',
      subtitle: 'Crystal Refraction',
      description: 'Translucent diamond facets splitting nightclub lights into rainbow spectrums.',
      price: 550,
      rarity: 'Epic',
      badge: 'NEW',
      accentGradient: 'from-fuchsia-400 via-purple-400 to-indigo-500',
      borderGlow: 'border-fuchsia-400/70 shadow-[0_0_18px_rgba(217,70,239,0.5)]',
      iconType: 'ball',
    },
    {
      id: 'ball_retro_pixel',
      category: 'balls',
      name: 'Retro 8-Bit Cubes',
      subtitle: 'Arcade Nostalgia',
      description: 'Isometric pixel blocks with authentic 90s arcade sound aesthetics.',
      price: 800,
      rarity: 'Legendary',
      accentGradient: 'from-emerald-400 via-teal-400 to-cyan-500',
      borderGlow: 'border-emerald-400/80 shadow-[0_0_20px_rgba(52,211,153,0.5)]',
      iconType: 'ball',
    },
  ],
};

const DEFAULT_QUESTS: DailyQuest[] = [
  {
    id: 'quest_bottle_spin',
    title: 'Bottle Spin Party',
    description: 'Spin the bottle 3 times with friends at the party table.',
    targetCount: 3,
    currentCount: 3,
    starReward: 50,
    isClaimed: false,
    gameMode: 'bottle',
  },
  {
    id: 'quest_roulette_picker',
    title: 'Finger Picker Host',
    description: 'Complete 2 rounds of Finger Roulette selection.',
    targetCount: 2,
    currentCount: 2,
    starReward: 50,
    isClaimed: false,
    gameMode: 'roulette',
  },
  {
    id: 'quest_kaboom_tiles',
    title: 'Bomb Defusal Safe Zone',
    description: 'Reveal 5 safe ball tiles in KABOOM mode without exploding.',
    targetCount: 5,
    currentCount: 5,
    starReward: 75,
    isClaimed: false,
    gameMode: 'kaboom',
  },
  {
    id: 'quest_extreme_gauntlet',
    title: 'Extreme Board Challenger',
    description: 'Survive or complete a round on 4×4 Extreme or 5×5 Chaos board.',
    targetCount: 1,
    currentCount: 0,
    starReward: 100,
    isClaimed: false,
    gameMode: 'kaboom',
  },
  {
    id: 'quest_daily_party',
    title: 'Party Attendance',
    description: 'Join the party today and visit the store or check settings.',
    targetCount: 1,
    currentCount: 1,
    starReward: 50,
    isClaimed: true,
    gameMode: 'settings',
  },
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
  },
  dailyQuests: DEFAULT_QUESTS,
  lastDailyReset: Date.now(),
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
    
    // Ensure default unlocked bottle is present
    let rawUnlocked: string[] = Array.isArray(parsed.unlockedItems) ? parsed.unlockedItems : DEFAULT_STATE.unlockedItems;
    if (!rawUnlocked.includes('bottle_btl_001')) {
      rawUnlocked.push('bottle_btl_001');
    }

    // Filter out obsolete/deleted prototype IDs
    const validBottleIds = STORE_CATALOGUE.bottles.map((b) => b.id);
    const validBombIds = STORE_CATALOGUE.bombs.map((b) => b.id);
    const validBallIds = STORE_CATALOGUE.balls.map((b) => b.id);
    const allValidIds = new Set([...validBottleIds, ...validBombIds, ...validBallIds, 'btl_e_001']);

    const cleanUnlocked = rawUnlocked.filter((id) => allValidIds.has(id));

    let equippedBottles = parsed.equippedSkins?.bottles;
    if (!validBottleIds.includes(equippedBottles)) {
      equippedBottles = 'bottle_btl_001';
    }

    return {
      stars: typeof parsed.stars === 'number' ? parsed.stars : DEFAULT_STATE.stars,
      unlockedItems: cleanUnlocked.length > 0 ? cleanUnlocked : DEFAULT_STATE.unlockedItems,
      equippedSkins: {
        bottles: equippedBottles,
        bombs: parsed.equippedSkins?.bombs || DEFAULT_STATE.equippedSkins.bombs,
        balls: parsed.equippedSkins?.balls || DEFAULT_STATE.equippedSkins.balls,
      },
      dailyQuests: Array.isArray(parsed.dailyQuests) && parsed.dailyQuests.length > 0 ? parsed.dailyQuests : DEFAULT_QUESTS,
      lastDailyReset: parsed.lastDailyReset || Date.now(),
      claimedLoginDay: parsed.claimedLoginDay || 1,
    };
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
