---
id: installation
title: Installation
sidebar_label: Installation
---

To install, jus run:

```bash
$ npm install mercurio-lives
```

or, with Yarn:

```bash
$ yarn add mercurio-lives
```

## Setup

Add the Babel plugin:

```javascript
...
plugins: [
  [
    'mercurio-lives/babel-mercurio-helmet',
    {
      "locales": ["pt", "en"], // (required) add here yout desired locales
      "filesOutput": "./src/mercurio/" // (optional, defaults to project's root) add here the output path for the generated files
    }
  ]
]
...
```

Add the Webpack (only works on webpack 4.x for now) plugin:

```javascript
const MercurioBoots = require('mercurio-lives/webpack-mercurio-boots')
plugins: [
  new MercurioBoots()
]
...
```
