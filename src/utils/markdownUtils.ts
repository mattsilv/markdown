"use client";

// This file now re-exports from the modular components
// to maintain backward compatibility during refactoring

export type { MarkdownOptions } from "./markdownUtils/types";
export { preprocessMarkdown } from "./markdownUtils/components/preprocessing";
export { configureMarked } from "./markdownUtils/components/markedConfiguration";
export { extractTitle } from "./markdownUtils/components/titleExtractor";
export { renderMarkdown } from "./markdownUtils/components/renderer";
export { configureCustomLinkRenderer } from "./markdownUtils/components/linkRenderer";

/**
 * Normalize spacing in markdown content for consistency
 * This helps ensure that all documents have consistent spacing
 * regardless of how the original markdown was formatted
 */
export function normalizeMarkdownSpacing(markdownContent: string): string {
  if (!markdownContent) return "";

  // Step 1: Normalize line endings
  let normalized = markdownContent.replace(/\r\n/g, "\n");

  // Step 2: Format executive summary bullet points
  // Look for executive summary section
  const executiveSummaryMatch = normalized.match(
    /#{1,3}\s+Executive\s+Summary.*?\n/i
  );
  if (executiveSummaryMatch) {
    const startIndex =
      executiveSummaryMatch.index! + executiveSummaryMatch[0].length;
    const nextHeadingMatch = normalized.slice(startIndex).match(/\n#{1,3}\s+/);
    const endIndex = nextHeadingMatch
      ? startIndex + nextHeadingMatch.index!
      : normalized.length;

    // Get executive summary content
    const executiveSummary = normalized.slice(startIndex, endIndex);

    // Convert specific lines to bullet points
    const keyTerms = [
      "Drive",
      "Increase",
      "Enhance",
      "Support",
      "Differentiate",
    ];

    let updatedSummary = executiveSummary;
    const lines = executiveSummary.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Check if line starts with any of the key terms
      if (keyTerms.some((term) => line.startsWith(term))) {
        // Convert to bullet point if it's not already one
        if (!line.startsWith("- ") && !line.startsWith("* ")) {
          lines[i] = "- " + line;
        }
      }
    }

    updatedSummary = lines.join("\n");

    // Replace the original summary with updated one
    normalized =
      normalized.slice(0, startIndex) +
      updatedSummary +
      normalized.slice(endIndex);
  }

  // Step 3: Fix inconsistent heading spacing
  // Ensure headings have consistent spacing before and after
  normalized = normalized.replace(/\n{3,}(#{1,6} )/g, "\n\n$1");
  normalized = normalized.replace(/(#{1,6} .*)\n{3,}/g, "$1\n\n");

  // Step 4: Fix inconsistent paragraph spacing
  // Replace 3+ newlines with exactly 2 newlines (one blank line)
  normalized = normalized.replace(/\n{3,}/g, "\n\n");

  // Step 5: Fix list spacing
  // Ensure proper spacing before and after lists
  normalized = normalized.replace(/\n{3,}(- |\d+\. )/g, "\n\n$1");
  normalized = normalized.replace(/([^\n])\n{1}(- |\d+\. )/g, "$1\n\n$2");

  // Step 6: Fix horizontal rule spacing
  // Ensure horizontal rules have consistent spacing
  normalized = normalized.replace(
    /\n{3,}(---|\*\*\*|___)\n{3,}/g,
    "\n\n$1\n\n"
  );

  // Step 7: Fix spacing around tables
  // Ensure tables have consistent spacing before and after
  normalized = normalized.replace(/\n{3,}(\|[^\n]+\|)\n/g, "\n\n$1\n");
  normalized = normalized.replace(/\n(\|[-:\s|]+\|)\n{3,}/g, "\n$1\n\n");

  // Step 8: Fix spacing around code blocks
  normalized = normalized.replace(/\n{3,}(```)/g, "\n\n$1");
  normalized = normalized.replace(/(```)\n{3,}/g, "$1\n\n");

  // Step 9: Fix spacing around blockquotes
  normalized = normalized.replace(/\n{3,}(> )/g, "\n\n$1");
  normalized = normalized.replace(/((?:> [^\n]*\n)+> [^\n]*)\n{3,}/g, "$1\n\n");

  // Step 10: Fix spacing around HTML blocks
  normalized = normalized.replace(/\n{3,}(<\w+)/g, "\n\n$1");
  normalized = normalized.replace(/(<\/\w+>)\n{3,}/g, "$1\n\n");

  // Step 11: Ensure consistent spacing at document start and end
  normalized = normalized.replace(/^\n+/, ""); // Remove leading newlines
  normalized = normalized.replace(/\n+$/, "\n"); // Ensure exactly one trailing newline

  return normalized;
}

/**
 * Add consistent spacing between different sections of content
 */
export function addSectionSpacing(htmlContent: string): string {
  if (!htmlContent) return "";

  let content = htmlContent;

  // Add adequate spacing between heading and content sections
  content = content.replace(/<\/h([1-3])>\s*<p>/g, "</h$1>\n<p>");

  // Ensure consistent spacing after lists and before new sections
  content = content.replace(/<\/ul>\s*<h([1-3])>/g, "</ul>\n\n<h$1>");
  content = content.replace(/<\/ol>\s*<h([1-3])>/g, "</ol>\n\n<h$1>");

  // Ensure consistent spacing around tables
  content = content.replace(/<\/table>\s*<p>/g, "</table>\n<p>");
  content = content.replace(/<\/p>\s*<table/g, "</p>\n<table");

  // Ensure consistent spacing around horizontal rules
  content = content.replace(/<hr\s*\/?>\s*<h/g, "<hr/>\n<h");
  content = content.replace(/<\/p>\s*<hr/g, "</p>\n<hr");

  // Ensure consistent spacing between consecutive paragraphs
  content = content.replace(/<\/p>\s*<p>/g, "</p>\n<p>");

  return content;
}
