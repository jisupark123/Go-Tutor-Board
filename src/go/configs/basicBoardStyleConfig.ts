import boardSrc from '@/assets/board.jpg';
import blackStoneSrc from '@/assets/stone_black.svg';
import whiteStoneSrc from '@/assets/stone_white.svg';
import type { BoardStyleConfig } from '@/go/configs/boardStyleConfig';

export default class BasicBoardStyleConfig implements BoardStyleConfig {
  readonly bgColor = '#E2E0CC';
  readonly bgImageUrl = boardSrc;
  readonly blackStoneImageUrl = blackStoneSrc;
  readonly whiteStoneImageUrl = whiteStoneSrc;
  // readonly lineColor = '#797876';
  readonly lineColor = '#000000';
  // readonly starPointColor = '#8C878A';
  readonly starPointColor = '#000000';
  readonly blackStoneColor = '#000000';
  readonly whiteStoneColor = '#ffffff';
  readonly blackStonePreviewColor = 'rgba(0, 0, 0, 0.3)';
  readonly whiteStonePreviewColor = 'rgba(255, 255, 255, 0.8)';
  readonly blackCurrentMoveColor = '#ffffff';
  readonly whiteCurrentMoveColor = '#0000ff';
}
