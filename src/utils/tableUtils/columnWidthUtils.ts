'use client';

/**
 * Analyzes table content and sets optimal column widths
 * Uses a flexible approach that identifies columns needing more space based on content
 */
export function analyzeAndSetColumnWidths(table: HTMLTableElement): void {
  const rows = table.querySelectorAll("tr");
  const firstRow = rows[0];
  const columnCount = firstRow.querySelectorAll("th, td").length;

  // If there's only one column, no need for complex calculations
  if (columnCount <= 1) return;

  // Analyze columns to identify which ones have consistently long content
  const columnLengths = new Array(columnCount).fill(0);
  const columnCounts = new Array(columnCount).fill(0);
  const maxColumnLengths = new Array(columnCount).fill(0);
  const avgColumnLengths = new Array(columnCount).fill(0);

  // Calculate average text length per column and track max length
  rows.forEach((row) => {
    const cells = row.querySelectorAll("th, td");
    cells.forEach((cell, index) => {
      if (index < columnLengths.length) {
        const contentLength = cell.textContent?.trim().length || 0;
        columnLengths[index] += contentLength;
        columnCounts[index]++;

        // Track maximum content length for each column
        if (contentLength > maxColumnLengths[index]) {
          maxColumnLengths[index] = contentLength;
        }
      }
    });
  });

  // Calculate average length per column
  for (let i = 0; i < columnCount; i++) {
    avgColumnLengths[i] = columnCounts[i] > 0 ? columnLengths[i] / columnCounts[i] : 0;
  }

  // Find column with most content to use as reference
  const contentRatio = findContentRatio(avgColumnLengths, maxColumnLengths);

  // Calculate width percentages based on content relative to column with most content
  const columnWidthPercentages = calculateWidthPercentages(columnCount, avgColumnLengths, maxColumnLengths, contentRatio);

  // Apply column widths to the table
  applyColumnWidths(table, columnWidthPercentages);
}

/**
 * Finds the ratio of content between columns
 * Determines how much space each column needs relative to others
 */
function findContentRatio(avgColumnLengths: number[], maxColumnLengths: number[]): number[] {
  // Use both average and max length to determine true content needs
  const combinedMetrics = avgColumnLengths.map((avg, i) => {
    // Weight: 70% average length + 30% max length
    return (avg * 0.7) + (maxColumnLengths[i] * 0.3);
  });
  
  const maxContentValue = Math.max(...combinedMetrics);
  
  // Content ratio for each column (relative to max content)
  return combinedMetrics.map(val => val / (maxContentValue || 1)); // Avoid division by zero
}

/**
 * Calculates width percentages for columns based on content ratio
 */
function calculateWidthPercentages(
  columnCount: number, 
  avgColumnLengths: number[], 
  maxColumnLengths: number[], 
  contentRatio: number[]
): number[] {
  // Total space available (100%)
  const totalSpace = 100;
  
  // Minimum percentage for any column
  const minColumnWidth = 5;
  
  // Calculate initial column widths based on content ratio
  let columnWidths = contentRatio.map(ratio => {
    // Convert ratio to percentage with some constraints
    return Math.max(minColumnWidth, Math.min(60, ratio * (totalSpace / columnCount)));
  });
  
  // Normalize to ensure sum equals 100%
  const initialSum = columnWidths.reduce((a, b) => a + b, 0);
  if (initialSum > 0) {
    columnWidths = columnWidths.map(width => (width / initialSum) * totalSpace);
  }
  
  return columnWidths;
}

/**
 * Applies calculated widths to table columns
 */
function applyColumnWidths(table: HTMLTableElement, columnWidthPercentages: number[]): void {
  const headerRow = table.querySelector("tr");
  if (!headerRow) return;
  
  const headerCells = headerRow.querySelectorAll("th, td");
  headerCells.forEach((cell, index) => {
    if (index < columnWidthPercentages.length) {
      (cell as HTMLElement).style.width = `${columnWidthPercentages[index]}%`;
    }
  });
}