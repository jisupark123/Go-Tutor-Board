import type { DragEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  BasicSequenceManager,
  CanvasBoard,
  classicStoneStyleConfig,
  Game,
  GameSgfFormatter,
  sabakiSgfAdapter,
  standardRuleProcessor,
  usePlaceModeSequenceEditor,
  useSound,
  woodBoardStyleConfig,
  type SequenceManager,
  type StoneColor,
} from '@dodagames/go';
import { Upload } from 'lucide-react';

import ChevronLeft from '@/assets/icons/chevron-left.svg?react';
import ChevronRight from '@/assets/icons/chevron-right.svg?react';
import ChevronDoubleLeft from '@/assets/icons/chevrons-left.svg?react';
import ChevronDoubleRight from '@/assets/icons/chevrons-right.svg?react';
import Trash from '@/assets/icons/trash.svg?react';
import SettingsMenu, { type SettingsOption } from '@/global/components/SettingsMenu';
import ToggleButtonGroup, { type ToggleButtonGroupOption } from '@/global/components/ToggleButtonGroup';
import ToggleFullScreenButton from '@/global/components/ToggleFullScreenButton';
import { useLocalStorage } from '@/global/hooks/useLocalStorage';
import MapGenerator from '@/utils/mapGenerator';

// @dodagames/go가 PlaceMode 타입을 export 하지 않아 동일한 리터럴 유니온을 로컬로 정의한다.
type PlaceMode = 'ONLY_BLACK' | 'ONLY_WHITE' | 'ALTERNATE';

const BOARD_SIZES = [5, 7, 9, 11, 13, 19] as const;
const DEFAULT_BOARD_SIZE = 13;

const placeModeOptions: ToggleButtonGroupOption<PlaceMode>[] = [
  { label: '흑돌만', value: 'ONLY_BLACK' },
  { label: '백돌만', value: 'ONLY_WHITE' },
  { label: '한수씩', value: 'ALTERNATE' },
];

const currentTurnOptions: ToggleButtonGroupOption<StoneColor>[] = [
  { label: '흑 차례', value: 'BLACK' },
  { label: '백 차례', value: 'WHITE' },
];

const mapGenerator = new MapGenerator();

interface HomeBoardProps {
  boardSize: number;
  onChangeBoardSize: () => void;
  onClear: () => void;
  onGenerateMap: () => void;
  /** 맵 생성·SGF 불러오기 등으로 복원한 수순. 주어지면 빈 판 대신 이 수순으로 초기화한다. */
  initialSequenceManager?: SequenceManager;
  /** 복원한 수순의 다음 차례. */
  initialTurn?: StoneColor;
}

/**
 * 바둑판 편집기 본체.
 * 에디터 인스턴스는 usePlaceModeSequenceEditor가 내부에서 소유하며,
 * boardSize 변경/초기화/맵 생성은 상위에서 key 리마운트로 새 인스턴스를 생성한다.
 */
function HomeBoard({
  boardSize,
  onChangeBoardSize,
  onClear,
  onGenerateMap,
  initialSequenceManager,
  initialTurn,
}: HomeBoardProps) {
  const [showStarPoints, setShowStarPoints] = useLocalStorage('settings-showStarPoints', true);
  const [showCurrentMoveMarker, setShowCurrentMoveMarker] = useLocalStorage('settings-showCurrentMoveMarker', true);

  const { playStone } = useSound();

  const {
    currentBoard,
    currentMove,
    currentTurn,
    fullSequenceHistory,
    currentSequenceHistory,
    placeMode,
    select,
    setPlaceMode,
    setCurrentTurn,
    undo,
    redo,
    undoAll,
    redoAll,
    canUndo,
    canRedo,
  } = usePlaceModeSequenceEditor({
    boardSize,
    ...(initialSequenceManager ? { sequenceManager: initialSequenceManager } : {}),
    ...(initialTurn ? { initialTurn } : {}),
  });

  // 다음 수로 이동할 때(착수·redo)에만 착수 소리를 재생한다. (undo 시에는 재생하지 않음)
  const currentStep = currentSequenceHistory.boardHistory.length - 1;
  const prevStepRef = useRef(currentStep);
  useEffect(() => {
    if (currentStep > prevStepRef.current) {
      playStone(0);
    }
    prevStepRef.current = currentStep;
  }, [currentStep, playStone]);

  // 현재까지의 전체 수순을 SGF 문자열로 변환해 파일로 내려받는다.
  const exportSgf = () => {
    const game = new Game(fullSequenceHistory, standardRuleProcessor);
    const sgf = new GameSgfFormatter(sabakiSgfAdapter, standardRuleProcessor).format(game);

    const url = URL.createObjectURL(new Blob([sgf], { type: 'application/x-go-sgf' }));
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `board-${new Date().toISOString().slice(0, 19).replace(/[:T]/g, '')}.sgf`;
    anchor.click();
    URL.revokeObjectURL(url);
  };

  const settingsOptions: SettingsOption[] = [
    {
      type: 'label',
      label: '맵 생성',
      onClick: onGenerateMap,
    },
    {
      type: 'label',
      label: 'SGF로 추출하기',
      onClick: exportSgf,
    },
    {
      type: 'separator',
    },
    {
      type: 'switch',
      label: '화점 보기',
      value: showStarPoints,
      onChange: setShowStarPoints,
    },
    {
      type: 'switch',
      label: '마지막 수 표시',
      value: showCurrentMoveMarker,
      onChange: setShowCurrentMoveMarker,
    },
  ];

  return (
    <div className='bg-bg flex h-[100vh] w-[100vw] flex-col items-center justify-center gap-[20px]'>
      <menu className='border-light-gray relative flex w-[900px] items-center gap-[20px] rounded-[8px] border-[1px] border-solid px-[20px] py-[10px]'>
        <button
          className='bg-dark-gray text-light-text hover:bg-light-gray flex h-[40px] w-[40px] items-center justify-center rounded-[8px] text-[20px] font-bold transition-colors duration-200'
          onClick={onChangeBoardSize}
        >
          {boardSize}
        </button>
        <ToggleButtonGroup options={placeModeOptions} value={placeMode} onChange={setPlaceMode} />
        {placeMode === 'ALTERNATE' && (
          <ToggleButtonGroup options={currentTurnOptions} value={currentTurn} onChange={setCurrentTurn} />
        )}
        <div className='flex items-center gap-[5px]'>
          <button
            className='bg-dark-gray hover:bg-light-gray hover:text-light-text text-dark-text flex items-center justify-center rounded-[8px] px-[12px] py-[4px] transition-colors duration-200'
            onClick={() => undoAll()}
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
            onClick={() => redoAll()}
            disabled={!canRedo(1)}
          >
            <ChevronDoubleRight className='text-inherit' />
          </button>
        </div>
        <div className='absolute right-[20px] flex items-center gap-[10px]'>
          <button
            className='bg-dark-gray hover:bg-light-gray hover:text-light-text text-dark-text flex h-[40px] w-[40px] items-center justify-center rounded-[8px] transition-colors duration-200'
            onClick={onClear}
          >
            <Trash className='text-inherit' />
          </button>
          <SettingsMenu options={settingsOptions} />
        </div>
      </menu>
      <div className='h-[600px] w-[600px]'>
        <CanvasBoard
          board={currentBoard}
          {...(currentMove ? { currentMove } : {})}
          showCurrentMoveMarker={showCurrentMoveMarker}
          showStarPoints={showStarPoints}
          boardStyleConfig={woodBoardStyleConfig}
          stoneStyleConfig={classicStoneStyleConfig}
          onSelect={select}
          hoverPreview={currentTurn}
        />
      </div>
      <ToggleFullScreenButton />
    </div>
  );
}

interface LoadedSequence {
  sequenceManager: SequenceManager;
  turn: StoneColor;
}

/**
 * 홈 페이지.
 * 판 크기 변경/전체 지우기/맵 생성/SGF 드롭은 내부 에디터를 새 인스턴스로 리마운트해 반영한다.
 */
function Home() {
  const [boardSize, setBoardSize] = useState<number>(DEFAULT_BOARD_SIZE);
  const [resetNonce, setResetNonce] = useState(0);
  const [loaded, setLoaded] = useState<LoadedSequence | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  // 자식 요소를 드나들 때 dragleave가 연쇄적으로 발생하므로 깊이를 세어 오버레이 깜빡임을 막는다.
  const dragDepthRef = useRef(0);

  const remount = () => setResetNonce((n) => n + 1);

  const cycleBoardSize = () => {
    const idx = BOARD_SIZES.indexOf(boardSize as (typeof BOARD_SIZES)[number]);
    setBoardSize(BOARD_SIZES[(idx + 1) % BOARD_SIZES.length]);
    setLoaded(null);
    remount();
  };

  const clearBoard = () => {
    setLoaded(null);
    remount();
  };

  const generateMap = () => {
    const generatedBoard = mapGenerator.generateMap(boardSize);
    setLoaded({ sequenceManager: new BasicSequenceManager(generatedBoard), turn: 'BLACK' });
    remount();
  };

  const applySgfFile = async (file: File) => {
    try {
      const text = await file.text();
      const game = new GameSgfFormatter(sabakiSgfAdapter, standardRuleProcessor).parse(text);
      setBoardSize(game.dimension);
      setLoaded({ sequenceManager: new BasicSequenceManager(game.sequenceHistory), turn: game.currentTurn });
      remount();
    } catch {
      window.alert('유효한 SGF 파일이 아닙니다.');
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
    dragDepthRef.current += 1;
    setIsDragging(true);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes('Files')) return;
    e.preventDefault();
  };

  const handleDragLeave = () => {
    dragDepthRef.current = Math.max(0, dragDepthRef.current - 1);
    if (dragDepthRef.current === 0) setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    dragDepthRef.current = 0;
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) applySgfFile(file);
  };

  return (
    <div
      className='relative'
      onDragEnter={handleDragEnter}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <HomeBoard
        key={`${boardSize}-${resetNonce}`}
        boardSize={boardSize}
        onChangeBoardSize={cycleBoardSize}
        onClear={clearBoard}
        onGenerateMap={generateMap}
        {...(loaded ? { initialSequenceManager: loaded.sequenceManager, initialTurn: loaded.turn } : {})}
      />

      {isDragging && (
        <div className='pointer-events-none absolute inset-[16px] z-50 flex flex-col items-center justify-center gap-[12px] rounded-[24px] border-[2px] border-dashed border-white/60 bg-black/70 text-white backdrop-blur-sm'>
          <Upload className='h-[40px] w-[40px]' />
          <p className='text-[18px] font-bold'>SGF 파일을 놓아 불러오기</p>
        </div>
      )}
    </div>
  );
}

export default Home;
