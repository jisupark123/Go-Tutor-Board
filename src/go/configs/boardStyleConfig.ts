export interface BoardStyleConfig {
  readonly bgColor: string; // 바둑판 배경색
  readonly bgImageUrl: string; // 바둑판 배경 이미지 URL
  readonly blackStoneImageUrl: string; // 흑돌 이미지 URL
  readonly whiteStoneImageUrl: string; // 백돌 이미지 URL
  readonly lineColor: string; // 바둑판 선 색
  readonly starPointColor: string; // 바둑판 점 색
  readonly blackStoneColor: string; // 흑돌 색
  readonly whiteStoneColor: string; // 백돌 색
  readonly blackStonePreviewColor: string; // 흑돌 미리보기 색
  readonly whiteStonePreviewColor: string; // 백돌 미리보기 색
  readonly blackCurrentMoveMarkColor: string; // 흑돌 현재 수 색
  readonly whiteCurrentMoveMarkColor: string; // 백돌 현재 수 색
}
