# Linking Notes via Wikilinks

## What Are Wikilinks?

Wikilinks are references to other documents using double bracket notation:

```markdown
[[document-name]]
```

For comprehensive documentation on Foam wikilinks, see the [official Foam wikilinks documentation](https://foambubble.github.io/foam/user/features/wikilinks).

## Creating Wikilinks

### Basic Syntax

```markdown
[[document-name]]           # Links to document-name.md
[[folder/document-name]]    # Links to a document in a subfolder
[[document-name|Title]]     # Links with custom display text
```

## Foam Integration

We use [Foam](https://foambubble.github.io/foam/) in VS Code to enhance our documentation workflow:

- **Navigation**: Click on wikilinks to navigate between documents
- **Visualization**: Use "Foam: Show Graph" to see knowledge relationships
- **Backlinks**: View references to the current document in the sidebar

### Aliasing hyphenated file names

Our workspace has configured Foam with these settings:

```json
"foam.completion.label": "title",
"foam.completion.useAlias": "whenPathDiffersFromTitle"
```

This approach balances human readability with technical considerations:
- Document titles with spaces and capitalization are displayed in autocomplete and rendered markdown for better human readability
- Actual filenames remain space-free and use kebab-case (e.g., `note-sizing-heuristics.md`)
- This keeps filenames AI-friendly, as many AI tools work better with hyphenated filenames than with spaces or complex formatting
- Aliases are automatically applied via autocomplete, ensuring consistent use of readable titles in the rendered content

This implementation is a practical example of dealing with our [[documentation-dual-audience-dilemma|Documentation Dual Audience Dilemma]] in practice, balancing human-friendly display with machine-friendly file naming.

#### Example

preferred:
```md
[[documentation-dual-audience-dilemma|Documentation Dual Audience Dilemma]]
```

not ideal:
```md
[[documentation-dual-audience-dilemma]]
```

## Why Use Wikilinks?

- **Discoverability**: Creates a navigable knowledge network
- **Maintenance**: Renames update all references automatically
- **Context**: Reveals relationships between concepts

## Best Practices

1. Use descriptive document names (kebab-case recommended)
2. Add custom display text when the filename isn't reader-friendly
3. Use the Foam autocomplete (Ctrl+Space after typing `[[`) to maintain consistency