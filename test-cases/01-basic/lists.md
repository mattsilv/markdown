# Lists Test

This test verifies proper rendering of both ordered and unordered lists with nesting.

## Test Input

```markdown
Unordered list:
- Item 1
- Item 2
  - Nested item 2.1
  - Nested item 2.2
- Item 3

Ordered list:
1. First item
2. Second item
   1. Nested item 2.1
   2. Nested item 2.2
3. Third item
```

## Expected Behavior

- Unordered lists should:
  - Use consistent bullet styles
  - Have proper spacing between items
  - Show nested items with clear indentation and possibly different bullet styles
  
- Ordered lists should:
  - Have proper numbering (1, 2, 3, etc.)
  - Have proper spacing between items
  - Maintain correct numbering sequence
  - Show nested numbered items with proper indentation and sub-numbering (1.1, 1.2, etc. or similar)
  
- The spacing between the two lists should be appropriate