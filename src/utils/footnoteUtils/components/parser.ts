'use client';

/**
 * Process footnote content to ensure URLs are properly linked
 * 
 * @param content The footnote content text
 * @returns Processed content with URLs converted to clickable links
 */
function processFootnoteContent(content: string): string {
  if (!content) return '';
  
  // Regular expression to find URLs that aren't already in HTML links
  // This matches URLs starting with http://, https://, or www.
  // And not already inside an existing <a> tag
  const urlRegex = /(?<!<a[^>]*>.*?)(?:https?:\/\/|www\.)[^\s<>]+/g;
  
  // Replace plain URLs with clickable links  
  return content.replace(urlRegex, (url) => {
    // Ensure URL has http(s):// prefix
    const fullUrl = url.startsWith('www.') ? `https://${url}` : url;
    
    // Clean up URL - remove trailing punctuation that might be part of the sentence
    let cleanUrl = fullUrl;
    // Remove trailing punctuation that isn't part of the URL
    if (/[.,!?:;]$/.test(cleanUrl)) {
      cleanUrl = cleanUrl.slice(0, -1);
    }
    
    return `<a href="${cleanUrl}" class="url-only-link" target="_blank">${url}</a>`;
  });
}

/**
 * Find all footnote references in format [^1] and track them
 */
export interface ReferenceResult {
  processed: string;
  footnoteRefs: Map<string, number[]>;
}

export function parseReferences(text: string): ReferenceResult {
  if (!text) return { processed: "", footnoteRefs: new Map() };

  const footnoteRefs = new Map<string, number[]>(); // Map to track all references for each footnote ID
  let footnoteRefIndex = 1; // Create unique reference IDs for tracking

  // Simple standard markdown footnote reference pattern
  // IMPORTANT: We need to exclude footnote definitions that look like [^1]: content
  // by making sure the reference isn't followed by a colon
  const processed = text.replace(
    /\[\^(\d+|[a-zA-Z0-9_-]+)\](?!:)/g,  // Added (?!:) to exclude definitions
    (match, refId) => {
      // Keep track of all references to each footnote ID
      if (!footnoteRefs.has(refId)) {
        footnoteRefs.set(refId, []);
      }
      const currentRefIndex = footnoteRefIndex++;
      footnoteRefs.get(refId)?.push(currentRefIndex);

      // Create the footnote reference in HTML
      const safeId = refId.replace(/[^a-zA-Z0-9-_]/g, "-");
      console.log(
        `Creating footnote ref: fnref-${safeId}-${currentRefIndex} pointing to fn-${safeId}`
      );

      // Check if this reference appears multiple times (would be a citation)
      const refCount = footnoteRefs.get(refId)?.length || 0;
      const isCitation =
        refCount > 1 || (footnoteRefs.get(refId)?.indexOf(currentRefIndex) ?? -1) > 0;

      // Generate HTML for the reference - no sup tags, just regular text
      return `<span id="fnref-${safeId}-${currentRefIndex}" class="footnote-ref${
        isCitation ? " citation-ref" : ""
      }"><a href="#fn-${safeId}">[${refId}]</a></span>`;
    }
  );

  return { processed, footnoteRefs };
}

/**
 * Extract footnote definitions from the markdown text
 */
export interface DefinitionResult {
  footnotes: Map<string, string>;
  processed: string;
}

export function extractDefinitions(text: string): DefinitionResult {
  const footnotes = new Map<string, string>();

  console.log("Starting footnote definition extraction");

  // First attempt: Try regex approach to find Works Cited section and standard footnote definitions
  // Account for bold/italic formatting around the heading text with optional ** markers
  const worksCitedSectionMatch = text.match(
    /(?:##\s+|###\s+|####\s+)(?:\*\*)?(?:Works cited|Works Cited|References|Footnotes|Notes|Bibliography)(?:\*\*)?.*?\n([\s\S]+)$/i
  );

  if (worksCitedSectionMatch) {
    console.log(
      "Found Works Cited/References section, will check for definitions there too"
    );

    // Try to find numbered references in format [^n]: content
    const sectionText = worksCitedSectionMatch[1];
    const refMatches = sectionText.match(
      /\[\^(\d+|[a-zA-Z0-9_-]+)\]:\s+([^\[\n]+)/g
    );

    if (refMatches && refMatches.length > 0) {
      console.log(
        `Found ${refMatches.length} potential footnote definitions in Works Cited section`
      );

      for (const match of refMatches) {
        const parts = match.match(/\[\^(\d+|[a-zA-Z0-9_-]+)\]:\s+(.+)/);
        if (parts) {
          const [, id, content] = parts;
          if (!footnotes.has(id)) {
            // Process content to ensure URLs are linked
            const processedContent = processFootnoteContent(content.trim());
            footnotes.set(id, processedContent);
            console.log(
              `Extracted citation ${id} from Works Cited section: ${content
                .trim()
                .substring(0, 40)}...`
            );
          }
        }
      }
    }
  }

  // Now do the line-by-line approach for standard markdown footnotes
  const lines = text.split("\n");
  const footnoteDefRegex = /^\s*\[\^(\d+|[a-zA-Z0-9_-]+)\]:\s+(.+)/;
  let currentId: string | null = null;
  let currentContent = "";

  // Debug the first few lines to see what we're working with
  console.log("First 10 lines of input:");
  for (let i = 0; i < Math.min(10, lines.length); i++) {
    console.log(
      `Line ${i + 1}: ${lines[i].substring(0, 50)}${
        lines[i].length > 50 ? "..." : ""
      }`
    );
  }

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    // Check if this line starts a new footnote definition
    const match = line.match(footnoteDefRegex);

    if (match) {
      console.log(
        `Found footnote definition at line ${i + 1}: [^${match[1]}]`
      );

      // If we were already building a footnote, save it first
      if (currentId !== null) {
        // Process content to ensure URLs are linked
        const processedContent = processFootnoteContent(currentContent.trim());
        footnotes.set(currentId, processedContent);
        console.log(
          `Saved footnote ${currentId}: ${currentContent
            .trim()
            .substring(0, 40)}...`
        );
      }

      // Start a new footnote
      currentId = match[1];
      currentContent = match[2];
    }
    // If we're in the middle of a footnote and the line isn't empty or another footnote,
    // append it to the current content
    else if (
      currentId !== null &&
      line.length > 0 &&
      !line.match(footnoteDefRegex)
    ) {
      currentContent += " " + line;
    }
  }

  // Don't forget to save the last footnote if we were building one
  if (currentId !== null) {
    // Process content to ensure URLs are linked
    const processedContent = processFootnoteContent(currentContent.trim());
    footnotes.set(currentId, processedContent);
    console.log(
      `Saved last footnote ${currentId}: ${currentContent
        .trim()
        .substring(0, 40)}...`
    );
  }

  // If we found no footnotes, try a more aggressive approach for Works Cited style
  if (footnotes.size === 0 && worksCitedSectionMatch) {
    console.log(
      "No footnotes found with standard approach, trying to extract from Works Cited format"
    );

    const citedSection = worksCitedSectionMatch[1];
    // Split by newlines and look for numbered items
    const citedLines = citedSection.split("\n");

    for (let i = 0; i < citedLines.length; i++) {
      const line = citedLines[i].trim();

      // Look for numbered items like "1. Author (Year). Title." or "[1] Author (Year). Title."
      const numberMatch = line.match(
        /^(?:\[?(\d+)\]?\.|\(?(\d+)\)?\.)\s+(.+)/
      );

      if (numberMatch) {
        const id = numberMatch[1] || numberMatch[2];
        const content = numberMatch[3];

        if (!footnotes.has(id)) {
          // Process content to ensure URLs are linked
          const processedContent = processFootnoteContent(content.trim());
          footnotes.set(id, processedContent);
          console.log(
            `Extracted citation ${id} from numbered item: ${content
              .trim()
              .substring(0, 40)}...`
          );
        }
      }
    }
  }

  console.log(`Total footnotes extracted: ${footnotes.size}`);

  // Approach to content cleaning:
  // 1. Find and remove individual footnote definitions, but
  // 2. Keep the Works Cited heading and non-footnote content intact
  let finalProcessed = text;

  if (footnotes.size > 0) {
    // First, replace standalone footnote definitions with empty string
    const allDefsRegex =
      /^\s*\[\^(\d+|[a-zA-Z0-9_-]+)\]:\s+.+(?:\n(?!\[\^|\s*$).+)*/gm;
    finalProcessed = finalProcessed.replace(allDefsRegex, "");

    // Now clean up any potential empty lines that might be left
    finalProcessed = finalProcessed.replace(/\n{3,}/g, "\n\n");

    console.log(
      "Removed footnote definitions from main content while preserving Works Cited section"
    );
  }

  // Check if we have a Works Cited section - account for bold/italic formatting in heading
  const worksCitedHeadingMatch = finalProcessed.match(
    /(?:\n|^)(##\s+|###\s+|####\s+)(?:\*\*)?(?:Works cited|Works Cited|References|Footnotes|Notes|Bibliography)(?:\*\*)?/i
  );

  if (worksCitedHeadingMatch) {
    console.log(
      "Found Works Cited heading in the processed content, will preserve it"
    );
  } else {
    // If we have footnotes but no Works Cited section, let's add one
    // This will be used when we don't have an existing heading in the document
    if (footnotes.size > 0) {
      console.log(
        "No Works Cited section found, but have footnotes - adding heading"
      );
      finalProcessed = finalProcessed.trim() + "\n\n### References\n";
    }
  }

  return { footnotes, processed: finalProcessed };
}