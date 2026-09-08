/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, X, Smartphone, Maximize2, Palette, Flame, Image as ImageIcon } from 'lucide-react';
import { SoundEngine, Haptics } from '../lib/audio';

interface VersionNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionNotesModal: React.FC<VersionNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-slate-950/90 border border-purple-500/40 p-5 shadow-[0_0_40px_rgba(168,85,247,0.35)] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src="/apple-touch-icon.png"
              alt="PICK'U PARTY Icon"
              className="w-7 h-7 rounded-lg object-cover border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
            />
            <h2 className="text-base font-extrabold uppercase tracking-wider text-white">
              PICK'U PARTY
            </h2>
          </div>
          <button
            onClick={() => {
              SoundEngine.playButtonClick();
              Haptics.buttonClick();
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-gray-300 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Badge & Version */}
        <div className="mt-4 flex items-center justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider bg-orange-500/20 text-orange-300 border border-orange-400/40 shadow-[0_0_10px_rgba(249,115,22,0.3)]">
            v1.4.001
          </span>
          <span className="text-[11px] text-gray-400 font-medium">Latest Release</span>
        </div>

        {/* Change List */}
        <div className="mt-4 space-y-2.5 text-xs text-gray-200 max-h-[300px] overflow-y-auto pr-1">
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-orange-500/10 border border-orange-400/30">
            <Flame className="w-4 h-4 text-orange-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">KABOOM Elimination Game Mode Live!</p>
              <p className="text-[11px] text-gray-400">
                Turn-based party elimination game featuring 5 grid sizes (2×2 to 6×6), 3D tactile sphere buttons, lethal hidden bomb, secret command bonuses, party dares, tactical radar scans, immunity shields, 60fps canvas particle explosions, and post-round stats.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-400/30">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Pure RGBA Splash Logo & Cinematic Launch</p>
              <p className="text-[11px] text-gray-400">Removed rectangular container and sweep overlays from the splash screen for a pure, seamless RGBA transparent logo graphic. Features slow video zoom-out, spring bounce pop-up at 40% height, and staged telemetry.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Flame className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Removed Add to Home Controls</p>
              <p className="text-[11px] text-gray-400">Cleaned up UI by removing the Add to Home buttons and toggles across Header, Landing Hub, and Settings modal.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Full Offline & Native Install</p>
              <p className="text-[11px] text-gray-400">Install directly onto your iOS or Android home screen with custom party launcher icons. Workbox service worker precaching guarantees 100% offline gameplay anywhere without internet.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Flame className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">WebP Conversion & FastStart Video Compression</p>
              <p className="text-[11px] text-gray-400">Converted all backgrounds, game cards, bottle sprites, and logos to ultra-optimized WebP (reduced image sizes by up to 96%). Re-encoded videos with H.264 FastStart moov atom headers for immediate instant playback.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Cinematic Launch Splash Screen</p>
              <p className="text-[11px] text-gray-400">Features a dynamic zooming-out launch exit, pop-up title logo in the top 2/3 vertical space, full game mode overview, animated multi-color gradient progress bar (blue, cyan, magenta, purple, orange), and live media pre-buffering status.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Flame className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Zero-Buffering In-Memory Blob Cache</p>
              <p className="text-[11px] text-gray-400">All videos and high-res images pre-load directly into in-memory Blob URLs and CacheStorage on launch. Eliminates blank screens, buffering pauses, and network chop during gameplay loops and countdowns.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Finger Roulette Dynamic Video & Ambience</p>
              <p className="text-[11px] text-gray-400">Idle displays the crystal-clear static background image. When fingers are placed before reaching the count, subtle moving ambience gradient glows at the bleed of the screen.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Flame className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Synchronized Countdown Playback & 2s Lockout</p>
              <p className="text-[11px] text-gray-400">Countdown options set strictly to 5s (speed up 2x), 8s (normal 1.25x), and 10s (speed down 1x) to seamlessly match the 10s animated video duration, followed by a 2s touch lockout.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Title Occasional Light Sweep & Pulse</p>
              <p className="text-[11px] text-gray-400">A clean diagonal specular light beam glides across the PICK'U PARTY logo occasionally, followed immediately by an energetic pulse reaction.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Flame className="w-4 h-4 text-fuchsia-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Button Light Sweep Taking Turns</p>
              <p className="text-[11px] text-gray-400">Play buttons across Finger Roulette, Spin the Bottle, and Kaboom each execute a smooth specular light sweep taking turns in sequence.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <ImageIcon className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Diagonal Corner Badges</p>
              <p className="text-[11px] text-gray-400">Finger Roulette panel features a 45° top-right "Popular" ribbon, and Kaboom features a 45° "Coming Soon" ribbon badge.</p>
            </div>
          </div>

          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Smartphone className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Refined Artwork & Modern Layout</p>
              <p className="text-[11px] text-gray-400">Crystal clear background character artwork with bold gradient typography and responsive 16:9 panels.</p>
            </div>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            onClose();
          }}
          className="mt-5 w-full py-2.5 rounded-full font-bold uppercase tracking-wider text-xs bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] active:scale-98 transition-all"
        >
          Got It
        </button>
      </div>
    </div>
  );
};
