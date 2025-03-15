'use client';

import { marked } from 'marked';

/**
 * Configure customized link rendering to properly handle Markdown links
 */
export function configureCustomLinkRenderer() {
  marked.use({
    extensions: [{
      name: 'customLinkRenderer',
      level: 'inline',
      start(src: string) {
        return src.match(/\[/)?.index;
      },
      // Tokens not used in this function but required by marked.js extension API
      // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
      tokenizer(src: string, tokens: any) {
        // Match markdown links in format [text](url) where text and url are the same
        const urlLinkMatch = src.match(/^\[(https?:\/\/[^\s\]]+)\]\(\1\)/);
        if (urlLinkMatch) {
          const url = urlLinkMatch[1];
          return {
            type: 'customUrlLink',
            raw: urlLinkMatch[0],
            href: url,
            text: url
          };
        }
        return undefined;
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      renderer(token: any) {
        if (token.type === 'customUrlLink') {
          // Only render URL once to avoid duplication
          return `<a href="${token.href}">${token.text}</a>`;
        }
        
        // Regular link handling
        const { href, title, text } = token;
        
        // If this is a footnote link or backref, customize the rendering
        if (
          (href && href.startsWith('#fn-')) || 
          (href && href.startsWith('#fnref-')) || 
          (text === '↩')
        ) {
          return `<a href="${href}"${title ? ` title="${title}"` : ''}>${text}</a>`;
        }
        
        // For other links, use the default behavior
        return false; // Use the default renderer
      }
    }]
  });
}