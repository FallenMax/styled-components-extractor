# Styled-Components Extractor

A faster [styled-components](https://www.styled-components.com/) workflow

1. (Optional) Use [Emmet](https://emmet.io/) to create JSX element tree
2. Extract unbound components to clipboard, then paste it where approriate (this extensions extract and copy for you)
3. (Optional) If you are using TypeScript and pasted them in another file, your can `auto import` those styled components with help of VS Code

![screenshot](images/screenshot.gif)

## Usage

Use VS Code Command: `Extract styled-components` (or `Extract exported styled-components`)

Optionally, You can bind these commands to shortcuts via `File -> Preferences -> Keyboard Shortcuts`.

Example:

```json
[
  {
    "key": "cmd+alt+e",
    "command": "styledComponentsExtractor.extract",
    "when": "editorFocus"
  },
  {
    "key": "ctrl+alt+e",
    "command": "styledComponentsExtractor.extractExported",
    "when": "editorFocus"
  }
]
```

## Configuration

```json
{
  // Add `import styled from 'styled-component'` statement if variable `styled` is unbound
  "styledComponentsExtractor.addImportStatement": true
}
```

## Release Notes

### 0.0.6

Support new syntax: optional chaining (`?.`), nullish coalescing (`??`)

### 0.0.5

Support `.js`, `.ts`, `.jsx` and `.tsx`

### 0.0.1

First release
