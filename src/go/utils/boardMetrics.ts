import Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Stone from '@/lib/go-kit/core/model/stone';

import type { BoardDimension } from '@/go/types/boardDimension';

export default class BoardMetrics {
  static readonly lineWidth = 1;

  static starPointsMap: Record<BoardDimension, Coordinate[]> = {
    5: [new Coordinate(2, 2)],
    7: [new Coordinate(3, 3)],
    9: [new Coordinate(4, 4)],
    11: [new Coordinate(5, 5), new Coordinate(3, 3), new Coordinate(3, 8), new Coordinate(8, 3), new Coordinate(8, 8)],
    13: [new Coordinate(6, 6), new Coordinate(3, 3), new Coordinate(3, 9), new Coordinate(9, 3), new Coordinate(9, 9)],
    19: [
      new Coordinate(3, 3),
      new Coordinate(9, 3),
      new Coordinate(15, 3),
      new Coordinate(3, 9),
      new Coordinate(9, 9),
      new Coordinate(15, 9),
      new Coordinate(3, 15),
      new Coordinate(9, 15),
      new Coordinate(15, 15),
    ],
  };

  // 보드 끝 여백 계산
  static endMargin(boardSize: number, dimension: number): number {
    return boardSize * (1 / dimension) * 0.7;
  }

  // 두 줄 사이 간격
  static lineGap(boardSize: number, dimension: number): number {
    return (
      (boardSize - 2 * BoardMetrics.endMargin(boardSize, dimension) - dimension * BoardMetrics.lineWidth) /
      (dimension - 1)
    );
  }

  // 바둑돌 사이즈
  static stoneSize(boardSize: number, dimension: number): number {
    // const ratio = 0.92;
    const ratio = 1;
    const lineGap = BoardMetrics.lineGap(boardSize, dimension);
    return lineGap * ratio;
  }

  // 화점 사이즈
  static starPointSize(boardSize: number, dimension: number): number {
    const ratio = 0.28;
    const lineGap = BoardMetrics.lineGap(boardSize, dimension);
    return lineGap * ratio;
  }

  // 마지막 수 표시 마크 사이즈
  static currentMoveMarkSize(boardSize: number, dimension: number, stone: Stone): number {
    const blackRatio = 0.38;
    const whiteRatio = 0.4;
    const stoneSize = BoardMetrics.stoneSize(boardSize, dimension);
    return stone === 'BLACK' ? stoneSize * blackRatio : stoneSize * whiteRatio;
  }

  // 바둑판 좌표 -> Canvas 좌표 변환
  static toCanvasCoordinate(boardSize: number, dimension: number, coordinate: Coordinate): [number, number] {
    const { y, x } = coordinate;
    const lineGap = BoardMetrics.lineGap(boardSize, dimension);
    const endMargin = BoardMetrics.endMargin(boardSize, dimension);
    return [endMargin + y * (lineGap + BoardMetrics.lineWidth), endMargin + x * (lineGap + BoardMetrics.lineWidth)];
  }

  // Canvas 좌표 -> 바둑판 좌표 변환
  static toBoardCoordinate(canvasY: number, canvasX: number, boardSize: number, dimension: number): [number, number] {
    const margin = BoardMetrics.endMargin(boardSize, dimension);
    const gap = BoardMetrics.lineGap(boardSize, dimension);
    const clamp = (val: number, min: number, max: number) => Math.min(Math.max(val, min), max);
    const y = Math.round(clamp(canvasY - margin, 0, boardSize - 2 * margin) / (gap + BoardMetrics.lineWidth));
    const x = Math.round(clamp(canvasX - margin, 0, boardSize - 2 * margin) / (gap + BoardMetrics.lineWidth));
    return [y, x];
  }

  /** 주어진 dimension에 해당하는 화점 좌표 반환 */
  static starPoints(dimension: BoardDimension): Coordinate[] {
    return BoardMetrics.starPointsMap[dimension] ?? [];
  }
}
