// import { useState, useCallback } from 'react';

// import type Board from '@/lib/go-kit/core/model/board';
// import type Coordinate from '@/lib/go-kit/core/model/coordinate';
// import type { GameResult } from '@/lib/go-kit/game/gameResult';
// import type { GameState } from '@/lib/go-kit/game/gameState';
// import type SelfGame from '@/lib/go-kit/game/selfGame';

// export function useSelfGame(_game: SelfGame) {
//   const [game] = useState(_game);
//   const [state, setState] = useState<GameState>(game.state);

//   const playMove = useCallback(
//     (coordinate: Coordinate): Board | null => {
//       const success = game.playMove(coordinate);
//       if (success) {
//         setState(game.state); // Game 내부 상태 반영
//         return game.state.currentBoard;
//       }
//       return null;
//     },
//     [game],
//   );

//   const checkResult = useCallback(async (): Promise<GameResult> => {
//     const result = await game.checkResult();
//     return result;
//   }, [game]);

//   return {
//     gameState: state,
//     playMove,
//     checkResult,
//   };
// }
