/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  X,
  Calendar,
  Layers,
  Palette,
  Smartphone,
  Star,
  Check,
  Sparkles,
} from 'lucide-react';
import { SoundEngine, Haptics } from '../lib/audio';

export interface VersionNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionNotesModal: React.FC<VersionNotesModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-xl animate-fadeIn select-none">
      <div
        className="relative w-full max-w-md max-h-[90vh] rounded-[28px] bg-slate-950/95 border border-purple-500/40 p-4 sm:p-5 shadow-[0_0_50px_rgba(168,85,247,0.35)] flex flex-col text-white overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-400/50 flex items-center justify-center text-purple-300 shadow-[0_0_12px_rgba(168,85,247,0.4)]">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-header text-base font-bold uppercase tracking-wider text-white flex items-center gap-1.5 leading-none">
                <span>VERSION NOTES</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-400/40 font-mono font-bold tracking-wider">
                  v1.4.01
                </span>
              </h2>
              <p className="font-subbody text-[11px] text-gray-400 mt-0.5">
                Changelog History & Feature Updates
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              Haptics.buttonClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-colors cursor-pointer"
            aria-label="Close Version Notes"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content Container */}
        <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 custom-scrollbar text-xs my-3">
          {/* CURRENT RELEASE HERO: v1.4.01 */}
          <div className="p-3.5 rounded-2xl bg-gradient-to-br from-purple-950/40 via-slate-900/60 to-cyan-950/40 border border-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.25)]">
            <div className="flex items-center justify-between pb-2 border-b border-purple-500/20">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-pulse" />
                <span className="font-header text-sm font-bold text-white tracking-wider">v1.4.01</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-purple-500/30 text-purple-200 border border-purple-400/40 font-bold uppercase tracking-wider">
                  Latest Release
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-mono">Sept 2026</span>
            </div>

            {/* Major Highlights */}
            <p className="font-subbody text-gray-300 text-[11px] leading-relaxed mt-2.5">
              High-definition custom grid artwork across all Kaboom board sizes, horizontally centered Star HUD, separate Version Notes & Game Guide navigation, and organic cosmetic progression.
            </p>

            <div className="mt-3 space-y-2">
              <div className="p-2.5 rounded-xl bg-cyan-950/30 border border-cyan-500/30">
                <div className="flex items-center gap-1.5 font-header font-bold text-cyan-300 text-[11px] uppercase tracking-wide">
                  <Palette className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dedicated Mode Artwork (Quick → Ultimate)</span>
                </div>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                  Replaced generic card images with tailored high-resolution backgrounds for all 5 board modes: 2×2 Quick (Cyan), 3×3 Classic (Blue), 4×4 Extreme (Pink), 5×5 Chaos (Purple), and 6×6 Ultimate (Amber Gold).
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-purple-950/30 border border-purple-500/30">
                <div className="flex items-center gap-1.5 font-header font-bold text-purple-300 text-[11px] uppercase tracking-wide">
                  <Smartphone className="w-3.5 h-3.5 text-purple-400" />
                  <span>Clarified Navigation & HUD</span>
                </div>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                  Version notes on the top-left, game guide on the top-right, and version notes text at the middle-bottom. Horizontally locked Star HUD.
                </p>
              </div>

              <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-500/30">
                <div className="flex items-center gap-1.5 font-header font-bold text-amber-300 text-[11px] uppercase tracking-wide">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <span>Authentic Progression & Star Economy</span>
                </div>
                <p className="text-[11px] text-gray-300 mt-1 leading-relaxed">
                  Preserved authentic accomplishment when unlocking cosmetic bottle skins, custom bombs, and vibrant particle effects through gameplay.
                </p>
              </div>
            </div>
          </div>

          {/* RELEASE HISTORY TIMELINE */}
          <div className="space-y-2.5">
            <h3 className="font-header text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5 px-1">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              <span>Release History & Changelog</span>
            </h3>

            {/* v1.3.00 */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-header text-xs font-bold text-white tracking-wide">v1.3.00</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 font-semibold uppercase">
                    Feature Update
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">Aug 2026</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px] text-gray-300">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">6×6 Ultimate Kaboom:</strong> 36-tile gauntlet with high-stakes bomb placements and big Star multiplier rewards.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-pink-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Bottle Quick Switcher:</strong> Direct in-game skin switching header action for fast cosmetic cycling.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Dynamic Bonus Cards:</strong> Added 2X Multiplier, Bomb Radar Scanner, and Defuse Shield modifiers.</span>
                </li>
              </ul>
            </div>

            {/* v1.2.00 */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-header text-xs font-bold text-white tracking-wide">v1.2.00</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-green-500/20 text-green-300 border border-green-400/30 font-semibold uppercase">
                    Multiplayer Update
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">Jul 2026</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px] text-gray-300">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-green-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Team Division Mode:</strong> Divides up to 10 players into 2 to 5 balanced squads with glowing energy link lines.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-yellow-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Multi-Tier Haptics:</strong> Custom frequency haptic pulses on touch down, countdown ticks, and elimination shocks.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Offline Synth Audio:</strong> Zero-dependency Web Audio synthesizers delivering low-latency sound effects.</span>
                </li>
              </ul>
            </div>

            {/* v1.1.00 */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-header text-xs font-bold text-white tracking-wide">v1.1.00</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 font-semibold uppercase">
                    Mobile & UI
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">Jun 2026</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px] text-gray-300">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-cyan-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Safe Area Layouts:</strong> Edge-to-edge support with top notch and bottom home indicator safe padding.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-purple-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Cyber Neon Dark System:</strong> OLED battery-friendly high-contrast dark aesthetic with 60 FPS animation loop.</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Fullscreen Toggle:</strong> One-tap immersive kiosk mode for tablets and mobile devices.</span>
                </li>
              </ul>
            </div>

            {/* v1.0.00 */}
            <div className="p-3 rounded-2xl bg-black/40 border border-white/10 hover:border-white/20 transition-all">
              <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
                <div className="flex items-center gap-2">
                  <span className="font-header text-xs font-bold text-white tracking-wide">v1.0.00</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-fuchsia-500/20 text-fuchsia-300 border border-fuchsia-400/30 font-semibold uppercase">
                    Genesis Launch
                  </span>
                </div>
                <span className="text-[10px] text-gray-500 font-mono">May 2026</span>
              </div>
              <ul className="mt-2 space-y-1.5 text-[11px] text-gray-300">
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-fuchsia-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">The Party Trio:</strong> Official launch of Finger Roulette, Spin the Bottle, and Kaboom!</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <Check className="w-3 h-3 text-blue-400 shrink-0 mt-0.5" />
                  <span><strong className="text-white">Local Persistence:</strong> IndexedDB storage keeping unlocked skins, preferences, and session statistics.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Dismiss Action */}
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            onClose();
          }}
          className="font-header mt-2 w-full py-2.5 rounded-full font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-purple-500 to-indigo-600 hover:brightness-110 text-white shadow-[0_0_20px_rgba(168,85,247,0.4)] active:scale-98 transition-all cursor-pointer"
        >
          Close Notes
        </button>
      </div>
    </div>
  );
};
