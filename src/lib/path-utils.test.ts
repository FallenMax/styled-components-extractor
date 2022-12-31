import {
  getExtension,
  relativeImportPathFromFile,
  stripExtension,
} from './path-utils'

test('relativeImportPathFromFile, same directory', async () => {
  const importPath = relativeImportPathFromFile(
    '/one/mycomponent.js',
    '/one/mycomponent.styles.js',
  )
  expect(importPath).toEqual('./mycomponent.styles')
})

test('relativeImportPathFromFile, different directories', async () => {
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
