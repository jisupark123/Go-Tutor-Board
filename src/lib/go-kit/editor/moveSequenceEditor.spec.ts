import { describe, it, expect, beforeEach } from 'vitest';

import Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';
import BasicMoveValidator from '@/lib/go-kit/core/rule/basicMoveValidator';
import type { MoveProcessor } from '@/lib/go-kit/core/rule/moveProcessor';
import RuleBasedMoveProcessor from '@/lib/go-kit/core/rule/ruleBasedMoveProcessor';
import StandardMoveUpdater from '@/lib/go-kit/core/rule/standardMoveUpdater';
import MoveSequenceEditor from '@/lib/go-kit/editor/moveSequenceEditor';
import BasicSequenceHistory from '@/lib/go-kit/history/basicSequenceHistory';
import type { SequenceHistory } from '@/lib/go-kit/history/sequenceHistory';

describe('MoveSequenceEditor', () => {
  let initBoard: Board;
  let sequenceHistory: SequenceHistory;
  let moveProcessor: MoveProcessor;
  let editor: MoveSequenceEditor;

  beforeEach(() => {
    initBoard = new Board(5);
    sequenceHistory = new BasicSequenceHistory(initBoard);
    moveProcessor = new RuleBasedMoveProcessor([new BasicMoveValidator()], new StandardMoveUpdater());
    editor = new MoveSequenceEditor(sequenceHistory, moveProcessor);
  });

  it('initialization sets up correctly', () => {
    expect(editor.currentBoard).toEqual(initBoard);
    expect(editor.currentMove).toBeNull();
    expect(editor.currentTurn).toEqual(Stone.BLACK);
  });

  // validateAndPlaceMove는 현재 차례에 맞게 착수하고 값들을 올바르게 업데이트한다.
  it('validateAndPlaceMove places move and updates states correctly', () => {
    const newEditor = editor.validateAndPlaceMove(new Coordinate(0, 0));

    expect(newEditor).not.toBeNull();
    expect(newEditor?.currentTurn).toEqual(Stone.WHITE); // 다음 차례는 WHITE
    expect(newEditor?.currentMove).toEqual(new Move(0, 0, Stone.BLACK)); // currentMove 업데이트됨
    expect(newEditor?.currentBoard).toEqual(initBoard.setMove(new Move(0, 0, Stone.BLACK))); // 보드 업데이트됨
  });

  // validateAndPlaceMove는 착수가 바둑판 범위를 벗어나면 에러를 발생시킨다.
  it('validateAndPlaceMove throws IllegalArgumentException for out of bounds move', () => {
    expect(() => editor.validateAndPlaceMove(new Coordinate(-1, 0))).toThrow();
    expect(() => editor.validateAndPlaceMove(new Coordinate(0, -1))).toThrow();
    expect(() => editor.validateAndPlaceMove(new Coordinate(5, 0))).toThrow();
    expect(() => editor.validateAndPlaceMove(new Coordinate(0, 5))).toThrow();
  });

  // validateAndPlaceMove는 이미 돌이 있는 곳에 착수하려고 하면 null을 반환한다.
  it('validateAndPlaceMove returns null for invalid move', () => {
    let newEditor = editor.validateAndPlaceMove(new Coordinate(0, 0)); // 첫 착수
    expect(newEditor).not.toBeNull(); // 첫 착수는 유효

    newEditor = newEditor!.validateAndPlaceMove(new Coordinate(0, 0)); // 같은 곳에 착수 시도
    expect(newEditor).toBeNull(); // 두 번째 착수는 null 반환
  });
});
