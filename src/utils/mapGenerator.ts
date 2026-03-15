import { basicBoardValidator, Board, BoardRuleHelper, Coordinate, Move, Stone } from '@dodagames/go';

type IntRange = [number, number];

export default class MapGenerator {
  private getConfigs(dimension: number): { randomSelectionRate: number; stoneRange: IntRange; balanceRange: IntRange } {
    const configsByDimension: Record<
      number,
      { randomSelectionRate: number; stoneRange: IntRange; balanceRange: IntRange }
    > = {
      5: { randomSelectionRate: 0.5, stoneRange: [12, 15], balanceRange: [-1, 1] },
      7: { randomSelectionRate: 0.5, stoneRange: [24, 29], balanceRange: [-2, 2] },
      9: { randomSelectionRate: 0.4, stoneRange: [40, 48], balanceRange: [-3, 3] },
      11: { randomSelectionRate: 0.3, stoneRange: [60, 72], balanceRange: [-4, 4] },
      13: { randomSelectionRate: 0.3, stoneRange: [84, 101], balanceRange: [-5, 5] },
      15: { randomSelectionRate: 0.2, stoneRange: [112, 135], balanceRange: [-6, 6] },
      17: { randomSelectionRate: 0.2, stoneRange: [144, 173], balanceRange: [-7, 7] },
      19: { randomSelectionRate: 0.1, stoneRange: [180, 216], balanceRange: [-8, 8] },
    };
    return configsByDimension[dimension];
  }

  generateMap(dimension: number): Board {
    if (dimension <= 0) {
      throw new Error('Dimension must be greater than 0');
    }

    while (true) {
      const board = this.generate(dimension);
      if (basicBoardValidator.isValidBoard(board)) {
        return board;
      }
    }
  }

  private generate(dimension: number): Board {
    const { randomSelectionRate, stoneRange, balanceRange } = this.getConfigs(dimension);
    // 전체 돌 개수 (균등분포)
    const totalStones = Math.floor(Math.random() * (stoneRange[1] - stoneRange[0] + 1)) + stoneRange[0];

    // 흑/백 비율 조정
    let remainBlack =
      Math.floor(totalStones / 2) +
      Math.floor(Math.random() * (balanceRange[1] - balanceRange[0] + 1)) +
      balanceRange[0];
    let remainWhite = totalStones - remainBlack;

    let board = new Board(dimension);
    const neighbors = new Set<Coordinate>();

    while (remainBlack > 0 || remainWhite > 0) {
      const selectedCoord = this.chooseCoordinate(board, neighbors, randomSelectionRate);
      if (!selectedCoord) break;

      const [stone, newBlack, newWhite] = this.selectRandomStone(remainBlack, remainWhite);
      board = board.setMove(new Move(selectedCoord.y, selectedCoord.x, stone));
      remainBlack = newBlack;
      remainWhite = newWhite;

      // 인접 좌표 추가 (빈 칸만)
      Array.from(BoardRuleHelper.adjacentCoordinates(board, selectedCoord))
        .filter((c) => board.get(c.y, c.x) === Stone.EMPTY)
        .forEach((c) => neighbors.add(c));
    }

    return board;
  }

  private selectRandomStone(remainBlack: number, remainWhite: number): [Stone, number, number] {
    if (remainBlack <= 0 && remainWhite <= 0) {
      throw new Error('No stones remaining');
    }

    const selectable: Stone[] = [];
    if (remainBlack > 0) selectable.push(Stone.BLACK);
    if (remainWhite > 0) selectable.push(Stone.WHITE);

    const index = Math.floor(Math.random() * selectable.length);
    const selected = selectable[index];

    switch (selected) {
      case Stone.BLACK:
        return [selected, remainBlack - 1, remainWhite];
      case Stone.WHITE:
        return [selected, remainBlack, remainWhite - 1];
      default:
        throw new Error('Should not select EMPTY');
    }
  }

  private chooseRandomCoordinate(board: Board): Coordinate | null {
    const emptyCoords = board.emptyCoordinates();
    if (emptyCoords.size === 0) return null;

    const index = Math.floor(Math.random() * emptyCoords.size);
    return Array.from(emptyCoords)[index];
  }

  private chooseCoordinate(board: Board, neighbors: Set<Coordinate>, epsilon: number): Coordinate | null {
    const useRandom = neighbors.size === 0 || Math.random() < epsilon;

    if (useRandom) {
      return this.chooseRandomCoordinate(board);
    } else {
      const neighborsArray = Array.from(neighbors);
      if (neighborsArray.length === 0) return null;

      const index = Math.floor(Math.random() * neighborsArray.length);
      const coord = neighborsArray[index];

      neighbors.delete(coord);
      return coord;
    }
  }
}
