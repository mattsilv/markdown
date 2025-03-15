'use client';

/**
 * Add tooltip to cell with long content
 * Provides a way for users to see the full content on hover
 */
export function addTooltipToCell(cell: HTMLElement): void {
  // Store the full text as a data attribute
  const fullText = cell.textContent || '';
  cell.setAttribute("data-full-text", fullText);
  cell.setAttribute("title", fullText); // Native browser tooltip

  // Add a visual indicator that there's more content
  cell.style.position = "relative";

  // Only add the indicator if it doesn't already exist
  if (!cell.querySelector(".more-indicator")) {
    const indicator = document.createElement("span");
    indicator.className = "more-indicator";
    indicator.textContent = "...";
    cell.appendChild(indicator);
  }
}