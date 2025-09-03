import Stone from '@/lib/go-kit/core/model/stone';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { GameResultProvider } from '@/lib/go-kit/game/gameResultProvider';

class QuickCaptureGameResultProvider implements GameResultProvider {
  private goal: number;

  constructor(goal: number) {
    this.goal = goal;
  }

  async provideResult(game: Game): Promise<GameResult> {
    if (game.capturedByBlack >= this.goal) {
      return { type: 'Resignation', winner: Stone.BLACK };
    }
    if (game.capturedByWhite >= this.goal) {
      return { type: 'Resignation', winner: Stone.WHITE };
    }
    return { type: 'Ongoing' };
  }
}

export default QuickCaptureGameResultProvider;
