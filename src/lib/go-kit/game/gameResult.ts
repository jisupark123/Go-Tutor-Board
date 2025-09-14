import type Stone from '@/lib/go-kit/core/model/stone';

export type GameResult =
  | { type: 'Ongoing' } // 진행 중
  | { type: 'Draw' } // 무승부
  | { type: 'Resignation'; winner: Stone } // 불계승(기권승)
  | { type: 'PointsWin'; winner: Stone; points: number }; // oo집승
