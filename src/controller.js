import {
  renderBoard,
  renderStatus,
  renderTurn,
  renderWinner,
  hideGrid,
} from "./view";
import { Ship, Gameboard, Player } from "./model";
const placementBtn = document.querySelector("#placement");
const confirmBtn = document.querySelector("#confirmBtn");
const dialog = document.querySelector("dialog");
const setStructure = () => {
  placementBtn.addEventListener("click", () => {
    placementBtn.textContent = placementBtn.textContent === "h" ? "v" : "h";
  });
  confirmBtn.addEventListener("click", (e) => {
    e.preventDefault();
    dialog.close(confirmBtn.value);
  });
};
class Game {
  constructor() {
    this.p1 = new Player("bakr", document.querySelector(".player"));
    this.p2 = new Player("ziad", document.querySelector(".enemy"), true);
    this.current = this.p1;
    this.next = this.p2;
    this.ships = [
      { name: "Cruiser", id: 1, length: 5 },
      { name: "Battleship", id: 2, length: 4 },
      { name: "Carrier", id: 3, length: 3 },
      { name: "Submarine", id: 4, length: 2 },
      { name: "Destroyer", id: 5, length: 2 },
    ];
  }
  async placementLoop() {
    let placement = document.querySelector("#placement");
    this.current.board.board = [];
    for (let i = 0; i < this.current.board.size; i++) {
      this.current.board.board[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    for (let i = 0; i < 5; i++) {
      renderTurn(this.current.name);
      const ship = this.ships.find((s) => s.id === i + 1);
      renderStatus(`Place your ${ship.name}`);
      renderBoard(this.current);
      hideGrid(this.next);
      let result, coords;
      do {
        coords = await this.addListener(this.current);
        result = this.current.board.checkShipPlacement(
          coords.x,
          coords.y,
          placement.textContent,
          ship
        );
        this.removeListener(this.current);
      } while (!result);
      this.current.board.placeShip(
        coords.x,
        coords.y,
        placement.textContent,
        ship
      );
      renderBoard(this.current);
    }
    this.switchTurn(this.current, this.next);
  }
  isGameOver() {
    if (this.next.board.fleetSunk()) return true;
    else return false;
  }
  addListener(player) {
    return new Promise((resolve) => {
      const divs = player.UI.children;
      const size = player.board.size;
      for (let i = 0; i < divs.length; i++) {
        divs[i].addEventListener("click", () => {
          resolve({ x: Math.floor(i / size), y: i % size });
        });
      }
    });
  }
  removeListener(player) {
    const divs = player.UI.children;
    for (let i = 0; i < divs.length; i++) {
      let old_element = divs[i];
      let new_element = old_element.cloneNode(true);
      old_element.parentNode.replaceChild(new_element, old_element);
    }
  }
  async gameLoop() {
    while (true) {
      renderTurn(this.current.name);
      renderBoard(this.current);
      hideGrid(this.next);
      const coords = await this.addListener(this.next);
      const result = this.current.attack(this.next, coords.x, coords.y);
      const str = result === -1 ? "already hit" : result === 0 ? "miss" : "hit";
      renderStatus(
        `${this.current.name} attacks ${this.next.name} at (${coords.x}, ${coords.y}) with ${str} `
      );
      if (result === -1) {
        continue;
      }
      if (result === 1) {
        if (this.isGameOver()) {
          break;
        }
      }

      this.switchTurn(this.next, this.current);
    }
    renderBoard(this.p1);
    renderBoard(this.p2);
    this.removeListener(this.p1);
    this.removeListener(this.p2);
    renderWinner(this.current.name);
  }

  switchTurn(src, dest) {
    this.removeListener(src);
    this.addListener(dest);
    let tmp = this.current;
    this.current = this.next;
    this.next = tmp;
  }
}
setStructure();
const game = new Game();
game
  .placementLoop()
  .then(() => game.placementLoop())
  .then(() => game.gameLoop());
