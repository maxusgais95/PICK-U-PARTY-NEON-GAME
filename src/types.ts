/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ScreenView = 'hub' | 'roulette' | 'bottle' | 'settings';

export type ThemeId =
  | 'cyber-neon'
  | 'synthwave'
  | 'solar-flare'
  | 'midnight-aurora';

export type BottleBuiltinStyle =
  | 'btl_e_001'
  | 'btl_e_002'
  | 'btl_e_003'
  | 'btl_e_004';

export type BottleBlendMode = 'normal' | 'screen' | 'color-dodge';

export interface CustomBottleSprite {
  id: string;
  name: string;
  dataUrl: string; // Stored in IndexedDB (processed transparent sprite)
  originalDataUrl?: string; // Raw original uploaded image file
  createdAt: number;
  rotationOffset: number; // 0, 90, 180, 270 degrees
  blendMode?: BottleBlendMode; // normal, screen, color-dodge
}

export interface TouchPlayer {
  id: number | string;
  x: number;
  y: number;
  colorIndex: number;
  teamIndex?: number;
  isTarget?: boolean;
  playerLabel: string;
}

export interface SwirlColorStop {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export interface ThemeColors {
  id: ThemeId;
  name: string;
  tagline?: string;
  primary: string;
  secondary: string;
  accent: string;
  bgBase: string;
  bgGrad: string;
  // Button Gradients
  btnRouletteGrad: string;
  btnRouletteShadow: string;
  btnBottleGrad: string;
  btnBottleShadow: string;
  // Stage Lighting & Lasers
  laserColors: string[];
  // 3D Swirl Shader Color Palette (5 stops for WebGL / Canvas)
  swirlStops: [SwirlColorStop, SwirlColorStop, SwirlColorStop, SwirlColorStop, SwirlColorStop];
  // Scanner Laser Blade & Glow
  scannerLaserColor: string;
  scannerLaserGlow: string;
  playerPalettes: {
    gradient: string;
    glow: string;
    text: string;
    border: string;
    solid: string;
  }[];
  teamPalettes?: {
    gradient: string;
    glow: string;
    text: string;
    border: string;
    solid: string;
  }[];
}

export interface AppSettings {
  // Game Play
  minPlayers: number; // 2..5
  targetCount: number; // 1..(minPlayers - 1)
  countdownSeconds: number; // 5, 8, 10
  
  // Bottle
  bottleStyle: BottleBuiltinStyle | 'custom';
  selectedCustomSpriteId: string | null;
  bottleBlendMode: BottleBlendMode;
  bottleFriction: number; // 0.985 standard
  
  // Theme & Appearance
  theme: ThemeId;
  
  // Audio & Haptics
  soundEnabled: boolean;
  soundVolume: number; // 0.0 to 1.0
  hapticsEnabled: boolean;
}

export interface AppStats {
  totalRouletteRounds: number;
  totalBottleSpins: number;
  lastPlayedAt: number;
}
