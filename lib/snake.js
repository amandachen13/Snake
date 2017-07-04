const Coord = require('./coord');

class Snake {
  constructor(board) {
    this.direction = "N";
    this.turning = false;
    this.board = board;

    const center = new Coord(Math.floor(board.dim / 2), Math.floor(board.dim / 2));
    this.segments = [center];

    this.growing = 0;
  }

  head() {
    return this.segments.slice(-1)[0];
  }

  move() {
    // move snake
    this.segments.push(this.head().plus(Snake.DIR[this.direction]));

    // allow turning
    this.turning = false;

    // eat apple
    if (this.eatApple()) {
      this.board.apple.replace();
    }

    // if snake is not growing, remove tail
    if (this.growing > 0) {
      this.growing -= 1;
    } else {
      this.segments.shift();
    }

    // destroy snake if not valid
    if (!this.isValid()) {
      this.segments = [];
    }
  }

  eatApple() {
    if (this.head().equals(this.board.apple.position)) {
      this.growing += 3;
      return true;
    } else {
      return false;
    }
  }

  isValid() {
    const head = this.head();

    // return false if snake goes off the board
    if (!this.board.validPosition(head)) {
      return false;
    }

    // return false if snake eats itself
    for (let i = 0; i < this.segments.length - 1; i++) {
      if (this.segments[i].equals(head)) {
        return false;
      }
    }

    return true;
  }

  turn(newDirection) {
    if (Snake.DIR[this.direction].isOpposite(Snake.DIR[newDirection])) {
      return;
    } else {
      this.turning = true;
      this.direction = newDirection;
    }
  }

  isOccupying(position) {
    this.segments.forEach( segment => {
      if (segment.x === position[0] && segment.y === position[1]) {
        return true;
      }
    });

    return false;
  }

}

Snake.DIR = {
  "N": new Coord(-1, 0),
  "E": new Coord(0, 1),
  "S": new Coord(1, 0),
  "W": new Coord(0, -1),
}

Snake.SYMBOL = "S";

module.exports = Snake;
