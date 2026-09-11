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
  KaboomBonusItem,
  KaboomCommand,
  KaboomGridDimension,
  KaboomLogEntry,
  KaboomTile,
} from '../../types';
import {
  KABOOM_GRID_CONFIGS,
  getRandomCommand,
} from './kaboomCommands';
import { getRandomBonusItem, getMaxBonusTierForDimension } from './kaboomBonusConfig';
import { KaboomFlyingStars, FlyingStarBatch } from './KaboomFlyingStars';
import { KaboomBoardSelection } from './KaboomBoardSelection';
import { KaboomBall } from './KaboomBall';
import { KaboomExplosionCanvas } from './KaboomExplosionCanvas';
import { SoundEngine, Haptics } from '../../lib/audio';
import { recordKaboomEvent } from '../../lib/db';
import { addStars, EconomyState, recordStarEarringsCondition } from '../../lib/economy';

interface KaboomGameProps {
  settings: AppSettings;
  onBackToMenu?: () => void;
  onStatsUpdated?: (stats: AppStats) => void;
  onEconomyUpdated?: (economy: EconomyState) => void;
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
  onEconomyUpdated,
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

  // Flying star currency particles for bonus discoveries
  const [flyingStarBatches, setFlyingStarBatches] = useState<FlyingStarBatch[]>([]);

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

  // Hyper-speed bonus discovery screen flash & flicker
  const [bonusFlickerActive, setBonusFlickerActive] = useState<boolean>(false);

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
          let bonusItem: KaboomBonusItem | undefined = undefined;

          if (type === 'bonus') {
            const maxTier = getMaxBonusTierForDimension(dimension);
            bonusItem = getRandomBonusItem(maxTier);
            command = getRandomCommand(usedCommandIdsRef.current);
            usedCommandIdsRef.current.add(command.id);
          }

          newTiles.push({
            id: tileIndex,
            row: r,
            col: c,
            type,
            revealed: false,
            bonusItem,
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

      // Award stars for Bomb Game Victory!
      const victoryStars = Math.max(20, selectedDimension * 10);
      const nextEco = addStars(victoryStars);
      if (onEconomyUpdated) onEconomyUpdated(nextEco);

      const hudEl = document.getElementById('star-currency-hud');
      const hudRect = hudEl?.getBoundingClientRect();
      const endX = hudRect ? hudRect.left + hudRect.width / 2 : window.innerWidth / 2;
      const endY = hudRect ? hudRect.top + hudRect.height / 2 : 28;

      setFlyingStarBatches((prev) => [
        ...prev,
        {
          id: `batch-victory-${Date.now()}`,
          startX: window.innerWidth / 2,
          startY: window.innerHeight / 2,
          endX,
          endY,
          amount: victoryStars,
        },
      ]);

      // Update Star Earrings condition: Bomb Game Victory
      const { updatedState: updatedEconomy, newlyUnlocked: earringsUnlocked } =
        recordStarEarringsCondition('bombVictory');
      if (onEconomyUpdated) onEconomyUpdated(updatedEconomy);

      addLog(
        'safe',
        playerIndex,
        earringsUnlocked
          ? `🏆 Bomb avoided till the game end! Victory! (+${victoryStars}★) ⭐ Star Earrings Unlocked!`
          : `🏆 Bomb avoided till the game end! Victory! (+${victoryStars}★)`
      );

      showToast(
        'bonus',
        '🏆 VICTORY!',
        earringsUnlocked
          ? `Bomb avoided till the game end and Victory! (+${victoryStars}★) ⭐ Star Earrings Unlocked!`
          : `Bomb avoided till the game end and Victory! (+${victoryStars}★)`,
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
          '🛡️ DEFUSED',
          'Immunity Shield absorbed the blast! Bomb defused!',
          3000
        );
        addLog(
          'safe',
          currentPlayer,
          `🛡️ Immunity Shield absorbed the blast! Bomb defused!`
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

      addLog('bomb', currentPlayer, `💥 Bomb was tapped!`);

      // Pop up toast message: no player order number
      showToast(
        'bomb',
        '💥 BOMB TAPPED',
        'The bomb was tapped! Round over.',
        0 // Stays visible until Next Round is clicked
      );
      return;
    }

    // ========================================================================
    // OUTCOME 2: BONUS SPRITE DISCOVERY (FLYING STARS TO HUD + BEEP, NO MODAL)
    // ========================================================================
    if (tile.type === 'bonus') {
      SoundEngine.playBonusFanfare();

      // Trigger subtle bonus discovery indicator
      setBonusFlickerActive(true);
      setTimeout(() => setBonusFlickerActive(false), 600);

      const maxTier = getMaxBonusTierForDimension(selectedDimension);
      const bonusItem = tile.bonusItem || getRandomBonusItem(maxTier);
      const command = tile.bonusCommand || getRandomCommand();

      // Calculate tile position to fly stars smoothly to #star-currency-hud
      const tileEl = document.getElementById(`kaboom-tile-${tile.id}`);
      const tileRect = tileEl?.getBoundingClientRect();
      const hudEl = document.getElementById('star-currency-hud');
      const hudRect = hudEl?.getBoundingClientRect();

      const startX = tileRect ? tileRect.left + tileRect.width / 2 : window.innerWidth / 2;
      const startY = tileRect ? tileRect.top + tileRect.height / 2 : window.innerHeight / 2;
      const endX = hudRect ? hudRect.left + hudRect.width / 2 : window.innerWidth / 2;
      const endY = hudRect ? hudRect.top + hudRect.height / 2 : 28;

      setFlyingStarBatches((prev) => [
        ...prev,
        {
          id: `batch-${Date.now()}-${Math.random()}`,
          startX,
          startY,
          endX,
          endY,
          amount: bonusItem.starReward,
        },
      ]);

      // Record bonus collected in persistent statistics
      recordKaboomEvent({ type: 'bonus' }).then((updatedStats) => {
        if (onStatsUpdated) onStatsUpdated(updatedStats);
      });

      // Apply instant bonus mechanics if tactical
      if (command.id === 'uno_reverse') {
        setIsReverseOrder((prev) => !prev);
      } else if (command.id === 'immunity_shield') {
        setActiveShieldPlayer(currentPlayer);
      }

      // Prepare updated tiles with this bonus tile revealed
      let updatedTiles = tiles.map((t) =>
        t.id === tile.id
          ? { ...t, revealed: true, revealedByPlayerIndex: currentPlayer }
          : t
      );

      // Bonus Discovered Skill:
      // Lowest bonus tier (rank 1) = tap 1 ball, highest bonus tier (rank 5) = tap 5 balls
      const ballsToTap = Math.max(1, Math.min(5, bonusItem.rank));
      const unrevealedSafe = updatedTiles.filter(
        (t) => !t.revealed && t.id !== tile.id && t.type === 'safe'
      );
      const toReveal = unrevealedSafe.slice(0, ballsToTap);
      const tappedCount = toReveal.length;

      if (tappedCount > 0) {
        updatedTiles = updatedTiles.map((t) =>
          toReveal.some((r) => r.id === t.id)
            ? { ...t, revealed: true, revealedByPlayerIndex: currentPlayer }
            : t
        );
      }

      setTiles(updatedTiles);

      addLog(
        'bonus',
        currentPlayer,
        `⭐ Discovered ${bonusItem.name}! ${tappedCount} ball${tappedCount === 1 ? '' : 's'} tapped by bonus (+${bonusItem.starReward}★)!`
      );

      showToast(
        'bonus',
        `✨ BONUS DISCOVERED`,
        `${tappedCount} ball${tappedCount === 1 ? '' : 's'} tapped by discovered bonus (+${bonusItem.starReward}★)!`,
        3000
      );

      // Check if this bonus tap leaves only the bomb remaining -> AUTOMATIC VICTORY!
      if (checkAndApplyVictory(updatedTiles, currentPlayer)) {
        return;
      }

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

    addLog('safe', currentPlayer, `Safe ball tapped.`);
    advanceToNextPlayer();
  };

  // Called when flying stars reach the currency HUD and trigger the beep
  const handleBatchComplete = useCallback(
    (batchId: string, amount: number) => {
      const updatedEconomy = addStars(amount);
      if (onEconomyUpdated) {
        onEconomyUpdated(updatedEconomy);
      }
      setFlyingStarBatches((prev) => prev.filter((b) => b.id !== batchId));
    },
    [onEconomyUpdated]
  );

  // Start a new round directly
  const handleNextRound = () => {
    SoundEngine.playButtonClick();
    Haptics.buttonClick();
    initializeBoard(selectedDimension);
  };

  // Board container size & proportion based on dimension:
  // "The board size proportion: 2x2 is slightly smaller than 3x3, 3x3 slightly smaller than 4x4, and so on."
  // Tiles are enlarged to almost fit the horizontal phone screen!
  const getBoardContainerClass = () => {
    switch (selectedDimension) {
      case 2:
        return 'w-[78%] max-w-[290px] sm:max-w-[325px] p-3 sm:p-4';
      case 3:
        return 'w-[86%] max-w-[340px] sm:max-w-[380px] p-2.5 sm:p-3.5';
      case 4:
        return 'w-[93%] max-w-[385px] sm:max-w-[430px] p-2 sm:p-3';
      case 5:
        return 'w-[97%] max-w-[415px] sm:max-w-[465px] p-1.5 sm:p-2.5';
      case 6:
        return 'w-full max-w-[440px] sm:max-w-[495px] p-1 sm:p-2';
      default:
        return 'w-[93%] max-w-[385px] p-2';
    }
  };

  // Grid style class based on dimension
  const getGridColsClass = () => {
    switch (selectedDimension) {
      case 2:
        return 'grid-cols-2 gap-3.5 sm:gap-4';
      case 3:
        return 'grid-cols-3 gap-2.5 sm:gap-3';
      case 4:
        return 'grid-cols-4 gap-2 sm:gap-2.5';
      case 5:
        return 'grid-cols-5 gap-1.5 sm:gap-2';
      case 6:
        return 'grid-cols-6 gap-1 sm:gap-1.5';
      default:
        return 'grid-cols-4 gap-2';
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
        className={`w-full h-full flex flex-col justify-between overflow-hidden px-2.5 sm:px-4 pt-[max(5.75rem,calc(env(safe-area-inset-top)+4.25rem))] pb-[max(1.25rem,calc(env(safe-area-inset-bottom)+0.75rem))] select-none ${
          currentScreen === 'gameplay' ? 'flex' : 'hidden'
        } ${explosionActive ? 'animate-screen-shake' : ''}`}
      >
        {/* Red / Orange Explosion Flash Screen Overlay */}
        {explosionActive && (
          <div className="fixed inset-0 bg-red-600/30 z-40 pointer-events-none animate-explosion-flash" />
        )}

        {/* Bonus Discovery Screen Overlay (Very gentle, non-blinding) */}
        {bonusFlickerActive && (
          <div className="fixed inset-0 bg-amber-400/[0.04] z-40 pointer-events-none transition-opacity duration-300" />
        )}

        {/* 60FPS Explosion Particle & Shockwave Canvas */}
        <KaboomExplosionCanvas
          active={explosionActive}
          originX={explosionCoords?.x}
          originY={explosionCoords?.y}
          onComplete={() => setExplosionActive(false)}
        />

      {/* Top Header / Navigation Bar - Fixed height container */}
      <div className="w-full max-w-md mx-auto shrink-0 mb-2 relative z-30">
        <div className="flex items-center justify-between gap-2 h-10">
          {/* Back to Board Selection */}
          <button
            id="kaboom-back-to-selection-button"
            type="button"
            onClick={() => {
              SoundEngine.playButtonClick();
              Haptics.buttonClick();
              setCurrentScreen('selection');
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-purple-400/40 text-purple-200 text-xs font-bold hover:border-purple-300 active:scale-95 transition-all cursor-pointer shadow-[0_0_12px_rgba(168,85,247,0.25)]"
          >
            <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
            <span>Select Board</span>
          </button>

          {/* Quick Reshuffle Button */}
          <button
            id="kaboom-restart-round-button"
            type="button"
            onClick={handleNextRound}
            title="Restart round"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-orange-500/40 text-orange-300 text-xs font-bold hover:border-orange-400 active:scale-95 transition-all cursor-pointer shadow-[0_0_10px_rgba(249,115,22,0.25)]"
          >
            <RotateCcw className="w-3.5 h-3.5 stroke-[2.2]" />
            <span>Restart</span>
          </button>
        </div>

        {/* Toast Notification: Floating absolutely directly below buttons row
            - absolute top-11: floats below the buttons without overlapping "Select Board" or "Restart"
            - 0px layout footprint: the board below NEVER shifts when toast appears or disappears!
        */}
        <div className="absolute top-11 left-0 right-0 pointer-events-none flex justify-center z-40">
          {toast && (
            <div className="w-full pointer-events-auto animate-bounce-in">
              <div
                onClick={() => setToast(null)}
                className={`w-full cursor-pointer rounded-xl p-2.5 border shadow-2xl backdrop-blur-xl flex items-start justify-between gap-2.5 ${
                  toast.type === 'bomb'
                    ? 'bg-gradient-to-r from-red-950/95 via-orange-950/95 to-slate-950/95 border-red-500/80 shadow-[0_0_20px_rgba(239,68,68,0.6)]'
                    : toast.type === 'bonus'
                    ? 'bg-gradient-to-r from-amber-950/95 via-purple-950/95 to-slate-950/95 border-amber-400/80 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                    : 'bg-black/90 border-cyan-500/60 shadow-[0_0_18px_rgba(6,182,212,0.4)]'
                }`}
              >
                <div className="flex-1 min-w-0">
                  <div
                    className={`text-[11px] font-black uppercase tracking-wider ${
                      toast.type === 'bomb'
                        ? 'text-red-300'
                        : toast.type === 'bonus'
                        ? 'text-amber-300'
                        : 'text-cyan-300'
                    }`}
                  >
                    {toast.title}
                  </div>
                  <div className="text-xs text-white/90 font-medium mt-0.5 leading-snug">
                    {toast.message}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setToast(null);
                  }}
                  className="text-gray-400 hover:text-white p-1 cursor-pointer shrink-0"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Tactile Cyber Neon Grid Board - LOCKED IN PLACE */}
      <div className="flex-1 flex items-center justify-center w-full max-w-lg mx-auto my-auto py-1">
        <div
          id="kaboom-grid-board"
          className={`grid ${getGridColsClass()} ${getBoardContainerClass()} rounded-2xl sm:rounded-3xl bg-[#03010a]/85 backdrop-blur-xl border border-purple-500/30 shadow-[0_0_45px_rgba(168,85,247,0.22)] justify-items-center items-center transition-all duration-300`}
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

      {/* Flying Star Currency Particles toward HUD */}
      <KaboomFlyingStars
        batches={flyingStarBatches}
        onBatchComplete={handleBatchComplete}
      />
    </div>
    </div>
  );
};
