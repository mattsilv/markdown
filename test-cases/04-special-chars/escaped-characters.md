# Escaped Characters Test

This test verifies handling of escaped markdown characters, especially when the "Fix escaped characters" option is enabled.

## Test Input

```markdown
\*This text is not in italics\*

\# This is not a heading

2\. This is not the start of an ordered list

This \`is not code\`

\- Not a bullet point
```

## Expected Behavior

With "Fix escaped characters" option CHECKED:
- Escaped characters should be processed to fix common escaping issues
- Text that was supposed to be a list item (like `2\.`) should be converted to a proper list
- Other intentional escapes should be preserved where appropriate

With "Fix escaped characters" option UNCHECKED:
- Escaped characters should remain as they are in the original markdown
- Backslashes should be visible in the output
- The markdown formatting that would normally apply (e.g., *italics*, # heading) should not take effect