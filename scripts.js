/* --- Game State --- */
const state = {
  board: Array(9).fill(null),
  xIsNext: true,
  gameActive: true,
};

/* --- DOM Elements --- */
const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const resetBtn = document.getElementById("resetBtn");

/* --- Winning Conditions --- */
const winningConditions = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8], // Rows
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8], // Columns
  [0, 4, 8],
  [2, 4, 6], // Diagonals
];

/* --- Logic Functions --- */

function handleCellClick(e) {
  const clickedCell = e.target;
  const clickedCellIndex = parseInt(clickedCell.getAttribute("data-index"));

  // Ignore if cell occupied or game over
  if (state.board[clickedCellIndex] !== null || !state.gameActive) {
    return;
  }

  // Update State
  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

function handleCellPlayed(cell, index) {
  state.board[index] = state.xIsNext ? "X" : "O";

  // Add Visual Mark
  const mark = document.createElement("span");
  mark.classList.add("mark");
  if (state.xIsNext) {
    mark.classList.add("x-mark");
    mark.innerText = "X";
  } else {
    mark.classList.add("o-mark");
    mark.innerText = "O";
  }

  cell.appendChild(mark);
  cell.classList.add("taken");
}

function handleResultValidation() {
  let roundWon = false;
  let winningLine = [];

  for (let i = 0; i < winningConditions.length; i++) {
    const winCondition = winningConditions[i];
    let a = state.board[winCondition[0]];
    let b = state.board[winCondition[1]];
    let c = state.board[winCondition[2]];

    if (a === null || b === null || c === null) {
      continue;
    }
    if (a === b && b === c) {
      roundWon = true;
      winningLine = winCondition;
      break;
    }
  }

  if (roundWon) {
    statusDisplay.innerText = `Winner: ${state.xIsNext ? "X" : "O"}!`;
    state.gameActive = false;
    statusDisplay.className = "status-bar game-over";
    highlightWinningCells(winningLine);
    return;
  }

  // Check for Draw
  const roundDraw = !state.board.includes(null);
  if (roundDraw) {
    statusDisplay.innerText = "It's a Draw!";
    state.gameActive = false;
    statusDisplay.className = "status-bar game-over";
    return;
  }

  // Continue Game
  state.xIsNext = !state.xIsNext;
  updateStatusDisplay();
}

function updateStatusDisplay() {
  if (state.xIsNext) {
    statusDisplay.innerText = "Player X's Turn";
    statusDisplay.className = "status-bar x-turn";
  } else {
    statusDisplay.innerText = "Player O's Turn";
    statusDisplay.className = "status-bar o-turn";
  }
}

function highlightWinningCells(indices) {
  indices.forEach((index) => {
    cells[index].classList.add("is-winner");
  });
}

function handleRestartGame() {
  state.gameActive = true;
  state.xIsNext = true;
  state.board = Array(9).fill(null);

  statusDisplay.innerText = "Player X's Turn";
  statusDisplay.className = "status-bar x-turn";

  cells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("taken", "is-winner");
  });
}

/* --- Event Listeners --- */
cells.forEach((cell) => cell.addEventListener("click", handleCellClick));
resetBtn.addEventListener("click", handleRestartGame);