import { Suspense } from 'react';
import { promises as fs } from 'fs';
import path from 'path';
import Link from 'next/link';
import { marked } from 'marked';
import SampleNavSidebar from '../../components/common/SampleNavSidebar';

export default async function MicroPage() {
  // Read the oai-micro.md file
  const microMarkdown = await fs.readFile(
    path.join(process.cwd(), 'samples', 'oai-micro.md'),
    'utf8'
  );

  // Convert markdown to HTML using marked
  marked.setOptions({
    gfm: true, // GitHub Flavored Markdown
    breaks: true, // Convert line breaks to <br>
    silent: false // Show warnings
  });
  
  // Parse markdown to HTML
  let contentHtml = await marked.parse(microMarkdown);
  
  // Handle long URLs with text fragments by adding a special class
  contentHtml = contentHtml.replace(
    /<a href="([^"]*?#:~:text=[^"]*?)">/g,
    '<a href="$1" class="text-fragment-link">'
  );
  
  // Truncate display of very long URLs while keeping the actual href intact
  contentHtml = contentHtml.replace(
    /(<a href="(https?:\/\/[^"]{60,})"(?:[^>]*)>)\2(<\/a>)/g,
    '$1$2...$3'
  );

  // Generate the current date for report display
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="sample-page-container">
      <SampleNavSidebar />
      
      <div className="sample-content-wrapper">
        <div className="mb-4">
          <Link href="/samples/config" className="text-blue-500 flex items-center">
            ← Back to Samples
          </Link>
        </div>
        
        {/* Using report styling classes for consistent report display */}
        <div className="report-container bg-white shadow-md rounded-lg p-8">
          <div className="report-header">
            <h1 className="report-title">Microlearning Study</h1>
            <p className="report-date">Generated on {currentDate}</p>
          </div>
          
          <Suspense fallback={<div>Loading...</div>}>
            <div 
              className="markdown-content report-content prose max-w-none"
              dangerouslySetInnerHTML={{ __html: contentHtml }} 
            />
          </Suspense>
          
          <div className="report-actions mt-8 pt-4 border-t border-gray-200">
            <div className="flex justify-end">
              <Link 
                href="/"  
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded transition-colors duration-300"
              >
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}