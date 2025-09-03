import { beforeEach, describe, expect, it } from 'vitest';

import Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';
import BoardShapeEditor from '@/lib/go-kit/editor/boardShapeEditor';

describe('BoardShapeEditorTest', () => {
  let initBoard: Board;
  let editor: BoardShapeEditor;

  beforeEach(() => {
    initBoard = new Board(5);
    editor = new BoardShapeEditor(initBoard);
  });

  it('initial state is same as initial board', () => {
    expect(editor.board).toEqual(initBoard);
  });

  it('addStone adds stone to empty coordinate', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newEditor = editor.addStone(newMove);

    expect(newEditor).toEqual(editor.addStone(newMove));
  });

  it('addStone does not add stone to occupied coordinate and return null', () => {
    const newMove = new Move(0, 0, Stone.BLACK);

    // 먼저 돌을 추가
    const newEditor1 = editor.addStone(newMove);
    expect(newEditor1).not.toBeNull();

    // 같은 좌표에 다시 돌을 추가하려고 시도
    const newEditor2 = newEditor1?.addStone(newMove);

    expect(newEditor2).toBeNull();
    expect(newEditor1).toEqual(editor.addStone(newMove));
  });

  it('removeStone removes stone from coordinate', () => {
    const newMove = new Move(0, 0, Stone.BLACK);
    const newEditor1 = editor.addStone(newMove);
    const newEditor2 = newEditor1?.removeStone(new Coordinate(0, 0));

    expect(newEditor2).toEqual(editor); // 원래 보드 상태로 돌아가야 함
  });
});
