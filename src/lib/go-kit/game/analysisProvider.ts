import type Game from '@/lib/go-kit/game/game';

type AnalysisResult = {
  winrate: number;
};

export interface AnalysisProvider {
  analyze(game: Game): Promise<AnalysisResult>;
}
