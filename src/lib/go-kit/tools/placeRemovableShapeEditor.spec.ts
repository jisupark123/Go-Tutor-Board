import { describe, it, expect, beforeEach } from 'vitest';

import Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';
import PlaceRemovableShapeEditor from '@/lib/go-kit/tools/placeRemovableShapeEditor';

describe('PlaceRemovableShapeEditor', () => {
  let editor: PlaceRemovableShapeEditor;
  let initBoard: Board;

  beforeEach(() => {
    initBoard = new Board(5);
    editor = new PlaceRemovableShapeEditor(initBoard);
  });

  it('initial state is same as initial board', () => {
    expect(editor.board).toEqual(initBoard);
  });

  it('setStoneToPlace throws exception when setting EMPTY', () => {
    expect(() => editor.setStoneToPlace(Stone.EMPTY)).toThrowError();
  });

  it('setStoneToPlace updates stone to place', () => {
    const newEditor = editor.setStoneToPlace(Stone.WHITE);
    expect(newEditor.stoneToPlace).toBe(Stone.WHITE);
  });

  it('setEditMode updates edit mode and stoneToPlace', () => {
    const blackEditor = editor.setEditMode('ONLY_BLACK');
    expect(blackEditor.editMode).toBe('ONLY_BLACK');
    expect(blackEditor.stoneToPlace).toBe(Stone.BLACK);

    const whiteEditor = editor.setEditMode('ONLY_WHITE');
    expect(whiteEditor.editMode).toBe('ONLY_WHITE');
    expect(whiteEditor.stoneToPlace).toBe(Stone.WHITE);

    const alternateEditor = editor.setEditMode('ALTERNATE');
    expect(alternateEditor.editMode).toBe('ALTERNATE');
    expect(alternateEditor.stoneToPlace).toBe(Stone.BLACK);

    const removeEditor = editor.setEditMode('REMOVE');
    expect(removeEditor.editMode).toBe('REMOVE');
    expect(removeEditor.stoneToPlace).toBe(editor.stoneToPlace);
  });

  it('leftClick adds stone according to stoneToPlace in ONLY_BLACK, ONLY_WHITE, ALTERNATE modes', () => {
    const blackEditor = editor.setEditMode('ONLY_BLACK').leftClick(new Coordinate(0, 0));
    const whiteEditor = editor.setEditMode('ONLY_WHITE').leftClick(new Coordinate(1, 1));
    const alternateEditor1 = editor.setEditMode('ALTERNATE').leftClick(new Coordinate(2, 2));
    const alternateEditor2 = alternateEditor1!.leftClick(new Coordinate(3, 3));

    expect(blackEditor?.board).toEqual(initBoard.setMove(new Move(0, 0, Stone.BLACK)));
    expect(whiteEditor?.board).toEqual(initBoard.setMove(new Move(1, 1, Stone.WHITE)));
    expect(alternateEditor1?.board).toEqual(initBoard.setMove(new Move(2, 2, Stone.BLACK)));
    expect(alternateEditor2?.board).toEqual(
      initBoard.setMove(new Move(2, 2, Stone.BLACK)).setMove(new Move(3, 3, Stone.WHITE)),
    );
  });

  it('leftClick maintains or toggles stoneToPlace according to editMode', () => {
    const onlyBlackEditor = editor.setEditMode('ONLY_BLACK').leftClick(new Coordinate(0, 0))!;

    const onlyWhiteEditor = editor.setEditMode('ONLY_WHITE').leftClick(new Coordinate(0, 0))!;

    const alternateEditor = editor.setEditMode('ALTERNATE').leftClick(new Coordinate(0, 0))!;

    expect(onlyBlackEditor.stoneToPlace).toBe(Stone.BLACK);
    expect(onlyWhiteEditor.stoneToPlace).toBe(Stone.WHITE);
    expect(alternateEditor.stoneToPlace).toBe(Stone.WHITE); // 마지막이 BLACK이므로 다음은 WHITE
  });

  it('leftClick returns null when adding to occupied coordinate', () => {
    const addedEditor = editor.setEditMode('ONLY_BLACK').leftClick(new Coordinate(2, 2))!;

    const result = addedEditor.setEditMode('ONLY_WHITE').leftClick(new Coordinate(2, 2));

    expect(result).toBeNull();
  });

  it('leftClick removes stone in REMOVE mode', () => {
    const editorWithStones = editor
      .leftClick(new Coordinate(0, 0))! // Add BLACK
      .setEditMode('ONLY_WHITE')
      .leftClick(new Coordinate(1, 1))! // Add WHITE
      .setEditMode('REMOVE');

    const afterRemoveBlack = editorWithStones.leftClick(new Coordinate(0, 0));
    const afterRemoveWhite = afterRemoveBlack?.leftClick(new Coordinate(1, 1));

    expect(afterRemoveBlack?.board).toEqual(initBoard.setMove(new Move(1, 1, Stone.WHITE)));
    expect(afterRemoveWhite?.board).toEqual(initBoard);
  });

  it('rightClick removes stone', () => {
    const editorWithStones = editor
      .leftClick(new Coordinate(0, 0))! // Add BLACK
      .setEditMode('ONLY_WHITE')
      .leftClick(new Coordinate(1, 1))!; // Add WHITE

    const afterRightClickBlack = editorWithStones.rightClick(new Coordinate(0, 0));
    const afterRightClickWhite = afterRightClickBlack.rightClick(new Coordinate(1, 1));

    expect(afterRightClickBlack.board).toEqual(initBoard.setMove(new Move(1, 1, Stone.WHITE)));
    expect(afterRightClickWhite.board).toEqual(initBoard);
  });

  it('reset restores board to initial state', () => {
    const modifiedEditor = editor
      .leftClick(new Coordinate(0, 0))! // Add BLACK
      .setEditMode('ONLY_WHITE')
      .leftClick(new Coordinate(1, 1))!; // Add WHITE

    const resetEditor = modifiedEditor.reset(initBoard);
    expect(resetEditor.board).toEqual(initBoard);
  });
});
