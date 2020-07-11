import fs from 'fs'
import p from 'path'

import constants from './constants'
import getRoot from './getRoot'

Object.defineProperty(exports, '__esModule', {
  value: true
})

function storeVariable(opts, newVar) {
  const { locales = constants.LOCALES, filesOutput = constants.FILES_OUTPUT } = opts
  const relativePath = getRoot()
  locales.forEach((locale) => {
    let currentLocaleFile = {}
    const localeFilename = p.join(relativePath, filesOutput, constants.LOCALES_FOLDER_NAME, `${locale}.json`)
    if (fs.existsSync(localeFilename)) currentLocaleFile = JSON.parse(fs.readFileSync(localeFilename, 'utf8'))
    const newLocaleFile = { ...newVar, ...currentLocaleFile }
    fs.mkdirSync(p.dirname(localeFilename), { recursive: true })
    fs.writeFileSync(localeFilename, JSON.stringify(newLocaleFile, null, '\t'))
  })
}

// function getModuleSourceName(opts) {
//    return opts.moduleSourceName || '~/components/mercurio'
// }

exports.default = function ship() {
  return {
    visitor: {
      JSXElement(path) {
        // const { file } = state
        const { attributes: attributesNode, name: nameNode } = path.node.openingElement
        if (nameNode.name !== constants.MERCURIO_TAG_NAME) return
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
