let grid_container = document.querySelector(".grid-container");
let grid_slider = document.querySelector("#grid-slider");
let grid_size_text = document.querySelector(".grid-size-text");
let game_container = document.querySelector(".game-container");
let buttons_container = document.querySelector(".buttons-container");

//Boxes
function showGridSize(e) {
  let grid_size = e.target.value;
  grid_size_text.textContent = `Grid Size: ${grid_size} x ${grid_size}`;
}

function initialSquares(n) {
  let resolution = n * n;
  for (i = 0; i < resolution; i++) {
    let grid_square = document.createElement("div");
    grid_square.classList.add("grid-square");
    grid_container.appendChild(grid_square);
  }
  grid_container.style.cssText = `grid-template-columns: repeat(${n}, 1fr);`;
  grid_size_text.textContent = `Grid Size: ${n} x ${n}`;
}

initialSquares(16);

function addGridSquares(e) {
  grid_container.innerHTML = "";
  let grid_size = e.target.value;
  let resolution = grid_size * grid_size;
  for (i = 0; i < resolution; i++) {
    let grid_square = document.createElement("div");
    grid_square.classList.add("grid-square");
    grid_container.appendChild(grid_square);
  }
  grid_container.style.cssText = `grid-template-columns: repeat(${grid_size}, 1fr);`;
}

grid_slider.addEventListener("input", showGridSize);
grid_slider.addEventListener("input", addGridSquares);

//Drawing
let shouldDraw = false;
let shouldErase = false;

function draw(e, color) {
  let target_box = e.target;
  let prev_color = target_box.style.backgroundColor;
  let new_color = color;

  if (prev_color != new_color) {
    target_box.style.backgroundColor = `${color}`;
    currentStroke.push({ target_box, prev_color, new_color });
    hasDrawn = true;
    button_reverse.disabled = false;
  }
}

grid_container.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    shouldDraw = true;
    currentStroke = [];
    draw(e, "black");
  } else if (e.button === 2) {
    shouldErase = true;
    currentStroke = [];
    draw(e, "transparent");
  }
});

document.addEventListener("mouseup", () => {
  if ((shouldDraw || shouldErase) && hasDrawn) {
    historyStack.push([...currentStroke]);
    redoStack.length = 0;
    updateReverseNextButtons();
  }
  shouldDraw = false;
  shouldErase = false;
  currentStroke = [];
  hasDrawn = false;
});

grid_container.addEventListener("mouseover", (e) => {
  if (shouldDraw) {
    draw(e, "black");
  } else if (shouldErase) {
    draw(e, "transparent");
  }
});

// Do | Undo functions
let currentStroke = [];
let historyStack = [];
let redoStack = [];
let hasDrawn = false;

function undo() {
  if (historyStack.length === 0) return;
  let lastStroke = historyStack.pop();

  lastStroke.forEach(({ target_box, prev_color }) => {
    target_box.style.backgroundColor = prev_color;
  });
  redoStack.push(lastStroke);
  updateReverseNextButtons();
}

function redo() {
  if (redoStack.length === 0) return;
  let stroke = redoStack.pop();

  stroke.forEach(({ target_box, new_color }) => {
    target_box.style.backgroundColor = new_color;
  });
  historyStack.push(stroke);
  updateReverseNextButtons();
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && (e.key === "z" || e.key === "Z")) {
    undo();
  } else if (e.ctrlKey && (e.key === "y" || e.key === "Y")) {
    redo();
  }
});

//buttons
buttons_container.addEventListener("click", (e) => {
  let target_button = e.target;

  switch (target_button.id) {
    case "btn-next":
      redo();
      return;
    case "btn-reverse":
      undo();
      return;
  }
});

// better ux
game_container.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

game_container.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

grid_container.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

function updateReverseNextButtons() {
  const undoButton = document.getElementById("btn-reverse");
  const redoButton = document.getElementById("btn-next");

  undoButton.disabled = historyStack.length === 0;
  redoButton.disabled = redoStack.length === 0;
}

updateReverseNextButtons();
