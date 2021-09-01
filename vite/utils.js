import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

// 开发环境
export function isDev (mode) {
  return mode === 'development'
}

// 生产环境
export function isProd (mode) {
  return mode === 'production'
}

// 打包分析
export function isReport () {
  return process.env.REPORT === 'true'
}

/**
 * @description frameEnv return ret
 * {
 *    VITE_PORT: 3001,
 *    VITE_PUBLIC_PATH: '/',
 *    VITE_USE_CDN: true,
 *    VITE_DROP_CONSOLE: true,
 *    VITE_BUILD_COMPRESS: true,
 * }
 */

/**
 * @description 读取环境变量
 * @param envConf
 * @return {Object}
 */
export function frameEnv (envConf) {
  const ret = {}

  // 遍历所有的key
  for (const envName of Object.keys(envConf)) {
    let realName = envConf[envName].replace(/\\n/g, '\n')
    realName = realName === 'true' ? true : realName === 'false' ? false : realName
    if (envName === 'VITE_PORT') realName = Number(realName)
    if (envName === 'VITE_PROXY') {
      try {
        realName = JSON.parse(realName)
      } catch (e) {
        console.log(e)
      }
    }
    ret[envName] = realName
    process.env[envName] = realName
  }

  return ret
}

/**
 * @description 获取以指定前缀开头的环境变量
 * @param match
 * @param confFiles
 * @returns {{}}
 */
export function getEnvConfig (match = 'VITE_GLOB_', confFiles = ['.env', '.env.production']) {
  let envConfig = {}
  confFiles.forEach((item) => {
    try {
      const env = dotenv.parse(fs.readFileSync(path.resolve(process.cwd(), item)))
      envConfig = { ...envConfig, ...env }
    } catch (error) {
    }
  })

  Object.keys(envConfig).forEach((key) => {
    const reg = new RegExp(`^(${match})`)
    if (!reg.test(key)) {
      Reflect.deleteProperty(envConfig, key)
    }
  })

  return envConfig
}

/**
 * @description 获取用户目录地址
 * @param dir
 * @returns {string}
 */
export function getRootPath (...dir) {
  return path.resolve(process.cwd(), ...dir)
}
