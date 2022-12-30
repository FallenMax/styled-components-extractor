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

export const collectUnbound = (code: string) => {
  const ast = parser.parse(code, parseOptions)

  const unboundJSXIdentifiers = new Set<string>()

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
          }

          break
        }
        default:
          break
      }
    },
  })

  return [...unboundJSXIdentifiers]
}

export const generateDeclarations = ({
  unbound,
  exportIdentifier,
}: {
  unbound: string[]
  exportIdentifier: boolean
}): string => {
  return unbound
    .map((varName) => {
      return `${
        exportIdentifier ? 'export ' : ''
      }const ${varName} = styled.div\`\``
    })
    .join('\n')
}
