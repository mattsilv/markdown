"use client";

import { truncateUrl } from "@/utils/urlUtils";

/**
 * Fix footnote links in the rendered HTML
 */
export function fixLinks(container: HTMLElement): void {
  if (!container) return;

  console.log("Fixing footnote links in rendered HTML");

  // Apply proper classes to footnotes section
  applyFootnoteStyles(container);

  // Fix links from footnote references to footnote items
  fixReferenceLinks(container);

  // Fix links from footnote items back to references
  fixBackreferenceLinks(container);

  // Fix duplicate URL links in footnotes
  fixDuplicateUrlLinks(container);
}

/**
 * Ensure footnotes section has proper classes for styling
 * No direct styling applied - all styles now come from CSS
 */
function applyFootnoteStyles(container: HTMLElement): void {
  // Find the footnotes section
  const footnotesSection = container.querySelector<HTMLElement>(
    ".footnotes, .report-content-footnotes, .works-cited"
  );

  if (footnotesSection) {
    console.log("Ensuring footnotes section has proper classes");

    // Make sure all class names are applied
    const classNames = ["footnotes", "report-content-footnotes", "works-cited"];
    classNames.forEach((className) => {
      if (!footnotesSection.classList.contains(className)) {
        footnotesSection.classList.add(className);
      }
    });

    // No inline styles - all styling now comes from global CSS
  }
}

/**
 * Fix duplicate URL text in markdown links within footnotes
 * This handles cases where URL appears as both link text and href
 */
export function fixDuplicateUrlLinks(container: HTMLElement): void {
  if (!container) return;

  try {
    // Find all footnote content elements
    const footnoteContents = container.querySelectorAll(".footnote-content");

    footnoteContents.forEach((content) => {
      let contentHtml = content.innerHTML;

      // FIRST: Completely remove any reference to Google search URLs
      contentHtml = contentHtml.replace(
        /\(https:\/\/www\.google\.com\/search\?[^)]+\)/g,
        ""
      );

      // Super simple Wikipedia fix - if it contains wikipedia.org, create a clean link
      contentHtml = contentHtml.replace(
        /\[?\[?(https?:\/\/)?(?:en\.)?wikipedia\.org[^\s<>"\]]+/g,
        (match) => {
          // Extract just the base Wikipedia URL if possible
          let baseUrl = match;

          // Clean up any markdown formatting characters
          baseUrl = baseUrl.replace(/^\[+|\]+$/g, "");

          // Ensure https:// prefix
          if (!baseUrl.startsWith("http")) {
            baseUrl = "https://" + baseUrl;
          }

          // Extract article name if possible
          let displayText = "Wikipedia";
          if (baseUrl.includes("/wiki/")) {
            const articleName = baseUrl.split("/wiki/")[1].split(/[#\s\]"]/)[0];
            baseUrl = `https://en.wikipedia.org/wiki/${articleName}`;

            // Create a readable display text from article name
            displayText = articleName.replace(/_/g, " ");
            // Capitalize first letter of each word
            displayText = displayText
              .split(" ")
              .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
              .join(" ");
          } else {
            baseUrl = "https://en.wikipedia.org";
          }

          return `<a href="${baseUrl}" class="url-only-link">Wikipedia: ${displayText}</a>`;
        }
      );

      // Remove any visible "class=url-only-link" that escaped into the text
      contentHtml = contentHtml.replace(/class="url-only-link">/g, "");

      // Fix specific "class=url-only-link" pattern appearing in rendered output
      contentHtml = contentHtml.replace(/"?\s*class="url-only-link"\s*>/g, "");

      // Remove any ">https:" text fragments
      contentHtml = contentHtml.replace(/>https:\/\/[^<]+/g, ">");

      // Fix duplicated domains (e.g., www.domain.comdomain.com)
      contentHtml = contentHtml.replace(
        /([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+)([a-zA-Z0-9-]+\.[a-zA-Z0-9-]+)/g,
        (match, p1, p2) => {
          // Check if p2 is part of p1 (duplicated domain)
          if (p1.includes(p2.substring(0, 4))) {
            return p1;
          }
          return match;
        }
      );

      // Process markdown links where URL is both text and href
      contentHtml = contentHtml.replace(
        /\[(https?:\/\/[^\]\s]+)\]\((\1)\)/g,
        (match, url) =>
          `<a href="${url}" class="url-only-link">${truncateUrl(url)}</a>`
      );

      // Clean up URLs with trailing brackets
      contentHtml = contentHtml.replace(
        /(https:\/\/[^"\s\]]+)(\])/g,
        (match, url) =>
          `<a href="${url}" class="url-only-link">${truncateUrl(url)}</a>${
            match.includes("]") ? "]" : ""
          }`
      );

      // Apply content changes first
      content.innerHTML = contentHtml;

      // Then process any links
      const links = content.querySelectorAll("a");
      links.forEach((link) => {
        const href = link.getAttribute("href");
        const text = link.textContent;

        if (href && text) {
          // Handle text fragment links (#:~:text=)
          if (href.includes("#:~:text=")) {
            const displayUrl = href.split("#:~:text=")[0];
            link.textContent = truncateUrl(displayUrl);
            link.classList.add("url-only-link");
          }
          // Handle any # fragment
          else if (href.includes("#") && href === text) {
            const displayUrl = href.split("#")[0];
            link.textContent = truncateUrl(displayUrl);
            link.classList.add("url-only-link");
          }
          // Standard case for identical URL and text
          else if (href === text && href.startsWith("http")) {
            link.textContent = truncateUrl(text);
            link.classList.add("url-only-link");
          }
          // Always ensure links are truncated for display
          else if (text.startsWith("http")) {
            link.textContent = truncateUrl(text);
          }
        }
      });
    });
  } catch (err) {
    console.error("Error fixing duplicate URL links in footnotes:", err);
  }
}

/**
 * Fix links from footnote references to footnote items
 */
function fixReferenceLinks(container: HTMLElement): void {
  // Find all footnote references
  const footnoteRefs = container.querySelectorAll<HTMLAnchorElement>(
    ".footnote-ref a, .citation-ref a"
  );

  footnoteRefs.forEach((link) => {
    const href = link.getAttribute("href");

    // Check if the link is valid
    if (href && href.startsWith("#fn-")) {
      // Get the target footnote item
      const targetId = href.substring(1); // Remove the # character
      const targetItem = container.querySelector(`#${targetId}`);

      if (!targetItem) {
        console.log(`Warning: Footnote reference target not found: ${href}`);
      }
    }
  });
}

/**
 * Fix links from footnote items back to references
 */
function fixBackreferenceLinks(container: HTMLElement): void {
  // Find all footnote backlinks
  const backlinks =
    container.querySelectorAll<HTMLAnchorElement>(".footnote-backref");

  backlinks.forEach((link) => {
    const href = link.getAttribute("href");

    // Check if the link is valid
    if (href && href.startsWith("#fnref-")) {
      // Get the target footnote reference
      const targetId = href.substring(1); // Remove the # character
      const targetRef = container.querySelector(`#${targetId}`);

      if (!targetRef) {
        console.log(`Warning: Backlink target not found: ${href}`);
      }
    }
  });
}
