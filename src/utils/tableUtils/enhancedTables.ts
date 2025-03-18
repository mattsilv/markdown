"use client";

/**
 * Apply consistent styling to tables for better appearance
 */
export function enhanceTables(container: HTMLElement): number {
  if (!container) return 0;

  // Find all tables
  const tables = container.querySelectorAll("table");
  let enhancedCount = 0;

  tables.forEach((table) => {
    // Check for demographic table patterns
    const isDemographicTable = checkForDemographicTable(table);

    if (isDemographicTable) {
      processDemographicTable(table);
      enhancedCount++;
      return;
    }

    // Check for special consumer reporting table pattern
    const isConsumerReportTable = checkForConsumerReportTable(table);

    if (isConsumerReportTable) {
      // Apply consistent styling specifically for consumer report tables
      processConsumerReportTable(table);
      enhancedCount++;
      return;
    }

    // First check if this is a financial table
    const isFinancialTable = checkForFinancialTable(table);

    if (isFinancialTable) {
      // Process as financial table with consistent center alignment
      processFinancialTable(table);
      enhancedCount++;
    } else {
      // Check for reference pattern in the table content
      const hasReferences = checkForReferences(table);

      if (hasReferences) {
        // Process with reference-focused styling
        processReferenceTable(table);
        enhancedCount++;
      } else {
        // For other tables, apply general consistent styling
        applyConsistentTableStyling(table);
        enhancedCount++;
      }
    }
  });

  return enhancedCount;
}

/**
 * Check for demographic tables or tables with mixed numeric+percentage columns
 */
function checkForDemographicTable(table: HTMLTableElement): boolean {
  // Check header row
  const headerRow = table.querySelector("tr:first-child");
  if (!headerRow) return false;

  const headers = headerRow.querySelectorAll("th");
  if (headers.length < 2) return false;

  // Check for demographic patterns in headers
  const headerTexts = Array.from(headers).map(
    (h) => h.textContent?.trim().toLowerCase() || ""
  );

  // Look for age group, demographic, or preference indicators
  const hasDemographicHeader = headerTexts.some(
    (text) =>
      text.includes("age") ||
      text.includes("demographic") ||
      text.includes("group") ||
      text.includes("preference")
  );

  // If it doesn't have demographic headers, check for mixed numeric/percentage columns
  if (!hasDemographicHeader) {
    // Check data rows for mixed numeric and percentage patterns
    const rows = table.querySelectorAll("tr");
    if (rows.length <= 2) return false; // Need enough data rows

    // Count different cell types in each column
    let numericColumns = 0;
    let percentageColumns = 0;
    let plusPrefixColumns = 0;

    // Get first data row for counting columns
    const firstDataRow = rows[1];
    const cells = firstDataRow.querySelectorAll("td");

    for (let i = 0; i < cells.length; i++) {
      const content = cells[i].textContent?.trim() || "";
      // Clean footnotes for detection
      const cleanContent = content
        .replace(/\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/, "")
        .trim();

      if (/^-?\d+(\.\d+)?$/.test(cleanContent)) {
        // Pure numeric (like 8.3)
        numericColumns++;
      } else if (/%/.test(cleanContent)) {
        // Percentage values
        percentageColumns++;
      } else if (/^\+\d+%/.test(cleanContent)) {
        // Values with plus signs like +22%
        plusPrefixColumns++;
      }
    }

    // If we have a mix of numeric and percentage/plus columns, it's likely a demographic table
    return (
      numericColumns > 0 && (percentageColumns > 0 || plusPrefixColumns > 0)
    );
  }

  return hasDemographicHeader;
}

/**
 * Process demographic tables with consistent alignment
 */
function processDemographicTable(table: HTMLTableElement): void {
  // Add appropriate classes
  table.classList.add("demographic-table");
  table.classList.add("mixed-data-table");

  // Apply consistent base styling
  applyConsistentTableStyling(table);

  // Get all rows
  const rows = table.querySelectorAll("tr");
  if (rows.length <= 1) return;

  // First analyze column contents to determine types
  const columnTypes: string[] = [];
  const firstDataRow = rows[1];
  const cells = firstDataRow.querySelectorAll("td");

  for (let i = 0; i < cells.length; i++) {
    const content = cells[i].textContent?.trim() || "";
    // Clean footnotes for detection
    const cleanContent = content
      .replace(/\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/, "")
      .trim();

    if (/^-?\d+(\.\d+)?$/.test(cleanContent)) {
      // Pure numeric (like 8.3)
      columnTypes[i] = "numeric";
    } else if (/%/.test(cleanContent)) {
      // Percentage values
      columnTypes[i] = "percentage";
    } else if (/^\+\d+%/.test(cleanContent)) {
      // Values with plus signs like +22%
      columnTypes[i] = "plus-percentage";
    } else {
      // Default text
      columnTypes[i] = "text";
    }
  }

  // Now process all data rows with consistent alignment per column type
  for (let i = 1; i < rows.length; i++) {
    const rowCells = rows[i].querySelectorAll("td");

    rowCells.forEach((cell, index) => {
      const columnType = columnTypes[index] || "text";
      const content = cell.textContent?.trim() || "";
      const hasFootnote = /\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/.test(content);

      // Add class for the column type
      cell.classList.add(`${columnType}-column`);

      // Set alignment based on content type
      if (columnType === "numeric") {
        (cell as HTMLElement).style.textAlign = "right";
        cell.classList.add("numeric-cell");
      } else if (columnType === "percentage") {
        // Center for consistency
        (cell as HTMLElement).style.textAlign = "center";
        cell.classList.add("percentage-value");
      } else if (columnType === "plus-percentage") {
        // Center for +X% values
        (cell as HTMLElement).style.textAlign = "center";
        cell.classList.add("plus-percentage-value");
      } else if (index === 0) {
        // First column left align
        (cell as HTMLElement).style.textAlign = "left";
        cell.classList.add("label-cell");
      }

      // Handle footnotes
      if (hasFootnote) {
        cell.classList.add("numeric-with-footnote");
      }
    });
  }
}

/**
 * Check if this is a consumer report style table with % values in second column
 */
function checkForConsumerReportTable(table: HTMLTableElement): boolean {
  // First check headers
  const headerRow = table.querySelector("tr:first-child");
  if (!headerRow) return false;

  const headers = headerRow.querySelectorAll("th");
  if (headers.length !== 3) return false; // Must have exactly 3 columns

  // Get header texts
  const headerTexts = Array.from(headers).map(
    (h) => h.textContent?.trim().toLowerCase() || ""
  );

  // Check for common patterns
  const hasFactorHeader =
    headerTexts[0].includes("factor") ||
    headerTexts[0].includes("item") ||
    headerTexts[0].includes("motivat");

  const hasPercentageHeader =
    headerTexts[1].includes("percentage") ||
    headerTexts[1].includes("percent") ||
    headerTexts[1].includes("consumers") ||
    headerTexts[1].includes("respondents") ||
    headerTexts[1].includes("%");

  // Check third column header - removed unused variable

  // If the headers match the pattern, check the data cells in second column
  if (hasFactorHeader && hasPercentageHeader) {
    // Check data cells in second column for percentage values
    const rows = table.querySelectorAll("tr");
    if (rows.length <= 1) return false;

    let percentageCount = 0;

    for (let i = 1; i < rows.length; i++) {
      const cells = rows[i].querySelectorAll("td");
      if (cells.length < 2) continue;

      const content = cells[1].textContent?.trim() || "";
      // Clean footnotes for matching
      const cleanedContent = content
        .replace(/\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/, "")
        .trim();

      if (/%/.test(cleanedContent)) {
        percentageCount++;
      }
    }

    // If most rows have percentages in second column, it's likely a consumer report table
    return percentageCount > 0 && percentageCount >= (rows.length - 1) / 2;
  }

  return false;
}

/**
 * Process a consumer report table
 */
function processConsumerReportTable(table: HTMLTableElement): void {
  // Add specific class
  table.classList.add("normalized-table");
  table.classList.add("consumer-report-table");

  // Apply consistent styling first as base
  applyConsistentTableStyling(table);

  // Get all rows
  const rows = table.querySelectorAll("tr");
  if (rows.length <= 1) return;

  // Force center alignment for percentage column
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");
    if (cells.length < 2) continue;

    // Always center the percentage column for this specific table type
    (cells[1] as HTMLElement).style.textAlign = "center";
    cells[1].classList.add("percentage-column");

    const content = cells[1].textContent?.trim() || "";

    // Add appropriate class if it has a footnote
    if (/\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/.test(content)) {
      cells[1].classList.add("numeric-with-footnote");
    }
  }
}

/**
 * Check if a table is a financial model table based on headers and structure
 */
function checkForFinancialTable(table: HTMLTableElement): boolean {
  // Get table header row
  const headerRow = table.querySelector("tr:first-child");
  if (!headerRow) return false;

  // Check header cells
  const headers = headerRow.querySelectorAll("th");
  if (headers.length < 2) return false;

  // Get header texts
  const headerTexts = Array.from(headers).map(
    (h) => h.textContent?.trim().toLowerCase() || ""
  );

  // Check for common financial table headers
  const hasMetric = headerTexts.some(
    (text: string) => text === "metric" || text.includes("item")
  );
  const hasValue = headerTexts.some(
    (text: string) => text === "value" || text.includes("amount")
  );
  const hasNotes = headerTexts.some(
    (text: string) => text === "notes" || text.includes("description")
  );

  // Check if table is preceded by a heading with "Financial Model"
  let previousElement = table.previousElementSibling;
  let hasPrecedingFinancialHeading = false;

  while (previousElement && !hasPrecedingFinancialHeading) {
    const tagName = previousElement.tagName.toLowerCase();
    if (tagName.match(/^h[1-6]$/)) {
      const headingText = previousElement.textContent?.toLowerCase() || "";
      hasPrecedingFinancialHeading =
        headingText.includes("financial") ||
        headingText.includes("finance") ||
        headingText.includes("model") ||
        headingText.includes("revenue") ||
        headingText.includes("cost");
      break;
    }
    previousElement = previousElement.previousElementSibling;
  }

  // Determine if it's a financial table based on headers or context
  return (
    (hasMetric && hasValue) ||
    (hasMetric && hasNotes) ||
    hasPrecedingFinancialHeading ||
    headerTexts.includes("roi") ||
    headerTexts.includes("cost") ||
    headerTexts.includes("price") ||
    headerTexts.includes("revenue") ||
    headerTexts.includes("margin")
  );
}

/**
 * Apply consistent styling to any table
 */
function applyConsistentTableStyling(table: HTMLTableElement): void {
  // Ensure table has consistent style
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.margin = "1.5em 0";
  table.style.fontSize = "0.95em";

  // Get all rows
  const rows = table.querySelectorAll("tr");
  if (rows.length <= 1) return;

  // Style header row
  const headerRow = rows[0];
  const headers = headerRow.querySelectorAll("th");

  headers.forEach((header) => {
    (header as HTMLElement).style.textAlign = "center";
    (header as HTMLElement).style.backgroundColor = "#f2f7fd";
    (header as HTMLElement).style.fontWeight = "600";
    (header as HTMLElement).style.border = "1px solid #dddddd";
    (header as HTMLElement).style.padding = "10px 15px";
  });

  // Analyze column content for better alignment decisions
  const columnContentStats = analyzeColumnContent(table);

  // Analyze table structure
  const columnCount = headers.length;
  const isSimpleTable = columnCount <= 3;

  // Determine optimal alignments based on content statistics
  const alignments = determineGeneralTableAlignments(
    columnContentStats,
    isSimpleTable
  );

  // Apply zebra striping
  for (let i = 2; i < rows.length; i += 2) {
    (rows[i] as HTMLElement).style.backgroundColor = "#f8f8f8";
  }

  // Process all cells for consistent styling
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");

    cells.forEach((cell, index) => {
      // Get content
      const content = cell.textContent?.trim() || "";

      // Check for footnotes/references
      const hasFootnote = /\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/.test(content);

      // Remove footnote markers for content analysis
      const cleanedContent = content
        .replace(/\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/, "")
        .trim();

      // Set consistent styling
      (cell as HTMLElement).style.padding = "10px 15px";
      (cell as HTMLElement).style.border = "1px solid #dddddd";
      (cell as HTMLElement).style.verticalAlign = "middle";
      (cell as HTMLElement).style.lineHeight = "1.5em";

      // Apply alignment based on content analysis
      if (alignments[index]) {
        (cell as HTMLElement).style.textAlign = alignments[index];
      }

      // Add appropriate classes based on content type
      if (isNumericContent(content)) {
        cell.classList.add("numeric-cell");

        // Add percentage class for percentage values
        if (content.includes("%")) {
          cell.classList.add("percentage-value");
          cell.setAttribute("data-content", content);
        }

        // If it has a footnote, add special class
        if (hasFootnote) {
          cell.classList.add("numeric-with-footnote");
        }
      } else if (index === 0 && columnCount > 1) {
        // First column in multi-column tables is typically a label
        cell.classList.add("label-cell");
      } else if (content.length > 50) {
        // Long content is likely descriptive
        cell.classList.add("notes-cell");
      }

      // Handle minimum width for short content cells
      if (
        cleanedContent.length < 10 &&
        !isNumericContent(content) &&
        index > 0
      ) {
        // Add min-width for very short content cells
        (cell as HTMLElement).style.minWidth = "70px";
      }
    });
  }
}

/**
 * Determine optimal alignments for general tables based on content analysis
 */
function determineGeneralTableAlignments(
  columnStats: ColumnStats[],
  isSimpleTable: boolean
): string[] {
  if (columnStats.length === 0) return [];

  const alignments: string[] = new Array(columnStats.length).fill("left");

  for (let i = 0; i < columnStats.length; i++) {
    const stats = columnStats[i];

    if (i === 0) {
      // First column is almost always left-aligned (labels)
      alignments[i] = "left";
    } else if (stats.isNumeric) {
      // Numeric columns are right-aligned for better readability
      alignments[i] = "right";
    } else if (stats.avgLength > 50) {
      // Long text content is left-aligned
      alignments[i] = "left";
    } else if (stats.avgLength < 10 && stats.maxLength < 15) {
      // Very short text content is center-aligned in simple tables
      // but left-aligned in complex tables for better readability
      alignments[i] = isSimpleTable ? "center" : "left";
    } else {
      // Default for other content
      alignments[i] = "left";
    }
  }

  return alignments;
}

/**
 * Process a reference table with citations
 */
function processReferenceTable(table: HTMLTableElement): void {
  // Add class for reference table
  table.classList.add("reference-table");

  // Apply consistent base styling
  applyConsistentTableStyling(table);

  // Get all rows
  const rows = table.querySelectorAll("tr");
  if (rows.length <= 1) return;

  // Get header row to determine column types
  const headerRow = rows[0];
  const headers = headerRow.querySelectorAll("th");
  const refHeaderTexts = Array.from(headers).map(
    (h) => h.textContent?.trim().toLowerCase() || ""
  );

  // Check for source or reference column
  const sourceColumnIndex = refHeaderTexts.findIndex(
    (text) =>
      text.includes("source") ||
      text.includes("reference") ||
      text.includes("citation")
  );

  // Style data cells
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");

    cells.forEach((cell, index) => {
      // Style source column
      if (sourceColumnIndex !== -1 && index === sourceColumnIndex) {
        cell.classList.add("source-cell");
        (cell as HTMLElement).style.color = "#555";
        (cell as HTMLElement).style.fontSize = "0.95em";
        (cell as HTMLElement).style.textAlign = "left";
      }

      // Style any cell with a link or superscript (likely a reference)
      if (cell.querySelector("a") || cell.querySelector("sup")) {
        (cell as HTMLElement).classList.add("has-reference");
      }
    });
  }
}

/**
 * Process a financial table with consistent styling
 */
function processFinancialTable(table: HTMLTableElement): void {
  // Add classes for financial table
  table.classList.add("financial-table");
  table.classList.add("metrics-table");
  table.classList.add("value-notes-table");

  // Set consistent style for financial tables
  table.style.borderCollapse = "collapse";
  table.style.width = "100%";
  table.style.margin = "1.5em 0";
  table.style.fontSize = "0.95em";

  // Get all rows
  const rows = table.querySelectorAll("tr");
  if (rows.length <= 1) return;

  // Style the header row
  const headerRow = rows[0];
  const headers = headerRow.querySelectorAll("th");

  headers.forEach((header) => {
    (header as HTMLElement).style.textAlign = "center";
    (header as HTMLElement).style.backgroundColor = "#f2f7fd";
    (header as HTMLElement).style.color = "#333333";
    (header as HTMLElement).style.fontWeight = "600";
    (header as HTMLElement).style.border = "1px solid #dddddd";
    (header as HTMLElement).style.padding = "10px 15px";
  });

  // Analyze column content for better alignment decisions
  const columnContentStats = analyzeColumnContent(table);

  // Apply optimal alignments based on table content and content stats
  const alignments = determineFinancialTableAlignments(
    table,
    columnContentStats
  );

  // Apply zebra striping
  for (let i = 2; i < rows.length; i += 2) {
    (rows[i] as HTMLElement).style.backgroundColor = "#f8f8f8";
  }

  // Process all data cells with the determined alignments
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");

    cells.forEach((cell, index) => {
      // Set consistent styling
      (cell as HTMLElement).style.padding = "10px 15px";
      (cell as HTMLElement).style.border = "1px solid #dddddd";
      (cell as HTMLElement).style.verticalAlign = "middle";
      (cell as HTMLElement).style.lineHeight = "1.5em";

      // Apply the determined alignment
      if (alignments[index]) {
        (cell as HTMLElement).style.textAlign = alignments[index];
      }

      // Add appropriate class based on content
      const content = cell.textContent?.trim() || "";

      // Check for footnotes/references
      const hasFootnote = /\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/.test(content);

      // Remove footnote markers for content analysis
      const cleanedContent = content
        .replace(/\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/, "")
        .trim();

      // Add specific classes based on column position and content type
      if (isNumericContent(content)) {
        cell.classList.add("numeric-cell");

        // Add percentage class for percentage values
        if (content.includes("%")) {
          cell.classList.add("percentage-value");
          // Store content in data attribute for CSS selection
          cell.setAttribute("data-content", content);
        }

        // If it has a footnote, add special class
        if (hasFootnote) {
          cell.classList.add("numeric-with-footnote");
        }
      } else if (index === 0) {
        cell.classList.add("label-cell");
      } else if (index === cells.length - 1 && headers.length >= 3) {
        cell.classList.add("notes-cell");
      }

      // Handle minimum width for short content cells
      if (cleanedContent.length < 10 && index > 0) {
        // Add min-width for very short content cells to prevent squeezing
        (cell as HTMLElement).style.minWidth = "80px";
      }
    });
  }
}

/**
 * Analyze column content to make smart alignment decisions
 */
interface ColumnStats {
  avgLength: number;
  isNumeric: boolean;
  maxLength: number;
  minLength: number;
}

function analyzeColumnContent(table: HTMLTableElement): ColumnStats[] {
  const rows = table.querySelectorAll("tr");
  if (rows.length <= 1) return [];

  const headerRow = rows[0];
  const columnCount = headerRow.querySelectorAll("th").length;
  const stats: ColumnStats[] = [];

  // Initialize column stats
  for (let i = 0; i < columnCount; i++) {
    stats.push({
      avgLength: 0,
      isNumeric: true, // Assume numeric until proven otherwise
      maxLength: 0,
      minLength: Number.MAX_VALUE,
    });
  }

  // Skip header row, analyze each data cell
  let totalRowsAnalyzed = 0;

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].querySelectorAll("td");
    totalRowsAnalyzed++;

    cells.forEach((cell, index) => {
      if (index >= columnCount) return;

      const content = cell.textContent?.trim() || "";
      // For content length, use the full content with footnotes
      const contentLength = content.length;

      // For numeric detection, check if the content without footnotes is numeric
      const cleanedContent = content
        .replace(/\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/, "")
        .trim();
      const isNumeric = isNumericContent(cleanedContent);

      // Track lengths
      stats[index].avgLength += contentLength;
      stats[index].maxLength = Math.max(stats[index].maxLength, contentLength);
      stats[index].minLength = Math.min(stats[index].minLength, contentLength);

      // Check if content is non-numeric
      if (!isNumeric && content.length > 0) {
        stats[index].isNumeric = false;
      }
    });
  }

  // Calculate averages
  if (totalRowsAnalyzed > 0) {
    for (let i = 0; i < stats.length; i++) {
      stats[i].avgLength = stats[i].avgLength / totalRowsAnalyzed;
    }
  }

  return stats;
}

/**
 * Determine optimal alignments for financial tables
 */
function determineFinancialTableAlignments(
  table: HTMLTableElement,
  columnStats?: ColumnStats[]
): string[] {
  const rows = table.querySelectorAll("tr");
  if (rows.length <= 1) return [];

  const headerRow = rows[0];
  const headers = headerRow.querySelectorAll("th");
  const columnCount = headers.length;
  const alignments: string[] = new Array(columnCount).fill("center");

  // Financial tables typically have the first column left-aligned
  if (columnCount > 1) {
    alignments[0] = "left";
  }

  // For standard metric/value/notes tables
  const finHeaderTexts = Array.from(headers).map(
    (h) => h.textContent?.trim().toLowerCase() || ""
  );
  const hasMetric = finHeaderTexts.some(
    (text) => text === "metric" || text.includes("item")
  );
  const hasValue = finHeaderTexts.some(
    (text) => text === "value" || text.includes("amount")
  );
  // Not currently used but may be useful in future enhancements - removed unused variable

  // Use column stats for smarter alignment if available
  if (columnStats && columnStats.length === columnCount) {
    for (let i = 0; i < columnCount; i++) {
      const stats = columnStats[i];

      if (i === 0) {
        // First column is almost always left-aligned (labels)
        alignments[i] = "left";
      } else if (stats.isNumeric) {
        // Numeric columns are right-aligned for better readability
        alignments[i] = "right";
      } else if (stats.avgLength > 30) {
        // Longer text content is left-aligned
        alignments[i] = "left";
      } else if (stats.avgLength < 10 && stats.maxLength < 15) {
        // Very short content is center-aligned for better appearance
        alignments[i] = "center";
      } else {
        // Default for other text content
        alignments[i] = "left";
      }
    }

    return alignments;
  }

  // Fall back to header-based alignment if stats not available
  if (hasMetric && hasValue && columnCount >= 3) {
    // Default financial table (Metric | Value | Notes)
    alignments[0] = "left"; // Metric column left
    alignments[1] = "right"; // Value column right-aligned for numbers

    // Notes column (typically last)
    if (columnCount >= 3) {
      alignments[columnCount - 1] = "left"; // Notes left-aligned for readability
    }
  }

  return alignments;
}

/**
 * Check if a table contains references (footnotes, citations, etc.)
 */
function checkForReferences(table: HTMLTableElement): boolean {
  const tableHTML = table.innerHTML;

  // Check for common reference patterns
  const referencePatterns = [
    /\[\^?\d+\]/, // Markdown footnote style [^1] or [1]
    /<sup>/, // Superscript tags
    /\(\d{4}\)/, // Year citations like (2023)
    /\b[A-Z][a-z]+ et al\b/, // Author citations like "Smith et al"
    /\bIbid\b/, // Academic references
    /\b[A-Z][a-z]+ \d{4}\b/, // Author year like "Smith 2023"
  ];

  // Check for source or reference in the last column header
  const headers = table.querySelectorAll("th");
  if (headers.length > 0) {
    const lastHeader = headers[headers.length - 1];
    const headerText = lastHeader.textContent?.toLowerCase() || "";
    if (headerText.includes("source") || headerText.includes("reference")) {
      return true;
    }
  }

  // Check for links in cells
  const hasLinks = table.querySelectorAll("td a").length > 0;
  if (hasLinks) return true;

  // Check for reference patterns
  return referencePatterns.some((pattern) => pattern.test(tableHTML));
}

/**
 * Check if content is numeric
 */
function isNumericContent(content: string): boolean {
  // Strip footnote markers and superscripts for detection
  const cleanedContent = content
    .replace(/\[\^?\d+\]|\^\d+|\[\d+\]|\(\d+\)/, "")
    .trim();

  // Handle common number formats
  return (
    /^-?\s*\d+(\.\d+)?%?$/.test(cleanedContent) ||
    /^\$\s*\d+(\.\d+)?$/.test(cleanedContent) ||
    /^-?\s*\d{1,3}(,\d{3})*(\.\d+)?%?$/.test(cleanedContent) ||
    /^-?\s*\d+(\.\d+)?[kKmMbBtT]$/.test(cleanedContent) // Handle 10k, 5M, etc.
  );
}

/**
 * Wrap the table in a container if needed for responsive display
 * Used by responsive utilities but exported here for future use
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function wrapTableIfNeeded(table: HTMLTableElement): void {
  // Check if table is already wrapped
  if (table.parentElement?.classList.contains("table-responsive")) {
    return;
  }

  // Check if table needs responsive wrapper
  const columnCount = table.querySelector("tr")?.children.length || 0;
  if (columnCount > 4) {
    const wrapper = document.createElement("div");
    wrapper.className = "table-responsive";
    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  }
}
