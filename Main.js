let grid = [];
let previousGrid = [];
let previousPreviousGrid = [];
let size = 50;
let iterations = 0;
let population = 0;

for (let x = 0; x < size; x++) {
  grid[x] = [];
  for (let y = 0; y < size; y++) {
    grid[x][y] = Math.random() > 0.5;
    if (grid[x][y]) {
      population++;
    }
  }
}

const gridElement = document.getElementById('grid');
for (let x = 0; x < size; x++) {
  for (let y = 0; y < size; y++) {
    const cellElement = document.createElement('div');
    cellElement.className = 'cell';
    if (grid[x][y]) {
      cellElement.className += 'live';
    }
    gridElement.appendChild(cellElement);
  }
}

function nextGeneration() {
  let changes = 0;
  previousPreviousGrid = previousGrid;
  previousGrid = grid;
  grid = [];
  for (let x = 0; x < size; x++) {
    grid[x] = [];
    for (let y = 0; y < size; y++) {
      const newState = nextState(previousGrid, x, y);
      if (newState!== previousGrid[x][y]) {
        changes++;
      }
      grid[x][y] = newState;
      if (newState) {
        population++;
      }
    }
  }
  population = countPopulation(grid);
  return changes;
}

function nextState(grid, x, y) {
  let liveNeighbors = countLiveNeighbors(grid, x, y);
  if (grid[x][y]) {
    return liveNeighbors === 2 || liveNeighbors === 3;
  } else {
    return liveNeighbors === 3;
  }
}

function countLiveNeighbors(grid, x, y) {
  let count = 0;
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      if (dx === 0 && dy === 0) {
        continue;
      }
      let neighborX = x + dx;
      let neighborY = y + dy;
      if (neighborX >= 0 && neighborX < size && neighborY >= 0 && neighborY < size) {
        if (grid[neighborX][neighborY]) {
          count++;
        }
      }
    }
  }
  return count;
}

setInterval(() => {
  const changes = nextGeneration();
  if (changes === 0) {
    console.log('Equilibrium reached after ' + iterations + ' iterations.');
  } else if (JSON.stringify(grid) === JSON.stringify(previousPreviousGrid)) {
    console.log('Blinker state reached after ' + iterations + ' iterations.');
  }
  iterations++;
  updateGrid();
  updateStats();
}, 1000);

function updateGrid() {
  const gridElement = document.getElementById('grid');
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      const cellElement = gridElement.children[x * size + y];
      if (grid[x][y]) {
        cellElement.className = 'cell alive';
      } else {
        cellElement.className = 'cell';
      }
    }
  }
}

function countPopulation(grid) {
  let population = 0;
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      if (grid[x][y]) {
        population++;
      }
    }
  }
  return population;
}



function updateStats() {
  document.getElementById('generation').innerHTML = iterations;
  document.getElementById('population').innerHTML = population;
}