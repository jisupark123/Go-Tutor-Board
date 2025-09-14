import type { GameAnalysisContext } from '@/lib/go-kit/ai/gameAnalysisContext';
import type { GameAnalysisProvider } from '@/lib/go-kit/ai/gameAnalysisProvider';
import type { GameAnalysisResult } from '@/lib/go-kit/ai/gameAnalysisResult';
import Stone from '@/lib/go-kit/core/model/stone';
import type Game from '@/lib/go-kit/game/game';
import type { GameResult } from '@/lib/go-kit/game/gameResult';
import type { GameResultChecker } from '@/lib/go-kit/gameResultChecker/gameResultChecker';

class FinishedBoardChecker implements GameResultChecker {
  private readonly analysisProvider: GameAnalysisProvider;

  constructor(analysisProvider: GameAnalysisProvider) {
    this.analysisProvider = analysisProvider;
  }

  async check(game: Game, context: GameAnalysisContext): Promise<GameResult | null> {
    const analysis = context.analysis ?? (await this.analysisProvider.analyze(game));
    context.analysis = analysis;

    if (analysis.isGameFinished) {
      if (this.isDraw(analysis)) {
        return { type: 'Draw' };
      }
      const isHalfPointKomi = game.komi % 1 !== 0; // 덤이 0.5, 1.5, ... 인 경우
      return {
        type: 'PointsWin',
        winner: analysis.winrate > 0.5 ? Stone.BLACK : Stone.WHITE,
        points: Math.max(Math.abs(analysis.scoreLead), isHalfPointKomi ? 0.5 : 1.0), // 최소 집 차이는 0.5 or 1.0
      };
    }
    return null;
  }

  private isDraw(analysis: GameAnalysisResult): boolean {
    const winrateThreshold = 0.05; // 승률이 45% ~ 55% 사이면
    const scoreThreshold = 0.3; // 집 차이가 0.3집 이내면
    return Math.abs(analysis.winrate - 0.5) < winrateThreshold && Math.abs(analysis.scoreLead) < scoreThreshold;
  }
}

export default FinishedBoardChecker;
