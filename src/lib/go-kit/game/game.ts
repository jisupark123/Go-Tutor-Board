import type { DataObject } from '@/lib/core-ts/dataObject';
import type Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone, { oppositeStone } from '@/lib/go-kit/core/model/stone';
import type { MoveProcessor } from '@/lib/go-kit/core/rule/moveProcessor';
import type { SequenceHistory } from '@/lib/go-kit/history/sequenceHistory';

type GameProps = {
  sequenceHistory: SequenceHistory;
  moveProcessor: MoveProcessor;
  initialTurn: Stone;
  komi: number;
  capturedByBlack: number;
  capturedByWhite: number;
};

class Game implements DataObject<Game, GameProps> {
  private readonly sequenceHistory: SequenceHistory;
  private readonly moveProcessor: MoveProcessor;
  readonly initialTurn: Stone;
  readonly komi: number;
  readonly capturedByBlack: number;
  readonly capturedByWhite: number;

  constructor(
    sequenceHistory: SequenceHistory,
    moveProcessor: MoveProcessor,
    initialTurn: Stone = Stone.BLACK,
    komi: number = 6.5,
    capturedByBlack: number = 0,
    capturedByWhite: number = 0,
  ) {
    this.sequenceHistory = sequenceHistory;
    this.moveProcessor = moveProcessor;
    this.initialTurn = initialTurn;
    this.komi = komi;
    this.capturedByBlack = capturedByBlack;
    this.capturedByWhite = capturedByWhite;
  }

  get dimension(): number {
    return this.sequenceHistory.currentBoard.dimension;
  }

  get boardHistory(): Board[] {
    return [...this.sequenceHistory.boardHistory];
  }

  get moveHistory(): Move[] {
    return [...this.sequenceHistory.moveHistory];
  }

  get initialBoard(): Board {
    return this.sequenceHistory.initialBoard;
  }

  get currentBoard(): Board {
    return this.sequenceHistory.currentBoard;
  }

  get currentMove(): Move | null {
    return this.sequenceHistory.currentMove;
  }

  get currentTurn(): Stone {
    return this.sequenceHistory.currentMove ? oppositeStone(this.sequenceHistory.currentMove.stone) : this.initialTurn;
  }

  playMove(coordinate: Coordinate): Game | null {
    const { y, x } = coordinate;
    const move = new Move(y, x, this.currentTurn);
    const oldBoard = this.sequenceHistory.currentBoard;

    // 착수 유효성 검사 및 보드 업데이트
    const newBoard = this.moveProcessor.validateMoveAndUpdate(oldBoard, move, this.sequenceHistory.boardHistory);
    if (!newBoard) return null;

    const newHistory = this.sequenceHistory.record(newBoard, move);
    const capturedStones = this.calculateCapturedStones(oldBoard, newBoard, this.currentTurn);

    return this.copy({
      sequenceHistory: newHistory,
      capturedByBlack: this.capturedByBlack + capturedStones[0],
      capturedByWhite: this.capturedByWhite + capturedStones[1],
    });
  }

  // 한수쉼
  passTurn(): Game {
    const newHistory = this.sequenceHistory.record(this.sequenceHistory.currentBoard, Move.PASS);
    return this.copy({ sequenceHistory: newHistory });
  }

  // return [capturedByBlack, capturedByWhite]
  calculateCapturedStones(oldBoard: Board, newBoard: Board, turn: Stone): [number, number] {
    switch (turn) {
      case Stone.BLACK: {
        // 흑의 턴일 때, 백이 잡힌 돌이 있는지 확인
        const whiteCountOld = oldBoard.countStones(Stone.WHITE);
        const whiteCountNew = newBoard.countStones(Stone.WHITE);
        const capturedByBlack = whiteCountOld - whiteCountNew;
        return [capturedByBlack, 0];
      }
      case Stone.WHITE: {
        // 백의 턴일 때, 흑이 잡힌 돌이 있는지 확인
        const blackCountOld = oldBoard.countStones(Stone.BLACK);
        const blackCountNew = newBoard.countStones(Stone.BLACK);
        const capturedByWhite = blackCountOld - blackCountNew;
        return [0, capturedByWhite];
      }
      default:
        throw new Error(`Unexpected turn: ${turn}`);
    }
  }

  hashCode(): number {
    return 0; // TODO: Implement a proper hash code calculation
  }

  equals(_other: unknown): boolean {
    return false; // TODO: Implement proper equality check
  }

  copy(props?: Partial<GameProps> | undefined): Game {
    return new Game(
      props?.sequenceHistory ?? this.sequenceHistory,
      props?.moveProcessor ?? this.moveProcessor,
      props?.initialTurn ?? this.initialTurn,
      props?.komi ?? this.komi,
      props?.capturedByBlack ?? this.capturedByBlack,
      props?.capturedByWhite ?? this.capturedByWhite,
    );
  }

  toString(): string {
    return `Game {
        sequenceHistory: ${this.sequenceHistory},
        moveProcessor: ${this.moveProcessor},
        initialTurn: ${this.initialTurn},
        komi: ${this.komi},
        capturedByBlack: ${this.capturedByBlack},
        capturedByWhite: ${this.capturedByWhite},
      }`;
  }
}

export default Game;
