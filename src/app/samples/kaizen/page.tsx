'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import ReportView from '../../components/ReportView';
import {
  preprocessMarkdown,
  configureMarked,
  extractTitle,
  renderMarkdown
} from '@/utils/markdownUtils/index';

export default function KaizenPage() {
  const [title, setTitle] = useState<string>('Kaizen Document');
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDate, setCurrentDate] = useState<string>('');
  
  const params = useSearchParams();
  
  // Get formatting options from URL params (0 or 1)
  const fixEscapes = params.get('fixEscapes') !== '0';
  const smartLists = params.get('smartLists') !== '0';
  const processFootnotes = params.get('processFootnotes') !== '0';
  
  useEffect(() => {
    // Set current date
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
    
    const loadMarkdown = async () => {
      setIsLoading(true);
      try {
        // Fetch markdown content from the samples directory
        const response = await fetch('/api/samples/kaizen');
        
        if (!response.ok) {
          throw new Error(`Failed to load markdown file: ${response.status}`);
        }
        
        const markdown = await response.text();
        
        // Pre-process markdown
        const processedMarkdown = preprocessMarkdown(markdown, {
          fixEscapes,
          processFootnotes,
        });
        
        // Configure marked options
        const markedOptions = configureMarked({
          smartLists,
        });
        
        // Extract title
        const { title, modifiedMarkdown } = extractTitle(processedMarkdown);
        setTitle(title);
        
        // Render the markdown
        const renderedHtml = await renderMarkdown(modifiedMarkdown, markedOptions);
        setContent(renderedHtml);
        
        setIsLoading(false);
      } catch (err) {
        console.error('Error loading markdown:', err);
        setError(`Error loading markdown: ${err instanceof Error ? err.message : String(err)}`);
        setIsLoading(false);
      }
    };
    
    loadMarkdown();
  }, [fixEscapes, smartLists, processFootnotes]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleBack = () => {
    window.location.href = '/';
  };
  
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mb-4 h-12 w-12 mx-auto rounded-full border-4 border-gray-300 border-t-blue-600 animate-spin"></div>
          <p className="text-lg">Loading Kaizen document...</p>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 text-red-800 p-6 rounded-lg max-w-xl">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <button 
            onClick={handleBack}
            className="mt-4 bg-red-700 hover:bg-red-800 text-white py-2 px-4 rounded"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <ReportView
      title={title}
      content={content}
      date={currentDate}
      onBack={handleBack}
      onPrint={handlePrint}
    />
  );
}