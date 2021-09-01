const fs = require('fs')
const rollup = require('rollup')
const { banner, footer } = require('./config')
const { externalMap, styleOutputPath } = require('./rollup.base')
const { getAssetsPath, isEsModule, chalkConsole, fsExistsSync } = require('./rollup.common')
const generatePlugins = require('./rollup.plugins')

/**
 * @description 生成文件
 * @params output { code: 源码， type: 'chunk | assets ', source: 'Buffer'  }
 * @params file 输出文件地址 lib/index.js lib/ace-editor.umd.js
 * @params fileName 输出文件名称
 * @params format 文件格式
 * @params fullName 文件名称包含格式和扩展名
 * @returns {Promise<boolean>}
 */
async function generateFile ({ output, file, fileName, format, fullName } = {}) {
  for (const { type, code, source } of output) {
    if (type === 'asset') {
      const cssFileName = `${fileName}.css`
      const filePath = getAssetsPath(`/${styleOutputPath}/${cssFileName}`)
      !fsExistsSync(filePath) && fs.writeFileSync(filePath, banner + source.toString() + footer)
      return false
    } else {
      const filePath = isEsModule(format) ? getAssetsPath(`/${fullName}`) : file
      const codeSource = code && code.replace(/\s?const\s/g, ' var ')
      fs.writeFileSync(filePath, banner + codeSource + footer)
    }
  }
}
/**
 * @description 生成入口文件
 * @params output 文件输入入口
 * @params suffix 文件后缀
 * @params input 文件入口
 * @params format 生成包的格式
 * @params moduleName 模块名称
 */
async function generateEntry (config) {
  const { output, suffix, input, format, moduleName } = config
  const rollupOptions = {
    input,
    external: Object.keys(externalMap),
    plugins: generatePlugins(config)
  }
  const fullName = `${output}${suffix}`
  const file = getAssetsPath(fullName)

  const formatOptions = {
    file,
    format,
    name: moduleName,
    exports: 'auto',
    globals: externalMap
  }

  try {
    const build = await rollup.rollup(rollupOptions)
    const { output: outlet } = await build.generate(formatOptions)
    await generateFile({ output: outlet, fileName: output, format, fullName, file })
  } catch (e) {
    console.log(e)
  }
}

/**
 * @description 生成入口文件
 * @params output 文件输入入口
 * @params suffix 文件后缀
 * @params input 文件入口
 * @params format 生成包的格式
 * @params moduleName 模块名称
 */
async function rollupBuild (builds) {
  let buildCount = 0
  const total = builds.length
  const next = async () => {
    // 输出当前是第几个打包文件
    chalkConsole.building(buildCount + 1, total)
    // 等待打包
    await generateEntry(builds[buildCount])
    // 递增下一个打包文件
    buildCount++
    buildCount < total ? await next() : chalkConsole.success()
  }
  await next()
}

module.exports = rollupBuild
