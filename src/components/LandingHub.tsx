/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import pickuPartyLogo from '../assets/images/PICK\'U PARTY LOGO E01.webp';
import chibiFingersImg from '../assets/images/Chibi Fingers Game.webp';
import chibiBottleImg from '../assets/images/Chibi Spinning Bottle.webp';
import chibiBombImg from '../assets/images/Chibi Bomb Game.webp';
import { getAssetUrl } from '../lib/assetPreloader';
import { AppSettings } from '../types';
import { SoundEngine, Haptics } from '../lib/audio';
import { PWAInstallButton } from './PWAInstallButton';

interface LandingHubProps {
  settings: AppSettings;
  onSelectRoulette: () => void;
  onSelectBottle: () => void;
  onUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  onOpenVersionNotes?: () => void;
}

export const LandingHub: React.FC<LandingHubProps> = ({
  onSelectRoulette,
  onSelectBottle,
  onOpenVersionNotes,
}) => {
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleTitleClick = () => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
  };

  const handleKaboomClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    setToastMessage("💣 KABOOM Mode Coming Soon! Get ready...");
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  return (
    <div className="relative w-full h-full max-w-md mx-auto flex flex-col justify-between items-center px-4 pt-[max(3.5rem,calc(env(safe-area-inset-top)+2.5rem))] pb-[max(0.6rem,env(safe-area-inset-bottom))] overflow-y-auto no-scrollbar select-none">
      {/* Toast notification for Kaboom or actions */}
      {toastMessage && (
        <div className="fixed top-16 z-50 animate-bounce">
          <div className="px-4 py-2 rounded-full bg-orange-600/90 text-white font-bold text-xs shadow-[0_0_20px_rgba(249,115,22,0.6)] border border-orange-300/80 backdrop-blur-md flex items-center gap-2">
            <span>{toastMessage}</span>
          </div>
        </div>
      )}

      {/* Header Title: PICK'U PARTY (Crisp, screen-blend logo with occasional light sweep + follow-up pulse) */}
      <div className="text-center mt-[1.5vh] sm:mt-[2.2vh] mb-0 flex flex-col items-center select-none relative z-20 shrink-0 w-full px-2">
        <div
          onClick={handleTitleClick}
          className="relative w-full max-w-[370px] sm:max-w-[430px] md:max-w-[470px] flex items-center justify-center cursor-pointer group"
          title="PICK'U PARTY"
        >
          {/* Logo container with follow-up pulse right after the sweep */}
          <div className="relative w-full flex items-center justify-center animate-title-sweep-pulse">
            {/* Official PICK'U PARTY Logo */}
            <img
              src={getAssetUrl(pickuPartyLogo)}
              alt="PICK'U PARTY"
              className="w-full h-auto max-h-[68px] sm:max-h-[82px] md:max-h-[92px] object-contain select-none pointer-events-none"
              style={{
                mixBlendMode: 'screen',
              }}
            />

            {/* Light Sweep Layer: Masked strictly to the logo silhouette */}
            <div
              className="absolute inset-0 pointer-events-none overflow-hidden"
              style={{
                WebkitMaskImage: `url("${getAssetUrl(pickuPartyLogo)}")`,
                maskImage: `url("${getAssetUrl(pickuPartyLogo)}")`,
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                mixBlendMode: 'screen',
              }}
            >
              <div
                className="absolute -inset-y-4 w-1/2 animate-title-sweep"
                style={{
                  background:
                    'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.2) 20%, rgba(255, 255, 255, 0.95) 50%, rgba(255, 255, 255, 0.2) 80%, transparent 100%)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Subtitle */}
        <p className="text-[12.5px] sm:text-[14.5px] md:text-base font-semibold tracking-normal sm:tracking-wide text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] drop-shadow-[0_0_10px_rgba(0,0,0,0.8)] mt-1 mb-0 select-none">
          Select a game mode and have fun with your friends
        </p>
      </div>

      {/* Main Game Mode Cards: 16:9 Ratio at Max Screen Size, Responsively Reduced Height on Smaller Screens */}
      <div className="w-full max-w-sm sm:max-w-md flex flex-col gap-2.5 sm:gap-3.5 my-auto shrink-0">
        {/* Card 1: FINGER ROULETTE */}
        <div
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            onSelectRoulette();
          }}
          className="relative rounded-[20px] sm:rounded-[22px] p-2.5 sm:p-3.5 bg-black/40 backdrop-blur-[3px] border-[1.5px] border-cyan-400 shadow-[0_0_18px_rgba(6,182,212,0.4),inset_0_0_10px_rgba(6,182,212,0.12)] flex flex-col items-center justify-end text-center cursor-pointer active:scale-[0.985] transition-all group hover:border-cyan-300 overflow-hidden w-full aspect-[2.35/1] xs:aspect-[2.1/1] sm:aspect-[16/9]"
        >
          {/* Top-Right Diagonal Ribbon: Popular */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 overflow-hidden pointer-events-none z-20">
            <div
              className="absolute top-[18px] -right-[34px] sm:top-[20px] sm:-right-[32px] w-[124px] sm:w-[130px] transform rotate-45 py-0.5 sm:py-1 text-center font-black tracking-widest text-[8.5px] sm:text-[9.5px] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.6)] border-y border-white/50 select-none whitespace-nowrap"
              style={{
                background: 'linear-gradient(90deg, #06b6d4 0%, #38bdf8 50%, #00e5ff 100%)',
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
              }}
            >
              Popular
            </div>
          </div>

          {/* Thematic Background Image: Pinned to Top, Crystal Clear at Top, Gradually Fades & Dims at Bottom (~30%) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden z-0"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 32%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.3) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 32%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.3) 100%)',
            }}
          >
            <img
              src={getAssetUrl(chibiFingersImg)}
              alt="Chibi Fingers Game"
              className="w-full h-full object-cover object-top select-none group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Gradual dimming overlay towards bottom (~30% brightness at bottom) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.65) 100%)',
              }}
            />
          </div>

          {/* Bottom Info: Bold Color Gradient Title & Description moved down close to button */}
          <div className="relative z-10 flex flex-col items-center w-full mt-auto">
            <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider uppercase bg-gradient-to-r from-cyan-200 via-sky-300 to-fuchsia-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight">
              FINGER ROULETTE
            </h2>

            <p className="text-[11px] sm:text-xs md:text-[13px] font-bold tracking-normal bg-gradient-to-r from-cyan-100 via-white to-sky-200 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] mt-0.5 mb-1.5 sm:mb-2 leading-tight">
              Place your finger and have fun
            </p>

            {/* 3D Glossy Capsule Button: PLAY PICKER */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playButtonClick();
                Haptics.buttonClick();
                onSelectRoulette();
              }}
              className="relative w-full h-8 sm:h-9 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-[0_3px_16px_rgba(6,182,212,0.45)] active:scale-[0.98] transition-all border-[1.2px] border-white/70 select-none group"
              style={{
                background: 'linear-gradient(90deg, #00e5ff 0%, #06b6d4 30%, #a855f7 70%, #d946ef 100%)',
              }}
            >
              {/* Top Gloss Specular Sheen */}
              <div
                className="absolute top-[1px] inset-x-2 h-[45%] rounded-[9999px_9999px_80px_80px] pointer-events-none z-10"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.22) 55%, rgba(255, 255, 255, 0) 100%)',
                }}
              />
              {/* Bottom Glass Rim */}
              <div
                className="absolute bottom-[1px] inset-x-3 h-[25%] rounded-[80px_80px_9999px_9999px] pointer-events-none z-10"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
                }}
              />

              {/* Occasional Taking-Turn Light Sweep (Turn 1: delay 0s) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 rounded-full">
                <div
                  className="absolute -inset-y-2 w-1/2 animate-button-sweep"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 25%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 100%)',
                    animationDelay: '0s',
                  }}
                />
              </div>

              {/* Button Label */}
              <span className="relative z-20 text-[10px] sm:text-[11px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                PLAY PICKER
              </span>
            </button>
          </div>
        </div>

        {/* Card 2: SPIN THE BOTTLE */}
        <div
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            onSelectBottle();
          }}
          className="relative rounded-[20px] sm:rounded-[22px] p-2.5 sm:p-3.5 bg-black/40 backdrop-blur-[3px] border-[1.5px] border-pink-500 shadow-[0_0_18px_rgba(236,72,153,0.4),inset_0_0_10px_rgba(236,72,153,0.12)] flex flex-col items-center justify-end text-center cursor-pointer active:scale-[0.985] transition-all group hover:border-pink-400 overflow-hidden w-full aspect-[2.35/1] xs:aspect-[2.1/1] sm:aspect-[16/9]"
        >
          {/* Thematic Background Image: Pinned to Top, Crystal Clear at Top, Gradually Fades & Dims at Bottom (~30%) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden z-0"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 32%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.3) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 32%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.3) 100%)',
            }}
          >
            <img
              src={getAssetUrl(chibiBottleImg)}
              alt="Chibi Spinning Bottle"
              className="w-full h-full object-cover object-top select-none group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Gradual dimming overlay towards bottom (~30% brightness at bottom) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.65) 100%)',
              }}
            />
          </div>

          {/* Bottom Info: Bold Color Gradient Title & Description moved down close to button */}
          <div className="relative z-10 flex flex-col items-center w-full mt-auto">
            <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider uppercase bg-gradient-to-r from-pink-200 via-rose-300 to-purple-300 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight">
              SPIN THE BOTTLE
            </h2>

            <p className="text-[11px] sm:text-xs md:text-[13px] font-bold tracking-normal bg-gradient-to-r from-pink-100 via-white to-purple-200 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] mt-0.5 mb-1.5 sm:mb-2 leading-tight">
              Flick or tap to spin the bottle
            </p>

            {/* 3D Glossy Capsule Button: SPIN BOTTLE */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                SoundEngine.playButtonClick();
                Haptics.buttonClick();
                onSelectBottle();
              }}
              className="relative w-full h-8 sm:h-9 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-[0_3px_16px_rgba(236,72,153,0.45)] active:scale-[0.98] transition-all border-[1.2px] border-white/70 select-none group"
              style={{
                background: 'linear-gradient(90deg, #9333ea 0%, #a855f7 35%, #ec4899 75%, #f43f5e 100%)',
              }}
            >
              {/* Top Gloss Specular Sheen */}
              <div
                className="absolute top-[1px] inset-x-2 h-[45%] rounded-[9999px_9999px_80px_80px] pointer-events-none z-10"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.22) 55%, rgba(255, 255, 255, 0) 100%)',
                }}
              />
              {/* Bottom Glass Rim */}
              <div
                className="absolute bottom-[1px] inset-x-3 h-[25%] rounded-[80px_80px_9999px_9999px] pointer-events-none z-10"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
                }}
              />

              {/* Occasional Taking-Turn Light Sweep (Turn 2: delay 1.4s) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 rounded-full">
                <div
                  className="absolute -inset-y-2 w-1/2 animate-button-sweep"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 25%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 100%)',
                    animationDelay: '1.4s',
                  }}
                />
              </div>

              {/* Button Label */}
              <span className="relative z-20 text-[10px] sm:text-[11px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                SPIN BOTTLE
              </span>
            </button>
          </div>
        </div>

        {/* Card 3: KABOOM */}
        <div
          onClick={handleKaboomClick}
          className="relative rounded-[20px] sm:rounded-[22px] p-2.5 sm:p-3.5 bg-black/40 backdrop-blur-[3px] border-[1.5px] border-orange-500 shadow-[0_0_18px_rgba(249,115,22,0.4),inset_0_0_10px_rgba(249,115,22,0.12)] flex flex-col items-center justify-end text-center cursor-pointer active:scale-[0.985] transition-all group hover:border-orange-400 overflow-hidden w-full aspect-[2.35/1] xs:aspect-[2.1/1] sm:aspect-[16/9]"
        >
          {/* Top-Right Diagonal Ribbon: Coming Soon */}
          <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 overflow-hidden pointer-events-none z-20">
            <div
              className="absolute top-[18px] -right-[34px] sm:top-[20px] sm:-right-[32px] w-[124px] sm:w-[130px] transform rotate-45 py-0.5 sm:py-1 text-center font-black tracking-wider text-[8px] sm:text-[9px] uppercase shadow-[0_2px_8px_rgba(0,0,0,0.6)] border-y border-amber-200/40 select-none whitespace-nowrap"
              style={{
                background: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ea580c 100%)',
                color: '#ffffff',
                textShadow: '0 1px 2px rgba(0,0,0,0.9)',
              }}
            >
              Coming Soon
            </div>
          </div>

          {/* Thematic Background Image: Pinned to Top, Crystal Clear at Top, Gradually Fades & Dims at Bottom (~30%) */}
          <div
            className="absolute inset-0 pointer-events-none overflow-hidden z-0"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 32%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.3) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 0%, rgba(0,0,0,1) 32%, rgba(0,0,0,0.65) 68%, rgba(0,0,0,0.3) 100%)',
            }}
          >
            <img
              src={getAssetUrl(chibiBombImg)}
              alt="Chibi Bomb Game"
              className="w-full h-full object-cover object-top select-none group-hover:scale-105 transition-transform duration-500 ease-out"
            />
            {/* Gradual dimming overlay towards bottom (~30% brightness at bottom) */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(to bottom, transparent 0%, transparent 35%, rgba(0,0,0,0.2) 65%, rgba(0,0,0,0.65) 100%)',
              }}
            />
          </div>

          {/* Bottom Info: Bold Color Gradient Title & Description moved down close to button */}
          <div className="relative z-10 flex flex-col items-center w-full mt-auto">
            <h2 className="text-sm sm:text-base md:text-lg font-black tracking-wider uppercase bg-gradient-to-r from-amber-200 via-orange-300 to-red-400 bg-clip-text text-transparent drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] leading-tight">
              KABOOM
            </h2>

            <p className="text-[11px] sm:text-xs md:text-[13px] font-bold tracking-normal bg-gradient-to-r from-amber-100 via-white to-orange-200 bg-clip-text text-transparent drop-shadow-[0_1px_3px_rgba(0,0,0,0.95)] mt-0.5 mb-1.5 sm:mb-2 leading-tight">
              Avoid the bomb and don't get exploded
            </p>

            {/* 3D Glossy Capsule Button: LET'S GO */}
            <button
              type="button"
              onClick={handleKaboomClick}
              className="relative w-full h-8 sm:h-9 rounded-full overflow-hidden flex items-center justify-center cursor-pointer shadow-[0_3px_16px_rgba(249,115,22,0.45)] active:scale-[0.98] transition-all border-[1.2px] border-white/70 select-none group"
              style={{
                background: 'linear-gradient(90deg, #ef4444 0%, #f97316 50%, #ff5500 100%)',
              }}
            >
              {/* Top Gloss Specular Sheen */}
              <div
                className="absolute top-[1px] inset-x-2 h-[45%] rounded-[9999px_9999px_80px_80px] pointer-events-none z-10"
                style={{
                  background:
                    'linear-gradient(180deg, rgba(255, 255, 255, 0.75) 0%, rgba(255, 255, 255, 0.22) 55%, rgba(255, 255, 255, 0) 100%)',
                }}
              />
              {/* Bottom Glass Rim */}
              <div
                className="absolute bottom-[1px] inset-x-3 h-[25%] rounded-[80px_80px_9999px_9999px] pointer-events-none z-10"
                style={{
                  background:
                    'linear-gradient(0deg, rgba(255, 255, 255, 0.25) 0%, rgba(255, 255, 255, 0) 100%)',
                }}
              />

              {/* Occasional Taking-Turn Light Sweep (Turn 3: delay 2.8s) */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden z-25 rounded-full">
                <div
                  className="absolute -inset-y-2 w-1/2 animate-button-sweep"
                  style={{
                    background:
                      'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.15) 25%, rgba(255, 255, 255, 0.85) 50%, rgba(255, 255, 255, 0.15) 75%, transparent 100%)',
                    animationDelay: '2.8s',
                  }}
                />
              </div>

              {/* Button Label */}
              <span className="relative z-20 text-[10px] sm:text-[11px] font-black tracking-wider text-white uppercase drop-shadow-[0_1px_2px_rgba(0,0,0,0.9)]">
                LET'S GO
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Footer Version Notes: v1.3.001 & PWA Pill */}
      <div className="shrink-0 mt-1 mb-0.5 flex flex-col items-center gap-1.5 select-none">
        <PWAInstallButton variant="pill" />
        <button
          type="button"
          onClick={() => {
            SoundEngine.playButtonClick();
            Haptics.buttonClick();
            if (onOpenVersionNotes) onOpenVersionNotes();
          }}
          className="text-[10px] sm:text-[11px] text-gray-400/80 hover:text-white transition-colors tracking-wide cursor-pointer focus:outline-none py-0.5"
        >
          Version notes: v1.3.001
        </button>
      </div>
    </div>
  );
};
