'use client';

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
    let title = (titleMatch[1] || titleMatch[2]).trim();
    
    // Remove any asterisks or underscores that might still be in the title
    title = title.replace(/(\*\*|__)/g, '');

    // If we found a title in the first line, remove it from the markdown to avoid duplication
    const modifiedMarkdown = markdown.replace(
      /^\s*(?:#\s+.*?$|(?:\*\*|__)(.*?)(?:\*\*|__)$)/m,
      ""
    );

    return { title, modifiedMarkdown };
  }

  return { title: "Report", modifiedMarkdown: markdown };
}