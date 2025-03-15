// Simple script to submit markdown to the application
// This is a simpler alternative to the full E2E test that just submits
// a markdown file and waits for it to be processed.

const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

async function submitMarkdown(filePath) {
  // Track start time
  const startTime = new Date();
  if (!filePath) {
    console.error('Please provide a path to a markdown file');
    console.log('Usage: node submit-test.js path/to/markdown.md');
    process.exit(1);
  }

  // Resolve the file path
  const resolvedPath = path.resolve(filePath);
  
  // Check if the file exists
  if (!fs.existsSync(resolvedPath)) {
    console.error(`File not found: ${resolvedPath}`);
    process.exit(1);
  }
  
  // Read the markdown content
  const markdownContent = fs.readFileSync(resolvedPath, 'utf8');
  console.log(`Read markdown file: ${resolvedPath}`);
  console.log(`Content length: ${markdownContent.length} characters`);
  
  // Launch the browser in headless mode
  console.log('Launching browser in headless mode...');
  const browser = await puppeteer.launch({
    headless: true, // Run in headless mode
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  
  try {
    // Navigate to the application
    console.log('Navigating to application...');
    await page.goto('http://localhost:3000', { waitUntil: 'networkidle2' });
    
    // Wait for the editor to load
    await page.waitForSelector('.markdown-input');
    
    // Input the markdown
    console.log('Inputting markdown...');
    await page.click('.markdown-input');
    await page.evaluate(() => document.querySelector('.markdown-input').value = '');
    await page.type('.markdown-input', markdownContent);
    
    // Submit the form
    console.log('Submitting markdown...');
    await page.click('.submit-button');
    
    // Wait for the report to generate
    console.log('Waiting for report to generate...');
    try {
      await page.waitForSelector('.report-content', { timeout: 5000 }); // Shorter 5-second timeout
      console.log('✅ SUCCESS: Report generated successfully');
      
      // Check if there are any error messages
      const errorMessage = await page.evaluate(() => {
        const errorElement = document.querySelector('.error-message');
        return errorElement ? errorElement.textContent : null;
      });
      
      if (errorMessage) {
        console.error(`❌ ERROR DISPLAYED: ${errorMessage}`);
      }
      
      // Take a screenshot
      await page.screenshot({ path: 'submission-result.png' });
      console.log('Screenshot saved as submission-result.png');
      
      // Calculate and log execution time
      const endTime = new Date();
      const totalTime = (endTime - startTime) / 1000;
      console.log(`✅ TEST COMPLETED SUCCESSFULLY in ${totalTime.toFixed(2)} seconds`);
      
      // Close the browser
      await browser.close();
      console.log('Browser closed');
    } catch (timeoutError) {
      console.error('❌ TIMEOUT: Report was not generated within the expected time');
      
      // Check if there's an error message
      const errorMessage = await page.evaluate(() => {
        const errorElement = document.querySelector('.error-message');
        return errorElement ? errorElement.textContent : null;
      });
      
      if (errorMessage) {
        console.error(`Error message: ${errorMessage}`);
      }
      
      await page.screenshot({ path: 'submission-timeout.png' });
      console.log('Error state screenshot saved as submission-timeout.png');
      
      // Calculate and log execution time
      const endTime = new Date();
      const totalTime = (endTime - startTime) / 1000;
      console.error(`❌ TEST FAILED after ${totalTime.toFixed(2)} seconds`);
      
      // Close the browser
      await browser.close();
      console.log('Browser closed');
    }
    
  } catch (error) {
    console.error('❌ ERROR:', error.message);
    await page.screenshot({ path: 'submission-error.png' });
    console.log('Error state screenshot saved as submission-error.png');
    
    // Calculate and log execution time
    const endTime = new Date();
    const totalTime = (endTime - startTime) / 1000;
    console.error(`❌ TEST FAILED after ${totalTime.toFixed(2)} seconds`);
    
    await browser.close();
    console.log('Browser closed');
  }
}

// Get the file path from command line arguments
const filePath = process.argv[2] || path.join(__dirname, 'test-cases', 'test-content.md');
submitMarkdown(filePath).catch(console.error);