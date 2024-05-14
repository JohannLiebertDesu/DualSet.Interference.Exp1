/**
 * Creates a grid for placing stimuli with specified columns and rows.
 * Marks the border and the middle column cells as occupied.
 * @return An array of GridCell objects.
 */

import { varSystem, expInfo } from "./settings"; // import the variables from settings
import { random } from "@coglabuzh/webpsy.js";

// Get the screen width and height, as well as number of rows and columns
export const screenWidth = window.screen.width;  // Get the screen width
export const screenHeight = window.screen.height;  // Get the screen height
export const numColumns = 11;  // Set the width of the grid
export const numRows = 6;  // Set the height of the grid

const ADJACENCY_LIMIT = 2; // Set the adjacency limit
const DIAGONAL_ADJACENCY = 1; // Set the diagonal adjacency


// Calculate the cell size based on the screen dimensions and grid size
export function calculateCellSize(screenWidth, screenHeight, numColumns, numRows) {
    const cellWidth = screenWidth / numColumns;
    const cellHeight = screenHeight / numRows;
    return {
        cellWidth,
        cellHeight
    };
}

// Define a type for the grid cells
export type GridCell = {
    id: string;
    occupied: boolean;
    x: number;
    y: number;
};

export function createGrid(numColumns: number, numRows: number): GridCell[] {
    const grid: GridCell[] = [];
    const middleColumnIndex = Math.floor(numColumns / 2); // Calculate the middle column index
    for (let row = 0; row < numRows; row++) {
        for (let col = 0; col < numColumns; col++) {
            // Check if the current cell is on the border or in the middle column
            const isBorder = col === 0 || col === numColumns - 1 || row === 0 || row === numRows - 1;
            const isMiddleColumn = col === middleColumnIndex;
            grid.push({
                id: `${col + 1}${String.fromCharCode(65 + row)}`, // Generates IDs like '1A', '2B', etc.
                occupied: isBorder || isMiddleColumn, // Mark as occupied if it's a border or middle column cell
                x: col,
                y: row
            });
        }
    }
    return grid;
}

export function selectAndOccupyCell(grid: GridCell[]) {
    let availableCells = grid.filter(cell => !cell.occupied);
    if (availableCells.length === 0) return null; // No available cells

    let selectedCell = availableCells[Math.floor(Math.random() * availableCells.length)];
    // Mark this cell and adjacent cells as occupied
    markAdjacentCellsAsOccupied(grid, selectedCell);
    return selectedCell;
}

export function markAdjacentCellsAsOccupied(grid: GridCell[], selectedCell: GridCell) {
    grid.forEach(cell => {
        // Check horizontal and vertical proximity (extend to two cells)
        if (
            (Math.abs(cell.x - selectedCell.x) <= ADJACENCY_LIMIT && cell.y === selectedCell.y) ||
            (Math.abs(cell.y - selectedCell.y) <= ADJACENCY_LIMIT && cell.x === selectedCell.x) ||
            // Check diagonal proximity (keep within one cell)
            (Math.abs(cell.x - selectedCell.x) === DIAGONAL_ADJACENCY && Math.abs(cell.y - selectedCell.y) === DIAGONAL_ADJACENCY)
        ) {
            cell.occupied = true;
        }
    });
    // Also mark the selected cell as occupied if not already done
    selectedCell.occupied = true;
}

export function resetGrid(grid: GridCell[], numColumns: number, numRows: number) {
    const middleColumnIndex = Math.floor(numColumns / 2);
    grid.forEach(cell => {
        const isBorder = cell.x === 0 || cell.x === numColumns - 1 || cell.y === 0 || cell.y === numRows - 1;
        const isMiddleColumn = cell.x === middleColumnIndex;
        cell.occupied = isBorder || isMiddleColumn;
    });
}

export function randomColor() {
    // Generate random RGB values
    const r = random.randint(0, 256); // Random integer between 0 and 255
    const g = random.randint(0, 256); // Random integer between 0 and 255
    const b = random.randint(0, 256); // Random integer between 0 and 255
    return `rgb(${r}, ${g}, ${b})`;
}

export function generateCircles(grid: GridCell[], numCircles: number, cellWidth: number, cellHeight: number) {
    const stimuli = [];

    for (let i = 0; i < numCircles; i++) {
        let cell = selectAndOccupyCell(grid);
        if (cell) {
            stimuli.push({
                obj_type: 'circle',                        // Type of the object
                startX: cell.x * cellWidth + cellWidth / 2, // Center of the cell
                startY: cell.y * cellHeight + cellHeight / 2, // Center of the cell
                radius: Math.min(cellWidth, cellHeight) / 4, // Circle radius
                line_color: randomColor(),                  // Random line color
                fill_color: randomColor(),                  // Random fill color
                });
        }
    }

    return stimuli;
}
