/**
 * 生成 /src/index.js
 *  1、自动导入组件库所有组件
 *  2、定义全量注册组件库组件的 install 方法
 *  3、导出版本、install、各个组件
 */
// fs系统模块
const fs = require('fs')
// path模块
const path = require('path')
// 负责将 comp-name 形式的字符串转换为 CompName
const upperCamelcase = require('uppercamelcase')

//  key 为包名、路径为值
const Components = require('../config/components.json')

// 模版库
const render = require('json-templater/string')
// const path = require('path')
// 末尾追加行
const endOfLine = require('os').EOL

// 输出 src/index.js
const OUTPUT_PATH = path.join(__dirname, '../config/index.js')
// 导入模版，import CompName from '../packages/comp-name/index.js'
const IMPORT_TEMPLATE = "import {{name}} from '../packages/{{package}}/index.js'"
// ' CompName'
const INSTALL_COMPONENT_TEMPLATE = '  {{name}}'
// /src/index.js 的模版
const MAIN_TEMPLATE = `{{include}}

const components = [
{{install}}
]

const install = function (Vue) {
  // 判断是否安装
  if (install.installed) {
    return
  }
  components.forEach(component => {
    Vue.component(component.name, component)
  })
}

/* istanbul ignore if */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue)
}

export default {
  version: '{{version}}',
  install,
{{list}}
}
`

// delete Components.font
// 得到所有的包名，[comp-name1, comp-name2]
const ComponentNames = Object.keys(Components)
// 存放所有的 import 语句
const includeComponentTemplate = []
// 组件名数组
const installTemplate = []
// 组件名数组
const listTemplate = []

ComponentNames.forEach((name) => {
  if (name === 'index') return
  // 将连字符格式的包名转换成大驼峰形式，就是组件名，比如 form-item =》 FormItem
  const componentName = upperCamelcase(name)
  // 替换导入语句中的模版变量，生成导入语句，import FromItem from '../packages/form-item/index.js'
  includeComponentTemplate.push(
    render(IMPORT_TEMPLATE, {
      name: componentName,
      package: name
    })
  )
  // 这些组件从 components 数组中剔除，不需要全局注册，采用挂载到原型链的方式，在模版字符串的 install 方法中有写
  installTemplate.push(
    render(INSTALL_COMPONENT_TEMPLATE, {
      name: componentName,
      component: name
    })
  )
  //  将所有的组件放到 listTemplates，最后导出
  listTemplate.push(`  ${componentName}`)
})

// 替换模版中的四个变量
const template = render(MAIN_TEMPLATE, {
  include: includeComponentTemplate.join(endOfLine),
  install: installTemplate.join(',' + endOfLine),
  version: process.env.VERSION || require('../package.json').version,
  list: listTemplate.join(',' + endOfLine)
})

fs.writeFileSync(OUTPUT_PATH, template)
console.log('[build entry] DONE:', OUTPUT_PATH)
