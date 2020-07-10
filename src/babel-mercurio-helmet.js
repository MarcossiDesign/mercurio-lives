const fs = require('fs')
const p = require('path')

Object.defineProperty(exports, '__esModule', {
  value: true
})

const traverseExpression = (t, arg) => {
  if (t.isStringLiteral(arg)) {
    return arg
  }

  if (t.isBinaryExpression(arg)) {
    return traverseExpression(t, arg.left)
  }

  return null
}

function getRoot() {
  let relativePath = p.join(p.sep, process.cwd())
  if (process.platform === 'win32') {
    const { name } = p.parse(process.cwd())
    if (relativePath.includes(name)) {
      relativePath = relativePath.slice(relativePath.indexOf(name) + name.length)
    }
  }
  return relativePath
}

function storeVariable(opts, newVar) {
  const { locales = ['en'], filesOutput = './mercurio' } = opts
  const relativePath = getRoot()
  locales.forEach((locale) => {
    let currentLocaleFile = {}
    const localeFilename = p.join(relativePath, filesOutput, 'locales', `${locale}.json`)
    if (fs.existsSync(localeFilename)) currentLocaleFile = JSON.parse(fs.readFileSync(localeFilename, 'utf8'))
    const newLocaleFile = { ...newVar, ...currentLocaleFile }
    // translations[locale] = newLocaleFile
    fs.mkdirSync(p.dirname(localeFilename), { recursive: true })
    fs.writeFileSync(localeFilename, JSON.stringify(newLocaleFile, null, '\t'))
  })
}

// function getModuleSourceName(opts) {
//    return opts.moduleSourceName || '~/components/mercurio'
// }

exports.default = function ship({ types: t }) {
  return {
    post() {},
    visitor: {
      CallExpression(path, state) {
        if (!state.file.opts.filename.endsWith('mercurio-lives/lib/index.js')) return
        // if (!callExpressionTester.test(path)) {
        //    return
        // }

        const args = path.node.arguments
        if (!args.length) {
          return
        }

        const firstArg = traverseExpression(t, args[0])

        if (firstArg) {
          firstArg.value = firstArg.value.replace('mercurioTranslationsFile', p.join(getRoot(), this.opts.filesOutput, 'translations.json'))
        }
      },
      JSXElement(path) {
        // const { file } = state
        const { attributes: attributesNode, name: nameNode } = path.node.openingElement
        if (nameNode.name !== 'Mercurio') return
        attributesNode
          .filter((attr) => attr.type === 'JSXAttribute')
          .forEach(({ value: valueNode, name: attrNameNode }) => {
            if (attrNameNode.name === 'id') {
              const value = path.node.children[0] && path.node.children[0].type === 'JSXText' ? path.node.children[0].value : ''
              if (valueNode.value) storeVariable(this.opts, { [valueNode.value]: value })
            }
          })
      }
    }
  }
}
