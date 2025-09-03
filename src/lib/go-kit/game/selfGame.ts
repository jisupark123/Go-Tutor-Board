// import type Board from '@/lib/go-kit/core/model/board';
// import type Coordinate from '@/lib/go-kit/core/model/coordinate';
// import Move from '@/lib/go-kit/core/model/move';
// import Stone from '@/lib/go-kit/core/model/stone';
// import type { MoveProcessor } from '@/lib/go-kit/core/rule/moveProcessor';
// import type { GameResult } from '@/lib/go-kit/game/gameResult';
// import type { GameResultProvider } from '@/lib/go-kit/game/gameResultProvider';
// import type { GameState } from '@/lib/go-kit/game/gameState';
// import type { SequenceHistory } from '@/lib/go-kit/history/sequenceHistory';

// class SelfGame {
//   private sequenceHistory: SequenceHistory;
//   private moveProcessor: MoveProcessor;
//   private resultProviders: GameResultProvider[];
//   private player: Stone;
//   capturedByBlack: number;
//   capturedByWhite: number;
//   komi: number;

//   constructor(
//     sequenceHistory: SequenceHistory,
//     moveProcessor: MoveProcessor,
//     resultProviders: GameResultProvider[],
//     player: Stone = Stone.BLACK,
//     komi: number = 6.5,
//     capturedByBlack: number = 0,
//     capturedByWhite: number = 0,
//   ) {
//     this.sequenceHistory = sequenceHistory;
//     this.moveProcessor = moveProcessor;
//     this.resultProviders = resultProviders;
//     this.player = player;
//     this.komi = komi;
//     this.capturedByBlack = capturedByBlack;
//     this.capturedByWhite = capturedByWhite;
//   }

//   get state(): GameState {
//     return {
//       dimension: this.sequenceHistory.currentBoard.dimension,
//       boardHistory: this.sequenceHistory.boardHistory,
//       moveHistory: this.sequenceHistory.moveHistory,
//       currentBoard: this.sequenceHistory.currentBoard,
//       currentMove: this.sequenceHistory.currentMove,
//       currentTurn: this.player,
//       komi: this.komi,
//       capturedByBlack: this.capturedByBlack,
//       capturedByWhite: this.capturedByWhite,
//     };
//   }

//   playMove(coordinate: Coordinate): boolean {
//     const { y, x } = coordinate;
//     const turn = this.player;
//     const move = new Move(y, x, turn);
//     const oldBoard = this.sequenceHistory.currentBoard;

//     // 착수 유효성 검사 및 보드 업데이트
//     const newBoard = this.moveProcessor.validateMoveAndUpdate(oldBoard, move, this.sequenceHistory.boardHistory);
//     if (!newBoard) return false;

//     this.sequenceHistory.record(newBoard, move);

//     // 사석 업데이트
//     this.updateCapturedStones(oldBoard, newBoard, turn);

//     return true;
//   }

//   private updateCapturedStones(oldBoard: Board, newBoard: Board, turn: Stone): void {
//     switch (turn) {
//       case Stone.BLACK: {
//         const whiteCountOld = oldBoard.countStones(Stone.WHITE);
//         const whiteCountNew = newBoard.countStones(Stone.WHITE);
//         const whiteCapturedThisMove = whiteCountOld - whiteCountNew;
//         this.capturedByBlack += whiteCapturedThisMove;
//         break;
//       }
//       case Stone.WHITE: {
//         const blackCountOld = oldBoard.countStones(Stone.BLACK);
//         const blackCountNew = newBoard.countStones(Stone.BLACK);
//         const blackCapturedThisMove = blackCountOld - blackCountNew;
//         this.capturedByWhite += blackCapturedThisMove;
//         break;
//       }
//       default:
//         throw new Error(`Unexpected turn: ${turn}`);
//     }
//   }

//   async checkResult(): Promise<GameResult> {
//     for (const provider of this.resultProviders) {
//       const result = await provider.provideResult(this.state);
//       if (result.type !== 'Ongoing') {
//         return result;
//       }
//     }
//     return { type: 'Ongoing' };
//   }
// }

// export default SelfGame;
