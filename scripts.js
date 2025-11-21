/* --- Game State --- */
const state = {
  board: Array(9).fill(null),
  xIsNext: true,
  gameActive: true,
  isVsCpu: true, // Default to Playing against computer
  cpuThinking: false,
};

/* --- DOM Elements --- */
const statusDisplay = document.getElementById("status");
const cells = document.querySelectorAll(".cell");
const resetBtn = document.getElementById("resetBtn");
const modeBtn = document.getElementById("modeBtn");

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

  // Ignore if:
  // 1. Cell is occupied
  // 2. Game is over
  // 3. It's CPU's turn (and we are in CPU mode)
  if (
    state.board[clickedCellIndex] !== null ||
    !state.gameActive ||
    (state.isVsCpu && !state.xIsNext)
  ) {
    return;
  }

  // Human Move
  handleCellPlayed(clickedCell, clickedCellIndex);
  handleResultValidation();
}

// Handle keyboard navigation (arrow keys and Enter)
function handleCellKeyDown(e) {
  const currentCell = e.target;
  const currentIndex = parseInt(currentCell.getAttribute("data-index"));
  let nextIndex = currentIndex;

  switch (e.key) {
    case 'ArrowUp':
      nextIndex = Math.max(0, currentIndex - 3);
      e.preventDefault();
      break;
    case 'ArrowDown':
      nextIndex = Math.min(8, currentIndex + 3);
      e.preventDefault();
      break;
    case 'ArrowLeft':
      if (currentIndex % 3 !== 0) {
        nextIndex = currentIndex - 1;
      }
      e.preventDefault();
      break;
    case 'ArrowRight':
      if (currentIndex % 3 !== 2) {
        nextIndex = currentIndex + 1;
      }
      e.preventDefault();
      break;
    case 'Enter':
    case ' ':
      handleCellClick(e);
      e.preventDefault();
      return;
    default:
      return;
  }

  cells[nextIndex].focus();
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
  cell.setAttribute("aria-pressed", "true");
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

  // Trigger CPU if it's CPU mode and O's turn
  if (state.gameActive && state.isVsCpu && !state.xIsNext) {
    state.cpuThinking = true;
    setTimeout(cpuPlay, 600); // Small delay for realism
  }
}

/* --- CPU AI Logic --- */
function cpuPlay() {
  if (!state.gameActive) return;

  let moveIndex = -1;

  // Priority 1: Check for a winning move for O
  moveIndex = findBestMove("O");

  // Priority 2: Check for a blocking move (prevent X from winning)
  if (moveIndex === -1) {
    moveIndex = findBestMove("X");
  }

  // Priority 3: Take the center if available
  if (moveIndex === -1 && state.board[4] === null) {
    moveIndex = 4;
  }

  // Priority 4: Random move
  if (moveIndex === -1) {
    const availableMoves = state.board
      .map((val, idx) => (val === null ? idx : null))
      .filter((val) => val !== null);

    if (availableMoves.length > 0) {
      moveIndex =
        availableMoves[Math.floor(Math.random() * availableMoves.length)];
    }
  }

  // Execute Move
  if (moveIndex !== -1) {
    const cell = cells[moveIndex];
    handleCellPlayed(cell, moveIndex);
    state.cpuThinking = false;
    handleResultValidation();
  }
}

// Helper to find a winning cell for a specific player
function findBestMove(playerSymbol) {
  for (let i = 0; i < winningConditions.length; i++) {
    const [a, b, c] = winningConditions[i];
    const line = [state.board[a], state.board[b], state.board[c]];

    // If we have 2 of the target player and 1 empty, that's the spot
    const playerCount = line.filter((val) => val === playerSymbol).length;
    const emptyCount = line.filter((val) => val === null).length;

    if (playerCount === 2 && emptyCount === 1) {
      // Return the index of the null cell
      if (state.board[a] === null) return a;
      if (state.board[b] === null) return b;
      if (state.board[c] === null) return c;
    }
  }
  return -1;
}

function updateStatusDisplay() {
  if (state.xIsNext) {
    statusDisplay.innerText = state.isVsCpu
      ? "Your Turn (X)"
      : "Player X's Turn";
    statusDisplay.className = "status-bar x-turn";
  } else {
    statusDisplay.innerText = state.isVsCpu
      ? "CPU Thinking..."
      : "Player O's Turn";
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
  state.cpuThinking = false;

  updateStatusDisplay();

  cells.forEach((cell) => {
    cell.innerHTML = "";
    cell.classList.remove("taken", "is-winner");
    cell.setAttribute("aria-pressed", "false");
  });
  
  // Set focus to first cell for better accessibility
  cells[0].focus();
}

function toggleMode() {
  state.isVsCpu = !state.isVsCpu;
  modeBtn.innerText = state.isVsCpu ? "Mode: vs CPU" : "Mode: 2 Player";

  // Visual toggle style
  if (state.isVsCpu) {
    modeBtn.classList.add("active");
  } else {
    modeBtn.classList.remove("active");
  }

  handleRestartGame();
}

/* --- Event Listeners --- */
cells.forEach((cell) => {
  cell.addEventListener("click", handleCellClick);
  cell.addEventListener("keydown", handleCellKeyDown);
});
resetBtn.addEventListener("click", handleRestartGame);
modeBtn.addEventListener("click", toggleMode);

// Init status text
updateStatusDisplay();
// Set initial focus for accessibility
cells[0].focus();