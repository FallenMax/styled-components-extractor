import { getCorrespondingStyleFile } from './corresponding-file'

test('getCorrespondingStyleFile styles.js', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.jsx',
    '*',
    'styles',
  )
  expect(importPath).toEqual('/one/two/styles.js')
})

test('getCorrespondingStyleFile styles.ts', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.tsx',
    '*',
    'styles',
  )
  expect(importPath).toEqual('/one/two/styles.ts')
})

test('getCorrespondingStyleFile filename.styles.js', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.jsx',
    '*',
    '$1.styles',
  )
  expect(importPath).toEqual('/one/two/three.styles.js')
})

test('getCorrespondingStyleFile styles.ts', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.tsx',
    '*',
    '$1.styles',
  )
  expect(importPath).toEqual('/one/two/three.styles.ts')
})

test('getCorrespondingStyleFile filenameView.jsx -> filenameStyles.jsx', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/threeView.jsx',
    '*View',
    '$1Styles',
  )
  expect(importPath).toEqual('/one/two/threeStyles.js')
})

test('getCorrespondingStyleFile styles.ts', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/threeView.tsx',
    '*View',
    '$1Styles',
  )
  expect(importPath).toEqual('/one/two/threeStyles.ts')
})

test('getCorrespondingStyleFile no match', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.tsx',
    '*View',
    '$1Styles',
  )
  expect(importPath).toEqual(null)
})
