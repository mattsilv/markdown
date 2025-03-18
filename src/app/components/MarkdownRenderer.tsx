import React, { useEffect, useState } from "react";
import {
  renderMarkdown,
  normalizeMarkdownSpacing,
  addSectionSpacing,
} from "@/utils/markdownUtils";

interface MarkdownRendererProps {
  markdown: string;
  className?: string;
  normalizeSpacing?: boolean;
  markedOptions?: Record<string, unknown>;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({
  markdown,
  className = "",
  normalizeSpacing = true,
  markedOptions = {},
}) => {
  const [html, setHtml] = useState<string>("");

  useEffect(() => {
    const processMarkdown = async () => {
      if (!markdown) return;

      // Apply spacing normalization when flag is true
      const processedMarkdown = normalizeSpacing
        ? normalizeMarkdownSpacing(markdown)
        : markdown;

      // Render markdown to HTML
      const renderedHtml = await renderMarkdown(
        processedMarkdown,
        markedOptions
      );

      // Apply HTML spacing fixes for consistent rendering
      const spacedHtml = normalizeSpacing
        ? addSectionSpacing(renderedHtml)
        : renderedHtml;

      setHtml(spacedHtml);
    };

    processMarkdown();
  }, [markdown, normalizeSpacing, markedOptions]);

  if (!markdown) return null;

  return (
    <div
      className={`markdown-content prose prose-lg max-w-none ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};
