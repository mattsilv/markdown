'use client';

interface ReportActionsProps {
  onBack: () => void;
  onPrint: () => void;
}

export default function ReportActions({ onBack, onPrint }: ReportActionsProps) {
  return (
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
      </div>
    </div>
  );
}