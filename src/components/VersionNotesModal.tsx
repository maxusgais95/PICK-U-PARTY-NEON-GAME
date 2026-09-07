/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Sparkles, X, Smartphone, Maximize2, Palette, Flame, Image as ImageIcon } from 'lucide-react';
import pickuPartyIcon from '../assets/images/PICK\'U PARTY APP ICON.webp';
import { SoundEngine, Haptics } from '../lib/audio';

interface VersionNotesModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const VersionNotesModal: React.FC<VersionNotesModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl animate-fadeIn">
      <div
        className="relative w-full max-w-sm rounded-[28px] bg-slate-950/90 border border-purple-500/40 p-5 shadow-[0_0_40px_rgba(168,85,247,0.35)] flex flex-col text-white"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-2.5">
            <img
              src={pickuPartyIcon}
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
          <span className="px-3 py-1 rounded-full text-xs font-black tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
            v1.3.001
          </span>
          <span className="text-[11px] text-gray-400 font-medium">Latest Release</span>
        </div>

        {/* Change List */}
        <div className="mt-4 space-y-2.5 text-xs text-gray-200 max-h-[300px] overflow-y-auto pr-1">
          <div className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white/5 border border-white/10">
            <Sparkles className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-white">Full Offline & Add to Home Screen (PWA)</p>
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
