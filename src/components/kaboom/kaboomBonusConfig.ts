/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { KaboomBonusItem, KaboomBonusSpriteId } from '../../types';
import bonusMusicalNoteImg from '../../assets/images/bonus_musical_note.jpg';
import bonusHeadsetImg from '../../assets/images/bonus_headset.jpg';
import bonusCuteStarImg from '../../assets/images/bonus_cute_star.jpg';
import bonusCrystalRoseImg from '../../assets/images/bonus_crystal_rose.jpg';
import bonusDiamondKeyImg from '../../assets/images/bonus_diamond_key.jpg';

export const KABOOM_BONUS_ITEMS: KaboomBonusItem[] = [
  {
    id: 'musical_note',
    name: 'Musical Note',
    rank: 1,
    rankName: 'Common',
    starReward: 15,
    probability: 0.44, // 44% probability
    tagline: 'Harmonic Chime',
    description: 'A glowing cyan glass melody tuned with upbeat party vibrations!',
    image: bonusMusicalNoteImg,
    accentColor: '#00f0ff',
    glowColor: 'rgba(0, 240, 255, 0.7)',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40',
    borderColor: 'border-[#00f0ff]',
  },
  {
    id: 'headset',
    name: 'DJ Headset',
    rank: 2,
    rankName: 'Uncommon',
    starReward: 35,
    probability: 0.26, // 26% probability
    tagline: 'Electric Bass Beats',
    description: 'Pro club DJ headphones pumping electrifying audio synth frequencies!',
    image: bonusHeadsetImg,
    accentColor: '#38bdf8',
    glowColor: 'rgba(56, 189, 248, 0.7)',
    badgeBg: 'bg-sky-500/20 text-sky-300 border-sky-400/40',
    borderColor: 'border-[#38bdf8]',
  },
  {
    id: 'cute_star',
    name: 'Cute Star',
    rank: 3,
    rankName: 'Rare',
    starReward: 75,
    probability: 0.16, // 16% probability
    tagline: 'Kawaii Charm',
    description: 'Adorable plush smiling celestial star radiating sweet party luck!',
    image: bonusCuteStarImg,
    accentColor: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.7)',
    badgeBg: 'bg-rose-500/20 text-rose-300 border-rose-400/40',
    borderColor: 'border-[#f43f5e]',
  },
  {
    id: 'crystal_rose',
    name: 'Crystal Rose',
    rank: 4,
    rankName: 'Epic',
    starReward: 150,
    probability: 0.10, // 10% probability
    tagline: 'Amethyst Blossom',
    description: 'Faceted royal purple gemstone crystal flower glittering with luxury!',
    image: bonusCrystalRoseImg,
    accentColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.75)',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-400/40',
    borderColor: 'border-[#c084fc]',
  },
  {
    id: 'diamond_key',
    name: 'Diamond Key',
    rank: 5,
    rankName: 'Legendary',
    starReward: 300,
    probability: 0.04, // 4% probability (highest rank, lowest probability)
    tagline: 'Treasure Master',
    description: 'Mythic lightning-charged filigree key unlocking maximum star riches!',
    image: bonusDiamondKeyImg,
    accentColor: '#f59e0b',
    glowColor: 'rgba(245, 158, 11, 0.85)',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-400/50',
    borderColor: 'border-[#f59e0b]',
  },
];

/**
 * Randomly select a bonus item weighted inversely by rank
 * (Higher rank = lower probability)
 */
export function getRandomBonusItem(): KaboomBonusItem {
  const roll = Math.random();
  let cumulative = 0;
  for (const item of KABOOM_BONUS_ITEMS) {
    cumulative += item.probability;
    if (roll <= cumulative) {
      return item;
    }
  }
  return KABOOM_BONUS_ITEMS[0];
}

export function getBonusItemById(id: KaboomBonusSpriteId): KaboomBonusItem {
  return (
    KABOOM_BONUS_ITEMS.find((item) => item.id === id) || KABOOM_BONUS_ITEMS[0]
  );
}
