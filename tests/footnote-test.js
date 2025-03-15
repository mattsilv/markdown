// Specific test for footnote processing
const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function testFootnotes() {
  console.log('Starting footnote test...');
  const startTime = new Date();
  
  // Define test content with footnotes in standard markdown format with clear separation
  // Check for command line argument to use kaizen.md file
  let footnoteMarkdown = `# Testing Footnotes

Here is a paragraph with a simple footnote[^1].

Here is another paragraph with a second footnote[^2].

[^1]: This is the content of the first footnote.

[^2]: This is the content of the second footnote with **formatting**.`;

  // Check if we should use kaizen.md
  const useKaizen = process.argv.includes('--kaizen');
  if (useKaizen) {
    try {
      console.log('Using kaizen.md for testing...');
      const kaizenPath = path.join(__dirname, 'samples', 'kaizen.md');
      footnoteMarkdown = fs.readFileSync(kaizenPath, 'utf8');
      console.log('Successfully loaded kaizen.md file');
    } catch (error) {
      console.error('Error loading kaizen.md:', error);
    }
  }
  
  console.log('Using markdown content:');
  // Only log a preview to avoid console overflow
  console.log(footnoteMarkdown.substring(0, 200) + '...');

  // Launch browser
  console.log('Launching browser in headless mode...');
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Navigate to the application
    console.log('Navigating to application...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait for editor to load
    await page.waitForSelector('.markdown-input');
    
    // Ensure footnote processing option is checked
    const footnotesCheckboxSelector = 'input[id="process-footnotes"]';
    const isChecked = await page.evaluate(selector => {
      const checkbox = document.querySelector(selector);
      return checkbox.checked;
    }, footnotesCheckboxSelector);
    
    if (!isChecked) {
      console.log('Ensuring footnote processing is enabled...');
      await page.click(footnotesCheckboxSelector);
    }
    
    // Enable browser console logging
    page.on('console', msg => console.log('Browser console:', msg.text()));
    
    // Input the markdown
    console.log('Inputting footnote markdown...');
    await page.click('.markdown-input');
    await page.evaluate(() => document.querySelector('.markdown-input').value = '');
    await page.type('.markdown-input', footnoteMarkdown);
    
    // Submit the form
    console.log('Submitting markdown...');
    await page.click('.submit-button');
    
    // Wait for report to generate
    console.log('Waiting for report to generate...');
    await page.waitForSelector('.report-content', { timeout: 5000 });
    console.log('Report generated successfully');
    
    // Take a screenshot
    await page.screenshot({ path: 'footnote-result.png' });
    console.log('Screenshot saved as footnote-result.png');
    
    // Check for footnote processing
    const footnoteResults = await page.evaluate(() => {
      // Check for footnote references in the text
      const footnoteRefs = document.querySelectorAll('.report-content a[href^="#fn-"]');
      
      // Check for footnote section with various possible class names
      const footnoteSections = {
        footnotes: document.querySelector('.report-content .footnotes'),
        reportContentFootnotes: document.querySelector('.report-content .report-content-footnotes'),
        worksCited: document.querySelector('.report-content .works-cited'),
        combined: document.querySelector('.report-content .footnotes.report-content-footnotes.works-cited')
      };
      
      // Log the full HTML content of the report for inspection
      const reportContent = document.querySelector('.report-content');
      const html = reportContent ? reportContent.innerHTML : 'No report content found';
      const htmlForLogging = html.length > 1000 ? 
        html.substring(0, 500) + '......' + html.substring(html.length - 500) : 
        html;
      console.log('HTML Content - Beginning and end of content:', htmlForLogging);
      
      // Check for footnote section content using different selectors
      const footnoteContent = {
        basic: document.querySelectorAll('.report-content .footnotes li'),
        alternative: document.querySelectorAll('.report-content .report-content-footnotes li'),
        worksCited: document.querySelectorAll('.report-content .works-cited li'),
        allItems: document.querySelectorAll('.report-content ol li')
      };
      
      // Check for backlinks using different selectors
      const backlinks = {
        basic: document.querySelectorAll('.report-content .footnotes a[href^="#fnref-"]'),
        alternative: document.querySelectorAll('.report-content .report-content-footnotes a[href^="#fnref-"]'),
        worksCited: document.querySelectorAll('.report-content .works-cited a[href^="#fnref-"]'),
        any: document.querySelectorAll('.report-content a[href^="#fnref-"]')
      };
      
      return {
        referencesFound: footnoteRefs.length,
        sectionExists: Object.values(footnoteSections).some(Boolean),
        detailedSections: Object.entries(footnoteSections).reduce((obj, [key, value]) => {
          obj[key] = !!value;
          return obj;
        }, {}),
        contentItemsFound: Object.values(footnoteContent).reduce((total, items) => Math.max(total, items.length), 0),
        detailedContent: Object.entries(footnoteContent).reduce((obj, [key, value]) => {
          obj[key] = value.length;
          return obj;
        }, {}),
        backlinksFound: Object.values(backlinks).reduce((total, items) => Math.max(total, items.length), 0),
        detailedBacklinks: Object.entries(backlinks).reduce((obj, [key, value]) => {
          obj[key] = value.length;
          return obj;
        }, {})
      };
    });
    
    console.log('Footnote processing results:');
    console.log(footnoteResults);
    
    if (
      footnoteResults.referencesFound >= 2 &&
      footnoteResults.sectionExists &&
      footnoteResults.contentItemsFound >= 2 &&
      footnoteResults.backlinksFound >= 2
    ) {
      console.log('✅ FOOTNOTE TEST PASSED: Footnotes properly processed');
    } else {
      console.error('❌ FOOTNOTE TEST FAILED: Issues with footnote processing');
      console.log('Expected: at least 2 references, footnote section, 2 content items, and 2 backlinks');
    }
    
    // Calculate and log execution time
    const endTime = new Date();
    const totalTime = (endTime - startTime) / 1000;
    console.log(`Test completed in ${totalTime.toFixed(2)} seconds`);
    
  } catch (error) {
    console.error('❌ TEST ERROR:', error.message);
    await page.screenshot({ path: 'footnote-error.png' });
    console.log('Error state screenshot saved as footnote-error.png');
    
    // Calculate and log execution time
    const endTime = new Date();
    const totalTime = (endTime - startTime) / 1000;
    console.error(`Test failed after ${totalTime.toFixed(2)} seconds`);
  } finally {
    // Close the browser
    await browser.close();
    console.log('Browser closed');
  }
}

// Run the test
testFootnotes().catch(console.error);