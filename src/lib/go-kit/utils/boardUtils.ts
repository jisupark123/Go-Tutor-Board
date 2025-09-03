import Board from '@/lib/go-kit/core/model/board';
import Stone from '@/lib/go-kit/core/model/stone';

class BoardUtils {
  static asciiToBoard(asciiBoard: string): Board {
    const mapping: Record<string, Stone> = {
      '+': Stone.EMPTY,
      x: Stone.BLACK,
      o: Stone.WHITE,
    };

    const rows = asciiBoard.trim().split('\n');
    const dimension = rows.length;

    const boardArray: Stone[][] = rows.map((row, _) =>
      row.split('').map((char, _) => {
        const stone = mapping[char];
        if (!stone) {
          throw new Error(`Invalid character: ${char}`);
        }
        return stone;
      }),
    );

    return new Board(dimension, boardArray);
  }

  static boardToAscii(board: Board): string {
    const mapping: Record<Stone, string> = {
      [Stone.EMPTY]: '+',
      [Stone.BLACK]: 'x',
      [Stone.WHITE]: 'o',
    };

    const asciiRows = board.state.map((row) => row.map((stone) => mapping[stone]).join(''));
    return '\n' + asciiRows.join('\n') + '\n';
  }
}

export default BoardUtils;
