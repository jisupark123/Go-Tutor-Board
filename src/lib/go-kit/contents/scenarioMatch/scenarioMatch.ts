import type { MoveProvider } from '@/lib/go-kit/ai/moveProvider';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Stone from '@/lib/go-kit/core/model/stone';
import type { MoveProcessor } from '@/lib/go-kit/core/rule/moveProcessor';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { PlayerResultState } from '@/lib/go-kit/game/playerResultState';
import type GameResultCheckerChain from '@/lib/go-kit/gameResultChecker/gameResultCheckerChain';

class ScenarioMatch {
  private readonly moveProcessor: MoveProcessor;
  private readonly aiMoveProvider: MoveProvider;
  private readonly resultCheckerChain: GameResultCheckerChain;

  constructor(moveProcessor: MoveProcessor, aiMoveProvider: MoveProvider, resultCheckerChain: GameResultCheckerChain) {
    this.moveProcessor = moveProcessor;
    this.aiMoveProvider = aiMoveProvider;
    this.resultCheckerChain = resultCheckerChain;
  }

  playPlayerMove(game: Game, coordinate: Coordinate): Game | null {
    return game.playMove(coordinate, this.moveProcessor);
  }

  async playAIMove(game: Game): Promise<Game | null> {
    const aiMove = await this.aiMoveProvider.provideMove(game);
    return this.playPlayerMove(game, aiMove);
  }

  async checkResult(game: Game): Promise<GameResult> {
    return this.resultCheckerChain.check(game);
  }

  toPlayerResultState(gameResult: GameResult, player: Stone): PlayerResultState {
    switch (gameResult.type) {
      case 'Ongoing':
        return { isSuccess: false, isFailure: false, isOngoing: true };

      case 'Draw':
        return { isSuccess: false, isFailure: true, isOngoing: false };

      case 'Resignation':
      case 'PointsWin':
        return gameResult.winner === player
          ? { isSuccess: true, isFailure: false, isOngoing: false }
          : { isSuccess: false, isFailure: true, isOngoing: false };
    }
  }
}

export default ScenarioMatch;
