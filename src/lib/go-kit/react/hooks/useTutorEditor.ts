import { useCallback, useState } from 'react';

import Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Stone from '@/lib/go-kit/core/model/stone';
import TutorEditor, { type TutorEditorPlaceMode } from '@/lib/go-kit/editor/tutorEditor';

export default function useTutorEditor(tutorEditor: TutorEditor) {
  const [editor, setEditor] = useState(tutorEditor);

  const validateAndPlaceMove = useCallback(
    (coordinate: Coordinate): TutorEditor | null => {
      const nextEditor = editor.validateAndPlaceMove(coordinate);
      if (nextEditor) {
        setEditor(nextEditor);
      }
      return nextEditor;
    },
    [editor],
  );

  const setCurrentTurn = useCallback(
    (turn: Stone): TutorEditor => {
      const nextEditor = editor.setCurrentTurn(turn);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const setPlaceMode = useCallback(
    (mode: TutorEditorPlaceMode): TutorEditor => {
      const nextEditor = editor.setPlaceMode(mode);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const undo = useCallback(
    (steps: number): TutorEditor => {
      const nextEditor = editor.undo(steps);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const redo = useCallback(
    (steps: number): TutorEditor => {
      const nextEditor = editor.redo(steps);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const undoAll = useCallback((): TutorEditor => {
    const nextEditor = editor.undoAll();
    setEditor(nextEditor);
    return nextEditor;
  }, [editor]);

  const redoAll = useCallback((): TutorEditor => {
    const nextEditor = editor.redoAll();
    setEditor(nextEditor);
    return nextEditor;
  }, [editor]);

  const reset = useCallback(
    (newBoard: Board = new Board(editor.currentBoard.dimension)) => {
      const nextEditor = editor.reset(newBoard);
      setEditor(nextEditor);
    },
    [editor],
  );

  return {
    currentBoard: editor.currentBoard,
    currentMove: editor.currentMove,
    currentTurn: editor.currentTurn,
    placeMode: editor.placeMode,
    validateAndPlaceMove,
    setPlaceMode,
    setCurrentTurn,
    undo,
    redo,
    undoAll,
    redoAll,
    reset,
    canUndo: editor.canUndo.bind(editor),
    canRedo: editor.canRedo.bind(editor),
  };
}
