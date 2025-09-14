import type { GameAnalysisResult } from '@/lib/go-kit/ai/gameAnalysisResult';
import type Game from '@/lib/go-kit/game/game';

export interface GameAnalysisProvider {
  analyze(game: Game): Promise<GameAnalysisResult>;
}
