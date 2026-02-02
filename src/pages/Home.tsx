import { useRef } from 'react';
import {
  BasicSequenceManager,
  Board,
  CanvasBoard,
  classicStoneStyleConfig,
  MoveProcessorFactory,
  PlaceModeSequenceHistoryEditor,
  usePlaceModeSequenceHistoryEditor,
  woodBoardStyleConfig,
  type PlaceModeSequenceHistoryEditorPlaceMode,
  type StoneColor,
} from '@dodagames/go';

import ChevronLeft from '@/assets/icons/chevron-left.svg?react';
import ChevronRight from '@/assets/icons/chevron-right.svg?react';
import ChevronDoubleLeft from '@/assets/icons/chevrons-left.svg?react';
import ChevronDoubleRight from '@/assets/icons/chevrons-right.svg?react';
import Trash from '@/assets/icons/trash.svg?react';
import ToggleButtonGroup, { type ToggleButtonGroupOption } from '@/global/components/ToggleButtonGroup';
import ToggleFullScreenButton from '@/global/components/ToggleFullScreenButton';

const placeModeOptions: ToggleButtonGroupOption<PlaceModeSequenceHistoryEditorPlaceMode>[] = [
  { label: '흑돌만', value: 'ONLY_BLACK' },
  { label: '백돌만', value: 'ONLY_WHITE' },
  { label: '한수씩', value: 'ALTERNATE' },
];

const currentTurnOptions: ToggleButtonGroupOption<StoneColor>[] = [
  { label: '흑 차례', value: 'BLACK' },
  { label: '백 차례', value: 'WHITE' },
];

const editor = new PlaceModeSequenceHistoryEditor(
  new BasicSequenceManager(new Board(13)),
  MoveProcessorFactory.standardRule(),
);

function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
  } = usePlaceModeSequenceHistoryEditor(editor);
  const { dimension: boardDimension } = currentBoard;

  function handleBoardDimensionButtonClick() {
    if (boardDimension === 7) {
      resetEditor(new Board(9));
    } else if (boardDimension === 9) {
      resetEditor(new Board(11));
    } else if (boardDimension === 11) {
      resetEditor(new Board(13));
    } else if (boardDimension === 13) {
      resetEditor(new Board(19));
    } else {
      resetEditor(new Board(7));
    }
  }

  // useEffect(() => {
  //   const handleKeyDown = (e: KeyboardEvent) => {
  //     const isMac = navigator.platform.toUpperCase().includes('MAC');
  //     const savePressed = isMac ? e.metaKey && e.key === 's' : e.ctrlKey && e.key === 's';
  //     if (savePressed) {
  //       e.preventDefault(); // 기본 브라우저 저장 단축키 방지
  //       if (canvasRef.current) {
  //         saveCanvasAsPng(canvasRef.current, boardImgUrl, 'board.png');
  //       }
  //     }
  //   };

  //   window.addEventListener('keydown', handleKeyDown);
  //   return () => window.removeEventListener('keydown', handleKeyDown);
  // }, []);

  return (
    <div className='bg-bg flex h-[100vh] w-[100vw] flex-col items-center justify-center gap-[20px]'>
      <menu className='border-light-gray relative flex w-[900px] items-center gap-[20px] rounded-[8px] border-[1px] border-solid px-[20px] py-[10px]'>
        <button
          className='bg-dark-gray text-light-text hover:bg-light-gray flex h-[40px] w-[40px] items-center justify-center rounded-[8px] text-[20px] font-bold transition-colors duration-200'
          onClick={handleBoardDimensionButtonClick}
        >
          {boardDimension}
        </button>
        <ToggleButtonGroup options={placeModeOptions} value={placeMode} onChange={setPlaceMode} />
        {placeMode === 'ALTERNATE' && (
          <ToggleButtonGroup options={currentTurnOptions} value={currentTurn as StoneColor} onChange={setCurrentTurn} />
        )}
        <div className='flex items-center gap-[5px]'>
          <button
            className='bg-dark-gray hover:bg-light-gray hover:text-light-text text-dark-text flex items-center justify-center rounded-[8px] px-[12px] py-[4px] transition-colors duration-200'
            onClick={undoAll}
            disabled={!canUndo(1)}
          >
            <ChevronDoubleLeft className='text-inherit' />
          </button>
          <button
            className='bg-dark-gray hover:bg-light-gray hover:text-light-text text-dark-text flex items-center justify-center rounded-[8px] px-[12px] py-[4px] transition-colors duration-200'
            onClick={() => undo(1)}
            disabled={!canUndo(1)}
          >
            <ChevronLeft className='text-inherit' />
          </button>
          <button
            className='bg-dark-gray hover:bg-light-gray hover:text-light-text text-dark-text flex items-center justify-center rounded-[8px] px-[12px] py-[4px] transition-colors duration-200'
            onClick={() => redo(1)}
            disabled={!canRedo(1)}
          >
            <ChevronRight className='text-inherit' />
          </button>
          <button
            className='bg-dark-gray hover:bg-light-gray hover:text-light-text text-dark-text flex items-center justify-center rounded-[8px] px-[12px] py-[4px] transition-colors duration-200'
            onClick={redoAll}
            disabled={!canRedo(1)}
          >
            <ChevronDoubleRight className='text-inherit' />
          </button>
        </div>
        <button
          className='bg-dark-gray hover:bg-light-gray hover:text-light-text text-dark-text absolute right-[20px] flex h-[40px] w-[40px] items-center justify-center rounded-[8px] transition-colors duration-200'
          onClick={() => resetEditor()}
        >
          <Trash className='text-inherit' />
        </button>
      </menu>
      <div className='h-[600px] w-[600px]'>
        <CanvasBoard
          board={currentBoard}
          {...(currentMove ? { currentMove } : {})}
          showCurrentMoveMarker
          showStarPoints
          boardStyleConfig={woodBoardStyleConfig}
          stoneStyleConfig={classicStoneStyleConfig}
          handleLeftClick={leftClick}
          // hoverPreview={currentTurn as StoneColor}
        />
      </div>
      <ToggleFullScreenButton />
    </div>
  );
}

export default Home;
