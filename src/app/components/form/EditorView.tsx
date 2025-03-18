"use client";

import MarkdownForm, { FormOptions } from "./MarkdownForm";
import Footer from "../common/Footer";
import {
  preprocessMarkdown,
  configureMarked,
  extractTitle,
  renderMarkdown,
} from "@/utils/markdownUtils/index";
import { normalizeMarkdownSpacing } from "@/utils/markdownUtils";

interface EditorViewProps {
  onGenerateReport: (title: string, htmlContent: string) => void;
  sampleDocumentLink?: React.ReactNode;
}

export default function EditorView({
  onGenerateReport,
  sampleDocumentLink,
}: EditorViewProps) {
  const handleSubmit = async (markdownText: string, options: FormOptions) => {
    try {
      // Pre-process markdown
      const processedMarkdown = preprocessMarkdown(markdownText, {
        fixEscapes: options.fixEscapes,
        processFootnotes: options.processFootnotes,
      });

      // Configure marked options
      const markedOptions = configureMarked({
        smartLists: options.smartLists,
      });

      // Extract title
      const { title, modifiedMarkdown } = extractTitle(processedMarkdown);

      // Normalize markdown spacing for consistent formatting
      const normalizedMarkdown = normalizeMarkdownSpacing(modifiedMarkdown);

      // Render the markdown (now awaiting the Promise)
      const renderedHtml = await renderMarkdown(
        normalizedMarkdown,
        markedOptions
      );

      // Switch to report view
      onGenerateReport(title, renderedHtml);
    } catch (error) {
      console.error("Error rendering markdown:", error);
      throw error;
    }
  };

  return (
    <div className="app-container flex flex-col max-w-4xl mx-auto p-4 md:p-8">
      <div className="app-header text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Markdown Report Generator</h1>
        <p className="text-gray-600">
          Paste your markdown content from ChatGPT, Claude, or any other source
          of deep research or long outputs and create a beautiful report you can
          print as a PDF
        </p>
      </div>

      <MarkdownForm
        onSubmit={handleSubmit}
        sampleDocumentLink={sampleDocumentLink}
      />

      <Footer />
    </div>
  );
}
