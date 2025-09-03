import { useState } from 'react';

import Board from '@/lib/go-kit/core/model/board';
import type Coordinate from '@/lib/go-kit/core/model/coordinate';
import Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';
import BoardShapeEditor from '@/lib/go-kit/editor/boardShapeEditor';
import useBoardShapeEditor from '@/lib/go-kit/react/hooks/useBoardShapeEditor';
import BoardUtils from '@/lib/go-kit/utils/boardUtils';

import Trash from '@/assets/icons/trash.svg?react';
import ToggleButtonGroup from '@/global/components/ToggleButtonGroup';
import CanvasBoardView from '@/go/components/CanvasBoardView';
import BasicBoardStyleConfig from '@/go/configs/basicBoardStyleConfig';

type StoneMode = 'BLACK' | 'WHITE';
type EditMode = 'PLACE' | 'REMOVE';

const stoneModeOptions: { label: string; value: StoneMode }[] = [
  { label: '흑', value: 'BLACK' },
  { label: '백', value: 'WHITE' },
];

const editModeOptions: { label: string; value: EditMode }[] = [
  { label: '돌 추가', value: 'PLACE' },
  { label: '돌 제거', value: 'REMOVE' },
];

function ProblemMaker() {
  const { board, addStone, removeStone, reset: resetEditor } = useBoardShapeEditor(new BoardShapeEditor(new Board(7)));
  const [stoneMode, setStoneMode] = useState<StoneMode>('BLACK');
  const [editMode, setEditMode] = useState<EditMode>('PLACE');

  console.log(BoardUtils.boardToAscii(board));

  function handleBoardDimensionButtonClick() {
    if (board.dimension === 5) {
      resetEditor(new Board(7));
    } else if (board.dimension === 7) {
      resetEditor(new Board(9));
    } else if (board.dimension === 9) {
      resetEditor(new Board(13));
    } else if (board.dimension === 13) {
      resetEditor(new Board(19));
    } else {
      resetEditor(new Board(5));
    }
  }

  function handleBoardClick(coordinate: Coordinate) {
    if (editMode === 'PLACE') {
      addStone(new Move(coordinate.y, coordinate.x, stoneMode === 'BLACK' ? Stone.BLACK : Stone.WHITE));
    } else {
      removeStone(coordinate);
    }
  }

  function handleResetButtonClick() {
    resetEditor(new Board(board.dimension));
    setEditMode('PLACE');
  }

  return (
    <div className='w-[100vw] h-[100vh] flex flex-col justify-center items-center gap-[30px]'>
      <menu
        className='relative w-[650px] py-[10px] px-[20px] border-solid border-[1px] border-light-gray rounded-[8px] flex items-center gap-[20px]
      '
      >
        <button
          className='w-[40px] h-[40px] bg-dark-gray text-[20px] text-light-text font-bold rounded-[8px] flex items-center justify-center hover:bg-light-gray transition-colors duration-200'
          onClick={handleBoardDimensionButtonClick}
        >
          {board.dimension}
        </button>
        <ToggleButtonGroup options={editModeOptions} defaultValue={editMode} value={editMode} onChange={setEditMode} />
        {editMode === 'PLACE' && (
          <ToggleButtonGroup
            options={stoneModeOptions}
            defaultValue={stoneMode}
            value={stoneMode}
            onChange={setStoneMode}
          />
        )}

        <button
          className='absolute right-[20px] flex items-center justify-center w-[40px] h-[40px] bg-dark-gray rounded-[8px] hover:bg-light-gray text-dark-text transition-colors duration-200'
          onClick={handleResetButtonClick}
        >
          <Trash className='text-inherit' />
        </button>
      </menu>
      <CanvasBoardView
        board={board}
        currentMove={null}
        boardSize={650}
        boardStyleConfig={new BasicBoardStyleConfig()}
        handleClick={handleBoardClick}
        handleContextMenu={removeStone}
        showStarPoints={false}
      />
    </div>
  );
}

export default ProblemMaker;
