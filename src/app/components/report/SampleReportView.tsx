"use client";

import Footer from '../common/Footer';
import ReportHeader from './ReportHeader';
import ReportContent from './ReportContent';
import ReportActions from './ReportActions';
import SampleNavSidebar from '../common/SampleNavSidebar';

interface SampleReportViewProps {
  title: string;
  content: string;
  date: string;
  onBack: () => void;
  onPrint: () => void;
}

export default function SampleReportView({
  title,
  content,
  date,
  onBack,
  onPrint,
}: SampleReportViewProps) {
  return (
    <div className="sample-page-container">
      <SampleNavSidebar />
      
      <div className="sample-content-wrapper">
        <div className="report-mode bg-white min-h-screen">
          <div className="max-w-3xl mx-auto p-6 md:p-8">
            {/* Back link at the top that's hidden when printing */}
            <div className="back-link-top mb-4 print:hidden">
              <button
                className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                onClick={onBack}
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  className="h-5 w-5" 
                  viewBox="0 0 20 20" 
                  fill="currentColor"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                    clipRule="evenodd" 
                  />
                </svg>
                Back to Samples
              </button>
            </div>
            
            <ReportHeader title={title} date={date} />
            
            <ReportContent content={content} />
            
            <ReportActions onBack={onBack} onPrint={onPrint} />
            
            <Footer />
          </div>
        </div>
      </div>
    </div>
  );
}