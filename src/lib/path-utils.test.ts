import {
  getExtension,
  relativeImportPathFromFile,
  stripExtension,
} from './path-utils'

test('relativeImportPathFromFile', async () => {
  const importPath = relativeImportPathFromFile(
    '/one/two/three.js',
    '/one/four/five.js',
  )
  expect(importPath).toEqual('../four/five')
})

test('stripExtension', async () => {
  const importPath = stripExtension('/one/two/three.test.js')
  expect(importPath).toEqual('/one/two/three.test')
})

test('stripExtension', async () => {
  const importPath = getExtension('/one/two/three.test.js')
  expect(importPath).toEqual('.js')
})
