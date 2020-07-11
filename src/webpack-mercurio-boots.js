import fs from 'fs'
import p from 'path'

import getRoot from './getRoot'
import constants from './constants'
import getBabelConfigFile from './getBabelConfigFile'

function getHelmetSettings() {
  const babelConfigFile = getBabelConfigFile()

  if (!babelConfigFile) return false

  const helmetConfig = babelConfigFile.plugins.find((plugin) => plugin[0].endsWith(constants.BABEL_PLUGIN_NAME))
  if (helmetConfig === -1) return false

  const { filesOutput = constants.FILES_OUTPUT, locales = constants.LOCALES } = helmetConfig[1]
  return { filesOutput, locales }
}

function getTranslationsLocation() {
  const root = getRoot()
  const getHelmetSettings = getHelmetSettings()
  if (!getHelmetSettings) return false
  const { filesOutput } = getHelmetSettings
  const absoluteFilesOutput = p.join(root, filesOutput, constants.TRANSLATIONS_FILE_NAME)
  return absoluteFilesOutput
}

class MercurioSail {
  apply(compiler) {
    // Resolve alias in React components
    compiler.resolverFactory.plugin('resolver normal', (resolver) => {
      resolver.hooks.resolve.tapAsync('MercurioBoots', (params, resolveContext, callback) => {
        if (params.request.endsWith(constants.TRANSLATION_FILE_ALIAS)) {
          const translationLocation = getTranslationsLocation()
          if (!translationLocation) throw new Error('Babel plugin not present or misconfigured.')
          const modified = { ...params, request: translationLocation }
          return resolver.doResolve('resolve', modified, null, resolveContext, callback)
        }
        return callback()
      })
    })

    // Generate the Translations file
    compiler.hooks.afterCompile.tap('after-compile', (compilation) => {
      const root = getRoot()
      const helmetSettings = getHelmetSettings()
      if (!helmetSettings) throw new Error('Babel plugin not present or misconfigured.')
      const { filesOutput, locales } = helmetSettings
      const translations = {}
      const absoluteFilesOutput = p.join(root, filesOutput)
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
