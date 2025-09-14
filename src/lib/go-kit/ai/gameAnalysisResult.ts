import type Move from '@/lib/go-kit/core/model/move';

export type GameAnalysisResult = {
  winrate: number;
  scoreLead: number;
  recommendedMove: Move;
  isGameFinished: boolean;
};
