const Coord = require('./coord');

class Apple {
  constructor(board) {
    this.board = board;
    this.position = null;
    this.place();
  }

  place() {
    // can't place apple on a snake segment
    while (this.position === null ||
           this.board.snake.isOccupying(this.position)) {
      const x = Math.floor(Math.random() * this.board.dim);
      const y = Math.floor(Math.random() * this.board.dim);
      this.position = new Coord(x, y);
    }

  }

}

Apple.SYMBOL = "A";

module.exports = Apple;
