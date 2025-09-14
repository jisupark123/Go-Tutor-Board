import { describe, it, expect, beforeEach } from 'vitest';

import Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import BoardShapeEditor from '@/lib/go-kit/tools/boardShapeEditor';

describe('BoardShapeEditorTest', () => {
  let editor: BoardShapeEditor;
  let initBoard: Board;

  beforeEach(() => {
    initBoard = new Board(5);
    editor = new BoardShapeEditor(initBoard);
  });

  it('initial state is same as initial board', () => {
    expect(editor.board).toEqual(initBoard);
  });

  it('setStoneToPlace throws exception when setting EMPTY', () => {
    expect(() => editor.setStoneToPlace('EMPTY')).toThrow();
  });

  it('setStoneToPlace updates stone to place', () => {
    const newEditor = editor.setStoneToPlace('WHITE');
    expect(newEditor.stoneToPlace).toEqual('WHITE');
  });

  it('setEditMode updates edit mode', () => {
    const newEditor = editor.setEditMode('REMOVE');
    expect(newEditor.editMode).toEqual('REMOVE');
  });

  it('leftClick adds stone according to stoneToPlace in ADD mode', () => {
    const blackEditor = editor.setEditMode('ADD').setStoneToPlace('BLACK').leftClick(new Coordinate(0, 0));

    expect(blackEditor?.board).toEqual(initBoard.setMove(new Move(0, 0, 'BLACK')));

    const whiteEditor = editor.setEditMode('ADD').setStoneToPlace('WHITE').leftClick(new Coordinate(1, 1));

    expect(whiteEditor?.board).toEqual(initBoard.setMove(new Move(1, 1, 'WHITE')));
  });

  it('leftClick returns null when adding to occupied coordinate', () => {
    const addedEditor = editor.setEditMode('ADD').setStoneToPlace('BLACK').leftClick(new Coordinate(3, 3))!;

    const result = addedEditor.setEditMode('ADD').setStoneToPlace('WHITE').leftClick(new Coordinate(3, 3));

    expect(result).toBeNull();
  });

  it('leftClick removes stone in REMOVE mode', () => {
    const addedEditor = editor.setEditMode('ADD').setStoneToPlace('BLACK').leftClick(new Coordinate(2, 2))!;

    const removedEditor = addedEditor.setEditMode('REMOVE').leftClick(new Coordinate(2, 2));

    expect(removedEditor?.board).toEqual(initBoard);
  });

  it('rightClick removes stone regardless of mode', () => {
    const addedEditor = editor
      .setEditMode('ADD')
      .setStoneToPlace('WHITE')
      .leftClick(new Coordinate(0, 0))!
      .leftClick(new Coordinate(4, 4))!;

    const removedEditor1 = addedEditor.setEditMode('ADD').rightClick(new Coordinate(4, 4));

    const removedEditor2 = removedEditor1.setEditMode('REMOVE').rightClick(new Coordinate(0, 0));

    expect(removedEditor2.board).toEqual(initBoard);
  });

  it('reset restores board to initial state', () => {
    const modifiedEditor = editor
      .setEditMode('ADD')
      .setStoneToPlace('BLACK')
      .leftClick(new Coordinate(1, 1))!
      .leftClick(new Coordinate(2, 2))!;

    const resetEditor = modifiedEditor.reset(initBoard);

    expect(resetEditor.board).toEqual(initBoard);
  });
});
