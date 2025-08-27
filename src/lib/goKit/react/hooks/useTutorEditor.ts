import { useCallback, useState } from 'react';

import type Board from '@/lib/goKit/core/model/board';
import type Coordinate from '@/lib/goKit/core/model/coordinate';
import type Move from '@/lib/goKit/core/model/move';
import type Stone from '@/lib/goKit/core/model/stone';
import TutorEditor, { type TutorEditorPlaceMode } from '@/lib/goKit/editor/tutorEditor';

export default function useTutorEditor(tutorEditor: TutorEditor) {
  const [editor] = useState(tutorEditor);
  const [currentBoard, setBoard] = useState<Board>(editor.currentBoard);
  const [currentMove, setMove] = useState<Move | null>(editor.currentMove);
  const [currentTurn, setCurrentTurn] = useState<Stone>(editor.currentTurn);
  const [mode, setMode] = useState<TutorEditorPlaceMode>(editor.placeMode);

  const validateAndPlaceMove = useCallback(
    (coordinate: Coordinate): boolean => {
      const success = editor.validateAndPlaceMove(coordinate);
      if (success) {
        setBoard(editor.currentBoard);
        setMove(editor.currentMove);
        setCurrentTurn(editor.currentTurn);
      }
      return success;
    },
    [editor],
  );

  const setTurn = useCallback(
    (turn: Stone) => {
      editor.currentTurn = turn;
      setCurrentTurn(editor.currentTurn);
    },
    [editor],
  );

  const toggleTurn = useCallback(() => {
    editor.toggleTurn();
    setCurrentTurn(editor.currentTurn);
  }, [editor]);

  const setPlaceMode = useCallback(
    (mode: TutorEditorPlaceMode) => {
      editor.placeMode = mode;
      setMode(editor.placeMode);
      setCurrentTurn(editor.currentTurn);
    },
    [editor],
  );

  const undo = useCallback(
    (steps: number) => {
      editor.undo(steps);
      setBoard(editor.currentBoard);
      setMove(editor.currentMove);
      setCurrentTurn(editor.currentTurn);
    },
    [editor],
  );

  const redo = useCallback(
    (steps: number) => {
      editor.redo(steps);
      setBoard(editor.currentBoard);
      setMove(editor.currentMove);
      setCurrentTurn(editor.currentTurn);
    },
    [editor],
  );

  const undoAll = useCallback(() => {
    editor.undoAll();
    setBoard(editor.currentBoard);
    setMove(editor.currentMove);
    setCurrentTurn(editor.currentTurn);
  }, [editor]);

  const redoAll = useCallback(() => {
    editor.redoAll();
    setBoard(editor.currentBoard);
    setMove(editor.currentMove);
    setCurrentTurn(editor.currentTurn);
  }, [editor]);

  const reset = useCallback(
    (newBoard: Board) => {
      editor.reset(newBoard);
      setBoard(editor.currentBoard);
      setMove(editor.currentMove);
      setCurrentTurn(editor.currentTurn);
    },
    [editor],
  );

  return {
    currentBoard,
    currentMove,
    currentTurn,
    placeMode: mode,
    validateAndPlaceMove,
    setPlaceMode,
    toggleTurn,
    setTurn,
    undo,
    redo,
    undoAll,
    redoAll,
    reset,
    canUndo: editor.canUndo.bind(editor),
    canRedo: editor.canRedo.bind(editor),
  };
}
