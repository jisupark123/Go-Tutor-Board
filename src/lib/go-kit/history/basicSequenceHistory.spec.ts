import { describe, it, expect, beforeEach } from 'vitest';

import Board from '@/lib/go-kit/core/model/board';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';
import type { MoveUpdater } from '@/lib/go-kit/core/rule/moveUpdater';
import StandardMoveUpdater from '@/lib/go-kit/core/rule/standardMoveUpdater';
import BasicSequenceHistory from '@/lib/go-kit/history/basicSequenceHistory';

describe('BasicSequenceHistory', () => {
  let initBoard: Board;
  let history: BasicSequenceHistory;
  const updater: MoveUpdater = new StandardMoveUpdater();

  beforeEach(() => {
    initBoard = new Board(5);
    history = new BasicSequenceHistory(initBoard);
  });

  it('initial state is correct', () => {
    expect(history.currentMove).toBeNull();
    expect(history.currentBoard).toEqual(initBoard);
  });

  it('record updates currentMove and currentBoard', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    const newHistory = history.record(newBoard, newMove);

    expect(newHistory.currentMove).toEqual(newMove);
    expect(newHistory.currentBoard).toEqual(newBoard);
  });

  it('record clears redo history', () => {
    const newMove1 = new Move(0, 0, Stone.BLACK);
    const newBoard1 = updater.placeMove(initBoard, newMove1);
    const newHistory1 = history.record(newBoard1, newMove1).undo(1);

    const newMove2 = new Move(1, 1, Stone.WHITE);
    const newBoard2 = updater.placeMove(newBoard1, newMove2);
    const newHistory2 = newHistory1.record(newBoard2, newMove2);

    expect(newHistory2.canRedo(1)).toBe(false);
  });

  it('record does not cause side effects', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    history.record(newBoard, newMove);

    // 새로운 수를 기록한 후에도 이전 히스토리는 변경되지 않음
    expect(history.currentMove).toBeNull();
    expect(history.currentBoard).toEqual(initBoard);
  });

  it('undo reverts to previous state', () => {
    const newMove1 = new Move(0, 0, Stone.BLACK);
    const newMove2 = new Move(1, 1, Stone.WHITE);
    const newBoard1 = updater.placeMove(initBoard, newMove1);
    const newBoard2 = updater.placeMove(newBoard1, newMove2);

    let newHistory = history.record(newBoard1, newMove1).record(newBoard2, newMove2);
    newHistory = newHistory.undo(1);

    expect(newHistory.currentMove).toEqual(newMove1);
    expect(newHistory.currentBoard).toEqual(newBoard1);

    newHistory = newHistory.undo(1);
    expect(newHistory.currentMove).toBeNull();
    expect(newHistory.currentBoard).toEqual(initBoard);
  });

  it('undo stops at the first available state', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    let newHistory = history.record(newBoard, newMove);
    newHistory = newHistory.undo(10); // 10단계 되돌리기
    expect(newHistory.currentMove).toBeNull();
    expect(newHistory.currentBoard).toEqual(initBoard);
    expect(newHistory.canUndo(1)).toBe(false);
  });

  it('redo advances to next state', () => {
    const newMove1 = new Move(0, 0, Stone.BLACK);
    const newMove2 = new Move(1, 1, Stone.WHITE);
    const newBoard1 = updater.placeMove(initBoard, newMove1);
    const newBoard2 = updater.placeMove(newBoard1, newMove2);

    let newHistory = history.record(newBoard1, newMove1).record(newBoard2, newMove2);

    newHistory = newHistory.undo(1);
    newHistory = newHistory.redo(1);
    expect(newHistory.currentMove).toEqual(newMove2);
    expect(newHistory.currentBoard).toEqual(newBoard2);

    newHistory = newHistory.undo(2);
    newHistory = newHistory.redo(2);
    expect(newHistory.currentMove).toEqual(newMove2);
    expect(newHistory.currentBoard).toEqual(newBoard2);
  });

  it('redo stops at the last available state', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    const historyAfterMove = history.record(newBoard, newMove);

    // 1. 새 수를 둔 상태에서 redo(10) → 마지막 상태 그대로
    expect(historyAfterMove).toEqual(historyAfterMove.redo(10));

    // 2. undo로 초기 상태로 간 후 redo(10) → 다시 마지막 상태까지 진행
    const historyAfterUndo = historyAfterMove.undo(1);
    expect(historyAfterMove).toEqual(historyAfterUndo.redo(10));
  });

  it('canUndo checks if steps can be undone', () => {
    expect(history.canUndo(0)).toBe(true);
    expect(history.canUndo(1)).toBe(false);

    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    const newHistory = history.record(newBoard, newMove);

    expect(newHistory.canUndo(1)).toBe(true);
    expect(newHistory.canUndo(2)).toBe(false);
  });

  it('canRedo checks if steps can be redone', () => {
    expect(history.canRedo(1)).toBe(false);

    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    let newHistory = history.record(newBoard, newMove);

    newHistory = newHistory.undo(1); // 초기 상태로 되돌리기
    expect(newHistory.canRedo(1)).toBe(true); // 1단계 다음으로 이동 가능
    expect(newHistory.canRedo(2)).toBe(false); // 2단계 다음으로 이동 불가능
  });
});
