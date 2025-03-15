'use client';

/**
 * Fix footnote links in the rendered HTML
 */
export function fixLinks(container: HTMLElement): void {
  if (!container) return;

  console.log("Fixing footnote links in rendered HTML");

  // Apply direct styling to footnotes section
  applyFootnoteStyles(container);

  // Fix links from footnote references to footnote items
  fixReferenceLinks(container);

  // Fix links from footnote items back to references
  fixBackreferenceLinks(container);
}

/**
 * Apply direct styling to footnotes section
 */
function applyFootnoteStyles(container: HTMLElement): void {
  // Find the footnotes section
  const footnotesSection = container.querySelector<HTMLElement>(
    ".footnotes, .report-content-footnotes, .works-cited"
  );

  if (footnotesSection) {
    console.log("Applying direct styling to footnotes section");

    // Apply font size directly
    footnotesSection.style.fontSize = "0.8em";

    // Also ensure the list items have the correct styling
    const footnoteItems = footnotesSection.querySelectorAll<HTMLElement>("li");
    footnoteItems.forEach((item) => {
      item.style.fontSize = "1em"; // Relative to parent
    });
  }
}

/**
 * Fix links from footnote references to footnote items
 */
function fixReferenceLinks(container: HTMLElement): void {
  // Find all footnote references
  const footnoteRefs = container.querySelectorAll<HTMLAnchorElement>(
    ".footnote-ref a, .citation-ref a"
  );

  footnoteRefs.forEach((link) => {
    const href = link.getAttribute("href");

    // Check if the link is valid
    if (href && href.startsWith("#fn-")) {
      // Get the target footnote item
      const targetId = href.substring(1); // Remove the # character
      const targetItem = container.querySelector(`#${targetId}`);

      if (!targetItem) {
        console.log(`Warning: Footnote reference target not found: ${href}`);
      }
    }
  });
}

/**
 * Fix links from footnote items back to references
 */
function fixBackreferenceLinks(container: HTMLElement): void {
  // Find all footnote backlinks
  const backlinks = container.querySelectorAll<HTMLAnchorElement>(".footnote-backref");

  backlinks.forEach((link) => {
    const href = link.getAttribute("href");

    // Check if the link is valid
    if (href && href.startsWith("#fnref-")) {
      // Get the target footnote reference
      const targetId = href.substring(1); // Remove the # character
      const targetRef = container.querySelector(`#${targetId}`);

      if (!targetRef) {
        console.log(`Warning: Backlink target not found: ${href}`);
      }
    }
  });
}