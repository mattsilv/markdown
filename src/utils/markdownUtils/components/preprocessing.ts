'use client';

import { MarkdownOptions } from '../types';
import { processFootnotes } from '../../footnoteUtils';

/**
 * Pre-process markdown to fix common issues before rendering
 */
export function preprocessMarkdown(text: string, options: MarkdownOptions): string {
  if (!text) return "";

  let processed = text;

  // Fix escaped backslashes before periods in lists if option is checked
  if (options.fixEscapes) {
    // Fix backslash escapes before periods in numbered lists
    processed = processed.replace(/(\d+)\\\./g, "$1.");

    // Fix other common escaped characters that cause rendering issues
    processed = processed.replace(/\\([._*{}[\]()#+\-!])/g, "$1");
  }

  // Google Docs processing functionality
  if (options.fixGDocs) {
    // Basic fixes for common Google Docs issues
    // Remove extra backslashes that Google Docs adds
    processed = processed.replace(/\\([^\s])/g, '$1');
    // Fix line breaks
    processed = processed.replace(/\n{3,}/g, '\n\n');
  }

  // Process standard markdown footnotes
  if (options.processFootnotes) {
    console.log("Processing standard markdown footnotes");
    try {
      processed = processFootnotes(processed);
      console.log("Footnotes processed successfully");
    } catch (err) {
      console.error("Error processing footnotes:", err);
      // Continue without footnote processing rather than failing
    }
  }

  return processed;
}