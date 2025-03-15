'use client';

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { processTables } from './tableUtils';
import { processFootnotes, fixFootnoteLinks } from './footnoteUtils';

export interface MarkdownOptions {
  fixEscapes?: boolean;
  fixGDocs?: boolean;
  processFootnotes?: boolean;
  smartLists?: boolean;
}

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
    processed = processFootnotes(processed);
  }

  return processed;
}

/**
 * Configure marked.js options
 */
export function configureMarked(options: MarkdownOptions) {
  // Configure renderer to avoid footnote processing conflicts
  const renderer = new marked.Renderer();
  
  // Override the link renderer to avoid conflicting with our footnote links
  const originalLinkRenderer = renderer.link;
  renderer.link = function(href, title, text) {
    // If this is a footnote link or backref, we'll handle it ourselves
    if (
      (href && href.startsWith('#fn-')) || 
      (href && href.startsWith('#fnref-')) || 
      (text === '↩')
    ) {
      // Return the original href and text to avoid conflicts
      return `<a href="${href}"${title ? ` title="${title}"` : ''}>${text}</a>`;
    }
    
    // For normal links, use the original renderer
    return originalLinkRenderer.call(this, href, title, text);
  };
  
  return {
    breaks: true,
    headerIds: true,
    gfm: true,
    pedantic: false,
    mangle: false,
    smartLists: options.smartLists,
    smartypants: true,
    xhtml: false,
    renderer: renderer
  };
}

/**
 * Extract title from the first heading or use default
 */
export function extractTitle(markdown: string): {title: string, modifiedMarkdown: string} {
  // Look for a title in the first line
  const titleMatch = markdown.match(
    /^\s*(?:#\s+(.*?)$|(?:\*\*|__)(.*?)(?:\*\*|__)$)/m
  );

  if (titleMatch) {
    // Either group 1 (# heading) or group 2 (** bold **) will have the title
    const title = (titleMatch[1] || titleMatch[2]).trim();

    // If we found a title in the first line, remove it from the markdown to avoid duplication
    const modifiedMarkdown = markdown.replace(
      /^\s*(?:#\s+.*?$|(?:\*\*|__)(.*?)(?:\*\*|__)$)/m,
      ""
    );

    return { title, modifiedMarkdown };
  }

  return { title: "Report", modifiedMarkdown: markdown };
}

/**
 * Render markdown to HTML with DOMPurify
 */
export function renderMarkdown(markdown: string, markedOptions: marked.MarkedOptions): string {
  marked.setOptions(markedOptions);

  // Configure DOMPurify to allow footnote links
  const purifyConfig = {
    ADD_ATTR: ["id", "target", "rel", "href", "aria-label"],
  };

  const sanitizedHtml = DOMPurify.sanitize(
    marked.parse(markdown),
    purifyConfig
  );

  // We need to be in a browser environment for this
  if (typeof document !== 'undefined') {
    // Process the HTML through a temporary container to enhance tables
    const tempContainer = document.createElement("div");
    tempContainer.innerHTML = sanitizedHtml;

    // Process tables
    processTables(tempContainer);

    // Fix any footnote links
    fixFootnoteLinks(tempContainer);

    return tempContainer.innerHTML;
  }
  
  return sanitizedHtml;
}