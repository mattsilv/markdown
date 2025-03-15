'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EditorView from './components/EditorView';
import ReportView from './components/ReportView';
import { FiExternalLink } from 'react-icons/fi';

export default function Home() {
  const [isReportMode, setIsReportMode] = useState(false);
  const [reportTitle, setReportTitle] = useState('Report');
  const [reportContent, setReportContent] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  useEffect(() => {
    // Set current date in the format "Month Day, Year"
    const date = new Date();
    setCurrentDate(date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }));
    
    // Check for recent markdown content in localStorage
    const savedContent = localStorage.getItem('markdownContent');
    if (savedContent) {
      // This will be handled by the EditorView component
      console.log('Found saved markdown content');
    }
  }, []);

  // Switch to report view
  const handleViewReport = (title: string, htmlContent: string) => {
    setReportTitle(title);
    setReportContent(htmlContent);
    setIsReportMode(true);
    window.scrollTo(0, 0);
  };

  // Switch back to editor view
  const handleBackToEditor = () => {
    setIsReportMode(false);
  };

  // Handle print action
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen">
      {isReportMode ? (
        <ReportView 
          title={reportTitle}
          content={reportContent}
          date={currentDate}
          onBack={handleBackToEditor}
          onPrint={handlePrint}
        />
      ) : (
        <EditorView onGenerateReport={handleViewReport} sampleDocumentLink={
          <Link 
            href="/samples/kaizen?fixEscapes=1&smartLists=1&processFootnotes=1" 
            className="text-blue-600 hover:text-blue-700 transition-colors duration-300 ml-4 self-center flex items-center gap-1"
          >
            <FiExternalLink className="inline" /> View Sample Document
          </Link>
        } />
      )}
    </div>
  );
}
