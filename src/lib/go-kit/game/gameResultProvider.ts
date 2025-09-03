import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';

export interface GameResultProvider {
  provideResult(game: Game): Promise<GameResult>;
}
