const GRID_SIZE = 16;
const grid = document.querySelector("#grid");

grid.style.gridTemplateColumns = `repeat(${GRID_SIZE}, 1fr)`;
grid.style.gridTemplateRows = `repeat(${GRID_SIZE}, 1fr)`;

const totalCells = GRID_SIZE * GRID_SIZE;

for (let i = 0; i < totalCells; i += 1) {
  const cell = document.createElement("div");
  cell.classList.add("cell");
  grid.appendChild(cell);
}
