/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Sparkles,
  Star,
  ArrowRight,
  Crosshair,
  RotateCcw,
  FastForward,
  Radio,
  ShieldAlert,
  Zap,
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
import { KaboomCommand, KaboomBonusItem } from '../../types';
import { SoundEngine, Haptics } from '../../lib/audio';

interface KaboomBonusModalProps {
  command: KaboomCommand;
  bonusItem?: KaboomBonusItem;
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
  bonusItem,
  playerName,
  onClaim,
}) => {
  const handleClaim = () => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    onClaim();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fade-in select-none">
      <div className="relative w-full max-w-sm rounded-3xl bg-gradient-to-b from-[#130924] via-[#0b0417] to-black border-2 border-amber-400/80 p-5 sm:p-6 shadow-[0_0_55px_rgba(245,158,11,0.45)] text-center animate-bonus-bounce">
        {/* Top Floating Glow Bonus Sprite / Icon */}
        <div className="relative mx-auto -mt-14 mb-3 w-24 h-24 rounded-2xl p-1 bg-black/90 border-2 shadow-2xl flex items-center justify-center overflow-hidden"
          style={{
            borderColor: bonusItem?.accentColor || '#fbbf24',
            boxShadow: `0 0 35px ${bonusItem?.glowColor || 'rgba(251,191,36,0.7)'}`,
          }}
        >
          {bonusItem ? (
            <img
              src={bonusItem.image}
              alt={bonusItem.name}
              className="w-full h-full object-cover rounded-xl transform hover:scale-110 transition-transform"
            />
          ) : (
            <div className="w-full h-full rounded-xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 flex items-center justify-center">
              {ICON_MAP[command.icon] || <Star className="w-10 h-10 text-slate-950 fill-current" />}
            </div>
          )}
        </div>

        {/* Rank Badge & Star Reward Capsule */}
        {bonusItem && (
          <div className="flex flex-wrap items-center justify-center gap-2 mb-2">
            <span
              className={`px-3 py-0.5 rounded-full border text-[11px] font-header font-black uppercase tracking-wider ${bonusItem.badgeBg}`}
            >
              RANK {bonusItem.rank} • {bonusItem.rankName}
            </span>
            <span className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-amber-400/20 border border-amber-300/60 text-amber-300 font-header font-black text-xs shadow-[0_0_12px_rgba(251,191,36,0.4)] animate-pulse">
              <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
              +{bonusItem.starReward} STARS
            </span>
          </div>
        )}

        {/* Bonus Name & Tagline */}
        {bonusItem && (
          <div className="mb-2">
            <h3 className="font-header text-2xl font-black text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.4)]">
              {bonusItem.name}
            </h3>
            <p className="font-subbody text-xs text-purple-200/80 italic">
              "{bonusItem.tagline}"
            </p>
          </div>
        )}

        {/* Player Name Callout */}
        <div className="font-subbody text-xs sm:text-sm font-medium text-purple-200/90 mb-2">
          Discovered by <span className="text-amber-300 font-bold">{playerName}</span>!
        </div>

        {/* Command Card (Title + Description) */}
        <div className="bg-slate-950/80 border border-purple-400/30 rounded-2xl p-3.5 mb-5 text-left shadow-inner">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="font-header text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-yellow-400">
              {command.title}
            </div>
            <span className="shrink-0 px-2 py-0.5 rounded-full bg-purple-500/20 border border-purple-400/30 text-[10px] font-header font-bold text-purple-300 uppercase tracking-widest">
              {command.tag}
            </span>
          </div>
          <div className="font-body text-gray-200 text-xs sm:text-sm font-medium leading-relaxed">
            {command.description}
          </div>
        </div>

        {/* Action Button */}
        <button
          id="kaboom-bonus-claim-button"
          type="button"
          onClick={handleClaim}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-slate-950 font-header font-black text-base sm:text-lg shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>
            {bonusItem ? `CLAIM +${bonusItem.starReward} STARS & CONTINUE` : 'CLAIM & CONTINUE'}
          </span>
          <ArrowRight className="w-5 h-5 stroke-[2.5]" />
        </button>
      </div>
    </div>
  );
};
