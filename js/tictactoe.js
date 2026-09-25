// Pure tic-tac-toe rules. Board is a 9-char string: "X", "O" or ".".

export const EMPTY_BOARD = ".........";

const LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

/** "X" | "O" | "draw" | null */
export const getWinner = (board) => {
  for (const [a, b, c] of LINES) {
    if (board[a] !== "." && board[a] === board[b] && board[a] === board[c]) return board[a];
  }
  return board.includes(".") ? null : "draw";
};

export const getWinningLine = (board) =>
  LINES.find(([a, b, c]) => board[a] !== "." && board[a] === board[b] && board[a] === board[c]) || null;

/** Returns the new board, or null if the move is illegal. */
export const applyMove = (board, index, mark) => {
  if (index < 0 || index > 8 || board[index] !== "." || getWinner(board)) return null;
  return board.slice(0, index) + mark + board.slice(index + 1);
};
