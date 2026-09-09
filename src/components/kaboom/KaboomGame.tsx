/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Bomb,
  RotateCcw,
  Sparkles,
  Users,
  ChevronLeft,
  Shield,
  Zap,
  ArrowRight,
  X,
  Trophy,
} from 'lucide-react';
import {
  AppSettings,
  AppStats,
  KaboomCommand,
  KaboomGridDimension,
  KaboomLogEntry,
  KaboomTile,
} from '../../types';
import {
  KABOOM_GRID_CONFIGS,
  getRandomCommand,
} from './kaboomCommands';
import { KaboomBoardSelection } from './KaboomBoardSelection';
import { KaboomBall } from './KaboomBall';
import { KaboomExplosionCanvas } from './KaboomExplosionCanvas';
import { SoundEngine, Haptics } from '../../lib/audio';
import { recordKaboomEvent } from '../../lib/db';

interface KaboomGameProps {
  settings: AppSettings;
  onBackToMenu?: () => void;
  onStatsUpdated?: (stats: AppStats) => void;
}

interface KaboomToast {
  id: string;
  type: 'bomb' | 'bonus' | 'info';
  title: string;
  message: string;
}

export const KaboomGame: React.FC<KaboomGameProps> = ({
  settings,
  onBackToMenu,
  onStatsUpdated,
}) => {
  // Game view state: starts directly at 'selection'
  const [currentScreen, setCurrentScreen] = useState<'selection' | 'gameplay'>('selection');
  const [selectedDimension, setSelectedDimension] = useState<KaboomGridDimension>(4);
  // playerCount: 0 represents Unlimited real-life players
  const [playerCount, setPlayerCount] = useState<number>(4);

  // Turn management
  const [activePlayerIndex, setActivePlayerIndex] = useState<number>(0);
  const [isReverseOrder, setIsReverseOrder] = useState<boolean>(false);
  const [activeShieldPlayer, setActiveShieldPlayer] = useState<number | null>(null);
  const [turnCount, setTurnCount] = useState<number>(1);

  // Tiles array
  const [tiles, setTiles] = useState<KaboomTile[]>([]);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [isVictory, setIsVictory] = useState<boolean>(false);
  const [detonatedPlayerIndex, setDetonatedPlayerIndex] = useState<number>(0);

  // Toast notification state (replaces all popup windows, positioned absolutely so board never shifts)
  const [toast, setToast] = useState<KaboomToast | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Explosion visual effect
  const [explosionActive, setExplosionActive] = useState<boolean>(false);
  const [explosionCoords, setExplosionCoords] = useState<{ x: number; y: number } | undefined>(undefined);

  // Action log / Event feed
  const [actionLogs, setActionLogs] = useState<KaboomLogEntry[]>([]);

  // Used command IDs in the current round to avoid duplicates
  const usedCommandIdsRef = useRef<Set<string>>(new Set());

  const isUnlimited = playerCount === 0;

  // Player names generator
  const getPlayerName = useCallback(
    (index: number) => {
      if (isUnlimited) {
        return `Player ${index + 1}`;
      }
      return `Player ${(index % playerCount) + 1}`;
    },
    [isUnlimited, playerCount]
  );

  // Trigger floating toast message
  const showToast = useCallback((type: KaboomToast['type'], title: string, message: string, autoDismissMs: number = 3500) => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }
    const newToast = { id: `${Date.now()}`, type, title, message };
    setToast(newToast);

    if (autoDismissMs > 0) {
      toastTimerRef.current = setTimeout(() => {
        setToast((current) => (current?.id === newToast.id ? null : current));
      }, autoDismissMs);
    }
  }, []);

  // Add an entry to the action log
  const addLog = useCallback(
    (type: KaboomLogEntry['type'], playerIndex: number, text: string) => {
      const entry: KaboomLogEntry = {
        id: `${Date.now()}-${Math.random()}`,
        timestamp: Date.now(),
        type,
        playerIndex,
        playerName: getPlayerName(playerIndex),
        text,
      };
      setActionLogs((prev) => [entry, ...prev.slice(0, 19)]);
    },
    [getPlayerName]
  );

  /**
   * Initializes a single round with exact user-requested bonus probabilities:
   * 2x2: (0 to 1 bonus)
   * 3x3: (0 to 2 bonuses)
   * 4x4: (1 to 3 bonuses)
   * 5x5: (1 to 4 bonuses)
   * 6x6: (2 to 5 bonuses)
   */
  const initializeBoard = useCallback(
    (dimension: KaboomGridDimension) => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      setToast(null);

      const config = KABOOM_GRID_CONFIGS[dimension];
      const totalTiles = dimension * dimension;

      // Random integer between bonusCountMin and bonusCountMax inclusive
      const bonusCount =
        Math.floor(Math.random() * (config.bonusCountMax - config.bonusCountMin + 1)) +
        config.bonusCountMin;

      const bombCount = 1; // Exactly 1 bomb per round
      const safeCount = totalTiles - bombCount - bonusCount;

      // Prepare types array
      const types: Array<'safe' | 'bonus' | 'bomb'> = [];
      for (let i = 0; i < bombCount; i++) types.push('bomb');
      for (let i = 0; i < bonusCount; i++) types.push('bonus');
      for (let i = 0; i < safeCount; i++) types.push('safe');

      // Fisher-Yates Shuffle
      for (let i = types.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [types[i], types[j]] = [types[j], types[i]];
      }

      usedCommandIdsRef.current.clear();

      // Create tiles
      const newTiles: KaboomTile[] = [];
      let tileIndex = 0;

      for (let r = 0; r < dimension; r++) {
        for (let c = 0; c < dimension; c++) {
          const type = types[tileIndex];
          let command: KaboomCommand | undefined = undefined;

          if (type === 'bonus') {
            command = getRandomCommand(usedCommandIdsRef.current);
            usedCommandIdsRef.current.add(command.id);
          }

          newTiles.push({
            id: tileIndex,
            row: r,
            col: c,
            type,
            revealed: false,
            bonusCommand: command,
          });
          tileIndex++;
        }
      }

      setTiles(newTiles);
      setIsGameOver(false);
      setIsVictory(false);
      setExplosionActive(false);
      setActivePlayerIndex(0);
      setIsReverseOrder(false);
      setActiveShieldPlayer(null);
      setTurnCount(1);

      addLog(
        'round_start',
        0,
        `New round started! ${dimension}×${dimension} Grid.`
      );
    },
    [addLog]
  );

  // Clean up timer on unmount
  useEffect(() => {
    return () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  // Start round with selected grid dimension
  const handleSelectGrid = (dimension: KaboomGridDimension) => {
    setSelectedDimension(dimension);
    initializeBoard(dimension);
    setCurrentScreen('gameplay');
  };

  // Turn rotation calculation (handles both custom player counts and unlimited real-life players)
  const advanceToNextPlayer = useCallback(
    (skipCount: number = 1) => {
      setActivePlayerIndex((prev) => {
        if (isUnlimited) {
          const next = prev + (isReverseOrder ? -skipCount : skipCount);
          return Math.max(0, next);
        }
        const step = isReverseOrder ? -skipCount : skipCount;
        let next = (prev + step) % playerCount;
        if (next < 0) next += playerCount;
        return next;
      });
      setTurnCount((prev) => prev + 1);
    },
    [isReverseOrder, playerCount, isUnlimited]
  );

  /**
   * Check victory condition:
   * When only 1 tile remains unrevealed and that tile is the bomb,
   * reveal the last bomb automatically and end the game as VICTORY!
   */
  const checkAndApplyVictory = (currentTiles: KaboomTile[], playerIndex: number): boolean => {
    const unrevealed = currentTiles.filter((t) => !t.revealed);
    if (unrevealed.length === 1 && unrevealed[0].type === 'bomb') {
      const lastBomb = unrevealed[0];
      const victoryTiles = currentTiles.map((t) =>
        t.id === lastBomb.id
          ? { ...t, revealed: true, isDefused: true, isDetonated: false }
          : t
      );
      setTiles(victoryTiles);
      setIsGameOver(true);
      setIsVictory(true);
      SoundEngine.playBonusFanfare();
      Haptics.buttonClick();

      // Record round victory in persistent statistics
      recordKaboomEvent({ type: 'victory' }).then((updatedStats) => {
        if (onStatsUpdated) onStatsUpdated(updatedStats);
      });

      addLog(
        'safe',
        playerIndex,
        `🏆 VICTORY! All safe balls cleared! The bomb was successfully defused!`
      );

      showToast(
        'bonus',
        '🏆 VICTORY! BOARD CLEARED!',
        'All safe balls found without detonating! The bomb was defused!',
        0 // Stays visible until Next Round is clicked
      );
      return true;
    }
    return false;
  };

  // Handle tile tap outcome
  const handleTileTap = (tile: KaboomTile, event: React.MouseEvent | React.TouchEvent) => {
    if (tile.revealed || isGameOver) return;

    // Get click coords for explosion canvas if bomb
    const clientX = 'clientX' in event ? event.clientX : (event.touches[0]?.clientX || window.innerWidth / 2);
    const clientY = 'clientY' in event ? event.clientY : (event.touches[0]?.clientY || window.innerHeight / 2);

    const currentPlayer = activePlayerIndex;
    const playerName = getPlayerName(currentPlayer);

    // ========================================================================
    // OUTCOME 1: BOMB (KABOOM! - GAME OVER LOSS FOR THIS ROUND)
    // ========================================================================
    if (tile.type === 'bomb') {
      // Check if player has Immunity Shield
      if (activeShieldPlayer === currentPlayer) {
        // Shield saves the player!
        SoundEngine.playSafePop();
        setActiveShieldPlayer(null);
        showToast(
          'info',
          '🛡️ SHIELD SAVED YOU!',
          `${playerName}'s Immunity Shield absorbed the blast! Bomb defused!`
        );
        addLog(
          'safe',
          currentPlayer,
          `🛡️ ${playerName}'s IMMUNITY SHIELD absorbed the blast!`
        );
        // Mark tile safe
        const nextTiles = tiles.map((t) =>
          t.id === tile.id ? { ...t, revealed: true, type: 'safe' as const } : t
        );
        setTiles(nextTiles);

        // Check if this was the last non-bomb
        if (!checkAndApplyVictory(nextTiles, currentPlayer)) {
          advanceToNextPlayer();
        }
        return;
      }

      // Detonation! Game Over for this round.
      SoundEngine.playBombExplosion();
      setDetonatedPlayerIndex(currentPlayer);
      setExplosionCoords({ x: clientX, y: clientY });
      setExplosionActive(true);
      setIsGameOver(true);
      setIsVictory(false);

      // Record bomb hit in persistent statistics
      recordKaboomEvent({ type: 'bomb_hit' }).then((updatedStats) => {
        if (onStatsUpdated) onStatsUpdated(updatedStats);
      });

      // Reveal bomb and all tiles on the board
      setTiles((prev) =>
        prev.map((t) =>
          t.id === tile.id
            ? { ...t, revealed: true, isDetonated: true }
            : { ...t, revealed: true }
        )
      );

      addLog('bomb', currentPlayer, `💥 KABOOM! ${playerName} tapped the bomb!`);

      // Pop up toast message and enable next round button (No pop up modal window!)
      showToast(
        'bomb',
        '💥 KABOOM! ROUND OVER!',
        `${playerName} tapped the bomb! Tap Next Round to play again.`,
        0 // Stays visible until Next Round is clicked
      );
      return;
    }

    // ========================================================================
    // OUTCOME 2: COMMAND BONUS (NO MODAL - TOAST ONLY)
    // ========================================================================
    if (tile.type === 'bonus') {
      SoundEngine.playBonusFanfare();

      // Record bonus collected in persistent statistics
      recordKaboomEvent({ type: 'bonus' }).then((updatedStats) => {
        if (onStatsUpdated) onStatsUpdated(updatedStats);
      });

      const command = tile.bonusCommand || getRandomCommand();

      // Apply instant bonus mechanics if tactical
      if (command.id === 'uno_reverse') {
        setIsReverseOrder((prev) => !prev);
      } else if (command.id === 'immunity_shield') {
        setActiveShieldPlayer(currentPlayer);
      }

      // Prepare updated tiles
      let updatedTiles = tiles.map((t) =>
        t.id === tile.id
          ? { ...t, revealed: true, revealedByPlayerIndex: currentPlayer }
          : t
      );

      // Radar / safe double reveal logic
      if (command.id === 'bomb_radar' || command.id === 'safe_reveal_double') {
        const count = command.id === 'safe_reveal_double' ? 2 : 1;
        const unrevealedSafe = updatedTiles.filter((t) => !t.revealed && t.id !== tile.id && t.type === 'safe');
        if (unrevealedSafe.length > 0) {
          const toReveal = unrevealedSafe.slice(0, count);
          updatedTiles = updatedTiles.map((t) =>
            toReveal.some((r) => r.id === t.id)
              ? { ...t, revealed: true, revealedByPlayerIndex: currentPlayer }
              : t
          );
        }
      }

      setTiles(updatedTiles);

      // Check if this bonus tap leaves only the bomb remaining -> VICTORY!
      if (checkAndApplyVictory(updatedTiles, currentPlayer)) {
        return;
      }

      // Pop up toast message without blocking window
      showToast(
        'bonus',
        `⭐ ${command.title} (${playerName})`,
        command.description,
        4500
      );

      addLog('bonus', currentPlayer, `⭐ ${playerName} found BONUS: ${command.title}!`);

      if (command.id === 'skip_turn') {
        advanceToNextPlayer(2); // Skip next player
      } else {
        advanceToNextPlayer();
      }
      return;
    }

    // ========================================================================
    // OUTCOME 3: SAFE BALL
    // ========================================================================
    SoundEngine.playSafePop();

    const updatedTiles = tiles.map((t) =>
      t.id === tile.id
        ? { ...t, revealed: true, revealedByPlayerIndex: currentPlayer }
        : t
    );
    setTiles(updatedTiles);

    // Check if only the bomb remains unrevealed -> AUTOMATIC VICTORY!
    if (checkAndApplyVictory(updatedTiles, currentPlayer)) {
      return;
    }

    addLog('safe', currentPlayer, `${playerName} tapped a Safe Ball.`);
    advanceToNextPlayer();
  };

  // Start a new round directly
  const handleNextRound = () => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    initializeBoard(selectedDimension);
  };

  // Grid style class based on dimension
  const getGridColsClass = () => {
    switch (selectedDimension) {
      case 2:
        return 'grid-cols-2 gap-5 sm:gap-6';
      case 3:
        return 'grid-cols-3 gap-3.5 sm:gap-4';
      case 4:
        return 'grid-cols-4 gap-2.5 sm:gap-3';
      case 5:
        return 'grid-cols-5 gap-2 sm:gap-2.5';
      case 6:
        return 'grid-cols-6 gap-1.5 sm:gap-2';
      default:
        return 'grid-cols-4 gap-2.5';
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* ========================================================================== */}
      {/* VIEW 1: BOARD SELECTION SCREEN (Kept mounted in DOM for instant cache)     */}
      {/* ========================================================================== */}
      <div className={`w-full h-full ${currentScreen === 'selection' ? 'block' : 'hidden'}`}>
        <KaboomBoardSelection
          onSelectGrid={handleSelectGrid}
          onBackToHub={onBackToMenu}
        />
      </div>

      {/* ========================================================================== */}
      {/* VIEW 2: ONE-ROUND GAMEPLAY SCREEN                                          */}
      {/* ========================================================================== */}
      <div
        id="kaboom-game-container"
        className={`w-full h-full flex flex-col justify-between overflow-hidden px-4 pt-16 pb-4 select-none ${
          currentScreen === 'gameplay' ? 'flex' : 'hidden'
        } ${explosionActive ? 'animate-screen-shake' : ''}`}
      >
        {/* Red / Orange Explosion Flash Screen Overlay */}
        {explosionActive && (
          <div className="fixed inset-0 bg-red-600/30 z-40 pointer-events-none animate-explosion-flash" />
        )}

        {/* 60FPS Explosion Particle & Shockwave Canvas */}
        <KaboomExplosionCanvas
          active={explosionActive}
          originX={explosionCoords?.x}
          originY={explosionCoords?.y}
          onComplete={() => setExplosionActive(false)}
        />

      {/* Top Header / Navigation Bar */}
      <div className="w-full max-w-md mx-auto shrink-0 mb-1">
        <div className="flex items-center justify-between gap-2 mb-2">
          {/* Back to Board Selection */}
          <button
            id="kaboom-back-to-selection-button"
            type="button"
            onClick={() => {
              SoundEngine.playButtonClick();
              Haptics.buttonClick();
              setCurrentScreen('selection');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/40 backdrop-blur-md border border-purple-400/40 text-purple-200 text-xs font-bold hover:border-purple-300 active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.2)]"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Select Board</span>
          </button>

          {/* Quick Reshuffle Button */}
          <button
            id="kaboom-restart-round-button"
            type="button"
            onClick={handleNextRound}
            title="Start new round"
            className="w-8 h-8 rounded-xl bg-black/40 backdrop-blur-md border border-orange-500/40 text-orange-300 flex items-center justify-center hover:border-orange-400 active:scale-95 transition-all cursor-pointer shadow-[0_0_10px_rgba(249,115,22,0.3)]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>

        {/* Turn Status Card */}
        <div className="bg-black/50 backdrop-blur-md rounded-2xl border border-purple-400/30 p-3 shadow-[0_0_25px_rgba(168,85,247,0.15)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className={`w-11 h-11 rounded-xl p-0.5 shadow-md ${
                  isVictory
                    ? 'bg-gradient-to-tr from-emerald-400 to-amber-400 shadow-[0_0_15px_rgba(16,185,129,0.7)]'
                    : 'bg-gradient-to-tr from-orange-500 via-amber-400 to-red-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]'
                }`}
              >
                <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center">
                  {isVictory ? (
                    <Trophy className="w-6 h-6 text-amber-300" />
                  ) : (
                    <span className="font-header text-base text-amber-300">
                      P{isUnlimited ? activePlayerIndex + 1 : (activePlayerIndex % playerCount) + 1}
                    </span>
                  )}
                </div>
              </div>
              {activeShieldPlayer === activePlayerIndex && !isGameOver && (
                <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border border-white flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.8)]">
                  <Shield className="w-3 h-3 text-white" />
                </div>
              )}
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-header text-lg tracking-wide text-white">
                  {isGameOver
                    ? isVictory
                      ? '🏆 VICTORY!'
                      : 'Round Finished'
                    : `${getPlayerName(activePlayerIndex)}'s Turn`}
                </span>
                {isReverseOrder && !isGameOver && (
                  <span className="font-header text-[9px] font-bold bg-purple-500/30 text-purple-300 border border-purple-400/40 px-1.5 py-0.2 rounded-full">
                    REVERSED
                  </span>
                )}
              </div>
              <div className="font-subbody text-[11px] text-gray-400">
                {isGameOver
                  ? isVictory
                    ? 'All safe balls cleared! Bomb was defused.'
                    : 'Bomb detonated! Start next round below.'
                  : `Turn #${turnCount} • Tap any ball`}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="font-subbody text-[10px] uppercase font-bold text-gray-400 tracking-wider">
              {selectedDimension}×{selectedDimension} Grid
            </div>
            <div className="font-header text-xs text-amber-300">
              {isGameOver
                ? 'Complete'
                : `${tiles.filter((t) => !t.revealed).length} Left`}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Toast Notification: Positioned ABSOLUTE so it NEVER shifts the board grid */}
      <div className="absolute top-20 left-0 right-0 px-4 flex justify-center z-50 pointer-events-none">
        {toast && (
          <div
            onClick={() => setToast(null)}
            className={`pointer-events-auto w-full max-w-md cursor-pointer rounded-2xl p-3 border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-3 animate-bounce-in ${
              toast.type === 'bomb'
                ? 'bg-gradient-to-r from-red-950/95 via-orange-950/95 to-slate-950/95 border-red-500/80 shadow-[0_0_25px_rgba(239,68,68,0.6)]'
                : toast.type === 'bonus'
                ? 'bg-gradient-to-r from-amber-950/95 via-purple-950/95 to-slate-950/95 border-amber-400/80 shadow-[0_0_25px_rgba(245,158,11,0.5)]'
                : 'bg-black/90 border-cyan-500/60 shadow-[0_0_20px_rgba(6,182,212,0.4)]'
            }`}
          >
            <div className="flex-1">
              <div
                className={`text-xs font-black uppercase tracking-wider ${
                  toast.type === 'bomb'
                    ? 'text-red-300'
                    : toast.type === 'bonus'
                    ? 'text-amber-300'
                    : 'text-cyan-300'
                }`}
              >
                {toast.title}
              </div>
              <div className="text-xs text-white font-medium mt-0.5 leading-snug">
                {toast.message}
              </div>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setToast(null);
              }}
              className="text-gray-400 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Center: Tactile 3D Ball Grid - LOCKED IN PLACE */}
      <div className="flex-1 flex items-center justify-center w-full max-w-md mx-auto my-auto min-h-[320px]">
        <div
          id="kaboom-grid-board"
          className={`grid ${getGridColsClass()} p-4 sm:p-5 rounded-3xl bg-slate-950/60 backdrop-blur-lg border border-purple-500/30 shadow-[0_0_40px_rgba(168,85,247,0.2)] justify-items-center items-center transition-none`}
        >
          {tiles.map((tile) => (
            <KaboomBall
              key={tile.id}
              tile={tile}
              dimension={selectedDimension}
              disabled={isGameOver}
              onTap={handleTileTap}
              isGameOver={isGameOver}
            />
          ))}
        </div>
      </div>

      {/* Bottom: Next Round Button (Enabled when ball tapped / game over) */}
      <div className="w-full max-w-md mx-auto shrink-0 mt-1">
        <button
          id="kaboom-next-round-button"
          type="button"
          onClick={handleNextRound}
          disabled={!isGameOver}
          className={`w-full py-3.5 px-6 rounded-2xl font-header tracking-wider text-base transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
            isGameOver
              ? isVictory
                ? 'bg-gradient-to-r from-emerald-500 via-amber-400 to-teal-400 text-slate-950 shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:brightness-110 active:scale-95 animate-pulse'
                : 'bg-gradient-to-r from-orange-500 via-amber-400 to-orange-500 text-slate-950 shadow-[0_0_25px_rgba(249,115,22,0.7)] hover:brightness-110 active:scale-95 animate-pulse'
              : 'bg-white/5 border border-white/10 text-gray-400 opacity-60 cursor-not-allowed'
          }`}
        >
          <RotateCcw className="w-5 h-5 stroke-[2.5]" />
          <span>
            {isGameOver
              ? isVictory
                ? 'VICTORY! START NEXT ROUND'
                : 'START NEXT ROUND'
              : 'ROUND IN PROGRESS'}
          </span>
        </button>
      </div>
    </div>
    </div>
  );
};
