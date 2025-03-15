# Title Extraction Tests

This set of tests verifies the application's ability to extract a title from the markdown content.

## Test Case 1: Title from H1

### Input
```markdown
# Document Title
## First Section
This is the content of the document.
```

### Expected
- "Document Title" should be extracted as the title
- The H1 title should be removed from the rendered content
- The title should be displayed in the designated title area of the report

## Test Case 2: Title from Bold Text (First Line)

### Input
```markdown
**Document Title**
## First Section
This is the content of the document.
```

### Expected
- "Document Title" should be extracted as the title
- The bold title should be removed from the rendered content
- The title should be displayed in the designated title area of the report

## Test Case 3: No Title

### Input
```markdown
This document has no clear title.
## First Section
This is the content of the document.
```

### Expected
- The default title "Report" should be used
- All content should be preserved in the rendered document
- The default title should be displayed in the designated title area

## Test Case 4: Title With Special Characters

### Input
```markdown
# Special Title: With "Quotes", & Symbols, and Numbers (123)
## First Section
This is the content of the document.
```

### Expected
- The entire title "Special Title: With "Quotes", & Symbols, and Numbers (123)" should be extracted correctly
- All special characters in the title should be preserved
- The title should be displayed properly in the designated title area