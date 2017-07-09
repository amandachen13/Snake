/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 4);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

class Coord {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  plus(coord2) {
    return new Coord(this.x + coord2.x, this.y + coord2.y);
  }

  equals(coord2) {
    return (this.x === coord2.x) && (this.y === coord2.y);
  }

  isOpposite(coord2) {
    return (this.x === (-1 * coord2.x)) && (this.y === (-1 * coord2.y));
  }
}

module.exports = Coord;


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

const Board = __webpack_require__(3);

class View {
  constructor($el) {
    this.$el = $el;
    this.board = new Board(20);
    this.setGrid();
    this.render();

    this.interval = window.setInterval(this.step.bind(this), 100);

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
    e.preventDefault();
    if (View.KEYS[e.keyCode]) {
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

}

View.KEYS = {
  38: "N",
  39: "E",
  40: "S",
  37: "W",
}

module.exports = View;


/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

const Coord = __webpack_require__(0);

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


/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

const Snake = __webpack_require__(5);
const Apple = __webpack_require__(2);

class Board {
  constructor(dim) {
    this.dim = dim;

    this.snake = new Snake(this);
    this.apple = new Apple(this);

    this.grid = Board.blankGrid(this.dim);
    this.score = 0;
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


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

const View = __webpack_require__ (1);

$l( () => {
  const root = $l('.snake-game');
  new View(root);
});


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

const Coord = __webpack_require__(0);

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
      this.board.apple.place();
    }

    // if snake is not growing, remove tail
    if (this.growing > 0) {
      // debugger
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
      this.growing += 2;
      this.board.score += this.segments.length;
      // debugger
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
    for (let i = 0; i < this.segments.length; i++) {
      if (this.segments[i].equals(position)) {
        return true;
      }
    }

    return false;
  }

}

Snake.DIR = {
  "N": new Coord(0, -1),
  "E": new Coord(1, 0),
  "S": new Coord(0, 1),
  "W": new Coord(-1, 0)
}

Snake.SYMBOL = "S";

module.exports = Snake;


/***/ })
/******/ ]);
//# sourceMappingURL=bundle.js.map