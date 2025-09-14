import { useCallback, useState } from 'react';

import type Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Stone from '@/lib/go-kit/core/model/stone';
import BoardShapeEditor, { type EditMode } from '@/lib/go-kit/tools/boardShapeEditor';

export default function useBoardShapeEditor(initialEditor: BoardShapeEditor) {
  const [editor, setEditor] = useState(initialEditor);

  const setEditMode = useCallback(
    (mode: EditMode) => {
      const nextEditor = editor.setEditMode(mode);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const setStoneToPlace = useCallback(
    (stone: Stone) => {
      const nextEditor = editor.setStoneToPlace(stone);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const leftClick = useCallback(
    (coordinate: Coordinate): BoardShapeEditor | null => {
      const nextEditor = editor.leftClick(coordinate);
      if (nextEditor) {
        setEditor(nextEditor);
      }
      return nextEditor;
    },
    [editor],
  );

  const rightClick = useCallback(
    (coordinate: Coordinate): BoardShapeEditor => {
      const nextEditor = editor.rightClick(coordinate);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const reset = useCallback(
    (initialBoard: Board) => {
      const nextEditor = editor.reset(initialBoard);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  return {
    board: editor.board,
    editMode: editor.editMode,
    stoneToPlace: editor.stoneToPlace,
    setEditMode,
    setStoneToPlace,
    leftClick,
    rightClick,
    reset,
  };
}
