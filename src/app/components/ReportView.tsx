'use client';

interface ReportViewProps {
  title: string;
  content: string;
  date: string;
  onBack: () => void;
  onPrint: () => void;
}

export default function ReportView({ title, content, date, onBack, onPrint }: ReportViewProps) {
  return (
    <div className="report-mode bg-white min-h-screen">
      <div className="max-w-3xl mx-auto p-6 md:p-8">
        <div className="report-header text-center mb-8 print:mb-12">
          <h1 id="report-title" className="text-3xl font-bold mb-2 print:text-4xl">
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
          
          <button 
            id="print-button"
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition-colors duration-300"
            onClick={onPrint}
          >
            Print / Save as PDF
          </button>
        </div>
      </div>
    </div>
  );
}