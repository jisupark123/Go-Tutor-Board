import type { GameAnalysisContext } from '@/lib/go-kit/ai/gameAnalysisContext';
import Stone from '@/lib/go-kit/core/model/stone';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { GameResultChecker } from '@/lib/go-kit/gameResultChecker/gameResultChecker';

class MinMovesChecker implements GameResultChecker {
  private readonly minMoves: number;

  constructor(minMoves: number) {
    this.minMoves = minMoves;
  }

  async check(game: Game, _context: GameAnalysisContext): Promise<GameResult | null> {
    const totalMoves = game.currentBoard.countStones(Stone.BLACK) + game.currentBoard.countStones(Stone.WHITE);
    const initialMoves = game.initialBoard.countStones(Stone.BLACK) + game.initialBoard.countStones(Stone.WHITE);

    if (totalMoves - initialMoves < this.minMoves) {
      return { type: 'Ongoing' };
    }
    return null;
  }
}

export default MinMovesChecker;
