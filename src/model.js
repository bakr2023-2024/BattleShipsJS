class Ship {
  constructor(id, length) {
    this.id = id;
    this.length = length;
    this.hits = 0;
  }
  hit() {
    this.hits++;
  }
  isSunk() {
    return this.length - this.hits === 0;
  }
}
class Gameboard {
  constructor(size) {
    this.board = [];
    for (let i = 0; i < size; i++) {
      this.board[i] = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }
    this.fleet = [];
    this.size = size;
  }
  placeShip(x, y, orient, build) {
    const ship = new Ship(build.id, build.length);
    if (orient === "h") {
      for (let i = y; i < y + ship.length; i++) {
        this.board[x][i] = ship.id;
      }
    } else {
      for (let i = x; i < x + ship.length; i++) {
        this.board[i][y] = ship.id;
      }
    }
    this.fleet.push(ship);
    return true;
  }
  checkShipPlacement(x, y, orient = "h", ship) {
    if (orient === "h")
      if (y + ship.length >= this.size) return false;
      else if (orient === "v") if (x + ship.length >= this.size) return false;
    if (orient === "h") {
      for (let i = y; i < y + ship.length; i++) {
        if (this.board[x][i] !== 0) {
          return false;
        }
      }
      return true;
    } else {
      for (let i = x; i < x + ship.length; i++) {
        if (this.board[i][y] !== 0) {
          return false;
        }
      }
      return true;
    }
  }
  receiveAttack(x, y) {
    if (this.board[x][y] === 0) return 0;
    else if (this.board[x][y] === -1) return -1;
    else {
      const ship = this.fleet.find((s) => s.id === this.board[x][y]);
      ship.hit();
      this.board[x][y] = -1;
      return 1;
    }
  }
  fleetSunk() {
    return this.fleet.every((ship) => ship.isSunk());
  }
}
class Player {
  constructor(name, UI, ai = false) {
    this.name = name;
    this.board = new Gameboard(10);
    this.ai = ai;
    this.UI = UI;
  }
  attack(enemy, x, y) {
    const result = enemy.board.receiveAttack(x, y);
    return result;
  }
}
export { Ship, Gameboard, Player };
