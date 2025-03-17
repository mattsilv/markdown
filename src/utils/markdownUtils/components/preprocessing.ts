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

  // Remove special characters and symbols that come from ChatGPT copy operations
  // Remove invisible/hidden Unicode characters
  processed = processed.replace(/[\u200B-\u200F\u2028-\u202E\u00A0]/g, '');
  
  // Remove non-breaking spaces and other typographic whitespace variations
  processed = processed.replace(/[\u00A0\u2000-\u200A\u202F\u205F\u3000]/g, ' ');
  
  // Remove unusual punctuation and symbols that may appear when copying from ChatGPT
  processed = processed.replace(/[\u2013\u2014]/g, '-'); // En dash, em dash to hyphen
  processed = processed.replace(/[\u2018\u2019]/g, "'"); // Curly single quotes to straight quote
  processed = processed.replace(/[\u201C\u201D]/g, '"'); // Curly double quotes to straight quotes
  
  return processed;
}