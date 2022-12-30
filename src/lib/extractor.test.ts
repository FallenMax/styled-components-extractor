import { collectUnbound, generateDeclarations } from './extractor'

test('collectUnbound', async () => {
  const code = `
const Def = 1 as any

const TestComponent: React.SFC = () => {
  const c = a?.b ?? c
  return (
    <Abc someAttrs>
      <Def>
        <Ghi />
        <section />
      </Def>
      <ul>
        <li>123</li>
        <li>456</li>
        <li>789</li>
      </ul>
    </Abc>
  )
}
  `

  expect(collectUnbound(code)).toEqual(['Abc', 'Ghi'])
})

test('collectUnbound syntax error', async () => {
  const code = `
const Def = 1 as any

const TestComponent: React.SFC = () => {
  const c = a?.b ?? c
  return (
    <Abc someAttrs>
      <Def>
        <Ghi />
        <section />
      </Def>
      <ul>
        <li>123</li>
        <li>456</li>
        <li>789</li>
      </ul>
    </Xyz>
  )
}
  `

  try {
    collectUnbound(code)
    fail('Should have thrown an error')
  } catch (e) {
    expect(
      e instanceof Error && Object.getPrototypeOf(e).name === 'SyntaxError',
    ).toBe(true)
  }
})

test('generateDeclarations no export', async () => {
  const declarations = await generateDeclarations({
    unbound: ['Abc', 'Xyz'],
    exportIdentifier: false,
  })
  expect(declarations).toEqual(
    'const Abc = styled.div``\n' + 'const Xyz = styled.div``',
  )
})

test('generateDeclarations yes export', async () => {
  const declarations = await generateDeclarations({
    unbound: ['Abc', 'Xyz'],
    exportIdentifier: true,
  })
  expect(declarations).toEqual(
    'export const Abc = styled.div``\n' + 'export const Xyz = styled.div``',
  )
})
