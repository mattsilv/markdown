#!/usr/bin/env node

// For this script, we use CommonJS style imports since it's a Node.js script, not a TypeScript file
// eslint-disable-next-line @typescript-eslint/no-require-imports
const fs = require('fs');
// eslint-disable-next-line @typescript-eslint/no-require-imports
const path = require('path');

// Paths to check
const srcDir = path.join(__dirname, '..', 'src');

// Find all .tsx files
const findTsxFiles = (dir) => {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      results = results.concat(findTsxFiles(filePath));
    } else if (file.endsWith('.tsx')) {
      results.push(filePath);
    }
  }
  
  return results;
};

// Check files for useSearchParams without suspense
const checkFiles = (files) => {
  const issues = [];
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf8');
    const relativePath = path.relative(process.cwd(), file);
    
    // Check for useSearchParams hook
    if (content.includes('useSearchParams()') || content.includes('useSearchParams(')) {
      // Check if wrapped in Suspense
      if (!content.includes('Suspense') || !content.includes('<Suspense')) {
        issues.push({
          file: relativePath,
          message: 'useSearchParams() should be wrapped in a Suspense boundary'
        });
      }
    }
  }
  
  return issues;
};

console.log('Checking for missing Suspense boundaries around useSearchParams...');
const files = findTsxFiles(srcDir);
const issues = checkFiles(files);

if (issues.length > 0) {
  console.log('\nFound issues:');
  issues.forEach(issue => {
    console.log(`❌ ${issue.file}: ${issue.message}`);
  });
  
  console.log('\nFiles need to be updated to wrap useSearchParams in a Suspense boundary.');
  console.log('Example:');
  console.log(`
import { Suspense } from 'react';

// Wrap component using useSearchParams in Suspense
export default function Page() {
  return (
    <Suspense fallback={<Loading />}>
      <ComponentUsingSearchParams />
    </Suspense>
  );
}
  `);
  
  process.exit(1);
} else {
  console.log('✅ All useSearchParams hooks are properly wrapped in Suspense boundaries.');
  process.exit(0);
}