import { getImportInsertion, getStyledImportInsertion } from './imports'

test('getImportInsertion no existing import', async () => {
  const code = `
import { foo } from "./bar"
import { baz } from "./qux"
  `

  const insertion = getImportInsertion(code, './styles', ['Abc', 'Xyz'])
  expect(insertion).toEqual({
    insertionText: 'import { Abc, Xyz } from "./styles"\n',
    insertionOffset: 0,
  })
})

test('getImportInsertion with existing import', async () => {
  const code = `
import { foo } from "./bar"
import { Def } from "./styles"
import { baz } from "./qux"
  `

  const insertion = getImportInsertion(code, './styles', ['Abc', 'Xyz'])
  expect(insertion).toEqual({
    insertionText: ', Abc, Xyz',
    insertionOffset: 41,
  })
})

test('getStyledImportInsertion no existing import', async () => {
  const code = `
import { foo } from "./bar"
import { baz } from "./qux"
  `

  const insertion = getStyledImportInsertion(code)
  expect(insertion).toEqual({
    insertionText: "import styled from 'styled-components'\n",
    insertionOffset: 0,
  })
})

test('getStyledImportInsertion no existing import, but with other named imports ', async () => {
  const code = `
import { foo } from "./bar"
import { css }  from 'styled-components'
import { baz } from "./qux"
  `

  const insertion = getStyledImportInsertion(code)
  expect(insertion).toEqual({
    insertionText: "import styled from 'styled-components'\n",
    insertionOffset: 0,
  })
})

test('getStyledImportInsertion with existing import', async () => {
  const code = `
import { foo } from "./bar"
import  styled from 'styled-components'
import { baz } from "./qux"
  `

  const insertion = getStyledImportInsertion(code)
  expect(insertion).toEqual(null)
})

test('getStyledImportInsertion with existing import, with other named imports ', async () => {
  const code = `
import { foo } from "./bar"
import styled, { css } from 'styled-components'
import { baz } from "./qux"
  `

  const insertion = getStyledImportInsertion(code)
  expect(insertion).toEqual(null)
})
