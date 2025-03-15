// Test script for text fragment link handling
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  // Launch browser
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  
  // Navigate to the local development server
  await page.goto('http://192.168.9.82:3000', { waitUntil: 'networkidle2' });
  console.log('Loaded the editor page');
  
  // Load test content
  const testContent = fs.readFileSync(path.join(__dirname, 'test-cases', 'test-content.md'), 'utf8');
  
  // Clear editor and set content
  await page.evaluate(() => {
    document.querySelector('textarea').value = '';
  });
  await page.type('textarea', testContent);
  console.log('Added test content to editor');
  
  // Trigger rendering
  await page.click('button.submit-button');
  console.log('Clicked submit button');
  
  // Wait for rendering to complete
  await page.waitForSelector('.report-content', { visible: true });
  
  // Use setTimeout with a promise as a replacement for waitForTimeout
  await new Promise(resolve => setTimeout(resolve, 1000)); // Additional wait to ensure all footnotes are processed
  
  // Look for text fragment links in footnotes
  const fragmentLinkTests = await page.evaluate(() => {
    // Find all footnote links that should be text fragment links
    const fragmentLinks = document.querySelectorAll('.footnote-content a.text-fragment-link');
    const results = [];
    
    if (fragmentLinks.length === 0) {
      return [{ success: false, message: 'No text fragment links found' }];
    }
    
    // Test each fragment link
    fragmentLinks.forEach((link, index) => {
      // Check if the href contains the full URL with text fragment
      const href = link.getAttribute('href');
      const containsFragment = href.includes('#:~:text=');
      
      // Check if the displayed text does NOT contain the fragment
      const displayedText = link.textContent;
      const fragmentNotDisplayed = !displayedText.includes('#:~:text=');
      
      // Get the base URL (everything before the text fragment)
      const baseUrl = href.split('#:~:text=')[0];
      const correctBaseDisplayed = displayedText === baseUrl;
      
      results.push({
        index,
        success: containsFragment && fragmentNotDisplayed && correctBaseDisplayed,
        href,
        displayedText,
        message: containsFragment && fragmentNotDisplayed && correctBaseDisplayed ? 
          `SUCCESS: Text fragment link ${index + 1} correctly handled` : 
          `FAILURE: Text fragment link ${index + 1} not correctly handled`
      });
    });
    
    return results;
  });
  
  // Log results for all tests
  let allSuccessful = true;
  fragmentLinkTests.forEach(test => {
    console.log(test.message);
    console.log('Link href:', test.href);
    console.log('Displayed text:', test.displayedText);
    console.log('---');
    if (!test.success) allSuccessful = false;
  });
  
  console.log(allSuccessful ? 
    'ALL TESTS PASSED: All text fragment links correctly handled' : 
    'TESTS FAILED: Some text fragment links not correctly handled');
  
  // Take a screenshot for visual verification
  await page.screenshot({ path: 'text-fragment-result.png' });
  console.log('Screenshot saved to text-fragment-result.png');
  
  // Close the browser
  await browser.close();
})();