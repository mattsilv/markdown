'use client';

import { parseReferences, extractDefinitions } from './components/parser';
import { generateFootnoteSection } from './components/renderer';
import { fixLinks, fixDuplicateUrlLinks } from './components/linkFixer';

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
  
  // Check if we're already inside a works cited section - account for bold/italic formatting in heading
  const hasWorksCitedSection = /(?:##\s+|###\s+|####\s+)(?:\*\*)?(?:Works cited|Works Cited|References|Footnotes|Notes|Bibliography)(?:\*\*)?/i.test(text);
  
  // Always generate the footnote content HTML, but handle differently based on 
  // whether there's an existing Works Cited section
  if (footnotes.size > 0) {
    console.log(`Generating footnote section for ${footnotes.size} footnotes`);
    const footnoteSection = generateFootnoteSection(footnotes, footnoteRefs);
    console.log(`Footnote section HTML length: ${footnoteSection.length} characters`);
    console.log(`Footnote section HTML preview: ${footnoteSection.substring(0, 100)}...`);
    
    if (!hasWorksCitedSection) {
      // If no existing Works Cited section, add our own complete section
      console.log('No existing Works Cited section found, adding complete section with heading');
      result += footnoteSection;
    } else {
      // If there's an existing Works Cited section, we need to:
      // 1. Find where that section starts
      // 2. Insert our footnote HTML content after that heading but without adding a duplicate heading
      console.log('Found existing Works Cited/References section, appending content without duplicate heading');
      
      // Get just the footnote content (without the heading/HR)
      // Extract the ordered list content from the full footnote section
      const footnoteContent = footnoteSection.match(/<ol class="footnote-list">([\s\S]+)<\/ol>/);
      if (footnoteContent && footnoteContent[1]) {
        // Find the works cited heading in the processed content
        const worksCitedMatch = result.match(/(?:##\s+|###\s+|####\s+)(?:\*\*)?(?:Works cited|Works Cited|References|Footnotes|Notes|Bibliography)(?:\*\*)?/i);
        if (worksCitedMatch) {
          const headingIndex = result.indexOf(worksCitedMatch[0]);
          const footnoteStart = headingIndex + worksCitedMatch[0].length;
          
          // Check if there's any content after the heading that we should remove
          // This prevents duplication when the original markdown includes both
          // the heading and the footnote definitions
          const nextHeadingMatch = result.substring(footnoteStart).match(/(?:#{1,6}\s+)/);
          const endOfSection = nextHeadingMatch && nextHeadingMatch.index !== undefined
            ? footnoteStart + nextHeadingMatch.index 
            : result.length;
            
          // Create the result with the heading and our footnote content
          // Don't include the HR tag for existing Works Cited sections to avoid duplicates
          result = result.substring(0, footnoteStart) + 
                  '\n\n<div class="footnotes report-content-footnotes works-cited">\n<ol class="footnote-list">' + 
                  footnoteContent[1] + 
                  '</ol>\n</div>' + 
                  result.substring(endOfSection);
        } else {
          // Fallback - just append the full section
          console.log('Could not locate Works Cited heading for insertion, appending full section');
          result += footnoteSection;
        }
      } else {
        // Fallback if we couldn't extract the content
        console.log('Could not extract footnote content, appending full section');
        result += footnoteSection;
      }
    }

    // No need to inject styles - all styling now in global CSS
  } else {
    console.log('No footnotes found, skipping footnote section generation');
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
 * Export fixDuplicateUrlLinks for testing and direct usage
 */
export { fixDuplicateUrlLinks };

