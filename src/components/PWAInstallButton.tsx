/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Download, Share2, PlusSquare, X, Smartphone, CheckCircle } from 'lucide-react';
import { usePWAInstall } from '../lib/usePWAInstall';

interface PWAInstallButtonProps {
  variant?: 'compact' | 'banner' | 'pill' | 'header';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({ variant = 'compact', className }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [installSuccess, setInstallSuccess] = useState(false);

  // If already installed and running as standalone PWA, hide
  if (isInstalled) {
    return null;
  }

  const handleInstall = async () => {
    if (isInstallable) {
      const outcome = await install();
      if (outcome) {
        setInstallSuccess(true);
        setTimeout(() => setInstallSuccess(false), 3000);
      }
    } else if (isIOS) {
      setShowIOSGuide(true);
    } else {
      // General browser fallback or desktop
      setShowIOSGuide(true);
    }
  };

  if (installSuccess) {
    return (
      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-bold">
        <CheckCircle className="w-3.5 h-3.5" />
        <span>Installed!</span>
      </div>
    );
  }

  return (
    <>
      {variant === 'banner' ? (
        <div
          id="pwa-install-banner"
          className="w-full flex items-center justify-between p-2.5 rounded-2xl bg-gradient-to-r from-cyan-950/60 to-purple-950/60 border border-cyan-400/30 backdrop-blur-md shadow-[0_0_15px_rgba(6,182,212,0.15)]"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
              <Smartphone className="w-5 h-5 text-cyan-300" />
            </div>
            <div className="text-left">
              <p className="text-xs font-black text-white tracking-wide">Install PICK'U PARTY</p>
              <p className="text-[10px] text-gray-400">Play full-screen 100% offline anytime</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleInstall}
            className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black tracking-wider uppercase hover:opacity-90 active:scale-95 transition-all shadow-[0_0_12px_rgba(6,182,212,0.4)] cursor-pointer"
          >
            Add to Screen
          </button>
        </div>
      ) : variant === 'pill' ? (
        <button
          type="button"
          id="pwa-install-pill-btn"
          onClick={handleInstall}
          className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold hover:bg-cyan-500/30 active:scale-95 transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Add to Screen</span>
        </button>
      ) : variant === 'header' ? (
        <button
          type="button"
          id="pwa-install-header-btn"
          onClick={handleInstall}
          aria-label="Add PICK'U PARTY to Home Screen for Offline Play"
          title="Add to Home Screen (Offline App)"
          className="w-11 h-11 sm:w-12 sm:h-12 rounded-[18px] bg-black/40 backdrop-blur-md border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.35)] flex items-center justify-center text-cyan-300 hover:text-white hover:border-cyan-300 active:scale-95 transition-all cursor-pointer group"
        >
          <Download className="w-5 h-5 stroke-[2.2] drop-shadow-[0_0_8px_rgba(6,182,212,0.8)] group-hover:scale-110 transition-transform" />
        </button>
      ) : className ? (
        <button
          type="button"
          id="pwa-install-custom-btn"
          onClick={handleInstall}
          className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-black tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.35)] hover:opacity-90 active:scale-95 transition-all cursor-pointer ${className}`}
        >
          <Download className="w-4 h-4" />
          <span>Add to Home Screen</span>
        </button>
      ) : (
        <button
          type="button"
          id="pwa-install-compact-btn"
          onClick={handleInstall}
          title="Add to Home Screen"
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 hover:text-white hover:bg-cyan-500/30 active:scale-95 transition-all shadow-[0_0_10px_rgba(6,182,212,0.3)] cursor-pointer"
        >
          <Download className="w-4 h-4" />
        </button>
      )}

      {/* iOS & General Browser "Add to Home Screen" Instructions Modal */}
      {showIOSGuide && (
        <div
          id="pwa-ios-guide-modal"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-fade-in"
          onClick={() => setShowIOSGuide(false)}
        >
          <div
            className="w-full max-w-sm rounded-3xl bg-gray-900/95 border border-cyan-500/30 p-5 shadow-[0_0_30px_rgba(6,182,212,0.25)] text-white relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-cyan-300" />
              </div>
              <div>
                <h3 className="text-base font-black text-white">Add to Home Screen</h3>
                <p className="text-[11px] text-cyan-300/80">Play 100% Offline with Zero Buffering</p>
              </div>
            </div>

            <div className="space-y-3 my-4 text-xs text-gray-300 bg-white/5 p-3.5 rounded-2xl border border-white/10">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-blue-500/20 border border-blue-400/40 text-blue-300 flex items-center justify-center shrink-0 font-bold text-xs">
                  1
                </div>
                <p className="leading-relaxed">
                  In Safari, Chrome, or your browser toolbar, tap the <strong className="text-cyan-300">Share</strong> <Share2 className="w-3.5 h-3.5 inline mx-0.5 text-cyan-300" /> button or menu (<strong className="text-cyan-300">⋮</strong>).
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-purple-500/20 border border-purple-400/40 text-purple-300 flex items-center justify-center shrink-0 font-bold text-xs">
                  2
                </div>
                <p className="leading-relaxed">
                  Scroll down the options and select <strong className="text-purple-300">Add to Home Screen</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-0.5 text-purple-300" />.
                </p>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 flex items-center justify-center shrink-0 font-bold text-xs">
                  3
                </div>
                <p className="leading-relaxed">
                  Tap <strong className="text-emerald-300">Add</strong> in the top right. An app icon will appear on your phone screen!
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowIOSGuide(false)}
              className="w-full py-2.5 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider hover:opacity-90 active:scale-95 transition-all shadow-[0_0_15px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              Got It!
            </button>
          </div>
        </div>
      )}
    </>
  );
};
