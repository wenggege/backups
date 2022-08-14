import { mapGetters } from 'vuex'

export default {
  data () {
    return {
      fullPageLoading: null
    }
  },
  computed: {
    ...mapGetters([
      'token', // TOKEN
      'username', // 用户名
      'userId'
    ]),
    // 页面标题
    pageTitle () {
      return this.$route.meta?.title || ''
    },
    // 所有下拉框配置项
    allSelectDict () {
      return this.$store.getters.allSelectDict || {}
    },
    allPersonDict () {
      return this.$store.getters.allPersonDict || []
    }
  },
  methods: {
    // 获取全局枚举配置
    getAllConfig () {
      if (this.token) {
        this.$store.dispatch('enums/getAllSelectDict') // 枚举配置下拉选项
      }
    },
    loadingShow (param) {
      const { target, fullscreen } = param || {}
      this.fullPageLoading = this.$loading({
        lock: true,
        // text: 'Loading',
        // spinner: 'el-icon-loading',
        // background: 'rgba(0, 0, 0, 0.7)',
        target: document.querySelector(target),
        fullscreen: fullscreen || ''
      })
      setTimeout(() => {
        this.fullPageLoading && this.fullPageLoading.close()
      }, 60000)
      return this.fullPageLoading
    },
    loadingHide () {
      this.fullPageLoading && this.fullPageLoading.close()
    },

    // 获取列表项对应枚举值
    getCellEnumValue (arr, val) {
      if (val === '' || val === null || val === undefined) {
        return ''
      } else {
        const obj = arr?.find(item => item.value + '' === val + '') || {}
        return obj.label ?? ''
      }
    },
    // 获取英文名称
    getCellEnumEnValue (arr, val) {
      if (val === '' || val === null || val === undefined) {
        return ''
      } else {
        const obj = arr?.find(item => item.value + '' === val + '') || {}
        return obj.enLabel ?? ''
      }
    },
    // 获取文件完整路径
    getFileFullPath (path) {
      if (path) {
        return /^http(s)?:/gi.test(path) ? path : process.env.VUE_APP_BASE_DW + path
      } else {
        return ''
      }
    },
    // 文件统一下载
    fileDownload (url, fileName = '') {
      const link = document.createElement('a')
      link.download = fileName || this.$moment().format('YYYY-MM-DD HH:mm:ss')
      link.style.display = 'none'
      link.target = '_blank'
      link.href = this.getFileFullPath(url)
      document.body.appendChild(link)
      link.click()
      URL.revokeObjectURL(link.href)
      document.body.removeChild(link)
    }
  }
}
