import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Stone from '@/lib/go-kit/core/model/stone';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { GameResultProvider } from '@/lib/go-kit/game/gameResultProvider';

class AIGameMaster {
  readonly game: Game;
  private readonly resultProviders: GameResultProvider[];

  constructor(game: Game, resultProviders: GameResultProvider[]) {
    this.game = game;
    this.resultProviders = resultProviders;
  }

  get player(): Stone {
    return this.game.initialTurn;
  }

  async playMove(coordinate: Coordinate): Promise<[GameResult, Game | null]> {
    const newGame = this.game.playMove(coordinate);
    if (!newGame) return Promise.resolve([{ type: 'InvalidMove' }, null]);
    const result = await this.checkResult(newGame);
    return Promise.resolve([result, newGame]);
  }

  async checkResult(game: Game): Promise<GameResult> {
    for (const provider of this.resultProviders) {
      const result = await provider.provideResult(game);
      if (result.type !== 'Ongoing') {
        return result;
      }
    }
    return { type: 'Ongoing' };
  }
}
