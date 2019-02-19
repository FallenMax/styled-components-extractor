import * as vscode from 'vscode'
import { collectUnbound, generateDeclarations } from './lib/extractor'

const supportedLangs = ['javascriptreact', 'typescriptreact']

const extract = async (options: {
  exportIdentifier: boolean
}): Promise<void> => {
  try {
    const editor = vscode.window.activeTextEditor
    if (!editor) {
      return
    }

    const curLang = editor.document.languageId
    if (supportedLangs.indexOf(curLang) === -1) {
      vscode.window.showWarningMessage(
        '[SCE] Only `.jsx` and `.tsx` is supported',
      )
      return
    }

    const document = editor.document

    const config = vscode.workspace.getConfiguration(
      'styledComponentsExtractor',
    )

    const text = document.getText()
    const { unbound, styledImported } = collectUnbound(text)
    if (!unbound.length) {
      vscode.window.showWarningMessage(
        '[SCE] Nothing to copy: There is no unbound components',
      )
      return
    }
    const declarations = generateDeclarations({
      unbound,
      styledImported,
      exportIdentifier: options.exportIdentifier,
      importStyled: config.get('addImportStatement', true),
    })

    await vscode.env.clipboard.writeText(declarations)
    vscode.window.showInformationMessage(
      `[SCE] Copied to clipboard! (Found: ${unbound.length}) `,
    )
  } catch (e) {
    console.error('[SCE]', e)
    vscode.window.showErrorMessage('[SCE] Failed to extract')
  }
}

export const activate = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(
    vscode.commands.registerCommand('styledComponentsExtractor.extract', () =>
      extract({
        exportIdentifier: false,
      }),
    ),
    vscode.commands.registerCommand(
      'styledComponentsExtractor.extractExported',
      () =>
        extract({
          exportIdentifier: true,
        }),
    ),
  )
}
