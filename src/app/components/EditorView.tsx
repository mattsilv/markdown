'use client';

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import OptionsPanel from './OptionsPanel';
import Footer from './Footer';
import { 
  preprocessMarkdown,
  configureMarked,
  extractTitle,
  renderMarkdown
} from '@/utils/markdownUtils/index';
import { FiUpload } from 'react-icons/fi';
import { RiMagicFill } from 'react-icons/ri';

interface EditorViewProps {
  onGenerateReport: (title: string, htmlContent: string) => void;
  sampleDocumentLink?: React.ReactNode;
}

export default function EditorView({ onGenerateReport, sampleDocumentLink }: EditorViewProps) {
  const [markdownText, setMarkdownText] = useState('');
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSavedContent, setHasSavedContent] = useState(false);
  
  // Options state
  const [fixEscapes, setFixEscapes] = useState(true);
  const [smartLists, setSmartLists] = useState(true);
  const [processFootnotes, setProcessFootnotes] = useState(true);

  useEffect(() => {
    // Check for saved content in localStorage
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent && savedContent.trim()) {
      setMarkdownText(savedContent);
      setHasSavedContent(true);
    }
    
    // Check for recent file
    const recentFile = localStorage.getItem('recentMarkdownFile');
    if (recentFile) {
      try {
        const fileData = JSON.parse(recentFile);
        const now = new Date().getTime();
        
        // Check if file data has expired
        if (fileData.expiresAt < now) {
          localStorage.removeItem('recentMarkdownFile');
        } else {
          setFileName(`${fileData.name} (Recent)`);
        }
      } catch (error) {
        console.error("Error checking recent files:", error);
      }
    }
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!markdownText.trim()) {
      setError('Please enter some markdown content.');
      setTimeout(() => setError(''), 5000);
      return;
    }
    
    // Save content to localStorage
    localStorage.setItem('markdownContent', markdownText);
    
    // Start loading state
    setIsLoading(true);
    
    try {
      // Pre-process markdown
      const processedMarkdown = preprocessMarkdown(markdownText, {
        fixEscapes,
        processFootnotes,
      });
      
      // Configure marked options
      const markedOptions = configureMarked({
        smartLists,
      });
      
      // Extract title
      const { title, modifiedMarkdown } = extractTitle(processedMarkdown);
      
      // Render the markdown (now awaiting the Promise)
      const renderedHtml = await renderMarkdown(modifiedMarkdown, markedOptions);
      
      // Switch to report view
      onGenerateReport(title, renderedHtml);
      
      // End loading state
      setIsLoading(false);
    } catch (error) {
      console.error("Error rendering markdown:", error);
      setError(`Error rendering markdown: ${error instanceof Error ? error.message : String(error)}`);
      setIsLoading(false);
    }
  };

  const handleFileImport = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Update filename display
    setFileName(file.name);
    
    // Save to localStorage with 30-minute expiration
    const fileData = {
      name: file.name,
      lastUsed: new Date().getTime(),
      expiresAt: new Date().getTime() + 30 * 60 * 1000, // 30 minutes
    };
    localStorage.setItem("recentMarkdownFile", JSON.stringify(fileData));
    
    // Read file contents
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setMarkdownText(content);
      
      // Save content to localStorage
      localStorage.setItem("markdownContent", content);
    };
    reader.onerror = (error) => {
      setError(`Error reading file: ${error}`);
      setTimeout(() => setError(''), 5000);
    };
    reader.readAsText(file);
  };

  const handleClear = () => {
    setMarkdownText('');
    setFileName('');
    localStorage.removeItem('markdownContent');
    setHasSavedContent(false);
  };

  const handleClearSaved = () => {
    localStorage.removeItem('markdownContent');
    setHasSavedContent(false);
  };

  return (
    <div className="app-container flex flex-col max-w-4xl mx-auto p-4 md:p-8">
      <div className="app-header text-center mb-6">
        <h1 className="text-3xl font-bold mb-2">Markdown Report Generator</h1>
        <p className="text-gray-600">Paste your markdown content from ChatGPT, Claude, or any other source of deep research or long outputs and create a beautiful report you can print as a PDF</p>
      </div>
      
      
      <form className="app-form" onSubmit={handleSubmit}>
        <div className="file-import-container mb-4 flex flex-wrap items-center gap-2">
          <label 
            htmlFor="file-import" 
            className="file-import-label bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded cursor-pointer transition duration-300 flex items-center gap-2"
          >
            <FiUpload className="inline" /> Import Markdown File
          </label>
          <input 
            type="file" 
            id="file-import" 
            accept=".md, .markdown, .txt" 
            className="hidden"
            onChange={handleFileImport}
          />
          {fileName && <span id="file-name" className="text-sm text-gray-600">{fileName}</span>}
          {sampleDocumentLink}
        </div>
        
        {hasSavedContent && (
          <div className="persistence-indicator bg-gray-100 p-2 rounded mb-2 flex justify-between items-center">
            <span className="text-sm text-gray-600">Content restored from previous session</span>
            <button 
              className="clear-persistent-content text-xs bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded"
              onClick={handleClearSaved}
              type="button"
            >
              Clear
            </button>
          </div>
        )}
        
        <div className="relative">
          <textarea
            className="markdown-input w-full h-96 p-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y"
            id="markdown-input"
            placeholder="Paste your markdown here or import a file..."
            value={markdownText}
            onChange={(e) => setMarkdownText(e.target.value)}
          />
          {markdownText && (
            <button 
              className="absolute top-2 right-2 bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-3 rounded-full text-sm transition duration-300"
              onClick={handleClear}
              type="button"
            >
              Clear
            </button>
          )}
        </div>
        
        {error && <div className="error-message text-red-600 mt-2">{error}</div>}

        <OptionsPanel
          fixEscapes={fixEscapes}
          smartLists={smartLists}
          processFootnotes={processFootnotes}
          onFixEscapesChange={(checked) => setFixEscapes(checked)}
          onSmartListsChange={(checked) => setSmartLists(checked)}
          onProcessFootnotesChange={(checked) => setProcessFootnotes(checked)}
        />
        
        <button 
          type="submit" 
          className={`submit-button mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded transition duration-300 w-full flex justify-center items-center ${isLoading ? 'is-loading opacity-75 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loading-text flex items-center">
              <span className="spinner mr-2 h-4 w-4 rounded-full border-2 border-white border-t-transparent animate-spin"></span>
              Processing...
            </span>
          ) : (
            <span className="btn-text flex items-center justify-center gap-2">
              <RiMagicFill className="inline" /> Make it Nice
            </span>
          )}
        </button>
      </form>
      <Footer />
    </div>
  );
}