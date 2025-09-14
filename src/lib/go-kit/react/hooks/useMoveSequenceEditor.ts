import { useCallback, useState } from 'react';

import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import MoveSequenceEditor from '@/lib/go-kit/tools/moveSequenceEditor';

export default function useMoveSequenceEditor(moveSequenceEditor: MoveSequenceEditor) {
  const [editor, setEditor] = useState(moveSequenceEditor);

  const validateAndPlaceMove = useCallback(
    (coordinate: Coordinate): MoveSequenceEditor | null => {
      const nextEditor = editor.validateAndPlaceMove(coordinate);
      if (nextEditor) {
        setEditor(nextEditor);
      }
      return nextEditor;
    },
    [editor],
  );

  const undo = useCallback(
    (steps: number) => {
      setEditor(editor.undo(steps));
    },
    [editor],
  );

  const redo = useCallback(
    (steps: number) => {
      setEditor(editor.redo(steps));
    },
    [editor],
  );

  const undoAll = useCallback(() => {
    setEditor(editor.undoAll());
  }, [editor]);

  const redoAll = useCallback(() => {
    setEditor(editor.redoAll());
  }, [editor]);

  return {
    currentBoard: editor.currentBoard,
    currentMove: editor.currentMove,
    currentTurn: editor.currentTurn,
    validateAndPlaceMove,
    undo,
    redo,
    undoAll,
    redoAll,
    canUndo: editor.canUndo.bind(editor),
    canRedo: editor.canRedo.bind(editor),
  };
}
