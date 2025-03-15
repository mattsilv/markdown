// Direct test of the footnote processor
const { processFootnotes } = require('./src/utils/footnoteUtils');

// Test with simple footnote
const testMarkdown = `Here is some text with a footnote[^1].

[^1]: This is the footnote content.`;

// Process the footnotes directly
console.log('== Testing processFootnotes directly ==');
console.log('Input markdown:');
console.log(testMarkdown);
console.log('\nProcessing...');

try {
  const result = processFootnotes(testMarkdown);
  
  console.log('\nProcessed result:');
  console.log(result);
  
  console.log('\n== Testing for expected output ==');
  // Check for footnote reference
  if (result.includes('fnref-1')) {
    console.log('✓ Found footnote reference');
  } else {
    console.log('✗ Missing footnote reference');
  }
  
  // Check for footnote section
  if (result.includes('<div class="footnotes')) {
    console.log('✓ Found footnote section');
  } else {
    console.log('✗ Missing footnote section');
  }
  
  // Check for footnote content
  if (result.includes('fn-1')) {
    console.log('✓ Found footnote content');
  } else {
    console.log('✗ Missing footnote content');
  }
  
  // Check for backlink
  if (result.includes('footnote-backref')) {
    console.log('✓ Found footnote backlink');
  } else {
    console.log('✗ Missing footnote backlink');
  }
  
  console.log('\nTest completed successfully');
} catch (error) {
  console.error('Error processing footnotes:', error);
}