const { pathResolve } = require('./rollup.common')

module.exports = {
  resolve: ['.js', '.ts', '.vue', '.json'],
  alias: {
    '@': pathResolve('../src'),
    packages: pathResolve('../packages'),
    example: pathResolve('../examples')
  },
  formatBuildType: [
    // { format: 'cjs', min: false, suffix: '.js' },
    // { format: 'cjs', min: true, suffix: '.min.js' },
    // { format: 'iife', min: true, suffix: '.min.js' },
    { format: 'umd', min: true, suffix: '.umd.js' },
    // { format: 'umd', min: true, suffix: '.umd.min.js' }
    { format: 'es', min: true, suffix: '.js' }
    // { format: 'es', min: true, suffix: '.es.min.js' },
  ],
  // addons: [
  //   {
  //     min: false,
  //     format: 'es',
  //     suffix: '.js',
  //     input: 'src/index.js',
  //     output: 'index'
  //   },
  //   {
  //     min: false,
  //     format: 'cjs',
  //     suffix: '.js',
  //     input: 'src/index.js',
  //     output: 'index'
  //   }
  // ],
  banner: ' /** 此项目仅为福生佳信所有，禁止一切侵权行为 */ \n ',
  footer: '/** copyright 2021 */'
}
