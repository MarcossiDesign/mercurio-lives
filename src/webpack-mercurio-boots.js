import fs from 'fs'
import p from 'path'

import getRoot from './getRoot'
import constants from './constants'
import getBabelConfigFile from './getBabelConfigFile'

const PLUGIN_NAME = 'MercurioBoots'

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
  const helmetSettings = getHelmetSettings()
  if (!helmetSettings) return false
  const { filesOutput } = helmetSettings
  const absoluteFilesOutput = p.join(root, filesOutput, constants.TRANSLATIONS_FILE_NAME)
  return absoluteFilesOutput
}

class MercurioBoots {
  apply(compiler) {
    // Resolve alias in React components
    compiler.resolverFactory.plugin('resolver normal', (resolver) => {
      resolver.hooks.resolve.tapAsync(PLUGIN_NAME, (params, resolveContext, callback) => {
        if (params.request.endsWith(constants.TRANSLATION_FILE_ALIAS)) {
          const translationsLocation = getTranslationsLocation()
          const modified = { ...params, request: fs.existsSync(translationsLocation) ? translationsLocation : './emptyTranslations.json' }
          return resolver.doResolve(resolver.ensureHook('resolve'), modified, null, resolveContext, callback)
        }
        return callback()
      })
    })

    // Generate dumb Translations before compilation
    compiler.hooks.beforeCompile.tap(PLUGIN_NAME, () => {
      const translationsFilename = getTranslationsLocation()
      if (!translationsFilename) throw new Error('Babel plugin not present or misconfigured.')
      if (fs.existsSync(translationsFilename)) return
      fs.mkdirSync(p.dirname(translationsFilename), { recursive: true })
      fs.writeFileSync(translationsFilename, JSON.stringify({}))
    })

    // Generate the Translations file
    compiler.hooks.afterCompile.tap(PLUGIN_NAME, (compilation) => {
      const root = getRoot()
      const helmetSettings = getHelmetSettings()
      if (!helmetSettings) return compilation.errors.push(new Error('Babel plugin not present or misconfigured.'))
      const { filesOutput, locales } = helmetSettings
      const translations = {}
      const absoluteFilesOutput = p.join(root, filesOutput)
      const localesFiles = p.join(absoluteFilesOutput, constants.LOCALES_FOLDER_NAME)
      locales.forEach((locale) => {
        const localeFile = p.join(localesFiles, `${locale}.json`)
        if (!fs.existsSync(localeFile)) return
        translations[locale] = JSON.parse(fs.readFileSync(localeFile, 'utf8'))
      })
      const translationsFilename = p.join(absoluteFilesOutput, constants.TRANSLATIONS_FILE_NAME)
      compilation.contextDependencies.add(absoluteFilesOutput)
      if (
        !fs.existsSync(localesFiles) ||
        (fs.existsSync(translationsFilename) && JSON.stringify(translations) === fs.readFileSync(translationsFilename, 'utf8'))
      ) {
        return
      }
      fs.writeFileSync(translationsFilename, JSON.stringify(translations))
    })
  }
}

module.exports = MercurioBoots
