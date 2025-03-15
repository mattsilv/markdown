'use client';

import { addTooltipToCell } from './tooltipUtils';

/**
 * Process formatting for all cells in a table
 * Optimizes appearance based on content and position
 */
export function processCellsFormatting(table: HTMLTableElement): void {
  if (!table) return;
  
  const rows = table.querySelectorAll("tr");
  if (!rows.length) return;
  
  const columnCount = rows[0].querySelectorAll("th, td").length;
  
  // Process header row - for headers
  const headerRow = rows[0];
  const headerCells = headerRow.querySelectorAll("th");
  
  headerCells.forEach((cell) => {
    // Center all header cells for consistency
    (cell as HTMLElement).style.textAlign = "center";
    
    // For tables with many columns, make headers smaller
    if (columnCount > 6) {
      (cell as HTMLElement).style.fontSize = "0.8em";
      (cell as HTMLElement).style.padding = "4px 6px";
    }
  });
  
  // Process all body rows
  for (let rowIndex = 1; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    const cells = row.querySelectorAll("td");
    
    cells.forEach((cell, cellIndex) => {
      const contentLength = (cell.textContent?.trim().length || 0);
      
      // Format cell based on content length
      formatCellByContent(cell as HTMLElement, contentLength, cellIndex, columnCount);
    });
  }
}

/**
 * Format individual cell based on its content
 */
function formatCellByContent(cell: HTMLElement, contentLength: number, cellIndex: number, columnCount: number): void {
  // For long content cells
  if (contentLength > 100) {
    cell.classList.add("long-content");
    
    // Add tooltip for very long content
    if (contentLength > 150) {
      addTooltipToCell(cell);
    }
  }
  
  // Center content in all cells except when:
  // - Contains numeric or very short content (left-align)
  // - Contains long text content (left-align)
  const isNumeric = /^[-+]?[0-9]*\.?[0-9]+([eE][-+]?[0-9]+)?$/.test(cell.textContent?.trim() || '');
  const isShortText = contentLength <= 3;
  const isLongText = contentLength > 50;
  
  if (isNumeric || isShortText) {
    // Right-align numeric values
    cell.style.textAlign = isNumeric ? "right" : "center";
  } else if (isLongText) {
    // Left-align long text
    cell.style.textAlign = "left";
  } else {
    // Center everything else
    cell.style.textAlign = "center";
  }
  
  // For very wide tables (many columns), make all text smaller
  if (columnCount > 6) {
    cell.style.fontSize = "0.8em";
    cell.style.padding = "4px 6px";
  }
}