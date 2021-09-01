const vue = require('rollup-plugin-vue')
const json = require('@rollup/plugin-json')
const alias = require('@rollup/plugin-alias')
const commonjs = require('@rollup/plugin-commonjs')
const replace = require('@rollup/plugin-replace')
const filesize = require('rollup-plugin-filesize')
const { babel } = require('@rollup/plugin-babel')
const { nodeResolve } = require('@rollup/plugin-node-resolve')
const { terser } = require('rollup-plugin-terser')
const postcss = require('rollup-plugin-postcss')
const config = require('./config')

const exclude = 'node_modules/**'

/**
 * @description 生成rollup中的plugins 配置选项
 * @param min
 */
function generatePlugins ({ min } = {}) {
  const plugins = [
    nodeResolve({
      extensions: config.resolve
    }),
    commonjs(),
    vue({
      css: false
    }),
    babel({
      babelHelpers: 'runtime',
      exclude
    }),
    json(),
    replace({
      exclude,
      preventAssignment: true,
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
    }),
    alias({
      entries: Object.entries(config.alias).map(([key, value]) => {
        return { find: key, replacement: value }
      }),
      resolve: config.resolve
    }),
    postcss({
      inject: false,
      extensions: ['.css', '.scss'],
      extract: true,
      minimize: true,
      sourceMap: false
    }),
    filesize()
  ]
  if (min) {
    plugins.concat(terser())
  }

  return plugins
}

module.exports = generatePlugins
