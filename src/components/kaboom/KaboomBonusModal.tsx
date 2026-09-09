/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Star,
  Award,
  Zap,
  ArrowRight,
  Crosshair,
  RotateCcw,
  FastForward,
  Radio,
  ShieldAlert,
  Wine,
  Flame,
  Eye,
  Mic,
  VolumeX,
  HeartHandshake,
  Crown,
  Swords,
  Camera,
  Search,
  Bot,
} from 'lucide-react';
import { KaboomCommand } from '../../types';
import { SoundEngine, Haptics } from '../../lib/audio';

interface KaboomBonusModalProps {
  command: KaboomCommand;
  playerName: string;
  onClaim: () => void;
}

const ICON_MAP: Record<string, React.ReactNode> = {
  Crosshair: <Crosshair className="w-8 h-8 text-amber-300" />,
  RotateCcw: <RotateCcw className="w-8 h-8 text-cyan-300" />,
  FastForward: <FastForward className="w-8 h-8 text-purple-300" />,
  Radio: <Radio className="w-8 h-8 text-emerald-300" />,
  ShieldAlert: <ShieldAlert className="w-8 h-8 text-blue-300" />,
  Zap: <Zap className="w-8 h-8 text-yellow-300" />,
  Wine: <Wine className="w-8 h-8 text-rose-300" />,
  Flame: <Flame className="w-8 h-8 text-orange-400" />,
  Eye: <Eye className="w-8 h-8 text-teal-300" />,
  Mic: <Mic className="w-8 h-8 text-fuchsia-300" />,
  Sparkles: <Sparkles className="w-8 h-8 text-yellow-300" />,
  VolumeX: <VolumeX className="w-8 h-8 text-indigo-300" />,
  HeartHandshake: <HeartHandshake className="w-8 h-8 text-pink-300" />,
  Crown: <Crown className="w-8 h-8 text-amber-400" />,
  Swords: <Swords className="w-8 h-8 text-red-400" />,
  Camera: <Camera className="w-8 h-8 text-sky-300" />,
  Search: <Search className="w-8 h-8 text-emerald-300" />,
  Bot: <Bot className="w-8 h-8 text-violet-300" />,
};

export const KaboomBonusModal: React.FC<KaboomBonusModalProps> = ({
  command,
  playerName,
  onClaim,
}) => {
  const handleClaim = () => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    onClaim();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-slate-900 via-purple-950 to-slate-950 border-2 border-amber-400/80 p-6 shadow-[0_0_50px_rgba(245,158,11,0.45)] text-center animate-bonus-bounce">
        {/* Top Floating Glow Icon */}
        <div className="mx-auto -mt-14 mb-3 w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 border-2 border-amber-200 shadow-[0_0_30px_rgba(251,191,36,0.8)] flex items-center justify-center transform -rotate-3">
          {ICON_MAP[command.icon] || <Star className="w-10 h-10 text-slate-950 fill-current" />}
        </div>

        {/* Category Tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-xs font-header font-bold tracking-widest uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          {command.tag}
        </div>

        {/* Player Name Callout */}
        <div className="font-subbody text-sm font-medium text-purple-200/90 mb-1">
          Awarded to <span className="text-amber-300 font-bold">{playerName}</span>!
        </div>

        {/* Command Title */}
        <h3 className="font-header text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-300 to-amber-400 drop-shadow-[0_2px_10px_rgba(245,158,11,0.5)] mb-3">
          {command.title}
        </h3>

        {/* Description Box */}
        <div className="font-body bg-slate-900/80 border border-purple-400/30 rounded-2xl p-4 mb-6 text-gray-100 text-base font-medium leading-relaxed shadow-inner">
          {command.description}
        </div>

        {/* Action Button */}
        <button
          id="kaboom-bonus-claim-button"
          type="button"
          onClick={handleClaim}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-500 text-slate-950 font-header font-bold text-lg shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>CLAIM & CONTINUE</span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
