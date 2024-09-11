import { useEffect } from "react";

function isMovesLeft(board) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) return true;
    }
  }
  return false;
}

function evaluate(board) {
  for (let row = 0; row < 3; row++) {
    if (board[row][0] === board[row][1] && board[row][1] === board[row][2]) {
      if (board[row][0] === "O") return +10;
      else if (board[row][0] === "X") return -10;
    }
  }
  for (let col = 0; col < 3; col++) {
    if (board[0][col] === board[1][col] && board[1][col] === board[2][col]) {
      if (board[0][col] === "O") return +10;
      else if (board[0][col] === "X") return -10;
    }
  }
  if (board[0][0] === board[1][1] && board[1][1] === board[2][2]) {
    if (board[0][0] === "O") return +10;
    else if (board[0][0] === "X") return -10;
  }
  if (board[0][2] === board[1][1] && board[1][1] === board[2][0]) {
    if (board[0][2] === "O") return +10;
    else if (board[0][2] === "X") return -10;
  }
  return 0;
}

function minimax(board, depth, isMax) {
  let score = evaluate(board);
  if (score === 10) return score - depth;
  if (score === -10) return score + depth;
  if (!isMovesLeft(board)) return 0;

  if (isMax) {
    let best = -Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          board[row][col] = "O";
          best = Math.max(best, minimax(board, depth + 1, false));
          board[row][col] = null;
        }
      }
    }
    return best;
  } else {
    let best = Infinity;
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (board[row][col] === null) {
          board[row][col] = "X";
          best = Math.min(best, minimax(board, depth + 1, true));
          board[row][col] = null;
        }
      }
    }
    return best;
  }
}

function findBestMove(board) {
  let bestVal = -Infinity;
  let bestMove = { row: -1, col: -1 };

  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col] === null) {
        board[row][col] = "O";
        let moveVal = minimax(board, 0, false);
        board[row][col] = null;
        if (moveVal > bestVal) {
          bestMove = { row: row, col: col };
          bestVal = moveVal;
        }
      }
    }
  }
  return bestMove;
}

export default function GameBoard({
  onSelectSquare,
  board,
  activePlayer,
  hasDraw,
}) {
  let bestMove;
  useEffect(() => {
    if (activePlayer === "O" && !hasDraw) {
      bestMove = findBestMove(board);
      console.log(bestMove);
      onSelectSquare(bestMove.row, bestMove.col);
    }
  }, [activePlayer === "O" && !hasDraw]);

  return (
    <ol id="game-board">
      {board.map((row, rowIndex) => (
        <li key={rowIndex}>
          <ol>
            {row.map((playerSymbol, colIndex) => (
              <li key={colIndex}>
                <button
                  onClick={() => onSelectSquare(rowIndex, colIndex)}
                  disabled={playerSymbol !== null}
                >
                  {playerSymbol}
                </button>
              </li>
            ))}
          </ol>
        </li>
      ))}
    </ol>
  );
}
