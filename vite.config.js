import { resolve } from 'path'

import { loadEnv } from 'vite'

import postcssImport from 'postcss-import'
import autoprefixer from 'autoprefixer'

import dayjs from 'dayjs'

import { createProxy } from './vite/proxy'
import { frameEnv } from './vite/utils'
import pkg from './package.json'
import { OUTPUT_DIR } from './vite/constants'
import { createVitePlugins } from './vite/plugins'

const { dependencies, devDependencies, name, version } = pkg

const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: dayjs().format('YYYY-MM-DD hh:mm:ss')
}

/**
 * @description vite config
 * @param command { 'serve' | 'build' }
 * @param mode { string }
 * @returns {{server: {proxy, port, host: boolean, open: boolean}, css: {preprocessorOptions: {scss: {}}, postcss: {plugins: ((function(*=): {postcssPlugin: string, Once(*=, {result?: *, atRule: *, postcss?: *}): Promise<void>})|*)[]}}, resolve: {alias: {'@': string}}, build: {terserOptions: {compress: {drop_console, keep_infinity: boolean}}, brotliSize: boolean, chunkSizeWarningLimit: number, target: string, outDir: string}, plugins: [Plugin, Plugin], root: string, define: {__APP_INFO__: string}, base}}
 */
export default ({ command, mode }) => {
  const root = process.cwd()
  // 家在环境变零
  const env = loadEnv(mode, root)
  const viteEnv = frameEnv(env)
  const { VITE_PORT, VITE_PUBLIC_PATH, VITE_PROXY, VITE_DROP_CONSOLE } = viteEnv
  const isBuild = command === 'build'

  return {
    root,
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: {
        '@': `${resolve(__dirname, 'src')}`
      }
    },
    server: {
      host: true,
      port: VITE_PORT,
      open: true,
      proxy: createProxy(VITE_PROXY)
    },
    build: {
      target: 'es2015',
      outDir: OUTPUT_DIR,
      terserOptions: {
        compress: {
          keep_infinity: true,
          // 生产环境删除console
          drop_console: VITE_DROP_CONSOLE
        }
      },
      // 关闭brotliSize显示器可以稍微缩短包装时间
      brotliSize: false,
      chunkSizeWarningLimit: 2000
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__)
    },
    css: {
      postcss: {
        plugins: [
          postcssImport,
          autoprefixer
        ]
      },
      preprocessorOptions: {
        scss: {}
      }
    },
    plugins: createVitePlugins(viteEnv, isBuild)
  }
}
