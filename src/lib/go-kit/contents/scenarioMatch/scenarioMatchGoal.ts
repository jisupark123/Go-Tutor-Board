export type ScenarioMatchGoal =
  | {
      type: 'Point'; // 집이 많은 쪽이 승리 (일반 바둑 규칙)
      komi: number; // 덤
      minMoves: number; // 최소 몇 수 후에 판정할지
    }
  | {
      type: 'Capture'; // 특정 수만큼 돌을 잡으면 승리
      stonesToCapture: number; // 몇 개 잡아야 하는지
    };
