import { useCallback, useState } from 'react';

import type Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Move from '@/lib/go-kit/core/model/move';
import BoardShapeEditor from '@/lib/go-kit/editor/boardShapeEditor';

export default function useBoardShapeEditor(initialEditor: BoardShapeEditor) {
  const [editor, setEditor] = useState(initialEditor);

  const addStone = useCallback(
    (move: Move): BoardShapeEditor | null => {
      const nextEditor = editor.addStone(move);
      if (nextEditor) {
        setEditor(nextEditor);
      }
      return nextEditor;
    },
    [editor],
  );

  const removeStone = useCallback(
    (coordinate: Coordinate): BoardShapeEditor => {
      const nextEditor = editor.removeStone(coordinate);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const reset = useCallback(
    (board: Board): BoardShapeEditor => {
      const nextEditor = editor.copy({ board });
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  return {
    board: editor.board,
    addStone,
    removeStone,
    reset,
  };
}
