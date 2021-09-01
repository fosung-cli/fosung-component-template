const fs = require('fs')
const chalk = require('chalk')
const { formatBuildType } = require('./config')
const { styleOutputPath } = require('./rollup.base')
const { getAssetsPath, pathResolve } = require('./rollup.common')
const Components = require('../config/components.json')
const rollupBuild = require('./rollup.entry')

// 同步地创建目录
fs.mkdirSync(pathResolve())
// 同步地创建目录
fs.mkdirSync(getAssetsPath(styleOutputPath))

const packages = []

formatBuildType.forEach(({ format, min, suffix } = {}) => {
  Object.entries(Components).forEach((moduleName) => {
    const [key, value] = moduleName
    packages.push({ min, format, suffix, moduleName: key, input: value, output: key })
  })
})

rollupBuild(packages).then(() => {
  console.log(chalk.green.bgGreen.bold.red('===============全部打包完成=============='))
})
