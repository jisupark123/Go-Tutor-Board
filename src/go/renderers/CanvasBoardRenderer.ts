import type Board from '@/lib/go-kit/core/model/board';
import Coordinate from '@/lib/go-kit/core/model/coordinate';
import type Move from '@/lib/go-kit/core/model/move';
import Stone from '@/lib/go-kit/core/model/stone';

import type { BoardStyleConfig } from '@/go/configs/boardStyleConfig';
import type { BoardDimension } from '@/go/types/boardDimension';
import BoardMetrics from '@/go/utils/boardMetrics';

function assertExists<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) throw new Error(message);
  return value;
}

export default class CanvasBoardRenderer {
  private canvas!: HTMLCanvasElement;
  private ctx!: CanvasRenderingContext2D;
  private boardSize!: number;
  private boardStyleConfig!: BoardStyleConfig;
  private blackStoneImage!: HTMLImageElement;
  private whiteStoneImage!: HTMLImageElement;

  public initialized: boolean = false;

  async init(canvas: HTMLCanvasElement | null, boardSize: number, boardStyleConfig: BoardStyleConfig): Promise<void> {
    if (this.initialized) return;
    const ctx = canvas?.getContext('2d');
    this.canvas = assertExists(canvas, 'Canvas not available');
    this.ctx = assertExists(ctx, 'Context not available');
    this.boardSize = boardSize;
    this.boardStyleConfig = boardStyleConfig;
    await this.loadStoneImages();

    this.initialized = true;
  }

  async renderBoard(board: Board, currentMove: Move | null, showStarPoints: boolean): Promise<void> {
    this.upscaleCanvas();
    // this.paintBoardBackground(ctx, boardStyleConfig, boardSize);
    // await this.paintBoardBackgroundImage(ctx, boardStyleConfig, boardSize);
    this.paintLineGrid(board);
    if (showStarPoints) {
      this.paintStarPoints(board);
    }
    this.paintStones(board);

    if (currentMove) {
      this.paintCurrentMove(board, currentMove);
    }
  }

  private loadStoneImages(): Promise<void> {
    const loadImage = (url: string): Promise<HTMLImageElement> =>
      new Promise((resolve, reject) => {
        const img = new Image();
        img.src = url;
        img.onload = () => resolve(img);
        img.onerror = (err) => reject(err);
      });

    return Promise.all([
      loadImage(this.boardStyleConfig.blackStoneImageUrl).then((img) => (this.blackStoneImage = img)),
      loadImage(this.boardStyleConfig.whiteStoneImageUrl).then((img) => (this.whiteStoneImage = img)),
    ]).then(() => undefined);
  }

  private upscaleCanvas(): void {
    const dpr = window.devicePixelRatio;
    this.canvas.width = this.boardSize * dpr;
    this.canvas.height = this.boardSize * dpr;
    this.ctx.scale(dpr, dpr);
  }

  private paintBoardBackground(): void {
    this.ctx.fillStyle = this.boardStyleConfig.bgColor;
    this.ctx.fillRect(0, 0, this.boardSize, this.boardSize);
    this.ctx.stroke();
  }

  private paintBoardBackgroundImage(): Promise<void> {
    const img = new Image();
    return new Promise((resolve, reject) => {
      img.src = this.boardStyleConfig.bgImageUrl;
      img.onload = () => {
        this.ctx.drawImage(img, 0, 0, this.boardSize, this.boardSize);
        resolve();
      };
      img.onerror = (error) => {
        reject(error);
      };
    });
  }

  private paintLineGrid(board: Board): void {
    const { lineWidth } = BoardMetrics;
    const { lineColor } = this.boardStyleConfig;
    const endMargin = BoardMetrics.endMargin(this.boardSize, board.dimension);
    const lineGap = BoardMetrics.lineGap(this.boardSize, board.dimension) + lineWidth;

    this.ctx.lineWidth = lineWidth;
    this.ctx.strokeStyle = lineColor;

    // 가로선 그리기
    let y = endMargin;
    for (let i = 0; i < board.dimension; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(endMargin, y);
      this.ctx.lineTo(this.boardSize - endMargin, y);
      this.ctx.stroke();
      y += lineGap;
    }

    // 세로선 그리기
    let x = endMargin;
    for (let i = 0; i < board.dimension; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(x, endMargin);
      this.ctx.lineTo(x, this.boardSize - endMargin);
      this.ctx.stroke();
      x += lineGap;
    }
  }

  private paintStarPoints(board: Board): void {
    const starPoints = BoardMetrics.starPoints(board.dimension as BoardDimension);
    const starPointSize = BoardMetrics.starPointSize(this.boardSize, board.dimension);

    this.ctx.lineWidth = starPointSize;
    this.ctx.fillStyle = this.boardStyleConfig.starPointColor;
    starPoints.forEach((point) => {
      const [y, x] = BoardMetrics.toCanvasCoordinate(this.boardSize, board.dimension as BoardDimension, point);
      this.ctx.beginPath();
      this.ctx.arc(x, y, starPointSize / 2, 0, Math.PI * 2); // x, y, 반지름, 시작 각도, 끝 각도
      this.ctx.fill();
    });
  }

  private paintStones(board: Board): void {
    const stoneSize = BoardMetrics.stoneSize(this.boardSize, board.dimension as BoardDimension);

    const { state } = board;
    state.forEach((row, y) => {
      row.forEach((stone, x) => {
        if (stone !== Stone.EMPTY) {
          const [canvasY, canvasX] = BoardMetrics.toCanvasCoordinate(
            this.boardSize,
            board.dimension as BoardDimension,
            new Coordinate(y, x),
          );
          const stoneImage = stone === 'BLACK' ? this.blackStoneImage : this.whiteStoneImage;
          this.ctx.drawImage(stoneImage, canvasX - stoneSize / 2, canvasY - stoneSize / 2, stoneSize, stoneSize);
        }
      });
    });
  }

  private paintCurrentMove(board: Board, move: Move) {
    const markSize = BoardMetrics.currentMoveMarkSize(this.boardSize, board.dimension as BoardDimension, move.stone);
    const [canvasY, canvasX] = BoardMetrics.toCanvasCoordinate(
      this.boardSize,
      board.dimension,
      new Coordinate(move.y, move.x),
    );
    this.ctx.fillStyle =
      move.stone === 'BLACK'
        ? this.boardStyleConfig.blackCurrentMoveMarkColor
        : this.boardStyleConfig.whiteCurrentMoveMarkColor;
    this.ctx.beginPath();
    this.ctx.moveTo(canvasX, canvasY); // 왼쪽 위 모서리 (꼭짓점)
    this.ctx.lineTo(canvasX + markSize, canvasY); // 오른쪽으로
    this.ctx.lineTo(canvasX, canvasY + markSize); // 아래쪽으로
    this.ctx.closePath();
    this.ctx.fill();
  }

  private paintStonePreview(move: Move, board: Board): void {
    const { y, x, stone } = move;
    const stoneSize = BoardMetrics.stoneSize(this.boardSize, board.dimension);
    const [canvasY, canvasX] = BoardMetrics.toCanvasCoordinate(this.boardSize, board.dimension, new Coordinate(y, x));
    this.ctx.fillStyle =
      stone === 'BLACK' ? this.boardStyleConfig.blackStoneColor : this.boardStyleConfig.whiteStoneColor;
    this.ctx.beginPath();
    this.ctx.arc(canvasX, canvasY, stoneSize / 2, 0, Math.PI * 2);
    this.ctx.fill();
  }
}
