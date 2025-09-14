import type { GameAnalysisContext } from '@/lib/go-kit/ai/gameAnalysisContext';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';

export interface GameResultChecker {
  check(game: Game, context: GameAnalysisContext): Promise<GameResult | null>;
}
