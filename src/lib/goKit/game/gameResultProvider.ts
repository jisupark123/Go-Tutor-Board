import type Game from '@/lib/goKit/game/game';
import type { GameResult } from '@/lib/goKit/game/gameResult';

export interface GameResultProvider {
  provideResult(game: Game): Promise<GameResult>;
}
