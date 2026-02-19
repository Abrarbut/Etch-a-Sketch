// Constants and configuration
const DEFAULT_GRID_SIZE = 16;
const MAX_GRID_SIZE = 100;
const DARKNESS_STEP = 0.1; // 10% per interaction
const MAX_INTERACTIONS = 10;

// Mode constants
const MODES = {
    DRAW: 'draw',
    ERASE: 'erase',
    PAUSE: 'pause'
};

// State
let currentGridSize = DEFAULT_GRID_SIZE;
let currentMode = MODES.DRAW;
const grid = document.querySelector("#grid");
const resetButton = document.querySelector("#reset");
const resizeButton = document.querySelector("#resize");

/**
 * Generate a random RGB color
 * @returns {string} RGB color string
 */
function getRandomColor() {
    const r = Math.floor(Math.random() * 256);
    const g = Math.floor(Math.random() * 256);
    const b = Math.floor(Math.random() * 256);
    return `rgb(${r}, ${g}, ${b})`;
}

/**
 * Get the darkness level of a cell (0-1)
 * @param {HTMLElement} cell
 * @returns {number} Darkness level
 */
function getDarknessLevel(cell) {
    const data = cell.dataset.darkness;
    return data ? parseFloat(data) : 0;
}

/**
 * Apply progressive darkening to a cell with random color
 * @param {HTMLElement} cell
 */
function drawCell(cell) {
    let darkness = getDarknessLevel(cell);
    
    // Only allow up to 10 interactions
    if (darkness >= 1) return;
    
    // Increase darkness
    darkness = Math.min(darkness + DARKNESS_STEP, 1);
    cell.dataset.darkness = darkness;
    
    // Get or set the base color for this cell
    if (!cell.dataset.baseColor) {
        cell.dataset.baseColor = getRandomColor();
    }
    
    const baseColor = cell.dataset.baseColor;
    
    // Apply darkness using opacity effect
    cell.style.background = baseColor;
    cell.style.opacity = (1 - darkness * 0.9); // Gradually fade to dark
    cell.style.boxShadow = `inset 0 0 ${darkness * 10}px rgba(0, 0, 0, ${darkness})`;
}

/**
 * Erase a cell - clears all drawing data
 * @param {HTMLElement} cell
 */
function eraseCell(cell) {
    cell.style.background = "white";
    cell.style.opacity = "1";
    cell.style.boxShadow = "none";
    cell.dataset.darkness = "0";
    cell.dataset.baseColor = "";
}

/**
 * Handle cell interaction based on current mode
 * @param {HTMLElement} cell
 */
function handleCellInteraction(cell) {
    if (currentMode === MODES.PAUSE) {
        return; // Do nothing in pause mode
    } else if (currentMode === MODES.ERASE) {
        eraseCell(cell);
    } else if (currentMode === MODES.DRAW) {
        drawCell(cell);
    }
}

/**
 * Create grid cells
 * @param {number} size - Number of cells per side
 */
function createGrid(size) {
    grid.innerHTML = "";
    
    for (let i = 0; i < size * size; i++) {
        const cell = document.createElement("div");
        cell.classList.add("cell");
        cell.style.flex = `1 1 calc(100% / ${size})`;
        
        // Add hover effect
        cell.addEventListener("mouseenter", () => {
            handleCellInteraction(cell);
        });
        
        grid.appendChild(cell);
    }
    
    updateModeIndicator();
}

/**
 * Reset grid - clears all cells
 */
function resetGrid() {
    const cells = document.querySelectorAll(".cell");
    cells.forEach((cell) => {
        cell.style.background = "white";
        cell.style.opacity = "1";
        cell.style.boxShadow = "none";
        cell.dataset.darkness = "0";
        cell.dataset.baseColor = "";
    });
}

/**
 * Resize grid with user input
 */
function resizeGrid() {
    let newSize = prompt(
        `Enter new grid size (1-${MAX_GRID_SIZE}):\n\nCurrent size: ${currentGridSize}x${currentGridSize}`,
        currentGridSize
    );
    
    // User cancelled
    if (newSize === null) return;
    
    newSize = parseInt(newSize, 10);
    
    // Validate input
    if (isNaN(newSize) || newSize < 1 || newSize > MAX_GRID_SIZE) {
        alert(`Invalid size. Please enter a number between 1 and ${MAX_GRID_SIZE}.`);
        return;
    }
    
    currentGridSize = newSize;
    createGrid(newSize);
}

/**
 * Set current mode and update UI
 * @param {string} newMode
 */
function setMode(newMode) {
    currentMode = newMode;
    updateModeIndicator();
}

/**
 * Update the visual indicator of current mode
 */
function updateModeIndicator() {
    let modeText = '';
    
    switch(currentMode) {
        case MODES.DRAW:
            modeText = '✏️ Draw Mode';
            grid.style.cursor = 'crosshair';
            break;
        case MODES.ERASE:
            modeText = '🧹 Erase Mode';
            grid.style.cursor = 'cell';
            break;
        case MODES.PAUSE:
            modeText = '⏸️ Pause Mode';
            grid.style.cursor = 'not-allowed';
            break;
    }
    
    console.log(`Mode: ${modeText}`);
}

// Event listeners
resetButton.addEventListener("click", resetGrid);
resizeButton.addEventListener("click", resizeGrid);

/**
 * Handle keyboard input for mode switching
 */
function setupKeyboardControls() {
    document.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();
        
        switch(key) {
            case 'd':
                // D key - Draw mode
                event.preventDefault();
                setMode(MODES.DRAW);
                break;
            case 'e':
                // E key - Erase mode
                event.preventDefault();
                setMode(MODES.ERASE);
                break;
            case 'q':
                // Q key - Pause mode (quiet)
                event.preventDefault();
                setMode(MODES.PAUSE);
                break;
        }
    });
}

// Initialize keyboard controls
setupKeyboardControls();

// Initialize grid on page load
createGrid(DEFAULT_GRID_SIZE);
