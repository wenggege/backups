import Vue from 'vue'

const defaultSelect = Vue.directive('defaultSelect', {
  componentUpdated (el, bindings, vnode) {
    if (bindings.value.length === 0) return
    const [values, options, prop, defaultValue] = bindings.value
    // 需要隐藏的标签索引
    const indexs = []
    if (values === null) return
    const tempData = values.map(a => options.find(op => op[prop] === a))
    if (tempData[0] === undefined) return
    tempData.forEach((a, index) => {
      if (defaultValue.indexOf(a[prop]) !== -1) {
        indexs.push(index)
      }
    })

    const dealStyle = function (tags) {
      tags.forEach((el, index) => {
        if (indexs.includes(index) && ![...el.classList].includes('select-tag-close-none')) {
          el.classList.add('none')
        }
      })
    }
    // 设置样式 隐藏close icon
    const tags = el.querySelectorAll('.el-tag__close')
    if (tags.length === 0) {
      // 初始化tags为空处理
      setTimeout(() => {
        const tagTemp = el.querySelectorAll('.el-tag__close')
        dealStyle(tagTemp)
      })
    } else {
      dealStyle(tags)
    }
  }
})

export { defaultSelect }
