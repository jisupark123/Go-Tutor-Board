import { useState, useCallback } from 'react';

import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Game from '@/lib/go-kit/game/game';

export function useGame(initialGame: Game) {
  const [game, setGame] = useState(initialGame);

  const playMove = useCallback((currentGame: Game, coordinate: Coordinate): Game | null => {
    const nextGame = currentGame.playMove(coordinate);
    if (nextGame) {
      setGame(nextGame);
      return nextGame;
    }
    return null;
  }, []);

  const passTurn = useCallback((): Game => game.passTurn(), [game]);

  const reset = useCallback(() => {
    setGame(initialGame);
  }, [initialGame]);

  return {
    game,
    playMove,
    passTurn,
    reset,
  };
}
