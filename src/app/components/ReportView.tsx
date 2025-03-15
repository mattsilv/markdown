"use client";

import Footer from './Footer';
// import { generatePDF } from "@/utils/pdfUtils";

interface ReportViewProps {
  title: string;
  content: string;
  date: string;
  onBack: () => void;
  onPrint: () => void;
}

export default function ReportView({
  title,
  content,
  date,
  onBack,
  onPrint,
}: ReportViewProps) {
  // Removed unused function
  // const handleDownloadPDF = () => {
  //   generatePDF(title, content, date);
  // };

  return (
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
            Back
          </button>
        </div>
        
        <div className="report-header text-center mb-8 print:mb-12">
          <h1
            id="report-title"
            className="text-3xl font-bold mb-2 print:text-4xl"
          >
            {title}
          </h1>
          <div className="subheader text-gray-600 print:text-gray-800">
            Generated on <span id="report-date">{date}</span>
          </div>
        </div>

        <div
          className="report-content prose prose-lg mx-auto max-w-none print:prose-sm"
          dangerouslySetInnerHTML={{ __html: content }}
        />

        <div className="report-actions mt-12 flex justify-between print:hidden">
          <button
            id="back-button"
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded transition-colors duration-300"
            onClick={onBack}
          >
            Back to Editor
          </button>

          <div className="flex gap-2">
            <button
              id="print-button"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition-colors duration-300 flex items-center"
              onClick={onPrint}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                  clipRule="evenodd"
                />
              </svg>
              Print
            </button>
            {/* PDF button hidden due to rendering issues
            <button
              id="download-pdf-button"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition-colors duration-300 flex items-center"
              onClick={handleDownloadPDF}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
              Save PDF
            </button>
            */}
          </div>
        </div>
        
        <Footer />
      </div>
    </div>
  );
}
