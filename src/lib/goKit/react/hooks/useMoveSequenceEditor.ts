import { useCallback, useState } from 'react';

import type Board from '@/lib/goKit/core/model/board';
import type Coordinate from '@/lib/goKit/core/model/coordinate';
import type Move from '@/lib/goKit/core/model/move';
import MoveSequenceEditor from '@/lib/goKit/editor/moveSequenceEditor';

export function useMoveSequenceEditor(moveSequenceEditor: MoveSequenceEditor) {
  const [editor] = useState(moveSequenceEditor);
  const [currentBoard, setBoard] = useState<Board>(editor.currentBoard);
  const [currentMove, setMove] = useState<Move | null>(editor.currentMove);

  const validateAndPlaceMove = useCallback(
    (coordinate: Coordinate): boolean => {
      const success = editor.validateAndPlaceMove(coordinate);
      if (success) {
        setBoard(editor.currentBoard);
        setMove(editor.currentMove);
      }
      return success;
    },
    [editor],
  );

  const undo = useCallback(
    (steps: number) => {
      editor.undo(steps);
      setBoard(editor.currentBoard);
      setMove(editor.currentMove);
    },
    [editor],
  );

  const redo = useCallback(
    (steps: number) => {
      editor.redo(steps);
      setBoard(editor.currentBoard);
      setMove(editor.currentMove);
    },
    [editor],
  );

  const undoAll = useCallback(() => {
    editor.undoAll();
    setBoard(editor.currentBoard);
    setMove(editor.currentMove);
  }, [editor]);

  const redoAll = useCallback(() => {
    editor.redoAll();
    setBoard(editor.currentBoard);
    setMove(editor.currentMove);
  }, [editor]);

  const reset = useCallback(
    (newBoard: Board) => {
      editor.reset(newBoard);
      setBoard(editor.currentBoard);
      setMove(editor.currentMove);
    },
    [editor],
  );

  return {
    currentBoard,
    currentMove,
    validateAndPlaceMove,
    undo,
    redo,
    undoAll,
    redoAll,
    reset,
    canUndo: editor.canUndo.bind(editor),
    canRedo: editor.canRedo.bind(editor),
  };
}
