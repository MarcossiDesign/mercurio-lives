const fs = require('fs')
const p = require('path')
const uniq = require('lodash.uniq')

const BABEL_PLUGIN_NAME = 'babel-mercurio-helmet'

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

function getTranslationsLocation() {
  const absolutePath = getRoot()
  const babelConfigFileLocation = p.join(absolutePath, '.babelrc')
  if (!fs.existsSync(babelConfigFileLocation)) return
  const babelConfigFile = JSON.parse(fs.readFileSync(babelConfigFileLocation, 'utf8'))
  const shipConfig = babelConfigFile.plugins.find((plugin) => plugin[0].endsWith(BABEL_PLUGIN_NAME))
  const { filesOutput = './mercurio' } = shipConfig[1]
  const absoluteFilesOutput = p.join(absolutePath, filesOutput, 'translations.json')
  return absoluteFilesOutput
}

class MercurioSail {
  apply(compiler) {
    compiler.resolverFactory.plugin('resolver normal', (resolver) => {
      const target = resolver.ensureHook(this.target);
      resolver.hooks.resolve.tapAsync('MyPlugin', (params, resolveContext, callback) => {
        if (params.request.endsWith('mercurioTranslationsFile')) {
          const modified = { ...params, request: getTranslationsLocation() }
          return resolver.doResolve('resolve', modified, null, resolveContext, callback)
        }
        return callback()
      })
    })

    compiler.hooks.afterCompile.tap('after-compile', (compilation) => {
      const absolutePath = getRoot()
      const babelConfigFileLocation = p.join(absolutePath, '.babelrc')
      if (!fs.existsSync(babelConfigFileLocation)) return
      const babelConfigFile = JSON.parse(fs.readFileSync(babelConfigFileLocation, 'utf8'))
      const shipConfig = babelConfigFile.plugins.find((plugin) => plugin[0].endsWith(BABEL_PLUGIN_NAME))
      if (shipConfig === -1) return
      const { filesOutput = './mercurio', locales = ['en'] } = shipConfig[1]
      const translations = {}
      const absoluteFilesOutput = p.join(absolutePath, filesOutput)
      const localesFiles = p.join(absoluteFilesOutput, 'locales')
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
