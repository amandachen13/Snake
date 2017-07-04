const Board = require('./board');

class View {
  constructor() {

    this.board = new Board(20);
  }

  step() {
    if (this.board.snake.segements.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      alert("You lose!");
      //
    }
  }

  setup() {

  }

  render() {

  }

}

View.KEYS = {
  38: "N",
  39: "E",
  40: "S",
  37: "W",
}

module.exports = View;
