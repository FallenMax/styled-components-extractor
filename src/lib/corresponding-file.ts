import * as path from 'path'
import { getExtension, stripExtension } from './path-utils'

export function getCorrespondingStyleFile(
  inputPath: string,
  outputFile: string,
  inputFileRegex: string,
) {
  const basePath = path.dirname(inputPath)
  const filename = stripExtension(path.basename(inputPath))
  const extension = getExtension(path.basename(inputPath))

  let outputFilename = outputFile.replace('$name', filename)

  if (inputFileRegex.length) {
    let effectiveRegex = inputFileRegex

    // HACK - ensure the regex matches the entire string, so
    // that we replace the whole string
    if (!effectiveRegex.startsWith('^')) {
      effectiveRegex = '^.*' + effectiveRegex
    }
    if (!effectiveRegex.endsWith('$')) {
      effectiveRegex += '.*$'
    }

    if (!filename.match(effectiveRegex)) {
      return null
    }

    outputFilename = filename.replace(
      new RegExp(effectiveRegex),
      outputFilename,
    )
  }

  const outputExtension = extension.match(/tsx?/) ? 'ts' : 'js'

  return path.join(basePath, `${outputFilename}.${outputExtension}`)
}
