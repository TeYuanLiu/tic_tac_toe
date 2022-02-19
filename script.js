const X_CLASS = "x";
const O_CLASS = "o";
const WINNING_COMBINATION = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const welcomeMessage = document.getElementById("welcomeMessage");
const easyModeButton = document.getElementById("easyModeButton");
const hardModeButton = document.getElementById("hardModeButton");

const orderMessage = document.getElementById("orderMessage");
const goFirstButton = document.getElementById("goFirstButton");
const goSecondButton = document.getElementById("goSecondButton");

const board = document.getElementById("board");
const cells = document.querySelectorAll("[data-cell]");

const outcomeMessage = document.getElementById("outcomeMessage");
const outcomeMessageText = document.querySelector(
  "[data-outcome-message-text]"
);
const restartButton = document.getElementById("restartButton");

let easyMode = true;
let goFirst = true;
let xTurn = true;

easyModeButton.addEventListener("click", () => {
  easyMode = true;
  showOrderMessage();
});

hardModeButton.addEventListener("click", () => {
  easyMode = false;
  showOrderMessage();
});

function showOrderMessage() {
  welcomeMessage.classList.remove("show");
  orderMessage.classList.add("show");
}

goFirstButton.addEventListener("click", () => {
  goFirst = true;
  startGame();
});

goSecondButton.addEventListener("click", () => {
  goFirst = false;
  startGame();
});

restartButton.addEventListener("click", () => {
  clearCells();
  outcomeMessage.classList.remove("show");
  welcomeMessage.classList.add("show");
});

cells.forEach((cell) => {
  cell.addEventListener("click", handleClick);
});

function startGame() {
  xTurn = true;
  clearCells();
  if (goFirst) {
    setBoardHoverClass();
  } else {
    queryBot();
  }
  orderMessage.classList.remove("show");
}

function clearCells() {
  cells.forEach((cell) => {
    cell.classList.remove(X_CLASS);
    cell.classList.remove(O_CLASS);
  });
}

function setBoardHoverClass() {
  unsetBoardHoverClass();
  if (xTurn) {
    board.classList.add(X_CLASS);
  } else {
    board.classList.add(O_CLASS);
  }
}

function unsetBoardHoverClass() {
  board.classList.remove(X_CLASS);
  board.classList.remove(O_CLASS);
}

function handleClick(e) {
  if ((goFirst && !xTurn) || (!goFirst && xTurn)) {
    return;
  }
  const cell = e.target;
  if (cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS)) {
    return;
  }
  const currentClass = xTurn ? X_CLASS : O_CLASS;
  placeMark(cell, currentClass);
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    queryBot();
  }
}

function placeMark(cell, currentClass) {
  cell.classList.add(currentClass);
}

function checkWin(currentClass) {
  return WINNING_COMBINATION.some((combination) => {
    return combination.every((index) => {
      return cells[index].classList.contains(currentClass);
    });
  });
}

function isDraw() {
  return [...cells].every((cell) => {
    return cell.classList.contains(X_CLASS) || cell.classList.contains(O_CLASS);
  });
}

function endGame(draw) {
  if (draw) {
    outcomeMessageText.innerHTML = "Draw";
  } else {
    outcomeMessageText.innerText = `You ${
      (goFirst && xTurn) || (!goFirst && !xTurn) ? "Win" : "Lose"
    }`;
  }
  outcomeMessage.classList.add("show");
}

function swapTurns() {
  xTurn = !xTurn;
}

async function queryBot() {
  unsetBoardHoverClass();
  let query = easyMode ? "easy/" : "hard/";
  for (let i = 0; i < cells.length; ++i) {
    const cell = cells[i];
    if (cell.classList.contains(X_CLASS)) {
      query += xTurn ? "o" : "x";
    } else if (cell.classList.contains(O_CLASS)) {
      query += xTurn ? "x" : "o";
    } else {
      query += "-";
    }
  }
  const url =
    "https://alpha-tictactoe-zero-dual-mode.herokuapp.com/api/" + query;
  try {
    const response = await fetch(url);
    const a = Number(await response.json());
    const cell = cells[a];
    if (xTurn) {
      cell.classList.add(X_CLASS);
    } else {
      cell.classList.add(O_CLASS);
    }
  } catch (err) {
    alert(err);
  }

  const currentClass = xTurn ? X_CLASS : O_CLASS;
  if (checkWin(currentClass)) {
    endGame(false);
  } else if (isDraw()) {
    endGame(true);
  } else {
    swapTurns();
    setBoardHoverClass();
  }
}
