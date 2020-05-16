import { collectUnbound } from './extractor'

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

  expect(collectUnbound(code)).toEqual({
    styledImported: false,
    unbound: ['Abc', 'Ghi'],
  })
})
