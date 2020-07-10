---
id: usage
title: Usage
sidebar_label: Usage
---

### `<MercurioProvider>`

Wrap you app with the `MercurioProvider` component:

```javascript
import { MercurioProvider } from 'mercurio-lives'

const App = () => {
   return (
      <MercurioProvider 
        locale="en" // (optional) provide a locale in case you don't want to use the internal context
        initialLocale="en" // (required) must be one of the previously configurated in babel plugin
        defaultMessage="Not translated" // (optional) a default message in case of missing translation
      >
         ...
      </MercurioProvider>
   )
}
```

### `<Mercurio>`

The translation itself:

```javascript
import { Mercurio } from 'mercurio-lives'

const name = 'Igor'

const Header = () => {
   return (
      <Mercurio
        id="welcomeMessage" // (required) the id of the translation
        extra={{ name }} // (optional) an object to be injected into the translated message
      >
        {/** The children is the default value for the ID. It'll be copied to all locales files. */}
         Welcome, [name]
      </MercurioProvider>
   )
}
```

### `useLocale` hook

A hook to get and set the locale:

```javascript
import { useLocale, Mercurio } from '~/components/mercurio'

const ChangeLanguageBtn = ({ setLanguage, language }) => {
   const [locale, setLocale] = useLocale()
   return (
      <button type="button" onClick={() => setLocale(locale === 'pt' ? 'en' : 'pt')}>
         <Mercurio id="changeLanguageBtn">Switch to Portuguese</Mercurio>
      </button>
   )
}
```

## Locales files

To edit the translations, just edit the locales files located in the `locales` folder, inside the folder specified in the Babel plugin (or in `projectRoot/mercurio/locales` if no path was specified).
