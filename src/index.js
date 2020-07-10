import React, { useState, useContext, useEffect } from 'react'
import PropTypes from 'prop-types'

let translations
try {
  // eslint-disable-next-line global-require, import/no-unresolved
  translations = require('mercurioTranslationsFile')
} catch (error) {
  translations = {}
}

const MercurioContext = React.createContext()

const MercurioProvider = ({ children, initialLocale, locale, defaultMessage }) => {
  const [internalLocale, setInternalLocale] = useState(initialLocale)
  useEffect(() => {
    if (locale) setInternalLocale(locale)
  }, [locale])
  return <MercurioContext.Provider value={{ setLocale: setInternalLocale, locale: internalLocale, defaultMessage }}>{children}</MercurioContext.Provider>
}

MercurioProvider.propTypes = {
  children: PropTypes.node.isRequired,
  initialLocale: PropTypes.string.isRequired,
  defaultMessage: PropTypes.string,
  locale: PropTypes.string
}

MercurioProvider.defaultProps = {
  defaultMessage: '',
  locale: undefined
}

const useLocale = () => {
  const { locale, setLocale } = useContext(MercurioContext)
  const validateSetLocale = (newLocale) => {
    if (!Object.keys(translations).includes(newLocale)) {
      return console.warn(
        '%cMercurio says:',
        'font-weight: bold; color: #EC5f67;',
        ` I didn't found any translations such as "${newLocale}". I'm sorry, but i'll keep ${locale}.`
      )
    }
    setLocale(newLocale)
  }
  return [locale, validateSetLocale]
}

const Mercurio = ({ children, id, extra }) => {
  const { locale, defaultMessage } = useContext(MercurioContext)
  if (!Object.keys(translations).length) return defaultMessage || ''
  const translation = translations[locale][id]
  if (!translation) return children || defaultMessage || ''
  let translationWithExtra = translation
  Object.entries(extra).map(([key, value]) => (translationWithExtra = translationWithExtra.replace(new RegExp(`[${key}]`, 'gi'), value)))
  return translationWithExtra
}

Mercurio.propTypes = {
  children: PropTypes.string,
  id: PropTypes.string.isRequired,
  extra: PropTypes.shape({})
}

Mercurio.defaultProps = {
  children: undefined,
  extra: {}
}

export { MercurioProvider, useLocale, Mercurio }
