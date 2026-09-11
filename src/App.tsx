/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { AppSettings, AppStats, CustomBottleSprite, ScreenView, TouchPlayer, BottleBuiltinStyle, ThemeId } from './types';
import { THEMES } from './lib/themes';
import { getSettings, saveSettings, getStats, getAllCustomSprites, saveCustomSprite } from './lib/db';
import { SoundEngine, Haptics } from './lib/audio';
import { processSpriteImage } from './lib/imageProcessing';
import { BackgroundCanvas } from './components/BackgroundCanvas';
import { Header } from './components/Header';
import { LandingHub } from './components/LandingHub';
import { FingerRoulette } from './components/FingerRoulette';
import { BottleSpin } from './components/BottleSpin';
import { SettingsModal } from './components/SettingsModal';
import { PartyBackground } from './components/PartyBackground';
import { FingerGameBackground } from './components/FingerGameBackground';
import { SpinBottleBackground } from './components/SpinBottleBackground';
import { BombGameBackground } from './components/BombGameBackground';
import { VersionNotesModal } from './components/VersionNotesModal';
import { AboutGuideModal } from './components/AboutGuideModal';
import { LandscapeBlocker } from './components/LandscapeBlocker';
import { SplashScreen } from './components/SplashScreen';
import { OfflineIndicator } from './components/OfflineIndicator';
import { KaboomGame } from './components/kaboom/KaboomGame';
import { getEconomyState, EconomyState } from './lib/economy';
import { StoreModal } from './components/StoreModal';
import { DailyQuestsModal } from './components/DailyQuestsModal';
import { RankingsModal } from './components/RankingsModal';
import { RewardsModal } from './components/RewardsModal';

export default function App() {
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentView, setCurrentView] = useState<ScreenView>('hub');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);
  const [isVersionNotesOpen, setIsVersionNotesOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isStoreOpen, setIsStoreOpen] = useState<boolean>(false);
  const [isDailyQuestsOpen, setIsDailyQuestsOpen] = useState<boolean>(false);
  const [isRankingsOpen, setIsRankingsOpen] = useState<boolean>(false);
  const [isRewardsOpen, setIsRewardsOpen] = useState<boolean>(false);
  const [economy, setEconomy] = useState<EconomyState>(() => getEconomyState());
  const [settings, setSettings] = useState<AppSettings>({
    minPlayers: 2,
    targetCount: 1,
    countdownSeconds: 5,
    bottleStyle: 'btl_e_001',
    selectedCustomSpriteId: null,
    bottleBlendMode: 'screen',
    bottleFriction: 0.992,
    theme: 'cyber-neon',
    soundEnabled: true,
    soundVolume: 0.8,
    hapticsEnabled: true,
  });

  const [stats, setStats] = useState<AppStats>({
    totalRouletteRounds: 0,
    totalBottleSpins: 0,
    lastPlayedAt: Date.now(),
  });

  const [customSprites, setCustomSprites] = useState<CustomBottleSprite[]>([]);
  const [currentTouches, setCurrentTouches] = useState<TouchPlayer[]>([]);
  const [showTeamLines, setShowTeamLines] = useState<boolean>(false);
  const [isBottleSpinning, setIsBottleSpinning] = useState<boolean>(false);
  const [bottleSpinSpeed, setBottleSpinSpeed] = useState<number>(0);
  const [rouletteGameState, setRouletteGameState] = useState<'waiting' | 'countdown' | 'resolved'>('waiting');
  const rouletteResolveRef = useRef<(() => void) | null>(null);

  // Load from IndexedDB on startup
  useEffect(() => {
    async function loadDB() {
      const loadedSettings = await getSettings();
      const loadedStats = await getStats();
      const loadedSprites = await getAllCustomSprites();

      // Ensure valid bottle style and screen blend mode
      const validSkins = ['btl_e_001', 'btl_e_002', 'btl_e_003', 'btl_e_004'];
      if (
        !validSkins.includes(loadedSettings.bottleStyle) &&
        loadedSettings.bottleStyle !== 'custom'
      ) {
        loadedSettings.bottleStyle = 'btl_e_001';
      }
      loadedSettings.bottleBlendMode = 'screen';
      loadedSettings.theme = 'cyber-neon';

      setSettings(loadedSettings);
      setStats(loadedStats);

      // Auto-upgrade any existing custom sprites
      const upgradedSprites = await Promise.all(
        loadedSprites.map(async (sprite) => {
          if (!sprite.originalDataUrl) {
            sprite.originalDataUrl = sprite.dataUrl;
          }
          if ((sprite as any).cleanEdgeVersion !== 2) {
            try {
              sprite.dataUrl = await processSpriteImage(
                sprite.originalDataUrl,
                sprite.blendMode || 'color-dodge',
                sprite.rotationOffset || 0
              );
              (sprite as any).cleanEdgeVersion = 2;
              await saveCustomSprite(sprite);
            } catch (err) {
              console.error('Error upgrading sprite:', err);
            }
          }
          return sprite;
        })
      );
      setCustomSprites(upgradedSprites);

      SoundEngine.updateConfig(
        loadedSettings.soundEnabled,
        loadedSettings.soundVolume,
        loadedSettings.hapticsEnabled
      );
      SoundEngine.preloadSounds();
    }
    loadDB();
  }, []);

  // Sync economy whenever stars are earned or items purchased
  useEffect(() => {
    const handleEconomyEvent = (e: Event) => {
      const customEvent = e as CustomEvent<EconomyState>;
      if (customEvent.detail) {
        setEconomy(customEvent.detail);
      } else {
        setEconomy(getEconomyState());
      }
    };
    window.addEventListener('picku_economy_updated', handleEconomyEvent);
    return () => window.removeEventListener('picku_economy_updated', handleEconomyEvent);
  }, []);

  const refreshSprites = useCallback(async () => {
    const sprites = await getAllCustomSprites();
    setCustomSprites(sprites);
  }, []);

  const refreshStats = useCallback(async () => {
    const loadedStats = await getStats();
    setStats(loadedStats);
  }, []);

  const handleUpdateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      saveSettings(updated);
      SoundEngine.updateConfig(
        updated.soundEnabled,
        updated.soundVolume,
        updated.hapticsEnabled
      );
      return updated;
    });
  }, []);

  const handleToggleSound = useCallback(() => {
    handleUpdateSettings({ soundEnabled: !settings.soundEnabled });
  }, [settings.soundEnabled, handleUpdateSettings]);

  const handleToggleHaptics = useCallback(() => {
    handleUpdateSettings({ hapticsEnabled: !settings.hapticsEnabled });
  }, [settings.hapticsEnabled, handleUpdateSettings]);

  const handleTouchUpdate = useCallback((touches: TouchPlayer[], showTeams: boolean) => {
    setCurrentTouches(touches);
    setShowTeamLines(showTeams);
  }, []);

  const activeCustomSprite = useMemo(() => {
    if (settings.bottleStyle !== 'custom' || !settings.selectedCustomSpriteId) return null;
    return customSprites.find((s) => s.id === settings.selectedCustomSpriteId) || null;
  }, [settings.bottleStyle, settings.selectedCustomSpriteId, customSprites]);

  const currentTheme = THEMES['cyber-neon'];

  // Quick bottle sprite cycle for header action (only appears in bottle spinning game mode)
  const handleCycleBottleSprite = useCallback(() => {
    const presetIds: BottleBuiltinStyle[] = ['btl_e_001', 'btl_e_002', 'btl_e_003', 'btl_e_004'];

    type SpriteOption = { style: BottleBuiltinStyle | 'custom'; spriteId: string | null };
    const options: SpriteOption[] = presetIds.map((id) => ({ style: id, spriteId: null }));
    customSprites.forEach((s) => {
      options.push({ style: 'custom', spriteId: s.id });
    });

    const currentIndex = options.findIndex((opt) => {
      if (opt.style === 'custom') {
        return settings.bottleStyle === 'custom' && settings.selectedCustomSpriteId === opt.spriteId;
      }
      return settings.bottleStyle === opt.style;
    });

    const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % options.length;
    const nextOpt = options[nextIndex];

    handleUpdateSettings({
      bottleStyle: nextOpt.style,
      selectedCustomSpriteId: nextOpt.spriteId,
    });
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
  }, [settings.bottleStyle, settings.selectedCustomSpriteId, customSprites, handleUpdateSettings]);

  return (
    <main
      className="relative w-screen h-screen overflow-hidden select-none touch-none font-sans transition-colors duration-500"
      style={{ backgroundColor: currentTheme.bgBase }}
    >
      {/* 1. Main Hub Background: Looping Neon Party DJ Background Video (Preloaded & Persistent for zero lag) */}
      <div className={currentView === 'hub' ? 'contents' : 'hidden'}>
        <PartyBackground theme={settings.theme} active={currentView === 'hub'} />
      </div>

      {/* 2. Finger Roulette Gameplay Background: Static Image, Screen Bleed Ambience Lights & Speed-Adjusted Video */}
      <div className={currentView === 'roulette' ? 'contents' : 'hidden'}>
        <FingerGameBackground
          theme={settings.theme}
          active={currentView === 'roulette'}
          gameState={rouletteGameState}
          activeFingersCount={currentTouches.length}
          minPlayers={settings.minPlayers}
          countdownSeconds={settings.countdownSeconds}
          onVideoEnd={() => {
            rouletteResolveRef.current?.();
          }}
        />
      </div>

      {/* 3. Spin Bottle Gameplay Background: Music Visualizer Spectrum with Table & Lights (Preloaded & Persistent) */}
      <div className={currentView === 'bottle' ? 'contents' : 'hidden'}>
        <SpinBottleBackground
          theme={settings.theme}
          active={currentView === 'bottle'}
          isSpinning={isBottleSpinning}
          spinSpeed={bottleSpinSpeed}
        />
      </div>

      {/* 4. Bomb Game Background (Preloaded & Persistent) */}
      <div className={currentView === 'kaboom' ? 'contents' : 'hidden'}>
        <BombGameBackground active={currentView === 'kaboom'} />
      </div>

      {/* 3. 60FPS Background Particle & Shockwave Canvas */}
      <BackgroundCanvas
        theme={settings.theme}
        touches={currentTouches}
        showTeamLines={showTeamLines}
        isBottleSpinning={isBottleSpinning}
        bottleSpinSpeed={bottleSpinSpeed}
      />

      {/* Persistent Mobile Top Action Header */}
      <Header
        currentView={currentView}
        settings={settings}
        stars={economy.stars}
        onNavigate={(view) => {
          setCurrentTouches([]);
          setShowTeamLines(false);
          setIsBottleSpinning(false);
          setBottleSpinSpeed(0);
          setRouletteGameState('waiting');
          setCurrentView(view);
        }}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onOpenStore={() => setIsStoreOpen(true)}
        onOpenInfo={() => setIsGuideOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onToggleSound={handleToggleSound}
        onToggleHaptics={handleToggleHaptics}
        onToggleBottleSprite={handleCycleBottleSprite}
        onEconomyUpdated={setEconomy}
      />

      {/* Screen Views */}
      <div className="relative w-full h-full z-20">
        {currentView === 'hub' && (
          <LandingHub
            settings={settings}
            economy={economy}
            onSelectRoulette={() => setCurrentView('roulette')}
            onSelectBottle={() => setCurrentView('bottle')}
            onSelectKaboom={() => setCurrentView('kaboom')}
            onUpdateSettings={handleUpdateSettings}
            onOpenVersionNotes={() => setIsVersionNotesOpen(true)}
            onOpenStore={() => setIsStoreOpen(true)}
            onOpenDailyQuests={() => setIsDailyQuestsOpen(true)}
            onOpenRankings={() => setIsRankingsOpen(true)}
            onOpenRewards={() => setIsRewardsOpen(true)}
          />
        )}

        {currentView === 'roulette' && (
          <FingerRoulette
            settings={settings}
            onTouchUpdate={handleTouchUpdate}
            onUpdateSettings={handleUpdateSettings}
            onGameStateChange={setRouletteGameState}
            registerResolveTrigger={(trigger) => {
              rouletteResolveRef.current = trigger;
            }}
          />
        )}

        {currentView === 'bottle' && (
          <BottleSpin
            settings={settings}
            customSprite={activeCustomSprite}
            onSpinStateChange={(spinning, speed) => {
              setIsBottleSpinning(spinning);
              setBottleSpinSpeed(speed);
            }}
          />
        )}

        {currentView === 'kaboom' && (
          <KaboomGame
            settings={settings}
            onBackToMenu={() => setCurrentView('hub')}
            onStatsUpdated={(newStats) => setStats(newStats)}
            onEconomyUpdated={setEconomy}
          />
        )}
      </div>

      {/* Settings & Custom Sprite Upload Modal */}
      <SettingsModal
        isOpen={isSettingsOpen}
        settings={settings}
        stats={stats}
        customSprites={customSprites}
        onClose={() => {
          refreshStats();
          setIsSettingsOpen(false);
        }}
        onUpdateSettings={handleUpdateSettings}
        onRefreshSprites={refreshSprites}
        onRefreshStats={refreshStats}
        onOpenStore={() => setIsStoreOpen(true)}
      />

      {/* Version Notes Modal (Changelog History & v1.4.01 Updates) */}
      <VersionNotesModal
        isOpen={isVersionNotesOpen}
        onClose={() => setIsVersionNotesOpen(false)}
      />

      {/* Game Guide Modal (How to Play, Party Tips & Star Economy) */}
      <AboutGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        economy={economy}
        onEconomyUpdated={setEconomy}
        onNavigateToGame={(game) => {
          setCurrentTouches([]);
          setShowTeamLines(false);
          setIsBottleSpinning(false);
          setBottleSpinSpeed(0);
          setRouletteGameState('waiting');
          setCurrentView(game);
        }}
        onOpenStore={() => setIsStoreOpen(true)}
      />

      {/* Store Modal (Bottles, Bombs, Balls, Bonus Skins) */}
      <StoreModal
        isOpen={isStoreOpen}
        economy={economy}
        settings={settings}
        onClose={() => setIsStoreOpen(false)}
        onEconomyUpdated={setEconomy}
        onUpdateSettings={handleUpdateSettings}
      />

      {/* Daily Quests Modal */}
      <DailyQuestsModal
        isOpen={isDailyQuestsOpen}
        quests={economy.dailyQuests}
        economy={economy}
        onClose={() => setIsDailyQuestsOpen(false)}
        onNavigateToGame={(view) => {
          setCurrentTouches([]);
          setShowTeamLines(false);
          setIsBottleSpinning(false);
          setBottleSpinSpeed(0);
          setRouletteGameState('waiting');
          setCurrentView(view);
        }}
        onEconomyUpdated={setEconomy}
      />

      {/* Rankings Modal (Hall of Fame) */}
      <RankingsModal
        isOpen={isRankingsOpen}
        onClose={() => setIsRankingsOpen(false)}
      />

      {/* Rewards Modal (Daily Login Streak) */}
      <RewardsModal
        isOpen={isRewardsOpen}
        economy={economy}
        onClose={() => setIsRewardsOpen(false)}
        onEconomyUpdated={setEconomy}
      />

      {/* Portrait-Only Guard: Landscape Blocker Overlay */}
      <LandscapeBlocker />

      {/* Offline Status Connectivity Toast */}
      <OfflineIndicator />

      {/* Launch Splash Screen & In-Memory Asset Preloader Modal */}
      {showSplash && (
        <SplashScreen
          onComplete={() => setShowSplash(false)}
        />
      )}
    </main>
  );
}
