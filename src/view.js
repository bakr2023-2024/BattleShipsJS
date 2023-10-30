import style from "./style.css";
const N = 10;
const renderGrids = () => {
  const boards = document.querySelectorAll(".board");
  boards.forEach((board) => {
    for (let i = 0; i < N; i++) {
      for (let j = 0; j < N; j++) {
        const div = document.createElement("div");
        div.classList.add("grid");
        board.appendChild(div);
      }
    }
  });
};
renderGrids();
const renderBoard = (player) => {
  const board = player.board.board;
  const container = player.UI;
  const divs = container.querySelectorAll(".grid");
  const size = board.length;
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const div = divs[j + i * size];
      if (board[i][j] === 0) {
        div.style.backgroundColor = "blue";
      } else if (board[i][j] === -1) {
        div.style.backgroundColor = "red";
      } else {
        div.style.backgroundColor = "green";
      }
    }
  }
};
const renderStatus = (text) => {
  document.querySelector("#stat").textContent = text;
};
const hideGrid = (player) => {
  const divs = player.UI.children;
  const size = player.board.board.length;
  for (let i = 0; i < divs.length; i++) {
    let x = Math.floor(i / size);
    let y = i % size;
    if (player.board.board[x][y] === -1) {
      divs[i].style.backgroundColor = "red";
    } else {
      divs[i].style.backgroundColor = "grey";
    }
  }
};
const renderTurn = (turn) => {
  document.querySelector("#turn").textContent = `${turn}'s turn`;
};
const renderWinner = (winner) => {
  document.querySelector("#winner").textContent = `${winner} wins!`;
};
export { renderBoard, renderStatus, renderTurn, renderWinner, hideGrid };
