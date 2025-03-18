// Simple End-to-End Test for Markdown to Print
// This script tests the basic functionality of the markdown-to-print application
// by submitting a test markdown file and verifying the rendered output.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

// Use TEST_BASE_URL from environment or .env.local, fallback to localhost
const TEST_BASE_URL = process.env.TEST_BASE_URL || 'http://localhost:3000';

async function runTest() {
  console.log('Starting end-to-end test for Markdown to Print');
  
  // Read test file - using our direct test content file
  const testFilePath = path.join(__dirname, '..', 'test-cases', 'test-content.md');
  const markdownContent = fs.readFileSync(testFilePath, 'utf8');
  
  console.log('Test file loaded:', testFilePath);
  console.log('Launching browser...');
  
  // Launch browser and navigate to app in headless mode
  const browser = await puppeteer.launch({
    headless: true,  // Run in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    console.log(`Navigating to application at ${TEST_BASE_URL}...`);
    await page.goto(TEST_BASE_URL, { waitUntil: 'networkidle2' });
    
    // Wait for editor to be fully loaded
    await page.waitForSelector('.markdown-input');
    
    console.log('Inputting test markdown...');
    // Clear any existing content and input test markdown
    await page.click('.markdown-input');
    await page.evaluate(() => document.querySelector('.markdown-input').value = '');
    await page.type('.markdown-input', markdownContent);
    
    // Submit the form
    console.log('Submitting markdown...');
    await page.click('.submit-button');
    
    // Wait for report view to appear
    console.log('Waiting for report to generate...');
    await page.waitForSelector('.report-content', { timeout: 10000 });
    
    // Take a screenshot of the result
    console.log('Taking screenshot of the result...');
    await page.screenshot({ path: 'test-result.png' });
    
    // Comprehensive verification of rendered elements
    const renderResults = await page.evaluate(() => {
      return {
        // Headings
        headings: {
          h1: !!document.querySelector('.report-content h1'),
          h2: !!document.querySelector('.report-content h2'),
          h3: !!document.querySelector('.report-content h3'),
          h4: !!document.querySelector('.report-content h4'),
          h5: !!document.querySelector('.report-content h5'),
          h6: !!document.querySelector('.report-content h6')
        },
        // Lists
        lists: {
          unordered: !!document.querySelector('.report-content ul'),
          ordered: !!document.querySelector('.report-content ol'),
          listItems: document.querySelectorAll('.report-content li').length > 0
        },
        // Formatting
        formatting: {
          italic: !!document.querySelector('.report-content em'),
          bold: !!document.querySelector('.report-content strong'),
          code: !!document.querySelector('.report-content code'),
          blockquote: !!document.querySelector('.report-content blockquote')
        },
        // Table
        table: {
          table: !!document.querySelector('.report-content table'),
          hasHeaders: !!document.querySelector('.report-content th') || !!document.querySelector('.report-content thead'),
          hasRows: document.querySelectorAll('.report-content tr').length > 1
        },
        // Footnotes
        footnotes: {
          footnoteLink: !!document.querySelector('.report-content a[href^="#fn-"]'),
          footnoteSection: !!document.querySelector('.report-content .footnotes')
        }
      };
    });
    
    console.log('Test results:', JSON.stringify(renderResults, null, 2));
    console.log('Screenshot saved as test-result.png');
    
    // Check each category and report results
    const categories = Object.keys(renderResults);
    const failedCategories = [];
    
    for (const category of categories) {
      const categoryResults = renderResults[category];
      const categoryPassed = Object.values(categoryResults).every(Boolean);
      
      if (categoryPassed) {
        console.log(`✅ ${category.toUpperCase()} PASSED: All elements rendered properly`);
      } else {
        console.log(`❌ ${category.toUpperCase()} FAILED: Some elements not rendered properly`);
        const missingElements = Object.entries(categoryResults)
          .filter(([_, exists]) => !exists)
          .map(([element]) => element);
        console.log(`   Missing: ${missingElements.join(', ')}`);
        failedCategories.push(category);
      }
    }
    
    if (failedCategories.length === 0) {
      console.log('\n✅ OVERALL TEST PASSED: All elements were rendered properly');
    } else {
      console.log(`\n❌ OVERALL TEST FAILED: Issues in ${failedCategories.length} categories`);
      console.log(`   Failed categories: ${failedCategories.join(', ')}`);
    }
    
  } catch (error) {
    console.error('❌ TEST FAILED with error:', error.message);
    await page.screenshot({ path: 'error-state.png' });
    console.log('Error state screenshot saved as error-state.png');
  } finally {
    // Close the browser
    await browser.close();
    console.log('Test completed');
  }
}


runTest().catch(console.error);