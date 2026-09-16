/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { Component, ErrorInfo, ReactNode } from 'react';
import { RotateCcw, AlertTriangle } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary] Uncaught application error:', error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleResetApp = async () => {
    try {
      if ('caches' in window) {
        const cacheKeys = await caches.keys();
        await Promise.all(cacheKeys.map((key) => caches.delete(key)));
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.clear();
      }
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.clear();
      }
    } catch (e) {
      console.warn('Cache clearing error:', e);
    }
    window.location.href = '/';
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div
          id="app-error-boundary"
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center p-6 bg-[#030712] text-white select-none"
          style={{ minHeight: '100dvh', backgroundColor: '#030712' }}
        >
          <div className="w-16 h-16 rounded-2xl bg-pink-500/10 border border-pink-500/40 flex items-center justify-center mb-4 shadow-[0_0_25px_rgba(255,42,133,0.35)]">
            <AlertTriangle className="w-8 h-8 text-pink-400" />
          </div>

          <h2 className="font-header text-xl sm:text-2xl font-bold uppercase tracking-wider text-center text-white mb-2">
            Party Engine Restart
          </h2>

          <p className="font-body text-xs sm:text-sm text-gray-300 text-center max-w-xs mb-6 leading-relaxed">
            The application encountered a temporary display issue during mobile launch. Tap below to refresh your session.
          </p>

          <div className="flex flex-col gap-3 w-full max-w-xs">
            <button
              onClick={this.handleReload}
              className="flex items-center justify-center gap-2 w-full py-3.5 px-4 rounded-xl font-body font-bold text-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_20px_rgba(0,240,255,0.4)] active:scale-95 transition-transform"
            >
              <RotateCcw className="w-4 h-4" />
              Reload PICK'U PARTY
            </button>

            <button
              onClick={this.handleResetApp}
              className="w-full py-2.5 px-4 rounded-xl font-body text-xs font-semibold text-gray-400 bg-white/5 border border-white/10 hover:text-white active:scale-95 transition"
            >
              Clear Local Cache & Relaunch
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
