import { useEffect, useRef } from 'react';

import type Board from '@/lib/goKit/core/model/board';
import Coordinate from '@/lib/goKit/core/model/coordinate';

import type { BoardStyleConfig } from '@/go/configs/boardStyleConfig';
import CanvasBoardRenderer from '@/go/renderers/CanvasBoardRenderer';
import BoardMetrics from '@/go/utils/boardMetrics';

type CanvasBoardViewProps = {
  /** 현재 보드 상태 */
  board: Board;

  /** 바둑판 크기 (px 단위) */
  boardSize: number;

  /** 바둑판 스타일 설정 */
  boardStyleConfig: BoardStyleConfig;

  /** 바둑판 클릭 이벤트 핸들러 */
  handleMove: (coord: Coordinate) => void;

  /** 비활성화 여부 */
  disabled?: boolean;
};
export default function CanvasBoardView({
  board,
  boardSize,
  boardStyleConfig,
  handleMove: onMove,
  disabled = false,
}: CanvasBoardViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasBoardRenderer = useRef<CanvasBoardRenderer>(new CanvasBoardRenderer());

  useEffect(() => {
    canvasBoardRenderer.current.init(canvasRef.current, boardSize, boardStyleConfig);
  }, [boardStyleConfig, boardSize]);

  useEffect(() => {
    canvasBoardRenderer.current.renderBoard(board);
  }, [board]);

  function onMouseUp(event: React.MouseEvent<HTMLCanvasElement>) {
    if (disabled) return;
    if (canvasBoardRenderer.current.initialized === false) {
      console.log('CanvasBoardRenderer is not initialized');
      return;
    }
    const canvasY = event.nativeEvent.offsetY;
    const canvasX = event.nativeEvent.offsetX;
    const [y, x] = BoardMetrics.toBoardCoords(canvasY, canvasX, boardSize, board.dimension);

    onMove(new Coordinate(y, x));
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
      onMouseUp={onMouseUp}
    />
  );
}
