# Styled-Components Extractor

Generate [styled-components](https://www.styled-components.com/) definitions from JSX tags.

This extension supports extracting definitions to several different locations:

1. **Same File** - If you keep your style definitions in your JSX files.
2. **Separate File** - If you keep your style definitions in a separate file whose name is derived from your JSX file name.
3. **Clipboard** - For all other use cases. You can paste the definitions wherever you like!

For maximum productivity, you can combine this extension with [Emmet](https://emmet.io/):

1. Use Emmet to create JSX element tree
2. Use this extension to extract styled-components from the JSX

![screenshot](images/screenshot.gif)

## Usage

Use one of the four VS Code commands provided by this extension:

- `Extract styled-components to the same file` - Generates definitions for all unbound styled components and appends them to end of the current JSX file.
- `Extract exported styled-components to a separate file` - Generates definitions for all unbound styled components and appends them to end of another file. Automatically imports the new components in the JSX file. The file the compnents are appended to is controlled by the `separateFile.outputFile` setting.
- `Extract styled-components to clipboard` - Generates definitions for all unbound styled components and copies them to the clipboard.
- `Extract exported styled-components to clipboard` - Same as previous, but includes the `export` keyword in each definition.

Optionally, you can bind these commands to shortcuts via `File -> Preferences -> Keyboard Shortcuts`.

Example:

```json
[
  {
    "key": "cmd+alt+e",
    "command": "styledComponentsExtractor.extractToSeparateFile",
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
  // Add `import styled from 'styled-components'` statement if variable `styled` is unbound
  // when copying to the clipboard only. When extracting to a file, whether to add this
  // import is automatically determined.
  "styledComponentsExtractor.addImportStatement": true
}
```

```json
{
  // The name of the file, excluding the extension, to place extracted components. You can
  // use `$name` to reference the name of the input file, excluding its extension. If
  // `#styledComponentsExtractor.separateFile.advanced.inputFileRegex#` is provided,
  // you can also use `$1`, `$2`.
  "styledComponentsExtractor.separateFile.outputFile": "$name.styles"
}
```

```json
{
  // A regex pattern used to capture parts of the input file's name when extracting to a
  // separate file. The pattern is matched against the file's name excluding the extension.
  // The contents of the regex's capture groups can be referenced in the output file name
  // as `$1`, `$2`, etc. Can be left blank if not needed.
  "styledComponentsExtractor.separateFile.advanced.inputFileRegex": ""
}
```

## Configuring a Separate File for Your Styles

Extracting your styled-components to a separate file is probably the most powerful capability of this extension. Every codebase has its own convention for file names, however, so you will probably have to change the default configuration to match your own preferences.

In many cases, if your style's filename is simply a suffixed or prefixed version of the JSX file (such as `FluxCapacitor.styles.js`), then you'll only need to set the `outputFile` option and utilize the `$name` variable. If you need something more advanced, like removing a portion of the JSX file's name, you'll need to set both `outputFile` and `inputFileRegex` and utilize the `$1`, `$2` variables.

The following examples are designed to illustrate the flexibility of the configuration and provide inspiration for your own settings!

### Append .styles.js

Example: `FluxCapacitorView.jsx` -> `FluxCapacitorView.styles.js`

Configuration:

```json
{
  "styledComponentsExtractor.separateFile.outputFile": "$name.styles"
}
```

### Always use styles.js in a named folder

Example: `FluxCapacitor/view.jsx` -> `FluxCapacitor/styles.js`

Configuration:

```json
{
  "styledComponentsExtractor.separateFile.outputFile": "styles"
}
```

### Replace ".view" with ".styles

Example: `FluxCapacitor.view.jsx` -> `FluxCapacitor.styles.js`

Configuration:

```json
{
  "styledComponentsExtractor.separateFile.outputFile": "$1.styles",
  "styledComponentsExtractor.separateFile.advanced.matchPattern": "^(.+)\\.view$"
}
```

### Note on TypeScript

If you're using TypeScript, your files will end with `.tsx` or `.ts` instead. However, you can still use the exact same configuration. If the JSX file has a `.tsx` extension, the extracted file will automatically have a `.ts` extension.
