const Board = require('./board');

class View {
  constructor($el) {
    this.$el = $el;
    this.board = new Board(20);
    this.setGrid();
    this.render();
    this.initialized = false;

    $l(window).on("keydown", this.handleKey.bind(this));
  }

  step() {
    if (this.board.snake.segments.length > 0) {
      this.board.snake.move();
      this.render();
    } else {
      alert("You lose!");
      window.clearInterval(this.interval);
    }
  }

  handleKey(e) {
    if (View.KEYS[e.keyCode]) {
      e.preventDefault();
      if (!this.initialized) {
        this.interval = window.setInterval(this.step.bind(this), 100);
        this.initialized = true;
      }
      this.board.snake.turn(View.KEYS[e.keyCode]);
    }
  }

  setGrid() {
    let html = "";

    for (let x = 0; x < this.board.dim; x ++) {
      html += "<ul>";
      for (let y = 0; y < this.board.dim; y++) {
        html += "<li></li>";
      }
      html += "</ul>";
    }

    this.$el.html(html);
    this.$li = $l("li");
  }

  render() {
    $l(".snake").removeClass("snake");
    $l(".apple").removeClass("apple");
    $l(".score").html(`Score: ${this.board.score}`);

    this.board.snake.segments.forEach( (segment) => {
      this.updateClass(segment, "snake");
    });
    this.updateClass(this.board.apple.position, "apple");
  }

  updateClass(coord, className) {
    const row = coord.x;
    const col = coord.y;
    this.$li.select(row * this.board.dim + col).addClass(className);
  }

  reset() {

  }

}

View.KEYS = {
  38: "N",
  39: "E",
  40: "S",
  37: "W",
}

module.exports = View;
