import type Move from '@/lib/goKit/core/model/move';
import type { GameState } from '@/lib/goKit/game/gameState';

export interface MoveProvider {
  nextMove(gameState: GameState): Promise<Move>;
}
