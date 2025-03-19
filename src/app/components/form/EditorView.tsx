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
  const handleMarkdownSubmit = async (
    markdownText: string,
    options: FormOptions
  ) => {
    try {
      console.log("Processing markdown with options:", options);

      // Normalize spacing and line breaks (clean up document)
      const normalizedMarkdown = normalizeMarkdownSpacing(markdownText);

      // Extract the title from the first heading if available
      const { title, modifiedMarkdown } = extractTitle(normalizedMarkdown);

      // Process markdown with selected options
      const preprocessed = preprocessMarkdown(modifiedMarkdown, {
        fixEscapes: options.fixEscapes,
        smartLists: options.smartLists,
        processFootnotes: options.processFootnotes,
        preserveUnicode: options.preserveUnicode,
      });

      // Configure marked.js with the selected options
      const markedOptions = configureMarked({
        smartLists: options.smartLists,
      });

      // Render to HTML - await the Promise
      const htmlContent = await renderMarkdown(preprocessed, markedOptions);

      // Generate the report
      onGenerateReport(title, htmlContent);
    } catch (error) {
      console.error("Error processing markdown:", error);
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
        onSubmit={handleMarkdownSubmit}
        sampleDocumentLink={sampleDocumentLink}
      />

      <Footer />
    </div>
  );
}
