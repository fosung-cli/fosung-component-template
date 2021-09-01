const path = require('path')
const fs = require('fs')
const chalk = require('chalk')

const { packageOutputPath, esDir } = require('./rollup.base')

module.exports = {
  pathResolve: (_path) => _path ? path.resolve(__dirname, _path) : path.resolve(__dirname, '..', packageOutputPath),
  getAssetsPath: (_path = '.') => path.posix.join(packageOutputPath, _path),
  isEsModule: (fmt) => fmt === esDir,
  chalkConsole: {
    success: () => {
      console.log(chalk.green('========================================='))
      console.log(chalk.green('========打包成功(build success)!========='))
      console.log(chalk.green('========================================='))
    },
    building: (index, total) => {
      console.log(chalk.blue(`正在打包第${index}/${total}个文件...`))
    }
  },
  fsExistsSync: (_path) => {
    try {
      fs.accessSync(_path, fs.F_OK)
    } catch (e) {
      return false
    }
    return true
  }
}
