import * as vscode from 'vscode'
import { getCorrespondingStyleFile } from './lib/corresponding-file'
import { collectUnbound, generateDeclarations } from './lib/extractor'
import { getStyledImportInsertion } from './lib/imports'
import { openFileInEditor } from './lib/vscode-utils'
import {
  insertStyledImport,
  insertStyles,
  modifyImports,
} from './lib/modify-vscode-editor'

const supportedLangs = ['javascript', 'javascriptreact', 'typescriptreact']

type ExtractType =
  | 'extractToClipboard'
  | 'extractExportedToClipboard'
  | 'extractToSameFile'
  | 'extractToSeparateFile'

const extract = async (type: ExtractType): Promise<void> => {
  try {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }

    if (
      supportedLangs.indexOf(editor.document.languageId) === -1 &&
      !/\.(js|ts)x?$/.test(editor.document.fileName)
    ) {
      vscode.window.showWarningMessage(
        '[SCE] Only `.js`, `.ts`, `.jsx` and `.tsx` are supported',
      )
      return
    }

    const document = editor.document

    const config = vscode.workspace.getConfiguration(
      'styledComponentsExtractor',
    )

    const text = document.getText()
    const unbound = collectUnbound(text)
    if (!unbound.length) {
      vscode.window.showWarningMessage(
        '[SCE] Nothing to extract: There are no unbound components',
      )
      return
    }

    const exportIdentifier =
      type == 'extractExportedToClipboard' || type == 'extractToSeparateFile'

    const declarations = generateDeclarations({
      unbound,
      exportIdentifier,
    })

    if (type == 'extractToClipboard' || type == 'extractExportedToClipboard') {
      let clipboardText = declarations
      if (config.get('addImportStatement', true)) {
        const styledImportInsertion = getStyledImportInsertion(
          editor.document.getText(),
        )
        if (styledImportInsertion) {
          clipboardText = styledImportInsertion.insertionText + declarations
        }
      }

      await vscode.env.clipboard.writeText(clipboardText)

      vscode.window.showInformationMessage(
        `[SCE] Copied to clipboard! (Found: ${unbound.length}) `,
      )
    } else if (type == 'extractToSeparateFile') {
      const styleFile = getCorrespondingStyleFile(
        editor.document.uri.path,
        config.get('separateFile.matchPattern', '*'),
        config.get('separateFile.outputFile', 'styles.ts'),
      )
      if (!styleFile) {
        vscode.window.showWarningMessage(
          '[SCE] This file does not match the pattern in your configuration.',
        )
        return
      }

      await modifyImports(editor, styleFile, unbound)

      const styleFileEditor = await openFileInEditor(styleFile)
      await insertStyles(styleFileEditor, declarations)
      await insertStyledImport(styleFileEditor)

      await editor.document.save()
      await styleFileEditor.document.save()
    } else if (type == 'extractToSameFile') {
      await insertStyles(editor, declarations)
      await insertStyledImport(editor)

      await editor.document.save()
    }
  } catch (e) {
    if (e instanceof Error && Object.getPrototypeOf(e).name === 'SyntaxError') {
      vscode.window.showErrorMessage(
        '[SCE] Failed to extract due to syntax error: ' + e.message,
      )
    } else {
      console.error('[SCE]', e)
      vscode.window.showErrorMessage('[SCE] Unexpected error while extracting')
    }
  }
}

export const activate = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand(
      'styledComponentsExtractor.extractToClipboard',
      () => extract('extractToClipboard'),
    ),
    vscode.commands.registerCommand(
      'styledComponentsExtractor.extractExportedToClipboard',
      () => extract('extractExportedToClipboard'),
    ),
    vscode.commands.registerCommand(
      'styledComponentsExtractor.extractToSameFile',
      () => extract('extractToSameFile'),
    ),
    vscode.commands.registerCommand(
      'styledComponentsExtractor.extractToSeparateFile',
      () => extract('extractToSeparateFile'),
    ),
  )
}
