'use client';

import { analyzeAndSetColumnWidths } from './columnWidthUtils';
import { processCellsFormatting } from './formattingUtils';
import { wrapTableInResponsiveContainer } from './responsiveUtils';
import { normalizeTableFontSizes } from './fontSizeUtils';

/**
 * Process all tables in a container
 */
export function processTables(container: HTMLElement): number {
  const tables = container.querySelectorAll<HTMLTableElement>("table");
  
  // First process each table individually
  tables.forEach((table) => processTable(table));
  
  // Then normalize font sizes and styling across all tables
  normalizeTablesAcrossDocument(container);
  
  return tables.length;
}

/**
 * Process a single table
 */
function processTable(table: HTMLTableElement): void {
  const rows = table.querySelectorAll("tr");
  const firstRow = rows[0];

  if (!firstRow) return;

  // Determine column count
  const columnCount = firstRow.querySelectorAll("th, td").length;

  // For tables with more than 4 columns, we treat them as data tables
  if (columnCount > 4) {
    table.classList.add("data-table");
  }

  // For tables with many columns, wrap in a responsive container
  if (columnCount > 5) {
    wrapTableInResponsiveContainer(table);
  }

  // Analyze content and set column widths
  analyzeAndSetColumnWidths(table);

  // Format cells for better appearance
  processCellsFormatting(table);

  // Calculate and set consistent row heights based on content and font
  calculateAndSetRowHeights(table);
}

/**
 * Normalize all tables across the document for consistent appearance
 */
function normalizeTablesAcrossDocument(container: HTMLElement): void {
  // Use fontSizeUtils to normalize font sizes across all tables
  // This will make all tables use the font size needed by the most constrained table
  // and apply consistent styling (light blue headers)
  normalizeTableFontSizes(container);
}

/**
 * Calculate and set consistent row heights based on content and font
 */
function calculateAndSetRowHeights(table: HTMLTableElement): void {
  const rows = table.querySelectorAll("tbody tr");
  if (rows.length <= 1) return;

  // Get computed styles to account for current font settings
  const computedStyle = window.getComputedStyle(table);
  const fontSize = parseFloat(computedStyle.fontSize);
  const lineHeight = parseFloat(computedStyle.lineHeight) / fontSize || 1.4; // Default to 1.4 if not set

  // Determine if any cell might need multiple lines
  let needsMultipleLines = false;
  let maxContentWidth = 0;
  let minCellWidth = Infinity;

  // Check each cell to see if content might wrap
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td");
    cells.forEach((cell) => {
      const cellWidth = cell.getBoundingClientRect().width;
      const contentLength = cell.textContent?.length || 0;

      // Estimate content width based on average character width (approximation)
      // Average character is roughly 0.6em wide for most fonts
      const estimatedContentWidth = contentLength * fontSize * 0.6;

      if (estimatedContentWidth > cellWidth) {
        needsMultipleLines = true;
      }

      // Track max content width and min cell width for calculations
      maxContentWidth = Math.max(maxContentWidth, estimatedContentWidth);
      minCellWidth = Math.min(minCellWidth, cellWidth || Infinity);
    });
  });

  // Calculate minimum row height needed
  let minRowHeight;

  if (needsMultipleLines) {
    // Estimate number of lines needed based on content vs cell width
    const estimatedLines = Math.ceil(maxContentWidth / (minCellWidth || 1));
    // Set minimum height based on number of lines (add a small buffer)
    minRowHeight = Math.max(2, estimatedLines) * lineHeight + "em";
  } else {
    // Single line height plus padding
    minRowHeight = lineHeight + 0.5 + "em";
  }

  // Apply consistent height to all rows
  rows.forEach((row) => {
    row.style.minHeight = minRowHeight;
    // Ensure all cells have the same min-height
    const cells = row.querySelectorAll("td");
    cells.forEach((cell) => {
      cell.style.minHeight = minRowHeight;
    });
  });
}