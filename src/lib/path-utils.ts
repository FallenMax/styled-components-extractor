import * as path from 'path'

export function relativeImportPathFromFile(from: string, to: string) {
  // TODO is this OK on Windows?
  let relative = path.relative(path.dirname(from), to)

  if (relative === path.basename(to)) {
    relative = './' + relative
  }

  return stripExtension(relative)
}

export function stripExtension(inputPath: string) {
  const parsed = path.parse(inputPath)
  return parsed.dir + '/' + parsed.name // removes extension
}

export function getExtension(inputPath: string) {
  const parsed = path.parse(inputPath)
  return parsed.ext
}
