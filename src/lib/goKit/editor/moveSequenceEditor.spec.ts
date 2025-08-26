import { describe, it, expect } from 'vitest';

import Board from '@/lib/goKit/core/model/board';
import Coordinate from '@/lib/goKit/core/model/coordinate';
import Move from '@/lib/goKit/core/model/move';
import Stone from '@/lib/goKit/core/model/stone';
import BasicMoveValidator from '@/lib/goKit/core/rule/basicMoveValidator';
import type { MoveProcessor } from '@/lib/goKit/core/rule/moveProcessor';
import RuleBasedMoveProcessor from '@/lib/goKit/core/rule/ruleBasedMoveProcessor';
import StandardMoveUpdater from '@/lib/goKit/core/rule/standardMoveUpdater';
import MoveSequenceEditor from '@/lib/goKit/editor/moveSequenceEditor';
import BasicSequenceHistory from '@/lib/goKit/history/basicSequenceHistory';
import type { SequenceHistory } from '@/lib/goKit/history/sequenceHistory';

describe('MoveSequenceEditor', () => {
  const initBoard = new Board(5);
  const sequenceHistory: SequenceHistory = new BasicSequenceHistory(initBoard);
  const moveProcessor: MoveProcessor = new RuleBasedMoveProcessor(
    [new BasicMoveValidator()],
    new StandardMoveUpdater(),
  );

  const editor = new MoveSequenceEditor(sequenceHistory, moveProcessor);

  it('initialization sets up correctly', () => {
    expect(editor.currentBoard).toEqual(initBoard);
    expect(editor.currentMove).toBeNull();
    expect(editor.currentTurn).toEqual(Stone.BLACK);
  });

  it('validateAndPlaceMove places move and updates states correctly', () => {
    const result = editor.validateAndPlaceMove(new Coordinate(0, 0));

    expect(result).toBe(true);
    expect(editor.currentTurn).toEqual(Stone.WHITE);
    expect(editor.currentMove).toEqual(new Move(0, 0, Stone.BLACK));
    expect(editor.currentBoard).toEqual(initBoard.setMove(new Move(0, 0, Stone.BLACK)));
  });

  it('validateAndPlaceMove throws IllegalArgumentException for out of bounds move', () => {
    expect(() => editor.validateAndPlaceMove(new Coordinate(-1, 0))).toThrow();
    expect(() => editor.validateAndPlaceMove(new Coordinate(0, -1))).toThrow();
    expect(() => editor.validateAndPlaceMove(new Coordinate(5, 0))).toThrow();
    expect(() => editor.validateAndPlaceMove(new Coordinate(0, 5))).toThrow();
  });

  it('validateAndPlaceMove returns false for invalid move and does not change states', () => {
    editor.validateAndPlaceMove(new Coordinate(0, 0));

    const result = editor.validateAndPlaceMove(new Coordinate(0, 0));

    expect(result).toBe(false);
    expect(editor.currentTurn).toEqual(Stone.WHITE);
    expect(editor.currentMove).toEqual(new Move(0, 0, Stone.BLACK));
    expect(editor.currentBoard).toEqual(initBoard.setMove(new Move(0, 0, Stone.BLACK)));
  });
});
