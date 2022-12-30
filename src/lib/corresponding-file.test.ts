import { getCorrespondingStyleFile } from './corresponding-file'

test('getCorrespondingStyleFile styles.js', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.jsx',
    'styles',
    '',
  )
  expect(importPath).toEqual('/one/two/styles.js')
})

test('getCorrespondingStyleFile styles.ts', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.tsx',
    'styles',
    '',
  )
  expect(importPath).toEqual('/one/two/styles.ts')
})

test('getCorrespondingStyleFile filename.styles.js', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.jsx',
    '$name.styles',
    '',
  )
  expect(importPath).toEqual('/one/two/three.styles.js')
})

test('getCorrespondingStyleFile filename.styles.ts', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.tsx',
    '$name.styles',
    '',
  )
  expect(importPath).toEqual('/one/two/three.styles.ts')
})

test('getCorrespondingStyleFile filenameView.jsx -> filenameStyles.js', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/threeView.jsx',
    '$1Styles',
    '^(.+)View$',
  )
  expect(importPath).toEqual('/one/two/threeStyles.js')
})

test('getCorrespondingStyleFile filenameView.tsx -> filenameStyles.ts', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/threeView.tsx',
    '$1Styles',
    '^(.+)View$',
  )
  expect(importPath).toEqual('/one/two/threeStyles.ts')
})

test('getCorrespondingStyleFile filename.view.jsx -> filename.styles.js', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.view.jsx',
    '$1.styles',
    '^(.+)\\.view$',
  )
  expect(importPath).toEqual('/one/two/three.styles.js')
})

test('getCorrespondingStyleFile filename.view.tsx -> filename.styles.ts', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.view.tsx',
    '$1.styles',
    '^(.+)\\.view$',
  )
  expect(importPath).toEqual('/one/two/three.styles.ts')
})

test('getCorrespondingStyleFile no match', async () => {
  const importPath = getCorrespondingStyleFile(
    '/one/two/three.tsx',
    '$1Styles',
    '^(.+)View$',
  )
  expect(importPath).toEqual(null)
})
