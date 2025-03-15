'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import EditorView from './components/EditorView';
import ReportView from './components/ReportView';

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
        <>
          <div className="max-w-4xl mx-auto p-4">
            <div className="flex justify-end mb-4">
              <Link 
                href="/samples/config" 
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300"
              >
                View Sample Document
              </Link>
            </div>
          </div>
          <EditorView onGenerateReport={handleViewReport} />
        </>
      )}
    </div>
  );
}
