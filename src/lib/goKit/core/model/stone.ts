// TypeScript에서는 runtime enum 대신 literal union 타입을 사용하는 방법이 추천됨
export const Stone = {
  EMPTY: 'EMPTY',
  BLACK: 'BLACK',
  WHITE: 'WHITE',
} as const;

export type Stone = (typeof Stone)[keyof typeof Stone];

// opposite 기능을 함수로 구현
export function oppositeStone(stone: Stone): Stone {
  switch (stone) {
    case Stone.BLACK:
      return Stone.WHITE;
    case Stone.WHITE:
      return Stone.BLACK;
    case Stone.EMPTY:
      return Stone.EMPTY;
  }
}

export default Stone;
