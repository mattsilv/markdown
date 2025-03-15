# Multiple Footnotes Test

This test verifies handling of multiple footnotes including repeated references.

## Test Input

```markdown
First footnote reference[^1]. Second footnote reference[^2]. Referencing the first footnote again[^1].

[^1]: Content of the first footnote.
[^2]: Content of the second footnote.
```

## Expected Behavior

- Each distinct footnote should have a unique number/symbol
- When a footnote is referenced multiple times:
  - All references should have the same number/symbol
  - Each reference should link to the same footnote content
  - The footnote content should only appear once in the footnotes section
  
- The footnotes section should list the footnotes in the order they first appear in the text, not alphabetically by identifier
- Each footnote in the footnotes section should have a backlink to its first reference in the document