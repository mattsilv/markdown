'use client';

import { marked } from 'marked';
import { MarkdownOptions } from '../types';

/**
 * Configure marked.js options
 */
export function configureMarked(options: MarkdownOptions) {
  // Configure renderer to avoid footnote processing conflicts
  const renderer = new marked.Renderer();
  
  // Instead of overriding the renderers (which is causing type issues), 
  // we'll use marked extensions which is the modern way to customize rendering
  
  marked.use({
    extensions: [{
      name: 'customHeading',
      level: 'block',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderer(token: any) {
        if (token.type !== 'heading') return false;
        
        // Remove any remaining asterisks or underscores from heading text
        const cleanText = token.text.replace(/(\*\*|__)(.*?)(\*\*|__)/g, '$2');
        
        // Return the cleaned heading HTML
        return `<h${token.depth}>${cleanText}</h${token.depth}>`;
      }
    },
    {
      name: 'customParagraph',
      level: 'block',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderer(token: any) {
        if (token.type !== 'paragraph') return false;
        
        // Let tailwind handle paragraph spacing
        return `<p>${token.text}</p>`;
      }
    }]
  });
  
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