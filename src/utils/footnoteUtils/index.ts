'use client';

import { parseReferences, extractDefinitions } from './components/parser';
import { generateFootnoteSection } from './components/renderer';
import { fixLinks } from './components/linkFixer';

/**
 * Process Markdown footnotes and citations
 */
export function processFootnotes(text: string): string {
  if (!text) return "";

  // Parse footnote references and track them
  const { processed: referencedText, footnoteRefs } = parseReferences(text);

  // Extract footnote definitions and remove them from the main content
  const { footnotes, processed: cleanedText } = extractDefinitions(referencedText);

  // Generate footnote section HTML if there are any footnotes
  let result = cleanedText;
  if (footnotes.size > 0) {
    const footnoteSection = generateFootnoteSection(footnotes, footnoteRefs);
    result += footnoteSection;

    // Inject style to ensure works cited section is properly styled
    if (typeof document !== 'undefined') {
      injectWorksCitedStyle();
    }
  }

  return result;
}

/**
 * Fix any footnote links that might be using the wrong format
 * and ensure all footnote links work correctly
 */
export function fixFootnoteLinks(container: HTMLElement): void {
  fixLinks(container);
}

/**
 * Inject a style tag to ensure works cited section is properly styled
 */
function injectWorksCitedStyle(): void {
  // Check if style already exists
  if (document.getElementById("works-cited-style")) {
    return;
  }

  // Create style element
  const style = document.createElement("style");
  style.id = "works-cited-style";
  style.textContent = `
    .works-cited, 
    .report-content .works-cited,
    .footnotes,
    .report-content .footnotes,
    .report-content-footnotes,
    .report-content .report-content-footnotes {
      font-size: 0.8em !important;
    }
    
    .works-cited ol,
    .report-content .works-cited ol,
    .footnote-list {
      font-size: 1em;
    }
    
    .works-cited li,
    .report-content .works-cited li,
    .footnote-item {
      font-size: 1em;
    }
  `;

  // Append to head
  document.head.appendChild(style);
}