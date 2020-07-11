import fs from 'fs'
import p from 'path'

import getRoot from './getRoot'
import constants from './constants'

function getBabelConfigFile() {
  const absolutePath = getRoot()

  const babelJSONConfigFileLocation = p.join(absolutePath, '.babelrc')
  const babelJSConfigFileLocation = p.join(absolutePath, '.babelrc.js')

  const babelJSONConfigFileExists = fs.existsSync(babelJSONConfigFileLocation)
  const babelJSConfigFileExists = fs.existsSync(babelJSConfigFileLocation)

  if (!babelJSONConfigFileExists || !babelJSConfigFileExists) return

  const babelConfigFile = babelJSONConfigFileExists ? JSON.parse(fs.readFileSync(babelJSONConfigFileLocation, 'utf8')) : require(babelJSConfigFileLocation)

  const shipConfig = babelConfigFile.plugins.find((plugin) => plugin[0].endsWith(constants.BABEL_PLUGIN_NAME))
  if (shipConfig === -1) return

  const { filesOutput = constants.FILES_OUTPUT, locales = constants.LOCALES } = shipConfig[1]
  return { filesOutput, locales }
}

function getTranslationsLocation() {
  const absolutePath = getRoot()
  const { filesOutput } = getBabelConfigFile()
  const absoluteFilesOutput = p.join(absolutePath, filesOutput, constants.TRANSLATIONS_FILE_NAME)
  return absoluteFilesOutput
}

class MercurioSail {
  apply(compiler) {
    compiler.resolverFactory.plugin('resolver normal', (resolver) => {
      resolver.hooks.resolve.tapAsync('MercurioBoots', (params, resolveContext, callback) => {
        if (params.request.endsWith('mercurioTranslationsFile')) {
          const modified = { ...params, request: getTranslationsLocation() }
          return resolver.doResolve('resolve', modified, null, resolveContext, callback)
        }
        return callback()
      })
    })

    compiler.hooks.afterCompile.tap('after-compile', (compilation) => {
      const absolutePath = getRoot()
      const { filesOutput, locales } = getBabelConfigFile()
      const translations = {}
      const absoluteFilesOutput = p.join(absolutePath, filesOutput)
      const localesFiles = p.join(absoluteFilesOutput, constants.LOCALES_FOLDER_NAME)
      locales.forEach((locale) => {
        const localeFile = p.join(localesFiles, `${locale}.json`)
        if (!fs.existsSync(localeFile)) return
        translations[locale] = JSON.parse(fs.readFileSync(localeFile, 'utf8'))
      })
      const translationsFilename = p.join(absoluteFilesOutput, 'translations.json')
      compilation.contextDependencies.add(absoluteFilesOutput)
      if (
        !fs.existsSync(localesFiles) ||
        (fs.existsSync(translationsFilename) && JSON.stringify(translations) === fs.readFileSync(translationsFilename, 'utf8'))
      )
        return
      fs.writeFileSync(translationsFilename, JSON.stringify(translations))
    })
  }
}

module.exports = MercurioSail
