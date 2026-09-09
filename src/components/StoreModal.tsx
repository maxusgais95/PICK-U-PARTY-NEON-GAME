/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Star, Check, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';
import { ChampagneBottleIcon } from './ChampagneBottleIcon';
import {
  StoreCategory,
  StoreItem,
  STORE_CATALOGUE,
  EconomyState,
  purchaseItem,
  equipItem,
  addStars,
} from '../lib/economy';
import { SoundEngine, Haptics } from '../lib/audio';
import { AppSettings, BottleBuiltinStyle } from '../types';

interface StoreModalProps {
  isOpen: boolean;
  economy: EconomyState;
  settings: AppSettings;
  onClose: () => void;
  onEconomyUpdated: (state: EconomyState) => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
}

const CATEGORIES: { id: StoreCategory; label: string; icon: string }[] = [
  { id: 'bottles', label: 'BOTTLES', icon: '🍾' },
  { id: 'bombs', label: 'BOMBS', icon: '💣' },
  { id: 'balls', label: 'BALLS', icon: '⚽' },
  { id: 'bonus', label: 'BONUS SKINS', icon: '⚡' },
];

export const StoreModal: React.FC<StoreModalProps> = ({
  isOpen,
  economy,
  settings,
  onClose,
  onEconomyUpdated,
  onUpdateSettings,
}) => {
  const [activeCategory, setActiveCategory] = useState<StoreCategory>('bottles');
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  if (!isOpen) return null;

  const currentItems = STORE_CATALOGUE[activeCategory] || [];
  const equippedId = economy.equippedSkins[activeCategory];

  const showToast = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 2800);
  };

  const handleQuickRefill = () => {
    SoundEngine.playTeamDivisionChime();
    Haptics.touchSuccess();
    const updated = addStars(1000);
    onEconomyUpdated(updated);
    showToast('Refilled +1,000 Stars (Prototype)!', 'success');
  };

  const handleRefillAndPurchase = (item: StoreItem) => {
    SoundEngine.playTeamDivisionChime();
    Haptics.touchSuccess();
    const deficit = Math.max(500, item.price - economy.stars);
    addStars(deficit);
    const res = purchaseItem(item.id);
    if (res.success) {
      onEconomyUpdated(res.updatedState);
      if (item.category === 'bottles' && item.builtInBottleStyle) {
        onUpdateSettings({
          bottleStyle: item.builtInBottleStyle,
          selectedCustomSpriteId: null,
        });
      }
      showToast(`Refilled +${deficit} ⭐ and unlocked ${item.name}!`, 'success');
    } else {
      showToast(`Refilled +${deficit} Stars!`, 'success');
    }
  };

  const handlePurchase = (item: StoreItem) => {
    const res = purchaseItem(item.id);
    if (res.success) {
      SoundEngine.playTeamDivisionChime();
      Haptics.touchSuccess();
      onEconomyUpdated(res.updatedState);

      // If this is a bottle item with built-in style, update app settings directly
      if (item.category === 'bottles' && item.builtInBottleStyle) {
        onUpdateSettings({
          bottleStyle: item.builtInBottleStyle,
          selectedCustomSpriteId: null,
        });
      }

      showToast(`Successfully unlocked & equipped ${item.name}!`, 'success');
    } else {
      SoundEngine.playButtonClick();
      Haptics.buttonClick();
      showToast(res.message, 'error');
    }
  };

  const handleEquip = (item: StoreItem) => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    const res = equipItem(item.category, item.id);
    if (res.success) {
      onEconomyUpdated(res.updatedState);

      if (item.category === 'bottles' && item.builtInBottleStyle) {
        onUpdateSettings({
          bottleStyle: item.builtInBottleStyle,
          selectedCustomSpriteId: null,
        });
      }

      showToast(`Equipped ${item.name}!`, 'success');
    }
  };

  // Render stylized visual preview icon/graphics (real bottle skins + stylized graphics for other items)
  const renderItemVisual = (item: StoreItem) => {
    switch (item.iconType) {
      case 'bottle':
        if (item.image) {
          return (
            <div className="relative flex items-center justify-center w-full h-full p-2 overflow-hidden">
              <div className={`absolute w-20 h-20 rounded-full bg-gradient-to-tr ${item.accentGradient} opacity-30 blur-lg`} />
              <img
                src={item.image}
                alt={item.name}
                className="max-h-24 w-auto object-contain drop-shadow-[0_8px_16px_rgba(0,0,0,0.8)] transform -rotate-12 group-hover:rotate-0 group-hover:scale-105 transition-all duration-300 pointer-events-none"
                style={{ mixBlendMode: 'screen' }}
              />
            </div>
          );
        }
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className={`absolute w-16 h-16 rounded-full bg-gradient-to-tr ${item.accentGradient} opacity-30 blur-md`} />
            <ChampagneBottleIcon className="w-12 h-12 text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] transform -rotate-12 group-hover:rotate-0 transition-transform duration-300" />
          </div>
        );
      case 'bomb':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className={`absolute w-16 h-16 rounded-full bg-gradient-to-tr ${item.accentGradient} opacity-30 blur-md`} />
            <div className="relative text-4xl transform group-hover:scale-110 transition-transform duration-300">
              💣
            </div>
          </div>
        );
      case 'ball':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className={`absolute w-16 h-16 rounded-full bg-gradient-to-tr ${item.accentGradient} opacity-30 blur-md`} />
            <div className="relative w-12 h-12 rounded-full bg-gradient-to-tr from-white/90 to-cyan-300 border-2 border-white shadow-[0_0_15px_rgba(255,255,255,0.7)] flex items-center justify-center transform group-hover:scale-105 transition-transform">
              <Sparkles className="w-6 h-6 text-cyan-700" />
            </div>
          </div>
        );
      case 'bonus':
        return (
          <div className="relative flex items-center justify-center w-full h-full">
            <div className={`absolute w-16 h-16 rounded-full bg-gradient-to-tr ${item.accentGradient} opacity-30 blur-md`} />
            <div className="relative w-11 h-14 rounded-xl bg-gradient-to-b from-purple-500/80 to-indigo-700/80 border border-purple-300 flex flex-col items-center justify-center shadow-[0_0_12px_rgba(168,85,247,0.5)] transform -rotate-6 group-hover:rotate-0 transition-transform">
              <Sparkles className="w-5 h-5 text-amber-300 animate-pulse" />
            </div>
          </div>
        );
      default:
        return <ShoppingBag className="w-10 h-10 text-white" />;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-fade-in select-none"
      onClick={onClose}
    >
      <div
        id="party-store-modal-container"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-lg max-h-[92vh] flex flex-col rounded-[28px] bg-gradient-to-b from-[#160b29]/95 via-[#0d071a]/95 to-black/95 border-2 border-purple-500/40 shadow-[0_0_50px_rgba(168,85,247,0.3)] overflow-hidden text-white"
      >
        {/* Toast Notification */}
        {notification && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 animate-bounce pointer-events-none">
            <div
              className={`px-4 py-2 rounded-full font-header font-bold text-xs shadow-lg backdrop-blur-md flex items-center gap-2 border ${
                notification.type === 'success'
                  ? 'bg-emerald-600/90 text-white border-emerald-300'
                  : 'bg-red-600/90 text-white border-red-300'
              }`}
            >
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* Top Header Bar */}
        <div className="relative px-5 pt-4 pb-3 border-b border-purple-500/20 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-purple-500 via-pink-500 to-amber-500 flex items-center justify-center shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-300/60">
              <ShoppingBag className="w-5 h-5 text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]" />
            </div>
            <div>
              <h2 className="font-header text-xl sm:text-2xl font-bold tracking-wider uppercase text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-pink-300 to-purple-300 leading-none">
                PARTY STORE
              </h2>
              <div className="text-[11px] text-purple-200/70 mt-1 font-body">
                Customize your party game visuals
              </div>
            </div>
          </div>

          {/* Star Currency Balance In Header */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.4)]">
              <Star className="w-4 h-4 fill-amber-400 text-amber-300 animate-pulse" />
              <span className="font-header font-bold text-xs sm:text-sm text-amber-200 tracking-wider">
                {economy.stars.toLocaleString()}
              </span>
            </div>

            <button
              type="button"
              onClick={() => {
                SoundEngine.playButtonClick();
                Haptics.buttonClick();
                onClose();
              }}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center text-gray-300 hover:text-white transition-all active:scale-95 cursor-pointer"
              aria-label="Close Store"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Currency & Earning Condition Info Banner + Prototype Star Refill */}
        <div className="px-4 py-2 bg-black/40 border-b border-white/5 flex items-center justify-between text-[11px] text-gray-300">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Currency:</span>
              <span className="font-semibold text-amber-300">Star</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-gray-400">Earning condition:</span>
              <span className="text-gray-400 italic">—</span>
            </div>
          </div>
          <button
            type="button"
            onClick={handleQuickRefill}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-orange-500/20 hover:from-amber-500/30 hover:to-orange-500/30 border border-amber-400/50 text-amber-300 text-[10px] font-header font-bold tracking-wider uppercase active:scale-95 transition-all shadow-[0_0_10px_rgba(245,158,11,0.2)] cursor-pointer"
            title="Refill 1,000 Stars (Prototype)"
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>Refill +1,000 ⭐</span>
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center justify-around px-2 py-2.5 bg-neutral-950/60 border-b border-white/10 overflow-x-auto">
          {CATEGORIES.map((cat) => {
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
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-header font-bold tracking-wider uppercase transition-all whitespace-nowrap active:scale-95 ${
                  isActive
                    ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] border border-pink-300'
                    : 'text-gray-400 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Store Grid Items */}
        <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
          <div className="grid grid-cols-2 gap-3.5 sm:gap-4">
            {currentItems.map((item) => {
              const isUnlocked = economy.unlockedItems.includes(item.id);
              const isEquipped = equippedId === item.id;
              const canAfford = economy.stars >= item.price;

              return (
                <div
                  key={item.id}
                  className={`group relative rounded-[22px] p-3 sm:p-3.5 bg-neutral-900/60 backdrop-blur-md border transition-all flex flex-col justify-between ${
                    isEquipped
                      ? 'border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
                      : isUnlocked
                      ? 'border-purple-400/40 hover:border-purple-300'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  {/* Ribbon Badge */}
                  {item.badge && (
                    <div className="absolute -top-1.5 right-3 px-2 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-[9px] font-header font-bold text-white tracking-widest uppercase shadow-sm border border-yellow-200/50">
                      {item.badge}
                    </div>
                  )}

                  {/* Top Item Info */}
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[9px] font-header font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        item.rarity === 'Legendary'
                          ? 'bg-amber-500/20 text-amber-300 border-amber-400/50'
                          : item.rarity === 'Epic'
                          ? 'bg-purple-500/20 text-purple-300 border-purple-400/50'
                          : item.rarity === 'Rare'
                          ? 'bg-blue-500/20 text-blue-300 border-blue-400/50'
                          : 'bg-white/10 text-gray-300 border-white/20'
                      }`}
                    >
                      {item.rarity}
                    </span>

                    {/* Price in Stars */}
                    <div className="flex items-center gap-1 font-header font-bold text-xs text-amber-300">
                      {item.price === 0 ? (
                        <span className="text-cyan-300 text-[10px]">FREE</span>
                      ) : (
                        <>
                          <Star className="w-3 h-3 fill-amber-400" />
                          <span>{item.price}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Item Visual Display Pedestal (Prototype Frame) */}
                  <div className="relative w-full h-24 sm:h-28 rounded-xl bg-black/40 border border-white/10 overflow-hidden flex flex-col items-center justify-center p-2 mb-2 group-hover:border-white/25 transition-all">
                    {renderItemVisual(item)}

                    {/* Subtle Prototype Tag Overlay */}
                    <div className="absolute bottom-1 right-1 text-[8px] font-mono text-gray-500 bg-black/60 px-1 rounded">
                      Proto
                    </div>
                  </div>

                  {/* Name & Flavor text */}
                  <div className="text-center mb-2.5">
                    <h3 className="font-header text-xs sm:text-sm font-bold text-white tracking-wide truncate">
                      {item.name}
                    </h3>
                    <p className="text-[10px] text-gray-400 font-body line-clamp-1 mt-0.5">
                      {item.subtitle}
                    </p>
                  </div>

                  {/* Action Button */}
                  <div>
                    {isEquipped ? (
                      <div className="w-full py-1.5 rounded-full bg-cyan-950/60 border border-cyan-400/60 text-cyan-300 font-header font-bold text-xs tracking-wider flex items-center justify-center gap-1">
                        <Check className="w-3.5 h-3.5" />
                        <span>EQUIPPED</span>
                      </div>
                    ) : isUnlocked ? (
                      <button
                        type="button"
                        onClick={() => handleEquip(item)}
                        className="w-full py-1.5 rounded-full bg-white/10 hover:bg-white/20 border border-purple-400/50 text-purple-200 font-header font-bold text-xs tracking-wider active:scale-95 transition-all"
                      >
                        EQUIP
                      </button>
                    ) : canAfford ? (
                      <button
                        type="button"
                        onClick={() => handlePurchase(item)}
                        className="w-full py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500 text-black font-header font-bold text-xs tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.5)] border border-yellow-200 active:scale-95 transition-all flex items-center justify-center gap-1"
                      >
                        <Star className="w-3 h-3 fill-black text-black" />
                        <span>BUY {item.price}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => handleRefillAndPurchase(item)}
                        className="w-full py-1.5 rounded-full bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/60 text-amber-300 font-header font-bold text-xs tracking-wider active:scale-95 transition-all flex items-center justify-center gap-1 cursor-pointer shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                        title={`Refill needed ${item.price - economy.stars} Stars & Unlock`}
                      >
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>REFILL & BUY ({item.price} ⭐)</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Store Footer */}
        <div className="p-3 bg-black/60 border-t border-white/10 text-center text-[11px] text-gray-400">
          More skins, visual animations, and custom sound effects coming soon!
        </div>
      </div>
    </div>
  );
};
