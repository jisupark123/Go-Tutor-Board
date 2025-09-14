import { useCallback, useState } from 'react';

import Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Stone from '@/lib/go-kit/core/model/stone';
import PlaceModeSequenceEditor, { type PlaceMode } from '@/lib/go-kit/tools/placeModeSequenceEditor';

export default function usePlaceModeSequenceEditor(placeModeSequenceEditor: PlaceModeSequenceEditor) {
  const [editor, setEditor] = useState(placeModeSequenceEditor);

  const validateAndPlaceMove = useCallback(
    (coordinate: Coordinate): PlaceModeSequenceEditor | null => {
      const nextEditor = editor.validateAndPlaceMove(coordinate);
      if (nextEditor) {
        setEditor(nextEditor);
      }
      return nextEditor;
    },
    [editor],
  );

  const setCurrentTurn = useCallback(
    (turn: Stone): PlaceModeSequenceEditor => {
      const nextEditor = editor.setCurrentTurn(turn);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const setPlaceMode = useCallback(
    (mode: PlaceMode): PlaceModeSequenceEditor => {
      const nextEditor = editor.setPlaceMode(mode);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const undo = useCallback(
    (steps: number): PlaceModeSequenceEditor => {
      const nextEditor = editor.undo(steps);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const redo = useCallback(
    (steps: number): PlaceModeSequenceEditor => {
      const nextEditor = editor.redo(steps);
      setEditor(nextEditor);
      return nextEditor;
    },
    [editor],
  );

  const undoAll = useCallback((): PlaceModeSequenceEditor => {
    const nextEditor = editor.undoAll();
    setEditor(nextEditor);
    return nextEditor;
  }, [editor]);

  const redoAll = useCallback((): PlaceModeSequenceEditor => {
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
