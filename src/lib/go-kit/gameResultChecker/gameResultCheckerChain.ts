import type { GameAnalysisContext } from '@/lib/go-kit/ai/gameAnalysisContext';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { GameResultChecker } from '@/lib/go-kit/gameResultChecker/gameResultChecker';

class GameResultCheckerChain {
  private readonly checkers: GameResultChecker[];

  constructor(checkers: GameResultChecker[]) {
    this.checkers = checkers;
  }

  async check(game: Game): Promise<GameResult> {
    const context: GameAnalysisContext = {};
    for (const checker of this.checkers) {
      const result = await checker.check(game, context);
      if (result) {
        return result;
      }
    }
    return { type: 'Ongoing' };
  }
}

export default GameResultCheckerChain;
