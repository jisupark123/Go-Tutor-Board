import type { GameAnalysisContext } from '@/lib/go-kit/ai/gameAnalysisContext';
import type { GameAnalysisProvider } from '@/lib/go-kit/ai/gameAnalysisProvider';
import Stone from '@/lib/go-kit/core/model/stone';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { GameResultChecker } from '@/lib/go-kit/gameResultChecker/gameResultChecker';

class ResignationChecker implements GameResultChecker {
  private readonly analysisProvider: GameAnalysisProvider;
  private readonly threshold: number = 0.99;

  constructor(analysisProvider: GameAnalysisProvider) {
    this.analysisProvider = analysisProvider;
  }

  async check(game: Game, context: GameAnalysisContext): Promise<GameResult | null> {
    const { currentMove } = game;
    if (!currentMove) throw new Error('Game has not started yet.');

    const analysis = context.analysis ?? (await this.analysisProvider.analyze(game));
    context.analysis = analysis;

    // 마지막으로 흑이 두었고, 흑의 승률이 threshold 이상이면 흑 불계승
    if (currentMove.stone === Stone.BLACK && analysis.winrate > this.threshold) {
      return { type: 'Resignation', winner: Stone.BLACK };
    }

    // 마지막으로 백이 두었고, 백의 승률이 threshold 이상이면 백 불계승
    if (currentMove.stone === Stone.WHITE && analysis.winrate < 1 - this.threshold) {
      return { type: 'Resignation', winner: Stone.WHITE };
    }

    return null;
  }
}

export default ResignationChecker;
