import type { GameAnalysisContext } from '@/lib/go-kit/ai/gameAnalysisContext';
import Stone from '@/lib/go-kit/core/model/stone';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { GameResultChecker } from '@/lib/go-kit/gameResultChecker/gameResultChecker';

class CapturedStoneChecker implements GameResultChecker {
  private goal: number;

  constructor(goal: number) {
    this.goal = goal;
  }

  async check(game: Game, _context: GameAnalysisContext): Promise<GameResult | null> {
    if (game.capturedByBlack >= this.goal) {
      return { type: 'Resignation', winner: Stone.BLACK };
    }
    if (game.capturedByWhite >= this.goal) {
      return { type: 'Resignation', winner: Stone.WHITE };
    }
    return null;
  }
}

export default CapturedStoneChecker;
