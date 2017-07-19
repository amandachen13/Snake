const View = require ('./snake-view');

$l( () => {
  const root = $l('.snake-game');
  let view = new View(root);
  $l('.fa-rotate-left').on("click", () => {
    if (view.board.snake.segments.length === 0) {
      view = new View(root)
    }
  });
});
