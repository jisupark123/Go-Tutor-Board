import { useCallback, useState } from 'react';

import type ScenarioMatch from '@/lib/go-kit/contents/scenarioMatch/scenarioMatch';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { PlayerResultState } from '@/lib/go-kit/game/playerResultState';

export default function useScenarioMatch(scenarioMatch: ScenarioMatch, initialGame: Game) {
  const [game, setGame] = useState(initialGame);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isError, setIsError] = useState(false);
  const [playerResultState, setPlayerResultState] = useState<PlayerResultState>({
    isSuccess: false,
    isFailure: false,
    isOngoing: true,
  });
  const [gameResult, setGameResult] = useState<GameResult>({ type: 'Ongoing' });

  const player = game.initialTurn;

  // 플레이어가 돌을 놓는 함수
  const playPlayerMove = useCallback(
    (coordinate: Coordinate): Game | null => {
      const newGame = scenarioMatch.playPlayerMove(game, coordinate);
      if (newGame) {
        setGame(newGame);
      }
      return newGame;
    },
    [scenarioMatch, game],
  );

  // AI가 돌을 놓는 함수
  const playAIMove = useCallback(
    async (game: Game): Promise<Game | null> => {
      setIsProcessing(true);
      try {
        const newGame = await scenarioMatch.playAIMove(game);
        if (newGame) {
          setGame(newGame);
          setIsError(false);
          return newGame;
        }
        throw new Error('Invalid AI move');
      } catch (e) {
        console.error('playAIMove:', e);
        setIsError(true);
        return null;
      } finally {
        setIsProcessing(false);
      }
    },
    [scenarioMatch],
  );

  const checkResult = useCallback(
    async (game: Game): Promise<{ gameResult: GameResult } & PlayerResultState> => {
      setIsProcessing(true);
      try {
        const gameResult = await scenarioMatch.checkResult(game);
        const playerResultState = scenarioMatch.toPlayerResultState(gameResult, player);
        setGameResult(gameResult);
        setPlayerResultState(playerResultState);
        setIsError(false);
        return { gameResult, ...playerResultState };
      } catch (e) {
        console.error('checkResult:', e);
        setIsError(true);
        return { gameResult: { type: 'Ongoing' }, isSuccess: false, isFailure: false, isOngoing: true };
      } finally {
        setIsProcessing(false);
      }
    },
    [scenarioMatch, player],
  );

  const reset = useCallback(() => {
    setGame(initialGame);
    setIsProcessing(false);
    setPlayerResultState({ isSuccess: false, isFailure: false, isOngoing: true });
    setGameResult({ type: 'Ongoing' });
    setIsError(false);
  }, [initialGame]);

  return {
    game,
    player,
    isPlayerTurn: game.currentTurn === player,
    isFinished: playerResultState.isSuccess || playerResultState.isFailure,
    isProcessing,
    isError,
    gameResult,
    ...playerResultState,
    playPlayerMove,
    playAIMove,
    checkResult,
    reset,
  };
}
