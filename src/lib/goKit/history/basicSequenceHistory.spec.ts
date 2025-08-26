import { describe, it, expect, beforeEach } from 'vitest';

import Board from '@/lib/goKit/core/model/board';
import Move from '@/lib/goKit/core/model/move';
import Stone from '@/lib/goKit/core/model/stone';
import type { MoveUpdater } from '@/lib/goKit/core/rule/moveUpdater';
import StandardMoveUpdater from '@/lib/goKit/core/rule/standardMoveUpdater';
import BasicSequenceHistory from '@/lib/goKit/history/basicSequenceHistory';

describe('BasicSequenceHistory', () => {
  const initBoard = new Board(5);
  let history: BasicSequenceHistory;
  const updater: MoveUpdater = new StandardMoveUpdater();

  beforeEach(() => {
    history = new BasicSequenceHistory(initBoard);
  });

  it('initial state is correct', () => {
    expect(history.currentMove).toBeNull();
    expect(history.currentBoard).toEqual(initBoard);
  });

  it('record updates currentMove and currentBoard', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    history.record(newBoard, newMove);

    expect(history.currentMove).toEqual(newMove);
    expect(history.currentBoard).toEqual(newBoard);
  });

  it('record clears redo history', () => {
    const newMove1 = new Move(0, 0, Stone.BLACK);
    const newBoard1 = updater.placeMove(initBoard, newMove1);
    history.record(newBoard1, newMove1);
    history.undo(1);

    const newMove2 = new Move(1, 1, Stone.WHITE);
    const newBoard2 = updater.placeMove(newBoard1, newMove2);
    history.record(newBoard2, newMove2);

    expect(history.canRedo(1)).toBe(false);
  });

  it('undo reverts to previous state', () => {
    const newMove1 = new Move(0, 0, Stone.BLACK);
    const newMove2 = new Move(1, 1, Stone.WHITE);
    const newBoard1 = updater.placeMove(initBoard, newMove1);
    const newBoard2 = updater.placeMove(newBoard1, newMove2);

    history.record(newBoard1, newMove1);
    history.record(newBoard2, newMove2);

    expect(history.currentMove).toEqual(newMove2);
    expect(history.currentBoard).toEqual(newBoard2);

    history.undo(1);
    expect(history.currentMove).toEqual(newMove1);
    expect(history.currentBoard).toEqual(newBoard1);

    history.undo(1);
    expect(history.currentMove).toBeNull();
    expect(history.currentBoard).toEqual(initBoard);
  });

  it('undo does not exceed initial state and returns actual steps', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    history.record(newBoard, newMove);

    const actualSteps = history.undo(10);
    expect(actualSteps).toBe(1);
    expect(history.currentMove).toBeNull();
    expect(history.currentBoard).toEqual(initBoard);
    expect(history.canUndo(1)).toBe(false);
  });

  it('redo advances to next state', () => {
    const newMove1 = new Move(0, 0, Stone.BLACK);
    const newMove2 = new Move(1, 1, Stone.WHITE);
    const newBoard1 = updater.placeMove(initBoard, newMove1);
    const newBoard2 = updater.placeMove(newBoard1, newMove2);

    history.record(newBoard1, newMove1);
    history.record(newBoard2, newMove2);

    history.undo(1);
    history.redo(1);
    expect(history.currentMove).toEqual(newMove2);
    expect(history.currentBoard).toEqual(newBoard2);

    history.undo(2);
    history.redo(2);
    expect(history.currentMove).toEqual(newMove2);
    expect(history.currentBoard).toEqual(newBoard2);
  });

  it('redo does not exceed last state and returns actual steps', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    history.record(newBoard, newMove);

    const actualSteps1 = history.redo(10);
    expect(actualSteps1).toBe(0);

    history.undo(1);
    const actualSteps2 = history.redo(10);
    expect(actualSteps2).toBe(1);
    expect(history.currentMove).toEqual(newMove);
    expect(history.currentBoard).toEqual(newBoard);
    expect(history.canRedo(1)).toBe(false);
  });

  it('canUndo checks if steps can be undone', () => {
    expect(history.canUndo(0)).toBe(true);
    expect(history.canUndo(1)).toBe(false);

    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    history.record(newBoard, newMove);

    expect(history.canUndo(1)).toBe(true);
    expect(history.canUndo(2)).toBe(false);
  });

  it('canRedo checks if steps can be redone', () => {
    expect(history.canRedo(1)).toBe(false);

    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    history.record(newBoard, newMove);

    history.undo(1);
    expect(history.canRedo(1)).toBe(true);
    expect(history.canRedo(2)).toBe(false);
  });

  it('reset returns to initial state', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newBoard = updater.placeMove(initBoard, newMove);
    history.record(newBoard, newMove);

    expect(history.currentMove).not.toBeNull();
    expect(history.currentBoard).not.toEqual(initBoard);

    history.reset(initBoard);
    expect(history.currentMove).toBeNull();
    expect(history.currentBoard).toEqual(initBoard);
    expect(history.canUndo(1)).toBe(false);
    expect(history.canRedo(1)).toBe(false);
  });
});
