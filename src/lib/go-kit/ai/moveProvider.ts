import type Move from '@/lib/go-kit/core/model/move';
import type Game from '@/lib/go-kit/game/game';

export interface MoveProvider {
  provideMove(game: Game): Promise<Move>;
}
