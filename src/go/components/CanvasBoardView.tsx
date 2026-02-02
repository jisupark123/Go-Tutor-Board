import { useEffect, useRef } from 'react';

import type Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Move from '@/lib/go-kit/core/model/move';

import type { BoardStyleConfig } from '@/go/configs/boardStyleConfig';
import CanvasBoardRenderer from '@/go/renderers/CanvasBoardRenderer';
import BoardMetrics from '@/go/utils/boardMetrics';

type CanvasBoardViewProps = {
  /** Canvas Ref */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;

  /** 현재 보드 상태 */
  board: Board;

  /** 마지막 수 */
  currentMove: Move | null;

  /** 바둑판 크기 (px 단위) */
  boardSize: number;

  /** 바둑판 스타일 설정 */
  boardStyleConfig: BoardStyleConfig;

  /** 바둑판 클릭 이벤트 핸들러 */
  handleClick: (coord: Coordinate) => void;

  /** 바둑판 우클릭 이벤트 핸들러 */
  handleContextMenu?: (coord: Coordinate) => void;

  /** 비활성화 여부 */
  disabled?: boolean;

  /** 화점 표시 여부 */
  showStarPoints?: boolean;
};
export default function CanvasBoardView({
  canvasRef,
  board,
  currentMove,
  boardSize,
  boardStyleConfig,
  handleClick,
  handleContextMenu,
  disabled = false,
  showStarPoints = true,
}: CanvasBoardViewProps) {
  const canvasBoardRenderer = useRef<CanvasBoardRenderer>(new CanvasBoardRenderer());

  useEffect(() => {
    (async () => {
      await canvasBoardRenderer.current.init(canvasRef.current!, boardSize, boardStyleConfig);
      // init이 끝난 뒤 board 있으면 바로 렌더링
      if (canvasBoardRenderer.current.initialized) {
        canvasBoardRenderer.current.renderBoard(board, currentMove, showStarPoints);
      }
    })();
  }, [boardStyleConfig, boardSize, board, currentMove, showStarPoints, canvasRef]);

  function onClick(event: React.MouseEvent<HTMLCanvasElement>) {
    if (disabled) return;
    if (canvasBoardRenderer.current.initialized === false) {
      console.log('CanvasBoardRenderer is not initialized');
      return;
    }
    const canvasY = event.nativeEvent.offsetY;
    const canvasX = event.nativeEvent.offsetX;
    const [y, x] = BoardMetrics.toBoardCoordinate(canvasY, canvasX, boardSize, board.dimension);

    handleClick(new Coordinate(y, x));
  }

  function onContextMenu(event: React.MouseEvent<HTMLCanvasElement>) {
    event.preventDefault();
    if (canvasBoardRenderer.current.initialized === false) {
      console.log('CanvasBoardRenderer is not initialized');
      return;
    }
    const canvasY = event.nativeEvent.offsetY;
    const canvasX = event.nativeEvent.offsetX;
    const [y, x] = BoardMetrics.toBoardCoordinate(canvasY, canvasX, boardSize, board.dimension);

    handleContextMenu?.(new Coordinate(y, x));
  }

  //   function onMouseMove(event: React.MouseEvent<HTMLCanvasElement>) {
  //     const ctx = canvasRef.current?.getContext('2d');
  //     if (!ctx) throw new Error('Canvas context is not available');

  //     const canvasY = event.nativeEvent.offsetY;
  //     const canvasX = event.nativeEvent.offsetX;
  //     const [y, x] = BoardMetrics.toBoardCoords(canvasY, canvasX, boardSize, board.dimension);

  //   }

  return (
    <canvas
      ref={canvasRef}
      width={boardSize}
      height={boardSize}
      style={{
        width: boardSize,
        height: boardSize,
        backgroundImage: `url(${boardStyleConfig.bgImageUrl})`,
        backgroundSize: 'cover',
      }}
      onClick={onClick}
      onContextMenu={onContextMenu}
    />
  );
}
