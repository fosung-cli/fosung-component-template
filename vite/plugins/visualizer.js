import visualizer from 'rollup-plugin-visualizer'
import { isReport } from '../utils'

export function configVisualizerConfig () {
  if (isReport()) {
    return visualizer({
      filename: './node_modules/.cache/visualizer/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })
  }
  return []
}
