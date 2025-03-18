"use client";

import { addSectionSpacing } from "@/utils/markdownUtils";
import { useEffect, useState, useRef } from "react";

interface ReportContentProps {
  content: string;
}

export default function ReportContent({ content }: ReportContentProps) {
  const [processedContent, setProcessedContent] = useState(content);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Apply spacing normalization to the HTML content
    const normalizedContent = addSectionSpacing(content);
    setProcessedContent(normalizedContent);
  }, [content]);

  // Add a second useEffect to fix bullet points after rendering
  useEffect(() => {
    if (!contentRef.current) return;

    // Process the executive summary section to properly format bullet points
    formatExecutiveSummaryBulletPoints(contentRef.current);

    // Add classes to paragraphs with special formatting
    addClassesToSpecialParagraphs(contentRef.current);

    // Perform a final cleanup to remove any remaining double bullets
    cleanupDoubleBullets(contentRef.current);
  }, [processedContent]);

  return (
    <div
      ref={contentRef}
      className="report-content prose prose-lg mx-auto max-w-none print:prose-sm"
      dangerouslySetInnerHTML={{ __html: processedContent }}
    />
  );
}

/**
 * Formats the executive summary section to ensure bullet points are displayed properly
 */
function formatExecutiveSummaryBulletPoints(container: HTMLElement) {
  // Find the executive summary section
  const h2Elements = container.querySelectorAll("h2");
  let executiveSummarySection: HTMLElement | null = null;

  for (const h2 of h2Elements) {
    if (h2.textContent?.toLowerCase().includes("executive summary")) {
      executiveSummarySection = h2 as HTMLElement;
      break;
    }
  }

  if (!executiveSummarySection) return;

  // First check if we already have UL elements - if so, don't try to create new ones
  let sibling = executiveSummarySection.nextElementSibling;
  while (sibling && sibling.tagName !== "H2") {
    if (sibling.tagName === "UL") {
      // Already have bullet points, just make sure they're styled correctly
      const ulElement = sibling as HTMLElement;
      ulElement.style.listStyleType = "disc";
      ulElement.style.paddingLeft = "1.5em";
      ulElement.style.marginTop = "1em";

      // Make sure list items are styled correctly
      const listItems = ulElement.querySelectorAll("li");
      for (const li of listItems) {
        (li as HTMLElement).style.display = "list-item";
        // Clean up any additional bullet characters in the content
        li.innerHTML = li.innerHTML.replace(/^(\s*)[•\-–—]\s+/g, "$1");
      }

      // Skip to next sibling
      sibling = sibling.nextElementSibling;
      continue;
    }

    // Find paragraphs that should be bullet points but aren't in a list yet
    if (sibling.tagName === "P") {
      const content = sibling.textContent || "";
      const keyTerms = [
        "Drive",
        "Increase",
        "Enhance",
        "Support",
        "Differentiate",
      ];

      // Check if this paragraph starts with one of our key terms
      const startsWithKeyTerm = keyTerms.some((term) =>
        content.trim().startsWith(term)
      );

      // Only convert to bullet point if it's not already inside a UL and starts with a key term
      if (startsWithKeyTerm) {
        convertToBulletPoint(sibling as HTMLElement);
      }
    }

    // Move to next sibling
    sibling = sibling.nextElementSibling;
  }
}

/**
 * Converts a paragraph to a bullet point
 */
function convertToBulletPoint(paragraph: HTMLElement) {
  // Create a list item
  const listItem = document.createElement("li");

  // Remove any existing bullet characters from the content
  let content = paragraph.innerHTML;
  content = content.replace(/^(\s*)[•\-–—]\s+/g, "$1"); // Remove leading bullet characters

  listItem.innerHTML = content;
  listItem.style.display = "list-item";
  listItem.style.marginLeft = "1.5em";

  // Create a list if it doesn't exist yet
  let bulletList = paragraph.previousElementSibling;

  // If the previous element is not a list or doesn't exist, create one
  if (!bulletList || bulletList.tagName !== "UL") {
    const newList = document.createElement("ul");
    newList.style.listStyleType = "disc";
    newList.style.paddingLeft = "1.5em";
    newList.style.marginTop = "1em";
    newList.style.marginBottom = "1em";
    paragraph.parentNode?.insertBefore(newList, paragraph);
    bulletList = newList;
  }

  // Add the list item to the list
  (bulletList as HTMLElement).appendChild(listItem);

  // Remove the original paragraph
  paragraph.parentNode?.removeChild(paragraph);
}

/**
 * Adds classes to special paragraphs that need custom formatting
 */
function addClassesToSpecialParagraphs(container: HTMLElement) {
  const paragraphs = container.querySelectorAll("p");
  const keyTerms = ["Drive", "Increase", "Enhance", "Support", "Differentiate"];

  for (let i = 0; i < paragraphs.length; i++) {
    const paragraph = paragraphs[i];
    const content = paragraph.textContent || "";
    const trimmedContent = content.trim();

    // Check if this paragraph starts with one of our key terms or a bullet symbol
    const startsWithKeyTerm = keyTerms.some(
      (term) =>
        trimmedContent.startsWith(term) ||
        trimmedContent.startsWith("• " + term) ||
        trimmedContent.startsWith("- " + term) ||
        trimmedContent.startsWith("– " + term) ||
        trimmedContent.startsWith("— " + term)
    );

    if (startsWithKeyTerm) {
      // This is a bullet text item
      paragraph.classList.add("bullet-text-item");

      // If there's a previous paragraph, mark it as a parent
      if (i > 0 && paragraphs[i - 1].tagName === "P") {
        paragraphs[i - 1].classList.add("bullet-text-parent");
      }
    }
  }

  // Also handle table cells with lists
  const tableCells = container.querySelectorAll("td");
  for (const cell of tableCells) {
    if (cell.querySelector("ul") || cell.querySelector("ol")) {
      cell.classList.add("list-cell");
    }
  }
}

/**
 * Clean up any remaining double bullets in list items
 */
function cleanupDoubleBullets(container: HTMLElement) {
  // Find all list items
  const listItems = container.querySelectorAll("li");

  for (const li of listItems) {
    // Get the HTML content
    const content = li.innerHTML;

    // Check for bullet characters at the start of content
    const cleanedContent = content
      .replace(/^(\s*)[•\-–—]\s+/g, "$1") // Remove leading bullet characters
      .replace(/<span[^>]*>\s*[•\-–—]\s*<\/span>/g, ""); // Remove bullet spans

    // If we removed something, update the content
    if (cleanedContent !== content) {
      li.innerHTML = cleanedContent;
    }

    // Remove any ::marker pseudo-elements through inline styles
    (li as HTMLElement).style.listStylePosition = "outside";
  }

  // Also clean up any applied bullet classes that could cause duplicates
  const bulletItems = container.querySelectorAll(".bullet-text-item");
  for (const item of bulletItems) {
    if (item.parentElement?.tagName === "LI" || item.tagName === "LI") {
      item.classList.remove("bullet-text-item", "bullet-text-parent");
    }
  }
}
