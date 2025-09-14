import { beforeEach, describe, expect, it } from 'vitest';

import type Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';
import BasicMoveValidator from '@/lib/go-kit/core/rule/basicMoveValidator';
import type { MoveProcessor } from '@/lib/go-kit/core/rule/moveProcessor';
import RuleBasedMoveProcessor from '@/lib/go-kit/core/rule/ruleBasedMoveProcessor';
import StandardMoveUpdater from '@/lib/go-kit/core/rule/standardMoveUpdater';
import Game from '@/lib/go-kit/game/game';
import BasicSequenceHistory from '@/lib/go-kit/history/basicSequenceHistory';
import type { SequenceHistory } from '@/lib/go-kit/history/sequenceHistory';
import BoardUtils from '@/lib/go-kit/utils/boardUtils';

describe('Game', () => {
  const b1 = `
xoxx+
xooxx
+x+oo
xooxx
xoxx+
    `.trim();
  let initBoard: Board;
  let sequenceHistory: SequenceHistory;
  let moveProcessor: MoveProcessor;
  let game: Game;

  beforeEach(() => {
    initBoard = BoardUtils.asciiToBoard(b1);
    sequenceHistory = new BasicSequenceHistory(initBoard);
    moveProcessor = new RuleBasedMoveProcessor([new BasicMoveValidator()], new StandardMoveUpdater());
    game = new Game(sequenceHistory);
  });

  // 초기화가 올바르게 설정되는지 확인
  it('initialization sets up correctly', () => {
    expect(game.currentBoard).toEqual(initBoard);
    expect(game.currentMove).toBeNull();
    expect(game.currentTurn).toBe(Stone.BLACK);
    expect(game.komi).toBe(6.5);
    expect(game.capturedByBlack).toBe(0);
    expect(game.capturedByWhite).toBe(0);
    expect(game.dimension).toBe(5);
  });

  // playMove는 현재 차례에 맞게 착수하고 값들을 올바르게 업데이트한다.
  it('playMove places move and updates states correctly', () => {
    const newGame = game.playMove(new Coordinate(2, 0), moveProcessor);

    expect(newGame).not.toBeNull();
    expect(newGame?.currentTurn).toBe(Stone.WHITE); // 다음 차례는 WHITE
    expect(newGame?.currentBoard).toEqual(game.currentBoard.setMove(new Move(2, 0, Stone.BLACK))); // 보드가 업데이트됨
    expect(newGame?.currentMove).toEqual(new Move(2, 0, Stone.BLACK)); // currentMove가 업데이트됨
  });

  // playMove는 착수가 바둑판 범위를 벗어나면 에러를 발생시킨다.
  it('playMove throws IllegalArgumentException for out of bounds move', () => {
    expect(() => game.playMove(new Coordinate(-1, 0), moveProcessor)).toThrowError();
    expect(() => game.playMove(new Coordinate(0, -1), moveProcessor)).toThrowError();
    expect(() => game.playMove(new Coordinate(5, 0), moveProcessor)).toThrowError();
    expect(() => game.playMove(new Coordinate(0, 5), moveProcessor)).toThrowError();
  });

  // playMove는 이미 돌이 있는 곳에 착수하려고 하면 null을 반환한다.
  it('playMove returns null for invalid move', () => {
    const newGame = game.playMove(new Coordinate(0, 0), moveProcessor); // 이미 돌이 있는 곳에 착수 시도
    expect(newGame).toBeNull(); // null 반환
  });

  // playMove는 잡은 돌의 개수를 올바르게 업데이트한다.
  it('playMove updates captured stones correctly', () => {
    const newGame = game.playMove(new Coordinate(2, 2), moveProcessor); // 흑이 백 돌을 잡는 착수
    expect(newGame?.capturedByBlack).toBe(8); // 흑이 잡은 돌 개수 업데이트
  });
});
