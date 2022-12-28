import * as path from 'path'
import { getExtension, stripExtension } from './path-utils'

function escapeRegex(string: string) {
  return string.replace(/[/\-\\^$*+?.()|[\]{}]/g, '\\$&')
}

export function getCorrespondingStyleFile(
  inputPath: string,
  matchPattern: string,
  outputFile: string,
) {
  const basePath = path.dirname(inputPath)
  const filename = stripExtension(path.basename(inputPath))
  const extension = getExtension(path.basename(inputPath))
  const regex = `^${escapeRegex(matchPattern).replace('\\*', '(.*)')}$`
  if (!filename.match(regex)) {
    return null
  }

  const outputFilename = filename.replace(new RegExp(regex), outputFile)
  const outputExtension = extension.match(/tsx?/) ? 'ts' : 'js'

  return path.join(basePath, `${outputFilename}.${outputExtension}`)
}
