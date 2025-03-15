# Test Cases for markdown-to-print-next

This directory contains test cases for manually verifying the markdown-to-print-next application. Each test case focuses on a specific feature or edge case to ensure full feature parity with the original application.

## Test Categories

1. **Basic Markdown Rendering**
   - Headings
   - Text Formatting 
   - Lists
   - Links and Images
   - Code Blocks

2. **Footnote Processing**
   - Basic Footnotes
   - Multiple Footnotes
   - Footnotes with Formatting

3. **Table Formatting**
   - Simple Tables
   - Tables with Alignment
   - Complex Tables with Varied Content
   - Large Data Tables

4. **Special Characters Handling**
   - Escaped Characters
   - HTML Entities
   - Unicode Characters
   - Google Docs Copy-Paste Issues

5. **Title Extraction**
   - Title from H1
   - Title from Bold Text
   - No Title
   - Title With Special Characters

## Running Tests

1. Start the development server:
   ```
   npm run dev
   ```

2. Open http://localhost:3000 in your browser

3. Paste each test case into the editor and check the output against the expected results

## Creating New Test Cases

To add new test cases, create a markdown file in the appropriate category directory with:
- A description of what's being tested
- The input markdown
- The expected output or behavior