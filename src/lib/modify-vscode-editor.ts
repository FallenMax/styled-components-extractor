import * as vscode from 'vscode'
import { getImportInsertion, getStyledImportInsertion } from './imports'
import { relativeImportPathFromFile } from './path-utils'
import { endOfFile } from './vscode-utils'

export async function modifyImports(
  editor: vscode.TextEditor,
  fileToImport: string,
  modulesToImport: string[],
) {
  const importPath = relativeImportPathFromFile(
    editor.document.uri.path,
    fileToImport,
  )

  const { insertionText, insertionOffset } = getImportInsertion(
    editor.document.getText(),
    importPath,
    modulesToImport,
  )

  const insertionPosition = editor.document.positionAt(insertionOffset)
  await editor.edit((editBuilder) => {
    editBuilder.insert(insertionPosition, insertionText)
  })
}

export async function insertStyledImport(editor: vscode.TextEditor) {
  const styledImportInsertion = getStyledImportInsertion(
    editor.document.getText(),
  )

  if (styledImportInsertion) {
    const { insertionText, insertionOffset } = styledImportInsertion

    const insertionPosition = editor.document.positionAt(insertionOffset)
    await editor.edit((editBuilder) => {
      editBuilder.insert(insertionPosition, insertionText)
    })
  }
}

export async function insertStyles(
  editor: vscode.TextEditor,
  declarations: string,
) {
  const end = endOfFile(editor)
  const declarationsToInsert = '\n\n' + declarations
  await editor.edit((editBuilder) => {
    editBuilder.insert(end, declarationsToInsert)
  })

  const newEnd = editor.document.positionAt(
    editor.document.offsetAt(end) + declarationsToInsert.length,
  )
  await editor.revealRange(new vscode.Range(end, newEnd))
}
