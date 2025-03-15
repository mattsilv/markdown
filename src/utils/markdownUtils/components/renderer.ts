'use client';

import { marked } from 'marked';
import DOMPurify from 'dompurify';
import { processTables } from '../../tableUtils';
import { fixFootnoteLinks } from '../../footnoteUtils';

/**
 * Render markdown to HTML with DOMPurify
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function renderMarkdown(markdown: string, markedOptions: any): Promise<string> {
  console.log("Rendering markdown with marked.js...");
  try {
    marked.setOptions(markedOptions);

    // Configure DOMPurify to allow footnote links
    const purifyConfig = {
      ADD_ATTR: ["id", "target", "rel", "href", "aria-label"],
    };

    // Parse markdown to HTML - use await since marked.parse might return a Promise in newer versions
    console.log("Parsing markdown to HTML...");
    const parsedHtml = await marked.parse(markdown);
    
    // Sanitize the HTML
    console.log("Sanitizing HTML with DOMPurify...");
    const sanitizedHtml = DOMPurify.sanitize(parsedHtml as string, purifyConfig);

    // Check if we're in a browser environment
    if (typeof document !== 'undefined') {
      console.log("Browser environment detected, processing HTML...");
      // Process the HTML through a temporary container to enhance tables
      const tempContainer = document.createElement("div");
      tempContainer.innerHTML = sanitizedHtml;

      try {
        // Process tables
        console.log("Processing tables...");
        processTables(tempContainer);
        
        // Fix any footnote links
        console.log("Fixing footnote links...");
        fixFootnoteLinks(tempContainer);
        
        // Look for and fix duplicate content issue
        console.log("HTML content length:", tempContainer.innerHTML.length);
        
        // Get the first heading as an anchor point
        const firstHeading = tempContainer.querySelector('h1');
        if (firstHeading) {
          const headingId = firstHeading.id;
          console.log("First heading ID:", headingId);
          
          // Count occurrences of this heading
          const headingMatches = tempContainer.querySelectorAll(`h1#${headingId}`);
          console.log("Number of identical h1 elements:", headingMatches.length);
          
          if (headingMatches.length > 1) {
            console.warn("Duplicate content detected, removing duplicates");
            
            // Calculate the position after the first heading (not used directly but helpful for debugging)
            tempContainer.innerHTML.substring(
              0, 
              tempContainer.innerHTML.indexOf(`<h1 id="${headingId}">`) + 
              (`<h1 id="${headingId}">${firstHeading.innerHTML}</h1>`).length
            );
            
            // Find the second occurrence position
            const secondPos = tempContainer.innerHTML.indexOf(
              `<h1 id="${headingId}">`, 
              tempContainer.innerHTML.indexOf(`<h1 id="${headingId}">`) + 1
            );
            
            // If found, truncate the content
            if (secondPos > -1) {
              console.log("Truncating at position:", secondPos);
              tempContainer.innerHTML = tempContainer.innerHTML.substring(0, secondPos);
            }
          }
        }
        
        console.log("HTML processing complete");
        return tempContainer.innerHTML;
      } catch (processingError) {
        console.error("Error during HTML post-processing:", processingError);
        // Return the sanitized HTML as a fallback
        return sanitizedHtml;
      }
    }
    
    console.log("Server environment detected, returning sanitized HTML");
    return sanitizedHtml;
  } catch (error) {
    console.error("Error rendering markdown:", error);
    throw new Error(`Markdown rendering failed: ${error instanceof Error ? error.message : String(error)}`);
  }
}