import { createVuePlugin } from 'vite-plugin-vue2'
import ViteComponents from 'vite-plugin-components'
import legacy from '@vitejs/plugin-legacy'
import vueJsx from '@vitejs/plugin-vue-jsx'

import { configHmrPlugin } from './hmr'
import { configHtmlPlugin } from './html'
import { configStyleImportPlugin } from './style'
import { configVisualizerConfig } from './visualizer'
// import { configImageminPlugin } from './image'
import { configCompressPlugin } from './compress'

/**
 * @description 生成vite plugin
 * @param viteEnv
 * @param isBuild { boolean }
 */
export function createVitePlugins (viteEnv, isBuild) {
  const {
    // VITE_USE_IMAGEMIN,
    VITE_LEGACY,
    VITE_BUILD_COMPRESS,
    VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE
  } = viteEnv
  const vitePlugins = [
    createVuePlugin({
      jsx: false,
      jsxOptions: {
        vModel: true,
        compositionAPI: false
      }
    }),
    ViteComponents({ transformer: 'vue2' }),
    vueJsx()
  ]
  !isBuild && vitePlugins.push(configHmrPlugin())
  VITE_LEGACY && isBuild && vitePlugins.push(legacy())
  vitePlugins.push(...configHtmlPlugin(viteEnv, isBuild))
  vitePlugins.push(configStyleImportPlugin(isBuild))
  vitePlugins.push(configVisualizerConfig())

  if (isBuild) {
    // VITE_USE_IMAGEMIN && vitePlugins.push(configImageminPlugin())
    vitePlugins.push(configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE))
  }

  return vitePlugins
}
