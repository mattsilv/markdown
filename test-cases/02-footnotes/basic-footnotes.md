# Basic Footnotes Test

This test verifies basic footnote processing functionality.

## Test Input

```markdown
Here is some text with a footnote[^1].

[^1]: This is the footnote content.
```

## Expected Behavior

- The footnote reference in the text should:
  - Appear as a superscript number or symbol
  - Be clickable, linking to the footnote content
  - Not disrupt the flow of the main text
  
- The footnote content should:
  - Appear at the bottom of the document in a dedicated "Footnotes" section
  - Be preceded by the same number/symbol as its reference
  - Have a backlink to return to the reference location
  - Be visually distinguished from the main content
  
- When the "Process footnotes" option is unchecked, the raw markdown for footnotes should be preserved, not processed