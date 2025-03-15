'use client';

/**
 * Generate HTML for footnote section at the end of the document
 */
export function generateFootnoteSection(
  footnotes: Map<string, string>,
  footnoteRefs: Map<string, number[]>
): string {
  // If no footnotes and no references, skip section entirely
  if (footnotes.size === 0 && footnoteRefs.size === 0) {
    console.log("No footnotes or references to render");
    return "";
  }

  console.log(`Generating footnote section with ${footnotes.size} footnotes`);
  console.log(
    `References map contains ${footnoteRefs.size} IDs:`,
    Array.from(footnoteRefs.keys())
  );

  // IMPORTANT: Use class="footnotes report-content-footnotes works-cited" for proper styling
  // Don't include another HR tag if we're using an existing Works Cited section
  let html =
    '\n\n<div class="footnotes report-content-footnotes works-cited">\n<hr>\n<ol class="footnote-list">';

  // Track which IDs have been rendered to avoid duplicates
  const renderedIds = new Set<string>();

  // Collect all IDs that need to be rendered - both from definitions and references
  const allIds = new Set([
    ...Array.from(footnotes.keys()),
    ...Array.from(footnoteRefs.keys()),
  ]);

  console.log(`Total unique IDs to process: ${allIds.size}`);

  // Sort IDs numerically if possible, otherwise alphabetically
  const allIdsArray = Array.from(allIds);
  const isNumericOnly = allIdsArray.every((id) => !isNaN(Number(id)));
  let sortedIds: string[];

  if (isNumericOnly) {
    sortedIds = allIdsArray.sort((a, b) => Number(a) - Number(b));
  } else {
    sortedIds = allIdsArray.sort((a, b) => a.localeCompare(b));
  }

  // Process each ID
  for (const id of sortedIds) {
    const safeId = id.replace(/[^a-zA-Z0-9-_]/g, "-");

    if (renderedIds.has(safeId)) {
      console.log(`Skipping duplicate footnote id: ${id}`);
      continue;
    }

    // Check if this ID exists in references and footnotes
    const hasReference = footnoteRefs.has(id);
    const hasDefinition = footnotes.has(id);

    // Simple logic: if reference appears multiple times, it's a citation
    const isCitation = hasReference && (footnoteRefs.get(id)?.length ?? 0) > 1;
    const citationClass = isCitation ? " citation-item" : "";

    // Get content - if definition exists use it, otherwise use placeholder
    const content = hasDefinition
      ? footnotes.get(id) ?? ""
      : `<em>No footnote definition found for reference ${id}</em>`;

    console.log(
      `Rendering footnote ${id} (has ref: ${hasReference}, has def: ${hasDefinition}, is citation: ${isCitation})`
    );

    // All footnotes use the same format now (no special treatment for citations)
    // Regular footnotes use brackets and backlinks
    const backrefHtml = hasReference
      ? ` <a href="#fnref-${safeId}-${
          footnoteRefs.get(id)?.[0] ?? 1
        }" class="footnote-backref" aria-label="Back to content">↩</a>`
      : "";

    html += `\n<li id="fn-${safeId}" class="footnote-item${citationClass}">${id}. <span class="footnote-content">${content}</span>${backrefHtml}</li>`;

    renderedIds.add(safeId);
  }

  html += "\n</ol>\n</div>";
  console.log(
    `Created footnote section with ${renderedIds.size} footnotes/citations`
  );
  return html;
}