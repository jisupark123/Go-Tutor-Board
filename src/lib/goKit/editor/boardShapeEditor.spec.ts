import { describe, expect, it } from 'vitest';

import Board from '@/lib/goKit/core/model/board';
import Coordinate from '@/lib/goKit/core/model/coordinate';
import Move from '@/lib/goKit/core/model/move';
import Stone from '@/lib/goKit/core/model/stone';
import BoardShapeEditor from '@/lib/goKit/editor/boardShapeEditor';

describe('BoardShapeEditorTest', () => {
  const initBoard = new Board(5);
  const editor = new BoardShapeEditor(initBoard);

  it('initial state is same as initial board', () => {
    expect(editor.result).toEqual(initBoard);
  });

  it('addStone adds stone to empty coordinate', () => {
    const coordinate = new Coordinate(0, 0);
    const stone = Stone.BLACK;

    expect(editor.addStone(coordinate, stone)).toBe(true);
    expect(editor.result).toEqual(initBoard.setMove(new Move(0, 0, stone)));
  });

  it('addStone does not add stone to occupied coordinate', () => {
    const coordinate = new Coordinate(0, 0);
    const stone = Stone.BLACK;

    editor.addStone(coordinate, stone);
    const result = editor.addStone(coordinate, stone);

    expect(result).toBe(false);
    expect(editor.result).toEqual(initBoard.setMove(new Move(0, 0, stone)));
  });

  it('removeStone removes stone from coordinate', () => {
    const coordinate = new Coordinate(0, 0);
    const stone = Stone.BLACK;

    editor.addStone(coordinate, stone);
    editor.removeStone(coordinate);

    expect(editor.result).toEqual(initBoard);
  });
});
