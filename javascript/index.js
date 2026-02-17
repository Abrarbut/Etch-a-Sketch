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

grid.addEventListener("mouseenter", (event) => {
  const target = event.target;

  if (target instanceof HTMLElement && target.classList.contains("cell")) {
    target.classList.add("is-drawn");
  }
}, true);

const resetButton = document.querySelector("#reset"); 
resetButton.addEventListener("click", () => {
  const cells = document.querySelectorAll(".cell");
  cells.forEach((cell) => {
    cell.classList.remove("is-drawn");
  });
});

const resizeButton = document.querySelector("#resize");

resizeButton.addEventListener("click", () => {
  let newSize = prompt("Enter new grid size (1-100):");
  newSize = parseInt(newSize, 10);  
  if (isNaN(newSize) || newSize < 1 || newSize > 100) {
    alert("Invalid size. Please enter a number between 1 and 100.");
    return;
  }   
  grid.style.gridTemplateColumns = `repeat(${newSize}, 1fr)`;
  grid.style.gridTemplateRows = `repeat(${newSize}, 1fr)`;
  grid.innerHTML = ""; 
  const newTotalCells = newSize * newSize;
  for (let i = 0; i < newTotalCells; i += 1) {
    const cell = document.createElement("div");
    cell.classList.add("cell");
    grid.appendChild(cell);
  }
});
