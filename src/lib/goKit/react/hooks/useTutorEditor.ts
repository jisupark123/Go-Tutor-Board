import { useCallback, useState } from 'react';

import Board from '@/lib/goKit/core/model/board';
import type Coordinate from '@/lib/goKit/core/model/coordinate';
import type Move from '@/lib/goKit/core/model/move';
import type Stone from '@/lib/goKit/core/model/stone';
import TutorEditor, { type TutorEditorPlaceMode } from '@/lib/goKit/editor/tutorEditor';

type TutorEditorState = {
  currentBoard: Board;
  currentMove: Move | null;
  currentTurn: Stone;
  placeMode: TutorEditorPlaceMode;
};

function getEditorState(tutorEditor: TutorEditor): TutorEditorState {
  return {
    currentBoard: tutorEditor.currentBoard,
    currentMove: tutorEditor.currentMove,
    currentTurn: tutorEditor.currentTurn,
    placeMode: tutorEditor.placeMode,
  };
}

export default function useTutorEditor(tutorEditor: TutorEditor) {
  const [editor] = useState(tutorEditor);
  const [editorState, setEditorState] = useState(getEditorState(editor));

  const validateAndPlaceMove = useCallback(
    (coordinate: Coordinate): boolean => {
      const success = editor.validateAndPlaceMove(coordinate);
      if (success) {
        setEditorState(getEditorState(editor));
      }
      return success;
    },
    [editor],
  );

  const setCurrentTurn = useCallback(
    (turn: Stone) => {
      editor.currentTurn = turn;
      setEditorState(getEditorState(editor));
    },
    [editor],
  );

  const toggleTurn = useCallback(() => {
    editor.toggleTurn();
    setEditorState(getEditorState(editor));
  }, [editor]);

  const setPlaceMode = useCallback(
    (mode: TutorEditorPlaceMode) => {
      editor.placeMode = mode;
      setEditorState(getEditorState(editor));
    },
    [editor],
  );

  const undo = useCallback(
    (steps: number) => {
      editor.undo(steps);
      setEditorState(getEditorState(editor));
    },
    [editor],
  );

  const redo = useCallback(
    (steps: number) => {
      editor.redo(steps);
      setEditorState(getEditorState(editor));
    },
    [editor],
  );

  const undoAll = useCallback(() => {
    editor.undoAll();
    setEditorState(getEditorState(editor));
  }, [editor]);

  const redoAll = useCallback(() => {
    editor.redoAll();
    setEditorState(getEditorState(editor));
  }, [editor]);

  const reset = useCallback(
    (newBoard: Board = new Board(editor.currentBoard.dimension)) => {
      editor.reset(newBoard);
      setEditorState(getEditorState(editor));
    },
    [editor],
  );

  return {
    currentBoard: editorState.currentBoard,
    currentMove: editorState.currentMove,
    currentTurn: editorState.currentTurn,
    placeMode: editorState.placeMode,
    validateAndPlaceMove,
    setPlaceMode,
    toggleTurn,
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
