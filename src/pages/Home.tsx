import Board from '@/lib/go-kit/core/model/board';
import Stone from '@/lib/go-kit/core/model/stone';
import BasicMoveValidator from '@/lib/go-kit/core/rule/basicMoveValidator';
import KoMoveValidator from '@/lib/go-kit/core/rule/koMoveValidator';
import RuleBasedMoveProcessor from '@/lib/go-kit/core/rule/ruleBasedMoveProcessor';
import StandardMoveUpdater from '@/lib/go-kit/core/rule/standardMoveUpdater';
import BasicSequenceHistory from '@/lib/go-kit/history/basicSequenceHistory';
import usePlaceModeSequenceEditor from '@/lib/go-kit/react/hooks/usePlaceModeSequenceEditor';
import type { PlaceMode } from '@/lib/go-kit/tools/placeModeSequenceEditor';
import PlaceModeSequenceEditor from '@/lib/go-kit/tools/placeModeSequenceEditor';

import ChevronLeft from '@/assets/icons/chevron-left.svg?react';
import ChevronRight from '@/assets/icons/chevron-right.svg?react';
import ChevronDoubleLeft from '@/assets/icons/chevrons-left.svg?react';
import ChevronDoubleRight from '@/assets/icons/chevrons-right.svg?react';
import Trash from '@/assets/icons/trash.svg?react';
import ToggleButtonGroup, { type ToggleButtonGroupOption } from '@/global/components/ToggleButtonGroup';
import ToggleFullScreenButton from '@/global/components/ToggleFullScreenButton';
import CanvasBoardView from '@/go/components/CanvasBoardView';
import BasicBoardStyleConfig from '@/go/configs/basicBoardStyleConfig';

const placeModeOptions: ToggleButtonGroupOption<PlaceMode>[] = [
  { label: '흑돌만', value: 'ONLY_BLACK' },
  { label: '백돌만', value: 'ONLY_WHITE' },
  { label: '한수씩', value: 'ALTERNATE' },
];

const currentTurnOptions: ToggleButtonGroupOption<Stone>[] = [
  { label: '흑 차례', value: Stone.BLACK },
  { label: '백 차례', value: Stone.WHITE },
];

const editor = new PlaceModeSequenceEditor(
  new BasicSequenceHistory(new Board(13)),
  new RuleBasedMoveProcessor([new BasicMoveValidator(), new KoMoveValidator()], new StandardMoveUpdater()),
);

function Home() {
  const {
    currentBoard,
    currentMove,
    currentTurn,
    placeMode,
    leftClick,
    setPlaceMode,
    setCurrentTurn,
    undo,
    redo,
    undoAll,
    redoAll,
    canUndo,
    canRedo,
    reset: resetEditor,
  } = usePlaceModeSequenceEditor(editor);
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
        className='relative w-[900px] py-[10px] px-[20px] border-solid border-[1px] border-light-gray rounded-[8px] flex items-center gap-[20px]
      '
      >
        <button
          className='w-[40px] h-[40px] bg-dark-gray text-[20px] text-light-text font-bold rounded-[8px] flex items-center justify-center hover:bg-light-gray transition-colors duration-200'
          onClick={handleBoardDimensionButtonClick}
        >
          {boardDimension}
        </button>
        <ToggleButtonGroup options={placeModeOptions} value={placeMode} onChange={setPlaceMode} />
        {placeMode === 'ALTERNATE' && (
          <ToggleButtonGroup options={currentTurnOptions} value={currentTurn} onChange={setCurrentTurn} />
        )}
        <div className='flex items-center gap-[5px]'>
          <button
            className='flex items-center justify-center px-[12px] py-[4px] bg-dark-gray rounded-[8px] hover:bg-light-gray hover:text-light-text text-dark-text transition-colors duration-200'
            onClick={undoAll}
            disabled={!canUndo(1)}
          >
            <ChevronDoubleLeft className='text-inherit' />
          </button>
          <button
            className='flex items-center justify-center px-[12px] py-[4px] bg-dark-gray rounded-[8px] hover:bg-light-gray hover:text-light-text text-dark-text transition-colors duration-200'
            onClick={() => undo(1)}
            disabled={!canUndo(1)}
          >
            <ChevronLeft className='text-inherit' />
          </button>
          <button
            className=' flex items-center justify-center px-[12px] py-[4px] bg-dark-gray rounded-[8px] hover:bg-light-gray hover:text-light-text text-dark-text transition-colors duration-200'
            onClick={() => redo(1)}
            disabled={!canRedo(1)}
          >
            <ChevronRight className='text-inherit' />
          </button>
          <button
            className='flex items-center justify-center px-[12px] py-[4px] bg-dark-gray rounded-[8px] hover:bg-light-gray hover:text-light-text text-dark-text transition-colors duration-200'
            onClick={redoAll}
            disabled={!canRedo(1)}
          >
            <ChevronDoubleRight className='text-inherit' />
          </button>
        </div>
        <button
          className='absolute right-[20px] flex items-center justify-center w-[40px] h-[40px] bg-dark-gray rounded-[8px] hover:bg-light-gray hover:text-light-text text-dark-text transition-colors duration-200'
          onClick={() => resetEditor()}
        >
          <Trash className='text-inherit' />
        </button>
      </menu>
      <CanvasBoardView
        board={currentBoard}
        currentMove={currentMove}
        boardSize={boardSize}
        boardStyleConfig={new BasicBoardStyleConfig()}
        handleClick={leftClick}
      />
      <ToggleFullScreenButton />
    </div>
  );
}

export default Home;
