'use client';

/**
 * Normalize font sizes across all tables in a container
 */
export function normalizeTableFontSizes(container: HTMLElement): number | null {
  const tables = container.querySelectorAll<HTMLTableElement>("table");
  if (!tables.length) return null;
  
  // Stage 1: Analyze each table to determine what font size it would need
  const tableSizeNeeds = Array.from(tables).map(table => analyzeTableSizeNeeds(table));
  
  // Stage 2: Find the smallest required font size across all tables
  const smallestFontSize = findSmallestRequiredFontSize(tableSizeNeeds);
  
  // Stage 3: Apply the smallest font size to all tables
  applyNormalizedFontSize(tables, smallestFontSize);
  
  // Stage 4: Apply consistent styling to all tables
  applyConsistentTableStyling(tables);
  
  return smallestFontSize;
}

interface TableAnalysis {
  table: HTMLTableElement;
  recommendedFontSize: number;
  columnCount?: number;
  rowCount?: number;
  avgContentLength?: number;
  tableWidth?: number;
}

/**
 * Analyze a table to determine what font size it would need based on content and dimensions
 */
function analyzeTableSizeNeeds(table: HTMLTableElement): TableAnalysis {
  const rows = table.querySelectorAll("tr");
  if (!rows.length) return { table, recommendedFontSize: 1.0 };
  
  const columnCount = rows[0].querySelectorAll("th, td").length;
  const rowCount = rows.length;
  
  // Get current table dimensions
  const tableRect = table.getBoundingClientRect();
  const tableWidth = tableRect.width;
  
  // Calculate average content length per cell
  let totalContentLength = 0;
  let cellCount = 0;
  
  rows.forEach(row => {
    const cells = row.querySelectorAll("th, td");
    cells.forEach(cell => {
      totalContentLength += (cell.textContent?.trim().length || 0);
      cellCount++;
    });
  });
  
  const avgContentLength = cellCount > 0 ? totalContentLength / cellCount : 0;
  
  // Calculate recommended font size based on table characteristics
  let recommendedFontSize = 1.0; // Default
  
  // Adjust based on column count
  if (columnCount > 10) {
    recommendedFontSize = 0.7;
  } else if (columnCount > 7) {
    recommendedFontSize = 0.8;
  } else if (columnCount > 5) {
    recommendedFontSize = 0.9;
  }
  
  // Further adjust based on average content length and available width
  if (avgContentLength > 30) {
    recommendedFontSize -= 0.05;
  }
  
  // Ensure we don't go below minimum readability threshold
  recommendedFontSize = Math.max(recommendedFontSize, 0.7);
  
  return {
    table,
    recommendedFontSize,
    columnCount,
    rowCount,
    avgContentLength,
    tableWidth
  };
}

/**
 * Find the smallest required font size across all analyzed tables
 */
function findSmallestRequiredFontSize(tableSizeNeeds: TableAnalysis[]): number {
  if (!tableSizeNeeds.length) return 0.95; // Slightly smaller default size to fit more content
  
  // Find the minimum font size from all table analyses
  const minFontSize = Math.min(...tableSizeNeeds.map(analysis => analysis.recommendedFontSize));
  
  // Ensure minimum size is not too small for readability
  return Math.max(minFontSize, 0.8);
}

/**
 * Apply the normalized font size to all tables
 */
function applyNormalizedFontSize(tables: NodeListOf<HTMLTableElement>, fontSize: number): void {
  tables.forEach(table => {
    table.style.fontSize = `${fontSize}em`;
    
    // Add data attribute for debugging
    table.dataset.normalizedFontSize = fontSize.toString();
    
    // Adjust cell padding based on font size - smaller padding for smaller font
    const padding = Math.max(4, 7 * fontSize);
    const cells = table.querySelectorAll<HTMLElement>("th, td");
    cells.forEach(cell => {
      cell.style.padding = `${padding}px`;
      
      // Ensure content isn't truncated
      cell.style.whiteSpace = "normal";
      cell.style.wordWrap = "break-word";
      cell.style.overflow = "visible";
      
      // Remove any existing height constraints
      if (cell.style.maxHeight) cell.style.maxHeight = "none";
      if (cell.style.height && cell.style.height !== "auto") cell.style.height = "auto";
    });
  });
}

/**
 * Apply consistent styling to all tables (light blue headers)
 */
function applyConsistentTableStyling(tables: NodeListOf<HTMLTableElement>): void {
  tables.forEach(table => {
    // Add consistent styling class
    table.classList.add("normalized-table");
    
    // Style header row with light blue background
    const headerRow = table.querySelector("tr:first-child");
    if (headerRow) {
      const headerCells = headerRow.querySelectorAll<HTMLElement>("th");
      headerCells.forEach(cell => {
        cell.style.backgroundColor = "#e6f2ff"; // Light blue
        cell.style.color = "#333333"; // Dark text for contrast
        cell.style.fontWeight = "600"; // Semi-bold
        cell.style.textAlign = "center";
      });
    }
    
    // Check for ID column by header text or column content
    let idColumnIndex = -1;
    
    // First, look for a header labeled "ID" or similar
    const headers = Array.from(table.querySelectorAll<HTMLElement>("tr:first-child th"));
    headers.forEach((header, index) => {
      const headerText = header.textContent?.trim().toLowerCase() || '';
      if (headerText === "id" || headerText === "#") {
        idColumnIndex = index;
      }
    });
    
    // If no header found, check content patterns
    if (idColumnIndex === -1) {
      idColumnIndex = detectIdColumn(table);
    }
    
    // Apply special styling to ID column if found
    if (idColumnIndex !== -1) {
      console.log(`ID column detected at index ${idColumnIndex}`);
      
      // Style ID cells
      const idCells = table.querySelectorAll<HTMLElement>(`tr td:nth-child(${idColumnIndex + 1})`);
      idCells.forEach(cell => {
        cell.classList.add('id-column');
        cell.style.maxWidth = "4em";
        cell.style.width = "4em";
        cell.style.textAlign = "center";
        cell.style.overflow = "visible"; // Ensure ID is fully visible
        
        // Keep cell contents from being truncated
        if (cell.style.maxHeight) cell.style.maxHeight = "none";
      });
      
      // Style ID header
      const idHeader = table.querySelector<HTMLElement>(`tr:first-child th:nth-child(${idColumnIndex + 1})`);
      if (idHeader) {
        idHeader.style.maxWidth = "4em";
        idHeader.style.width = "4em"; 
        idHeader.style.textAlign = "center";
        idHeader.classList.add("id-column-header");
      }
    }
    
    // Style all cells for consistency
    const cells = table.querySelectorAll<HTMLElement>("td, th");
    cells.forEach(cell => {
      // Set border style - use a single line rather than double line
      cell.style.border = "1px solid #dddddd";
    });
    
    // Ensure there's no border-collapse issues at the table level
    table.style.borderCollapse = "collapse";
    table.style.borderSpacing = "0";
    table.style.border = "1px solid #dddddd";
  });
}

/**
 * Detect if a table has an ID column (typically first column with just numbers)
 */
function detectIdColumn(table: HTMLTableElement): number {
  const rows = table.querySelectorAll("tbody tr");
  if (rows.length < 2) return -1;
  
  // Analyze patterns in first few columns
  const maxColumnsToCheck = Math.min(2, rows[0].querySelectorAll("td").length);
  
  for (let i = 0; i < maxColumnsToCheck; i++) {
    let isNumericColumn = true;
    let isSequential = true;
    let lastValue = 0;
    
    // Check each row's cell at this column index
    for (let j = 0; j < rows.length; j++) {
      const cells = rows[j].querySelectorAll("td");
      if (i >= cells.length) continue;
      
      const cell = cells[i];
      const content = cell.textContent?.trim() || '';
      
      // Check if numeric and short
      if (!/^\d+$/.test(content)) {
        isNumericColumn = false;
        break;
      }
      
      // Check if sequential
      const numValue = parseInt(content, 10);
      if (j > 0 && numValue !== lastValue + 1) {
        isSequential = false;
      }
      lastValue = numValue;
    }
    
    // If this column is numeric and either sequential or the first column, it's likely an ID
    if (isNumericColumn && (isSequential || i === 0)) {
      return i;
    }
  }
  
  return -1;
}