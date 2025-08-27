import Board from '@/lib/goKit/core/model/board';
import Stone from '@/lib/goKit/core/model/stone';
import BasicMoveValidator from '@/lib/goKit/core/rule/basicMoveValidator';
import KoMoveValidator from '@/lib/goKit/core/rule/koMoveValidator';
import RuleBasedMoveProcessor from '@/lib/goKit/core/rule/ruleBasedMoveProcessor';
import StandardMoveUpdater from '@/lib/goKit/core/rule/standardMoveUpdater';
import TutorEditor, { type TutorEditorPlaceMode } from '@/lib/goKit/editor/tutorEditor';
import BasicSequenceHistory from '@/lib/goKit/history/basicSequenceHistory';
import useTutorEditor from '@/lib/goKit/react/hooks/useTutorEditor';

import ChevronLeft from '@/assets/icons/chevron-left.svg?react';
import ChevronRight from '@/assets/icons/chevron-right.svg?react';
import ChevronDoubleLeft from '@/assets/icons/chevrons-left.svg?react';
import ChevronDoubleRight from '@/assets/icons/chevrons-right.svg?react';
import ToggleButtonGroup from '@/global/components/ToggleButtonGroup';
import CanvasBoardView from '@/go/components/CanvasBoardView';
import BasicBoardStyleConfig from '@/go/configs/basicBoardStyleConfig';

const placeModeOptions: { label: string; value: TutorEditorPlaceMode }[] = [
  { label: '흑돌만', value: 'ONLY_BLACK' },
  { label: '백돌만', value: 'ONLY_WHITE' },
  { label: '한수씩', value: 'ALTERNATE' },
];

const currentTurnOptions: { label: string; value: Stone }[] = [
  { label: '흑 차례', value: Stone.BLACK },
  { label: '백 차례', value: Stone.WHITE },
];

const editor = new TutorEditor(
  new BasicSequenceHistory(new Board(13)),
  new RuleBasedMoveProcessor([new BasicMoveValidator(), new KoMoveValidator()], new StandardMoveUpdater()),
);

function Home() {
  const {
    currentBoard,
    currentTurn,
    placeMode,
    validateAndPlaceMove,
    setPlaceMode,
    setTurn,
    undo,
    redo,
    undoAll,
    redoAll,
    canUndo,
    canRedo,
    reset: resetEditor,
  } = useTutorEditor(editor);
  const { dimension: boardDimension } = currentBoard;
  const boardSize = 650; // px 단위

  function handleBoardDimensionButtonClick() {
    if (boardDimension === 9) {
      resetEditor(new Board(13));
    } else if (boardDimension === 13) {
      resetEditor(new Board(19));
    } else {
      resetEditor(new Board(9));
    }
  }

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-[20px] bg-bg'>
      <menu
        className='w-[800px] py-[10px] px-[20px] border-solid border-[1px] border-light-gray rounded-[8px] flex items-center gap-[20px]
      '
      >
        <button
          className='w-[40px] h-[40px] bg-light-gray text-[20px] font-bold rounded-[8px] flex items-center justify-center'
          onClick={handleBoardDimensionButtonClick}
        >
          {boardDimension}
        </button>
        <ToggleButtonGroup
          options={placeModeOptions}
          defaultValue={placeMode}
          value={placeMode}
          onChange={setPlaceMode}
        />
        {placeMode === 'ALTERNATE' && (
          <ToggleButtonGroup
            options={currentTurnOptions}
            defaultValue={currentTurn}
            value={currentTurn}
            onChange={setTurn}
          />
        )}
        <div className='flex items-center gap-[5px]'>
          <button
            className='flex items-center justify-center px-[12px] py-[4px] bg-dark-gray rounded-[8px] hover:bg-light-gray transition-colors duration-200'
            onClick={undoAll}
            disabled={!canUndo(1)}
          >
            <ChevronDoubleLeft color='var(--color-dark-text)' />
          </button>
          <button
            className='flex items-center justify-center px-[12px] py-[4px] bg-dark-gray rounded-[8px] hover:bg-light-gray transition-colors duration-200'
            onClick={() => undo(1)}
            disabled={!canUndo(1)}
          >
            <ChevronLeft color='var(--color-dark-text)' />
          </button>
          <button
            className='flex items-center justify-center px-[12px] py-[4px] bg-dark-gray rounded-[8px] hover:bg-light-gray transition-colors duration-200'
            onClick={() => redo(1)}
            disabled={!canRedo(1)}
          >
            <ChevronRight color='var(--color-dark-text)' />
          </button>
          <button
            className='flex items-center justify-center px-[12px] py-[4px] bg-dark-gray rounded-[8px] hover:bg-light-gray transition-colors duration-200'
            onClick={redoAll}
            disabled={!canRedo(1)}
          >
            <ChevronDoubleRight color='var(--color-dark-text)' />
          </button>
        </div>
      </menu>
      <CanvasBoardView
        board={currentBoard}
        boardSize={boardSize}
        boardStyleConfig={new BasicBoardStyleConfig()}
        handleMove={validateAndPlaceMove}
      />
    </div>
  );
}

export default Home;
