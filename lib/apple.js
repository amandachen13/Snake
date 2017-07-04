const Coord = require('./coord');

class Apple {
  constructor(board) {
    this.board = board;
    this.place();
  }

  place() {
    const x = Math.floor(Math.random() * this.board.dim);
    const y = Math.floor(Math.random() * this.board.dim);

    // can't place apple on a snake segment
    while (this.board.snake.isOccupying([x, y])) {
      const x = Math.floor(Math.random() * this.board.dim);
      const y = Math.floor(Math.random() * this.board.dim);
    }

    this.position = new Coord(x, y);
  }

}

Apple.SYMBOL = "A";

module.exports = Apple;
