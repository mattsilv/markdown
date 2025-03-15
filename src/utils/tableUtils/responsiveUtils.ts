'use client';

/**
 * Wrap table in a responsive container for horizontal scrolling
 * Adds a note to indicate scrolling is possible
 */
export function wrapTableInResponsiveContainer(table: HTMLTableElement): void {
  // Skip if already wrapped
  if (table.parentNode && (table.parentNode as HTMLElement).classList.contains("table-responsive")) {
    return;
  }

  // Create a wrapper div with appropriate styling
  const wrapper = document.createElement("div");
  wrapper.className = "table-responsive";

  // Get the parent node of the table
  const parent = table.parentNode;
  if (!parent) return;

  // Insert the wrapper before the table in the DOM
  parent.insertBefore(wrapper, table);

  // Move the table into the wrapper
  wrapper.appendChild(table);

  // Add a small note above the table for wide tables
  const note = document.createElement("div");
  note.className = "table-note";
  note.textContent = "Scroll horizontally to view all columns";

  // Insert the note before the table in the wrapper
  wrapper.insertBefore(note, table);
}