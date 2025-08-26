import { useState, useCallback } from 'react';

import type Board from '@/lib/goKit/core/model/board';
import type Coordinate from '@/lib/goKit/core/model/coordinate';
import type Game from '@/lib/goKit/game/game';
import type { GameResult } from '@/lib/goKit/game/gameResult';
import type { GameState } from '@/lib/goKit/game/gameState';

export function useGame(game: Game) {
  const [state, setState] = useState<GameState>(game.state);

  const playMove = useCallback(
    (coordinate: Coordinate): Board | null => {
      const success = game.playMove(coordinate);
      if (success) {
        setState(game.state); // Game 내부 상태 반영
        return game.state.currentBoard;
      }
      return null;
    },
    [game],
  );

  const checkResult = useCallback(async (): Promise<GameResult> => {
    const result = await game.checkResult();
    return result;
  }, [game]);

  return {
    gameState: state,
    playMove,
    checkResult,
  };
}
