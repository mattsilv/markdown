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

  // Find paragraphs that should be bullet points
  const keyTerms = ["Drive", "Increase", "Enhance", "Support", "Differentiate"];
  let sibling = executiveSummarySection.nextElementSibling;

  while (sibling && sibling.tagName !== "H2") {
    // Skip the introduction paragraph
    if (sibling.tagName === "P") {
      const content = sibling.textContent || "";

      // Check if this paragraph starts with one of our key terms
      const startsWithKeyTerm = keyTerms.some((term) =>
        content.trim().startsWith(term)
      );

      if (startsWithKeyTerm) {
        // This should be a bullet point
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
  listItem.innerHTML = paragraph.innerHTML;
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
    const startsWithKeyTerm = keyTerms.some(term => 
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
      if (i > 0 && paragraphs[i-1].tagName === "P") {
        paragraphs[i-1].classList.add("bullet-text-parent");
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
