
import moment from 'moment'
import mixin from '../mixins/index' // 混入
import { canI } from '../store' // 菜单权限判断函数
import '../utils/directive/preventReClick' // 防多次点击，重复提交
import '../utils/directive/defaultSelect' // 隐藏下拉框
import '../assets/menu-icons' // 加载左侧菜单栏图标
import '../permission' // 路由权限判断

export default {
  install (Vue, options) {
    // 注册components目录下所有的组件
    const files = require.context('@/components', true, /\.vue$/)
    files.keys().forEach(componentName => {
      const componentEntity = files(componentName).default
      if (componentEntity.name) {
        const componentEntity = files(componentName).default
        // 使用内置的组件名称 进行全局组件注册
        Vue.component(componentEntity.name, componentEntity)
      }
    })
    Vue.prototype.$moment = moment
    Vue.prototype.canI = canI
    Vue.mixin(mixin)
  }
}
