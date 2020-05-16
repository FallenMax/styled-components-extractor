import * as parser from '@babel/parser'
import traverse from '@babel/traverse'

const parseOptions: parser.ParserOptions = {
  sourceType: 'module',
  plugins: [
    'jsx',
    'typescript',
    'objectRestSpread',
    'asyncGenerators',
    'classProperties',
    'dynamicImport',
    'decorators-legacy',
    'optionalCatchBinding',
    'optionalChaining',
    'nullishCoalescingOperator',
  ],
}

const STYLED_COMPONENTS_IDENTIFIER = 'styled'
export const collectUnbound = (code: string) => {
  const ast = parser.parse(code, parseOptions)

  const unboundJSXIdentifiers = new Set<string>()
  let styledImported: undefined | boolean = undefined

  traverse(ast, {
    enter(path) {
      const node = path.node

      switch (node.type) {
        case 'JSXIdentifier': {
          if (path.parentPath.node.type !== 'JSXOpeningElement') {
            return
          }
          const isComponent = /[A-Z]/.test(node.name)
          if (!isComponent) {
            return
          }
          if (!path.scope.hasBinding(node.name)) {
            unboundJSXIdentifiers.add(node.name)
            if (styledImported == null) {
              styledImported = path.scope.hasBinding(
                STYLED_COMPONENTS_IDENTIFIER,
              )
            }
          }

          break
        }
        default:
          break
      }
    },
  })

  const unbound = [...unboundJSXIdentifiers]
  return {
    unbound,
    styledImported: Boolean(styledImported),
  }
}

export const generateDeclarations = ({
  unbound,
  styledImported,
  exportIdentifier,
  importStyled,
}: {
  unbound: string[]
  styledImported: boolean
  exportIdentifier: boolean
  importStyled: boolean
}): string => {
  return [
    ...(importStyled && !styledImported
      ? [`import styled from 'styled-components'`]
      : []),
    ...unbound.map((varName) => {
      return `${
        exportIdentifier ? 'export ' : ''
      }const ${varName} = styled.div\`\``
    }),
  ].join('\n')
}
