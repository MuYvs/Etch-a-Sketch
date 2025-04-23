let grid_container = document.querySelector(".grid-container");
let grid_slider = document.querySelector("#grid-slider");
let grid_size_text = document.querySelector(".grid-size-text");
let game_container = document.querySelector(".game-container");

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

let shouldDraw = false;
let shouldErase = false;
function draw(e) {
  let target_box = e.target;
  target_box.style.backgroundColor = "black";
}

function erase(e) {
  let target_box = e.target;
  target_box.style.backgroundColor = "transparent";
}

document.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    shouldDraw = true;
  } else if (e.button === 2) {
    shouldErase = true;
  }
});

document.addEventListener("mouseup", () => {
  shouldDraw = false;
  shouldErase = false;
});

game_container.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

game_container.addEventListener("contextmenu", (e) => {
  e.preventDefault();
});

grid_container.addEventListener("mousedown", (e) => {
  if (e.button === 0) {
    draw(e);
  } else if (e.button === 2) {
    erase(e);
  }
});

grid_container.addEventListener("dragstart", (e) => {
  e.preventDefault();
});

grid_container.addEventListener("mouseover", (e) => {
  if (shouldDraw) {
    draw(e);
  } else if (shouldErase) {
    erase(e);
  }
});
