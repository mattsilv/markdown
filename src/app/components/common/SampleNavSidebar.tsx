'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';

interface SampleFile {
  id: string;
  name: string;
  path: string;
}

// Separate component that uses searchParams
const SampleNavContent: React.FC = () => {
  const [sampleFiles, setSampleFiles] = useState<SampleFile[]>([]);
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Format query parameters to pass along when switching samples
  const formatQueryString = () => {
    const params = new URLSearchParams(searchParams);
    return params.toString() ? `?${params.toString()}` : '';
  };

  useEffect(() => {
    // Define sample files
    // We're hardcoding them since we know what sample files exist
    const files: SampleFile[] = [
      { id: 'kaizen', name: 'Kaizen Case Study', path: '/samples/kaizen' },
      { id: 'tables', name: 'Tables Gallery', path: '/samples/tables' },
      { id: 'micro', name: 'Microlearning Study', path: '/samples/micro' }
    ];
    
    setSampleFiles(files);
  }, []);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path: string): boolean => {
    // Extract base path without query params
    const currentBasePath = pathname.split('?')[0];
    const targetBasePath = path.split('?')[0];
    return currentBasePath === targetBasePath;
  };

  return (
    <div className="sample-nav-sidebar">
      <div className={`sidebar-container ${isOpen ? 'open' : 'closed'}`}>
        <button 
          className="toggle-button"
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close samples sidebar' : 'Open samples sidebar'}
        >
          {isOpen ? '«' : '»'}
        </button>
        
        <div className="sidebar-content">
          <h3>Sample Files</h3>
          <ul>
            {sampleFiles.map((file) => (
              <li key={file.id} className={isActive(file.path) ? 'active' : ''}>
                <Link 
                  href={`${file.path}${formatQueryString()}`}
                  className={isActive(file.path) ? 'active-link' : ''}
                >
                  {file.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

// Main component with Suspense
const SampleNavSidebar: React.FC = () => {
  return (
    <Suspense fallback={<div className="sample-nav-sidebar loading">Loading...</div>}>
      <SampleNavContent />
    </Suspense>
  );
};

export default SampleNavSidebar;