export function getImportInsertion(
  existingText: string,
  importPath: string,
  modulesToImport: string[],
) {
  const importRegex = new RegExp(`(import {.*?)\\s+} from "${importPath}"`)
  const importAlreadyPresent = importRegex.exec(existingText)
  if (importAlreadyPresent) {
    const matchIndex = importAlreadyPresent.index
    const upToImportList = importAlreadyPresent[1]
    const insertionOffset = matchIndex + upToImportList.length

    return {
      insertionText: `, ${modulesToImport.join(', ')}`,
      insertionOffset,
    }
  } else {
    return {
      insertionText: `import { ${modulesToImport.join(
        ', ',
      )} } from "${importPath}"\n`,
      insertionOffset: 0,
    }
  }
}

export function getStyledImportInsertion(existingText: string) {
  const importRegex = new RegExp(
    `import\\s+styled\\s+from\\s+["']styled-components["']`,
  )
  const importAlreadyPresent = importRegex.exec(existingText)
  if (!importAlreadyPresent) {
    return {
      insertionText: `import styled from 'styled-components'\n`,
      insertionOffset: 0,
    }
  } else {
    return null
  }
}
