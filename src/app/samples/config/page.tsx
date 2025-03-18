'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ConfigPage() {
  const [sampleType, setSampleType] = useState('kaizen');
  const [fixEscapes, setFixEscapes] = useState(true);
  const [smartLists, setSmartLists] = useState(true);
  const [processFootnotes, setProcessFootnotes] = useState(true);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // For tables sample, navigate directly
    if (sampleType === 'tables') {
      router.push('/samples/tables');
      return;
    }
    
    // For other samples, create URL with parameters
    const url = `/samples/${sampleType}?fixEscapes=${fixEscapes ? '1' : '0'}&smartLists=${smartLists ? '1' : '0'}&processFootnotes=${processFootnotes ? '1' : '0'}`;
    
    // Navigate to the URL
    router.push(url);
  };

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-2xl mx-auto bg-white p-8 shadow rounded">
        <h1 className="text-2xl font-bold mb-6">Sample Document Configuration</h1>
        
        <form onSubmit={handleSubmit}>
          <h2 className="text-xl font-semibold mb-4">Sample Selection</h2>
          
          <div className="mb-6">
            <label htmlFor="sampleType" className="block text-gray-700 mb-2">
              Select Sample Document
            </label>
            <select
              id="sampleType"
              value={sampleType}
              onChange={(e) => setSampleType(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="kaizen">Kaizen Case Study</option>
              <option value="tables">Tables Gallery</option>
            </select>
          </div>
          
          {sampleType !== 'tables' && (
            <>
              <h2 className="text-xl font-semibold mb-4">Formatting Options</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="fixEscapes"
                    checked={fixEscapes}
                    onChange={(e) => setFixEscapes(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="fixEscapes" className="ml-3 block text-gray-700">
                    Fix escaped characters (\\.)
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="smartLists"
                    checked={smartLists}
                    onChange={(e) => setSmartLists(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="smartLists" className="ml-3 block text-gray-700">
                    Smart lists
                  </label>
                </div>
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="processFootnotes"
                    checked={processFootnotes}
                    onChange={(e) => setProcessFootnotes(e.target.checked)}
                    className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="processFootnotes" className="ml-3 block text-gray-700">
                    Process footnotes ([^1])
                  </label>
                </div>
              </div>
            </>
          )}
          
          <div className="flex justify-between">
            <button
              type="button"
              onClick={() => router.push('/')}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-6 rounded transition-colors duration-300"
            >
              Back to Home
            </button>
            
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition-colors duration-300"
            >
              View Sample
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}