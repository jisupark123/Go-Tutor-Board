import Stone from '@/lib/go-kit/core/model/stone';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { GameResultProvider } from '@/lib/go-kit/game/gameResultProvider';

class SelfCaptureModeResultProvider implements GameResultProvider {
  private player: Stone;
  private goal: number;

  constructor(player: Stone, goal: number) {
    this.player = player;
    this.goal = goal;
  }

  async provideResult(game: Game): Promise<GameResult> {
    switch (this.player) {
      case Stone.BLACK:
        return game.capturedByBlack >= this.goal ? { type: 'Resignation', winner: Stone.BLACK } : { type: 'Ongoing' };

      case Stone.WHITE:
        return game.capturedByWhite >= this.goal ? { type: 'Resignation', winner: Stone.WHITE } : { type: 'Ongoing' };

      case Stone.EMPTY:
      default:
        throw new Error('Invalid player: EMPTY');
    }
  }
}

export default SelfCaptureModeResultProvider;
