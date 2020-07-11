import fs from 'fs'
import p from 'path'

import getRoot from './getRoot'
import constants from './constants'

const POSSIBLE_EXTENSIONS = ['', '.js', '.json', '.cjs', '.mjs']

export default () => {
  const root = getRoot()
  let foundBabelConfigFilePath = false
  for (let confIndex = 0; !foundBabelConfigFilePath && confIndex < constants.BABEL_CONF_FILE_NAMES.length - 1; confIndex++) {
    for (let extIndex = 0; !foundBabelConfigFilePath && extIndex < POSSIBLE_EXTENSIONS.length - 1; extIndex++) {
      const filePath = p.join(root, constants.BABEL_CONF_FILE_NAMES[confIndex] + POSSIBLE_EXTENSIONS[extIndex])
      if (fs.existsSync(filePath)) foundBabelConfigFilePath = filePath
    }
  }
  if (!foundBabelConfigFilePath) return foundBabelConfigFilePath
  const ext = p.extname(foundBabelConfigFilePath)
  if (ext === '.json' || ext === '') return JSON.parse(fs.readFileSync(foundBabelConfigFilePath, 'utf8'))
  return require(foundBabelConfigFilePath, 'utf8')
}
