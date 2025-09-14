import { describe, it, expect, beforeEach } from 'vitest';

import Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import { Stone } from '@/lib/go-kit/core/model/stone';
import BasicMoveValidator from '@/lib/go-kit/core/rule/basicMoveValidator';
import RuleBasedMoveProcessor from '@/lib/go-kit/core/rule/ruleBasedMoveProcessor';
import StandardMoveUpdater from '@/lib/go-kit/core/rule/standardMoveUpdater';
import BasicSequenceHistory from '@/lib/go-kit/history/basicSequenceHistory';
import PlaceModeSequenceEditor from '@/lib/go-kit/tools/placeModeSequenceEditor';

describe('PlaceModeSequenceEditor', () => {
  let initBoard: Board;
  let sequenceHistory: BasicSequenceHistory;
  let moveProcessor: RuleBasedMoveProcessor;
  let editor: PlaceModeSequenceEditor;

  beforeEach(() => {
    initBoard = new Board(5);
    sequenceHistory = new BasicSequenceHistory(initBoard);
    moveProcessor = new RuleBasedMoveProcessor([new BasicMoveValidator()], new StandardMoveUpdater());
    editor = new PlaceModeSequenceEditor(sequenceHistory, moveProcessor);
  });

  it('initial state is same as initial board', () => {
    expect(editor.currentBoard).toEqual(initBoard);
  });

  it('setCurrentTurn throws exception when setting EMPTY', () => {
    expect(() => editor.setCurrentTurn(Stone.EMPTY)).toThrowError();
  });

  it('setCurrentTurn updates currentTurn', () => {
    const newEditor = editor.setCurrentTurn(Stone.WHITE);
    expect(newEditor.currentTurn).toBe(Stone.WHITE);
  });

  it('setPlaceMode updates place mode and currentTurn', () => {
    const blackEditor = editor.setPlaceMode('ONLY_BLACK');
    expect(blackEditor.placeMode).toBe('ONLY_BLACK');
    expect(blackEditor.currentTurn).toBe(Stone.BLACK);

    const whiteEditor = editor.setPlaceMode('ONLY_WHITE');
    expect(whiteEditor.placeMode).toBe('ONLY_WHITE');
    expect(whiteEditor.currentTurn).toBe(Stone.WHITE);

    const alternateEditor = editor.setPlaceMode('ALTERNATE');
    expect(alternateEditor.placeMode).toBe('ALTERNATE');
    expect(alternateEditor.currentTurn).toBe(Stone.BLACK);
  });

  it('leftClick adds stone according to currentTurn', () => {
    const blackEditor = editor.setCurrentTurn(Stone.BLACK).leftClick(new Coordinate(0, 0));
    const whiteEditor = editor.setCurrentTurn(Stone.WHITE).leftClick(new Coordinate(1, 1));
    const alternateEditor1 = editor.setPlaceMode('ALTERNATE').leftClick(new Coordinate(2, 2));
    const alternateEditor2 = alternateEditor1!.leftClick(new Coordinate(3, 3));

    expect(blackEditor?.currentBoard).toEqual(initBoard.setMove(new Move(0, 0, Stone.BLACK)));
    expect(whiteEditor?.currentBoard).toEqual(initBoard.setMove(new Move(1, 1, Stone.WHITE)));
    expect(alternateEditor1?.currentBoard).toEqual(initBoard.setMove(new Move(2, 2, Stone.BLACK)));
    expect(alternateEditor2?.currentBoard).toEqual(
      initBoard.setMove(new Move(2, 2, Stone.BLACK)).setMove(new Move(3, 3, Stone.WHITE)),
    );
  });

  it('leftClick updates currentTurn according to placeMode', () => {
    const onlyBlackEditor = editor.setPlaceMode('ONLY_BLACK').leftClick(new Coordinate(0, 0))!;
    const onlyWhiteEditor = editor.setPlaceMode('ONLY_WHITE').leftClick(new Coordinate(1, 1))!;
    const alternateEditor = editor.setPlaceMode('ALTERNATE').leftClick(new Coordinate(2, 2))!;

    expect(onlyBlackEditor.currentTurn).toBe(Stone.BLACK);
    expect(onlyWhiteEditor.currentTurn).toBe(Stone.WHITE);
    expect(alternateEditor.currentTurn).toBe(Stone.WHITE);
  });

  it('leftClick returns null when placing on occupied position', () => {
    const firstEditor = editor.leftClick(new Coordinate(0, 0))!;
    const secondEditor = firstEditor.leftClick(new Coordinate(0, 0));
    expect(secondEditor).toBeNull();
  });

  it('undo and redo update currentTurn appropriately', () => {
    const editorAfterMoves = editor
      .setPlaceMode('ALTERNATE')
      .leftClick(new Coordinate(0, 0))! // BLACK
      .leftClick(new Coordinate(1, 1))! // WHITE
      .leftClick(new Coordinate(2, 2))!; // BLACK

    expect(editorAfterMoves.currentTurn).toBe(Stone.WHITE);

    const afterUndo1 = editorAfterMoves.undo(1);
    expect(afterUndo1.currentTurn).toBe(Stone.BLACK);

    const afterUndo2 = afterUndo1.undo(1);
    expect(afterUndo2.currentTurn).toBe(Stone.WHITE);

    const afterRedo1 = afterUndo2.redo(1);
    expect(afterRedo1.currentTurn).toBe(Stone.BLACK);

    const afterRedoAll = afterRedo1.redoAll();
    expect(afterRedoAll.currentTurn).toBe(Stone.WHITE);

    const afterUndoAll = afterRedoAll.undoAll();
    expect(afterUndoAll.currentTurn).toBe(Stone.BLACK);
  });

  it('reset restores initial board and currentTurn', () => {
    const editorAfterMoves = editor
      .setPlaceMode('ALTERNATE')
      .leftClick(new Coordinate(0, 0))!
      .leftClick(new Coordinate(1, 1))!;

    const resetEditor = editorAfterMoves.reset();
    expect(resetEditor.currentBoard).toEqual(initBoard);
    expect(resetEditor.currentTurn).toBe(Stone.BLACK);
  });
});
