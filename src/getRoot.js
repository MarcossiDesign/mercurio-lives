import p from 'path'

export default () => {
  let relativePath = p.join(p.sep, process.cwd())
  if (process.platform === 'win32') {
    const { name } = p.parse(process.cwd())
    if (relativePath.includes(name)) {
      relativePath = relativePath.slice(relativePath.indexOf(name) + name.length)
    }
  }
  return relativePath
}
