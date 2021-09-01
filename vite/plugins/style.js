import styleImport from 'vite-plugin-style-import'

export function configStyleImportPlugin (isBuild) {
  if (!isBuild) return []
  return styleImport({
    libs: []
  })
}
