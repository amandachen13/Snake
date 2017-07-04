const Snake = require('./snake');
const Apple = require('./apple');

class Board {
  constructor(dim) {
    this.dim = dim;

    this.snake = new Snake(this);
    this.apple = new Apple(this);
  }

  static blankGrid(dim) {
    const grid = [];

    for (let x = 0; x < dim; x ++) {
      const row = [];
      for (let y = 0; y < dim; y ++) {
        row.push(Board.BLANK_SYMBOL);
      }
      grid.push(row);
    }

    return grid;
  }

  render() {
    const grid = Board.blankGrid(this.dim);

    // render snake
    this.snake.segments.forEach( segment => {
      grid[segment.x][segment.y] = Snake.SYMBOL;
    });

    // render apple
    grid[this.apple.position.x][this.apple.position.y] = Apple.SYMBOL;

    // join rows
    const gridStr = grid.map( row => row.join("") ).join("\n");
    return gridStr;
  }

  validPosition(coord) {
    return (coord.x >= 0) && (coord.x < this.dim)
      && (coord.y >= 0) && (coord.y < this.dim);
  }

}

Board.BLANK_SYMBOL = ".";

module.exports = Board;
