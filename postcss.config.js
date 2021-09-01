const simpleVars = require('postcss-simple-vars')
const postcssImport = require('postcss-import')
const autoprefixer = require('autoprefixer')
const nested = require('postcss-nesting')
const cssnano = require('cssnano')

module.exports = {
  plugins: [
    simpleVars,
    postcssImport(),
    autoprefixer,
    nested(),
    cssnano({
      preset: 'default'
    })
  ]
}
