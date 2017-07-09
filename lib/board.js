const Snake = require('./snake');
const Apple = require('./apple');

class Board {
  constructor(dim) {
    this.dim = dim;

    this.snake = new Snake(this);
    this.apple = new Apple(this);

    this.score = 0;
  }

  validPosition(coord) {
    return (coord.x >= 0) && (coord.x < this.dim)
      && (coord.y >= 0) && (coord.y < this.dim);
  }

}

Board.BLANK_SYMBOL = ".";

module.exports = Board;
