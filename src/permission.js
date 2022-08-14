import router from './router'
import store from './store'
import { checkDataType } from '@/utils'
import { Loading } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import getPageTitle from '@/utils/get-page-title'

// NProgress Configuration
NProgress.configure({ showSpinner: false })

// no redirect whitelist (route name)
const whiteList = ['Login', 'LogsImportSystem']

router.beforeEach(async (to, from, next) => {
  NProgress.start()
  // set page title
  document.title = getPageTitle(to.meta.title)
  // 白名单直接跳转
  if (whiteList.includes(to.name)) {
    next()
  } else {
    let authInfo = localStorage.getItem('LOCAL_OPERATIONS_AUTH')
    try {
      authInfo = JSON.parse(authInfo)
      authInfo = checkDataType(authInfo) === 'Object' ? authInfo : {}
    } catch (err) {
      authInfo = {}
    }

    // 未获取到内存中token
    if (!store.getters.token) {
      const token = authInfo?.token ?? ''
      // url里未携带token
      // if (!token && !whiteList.includes(from.name)) {
      //   const slocation = window.location.search
      //   if (!slocation.includes('domainid')) {
      //     window.location.href = process.env.VUE_APP_REDIRECTURL
      //   } else {
      //     await store.dispatch('user/getUserToken', slocation.split('domainid=')[1])
      //     next({ name: 'Login' })
      //   }
       next({ name: 'Login' })
      // }

      if (token) {
        await store.commit('user/SET_USERINFO', authInfo)
      }
    }

    const IS_LOGIN = !!store.getters.permissions
    console.log('IS_LOGIN:::', IS_LOGIN)
    // 当前已获得token 未获取客户使用权限
    if (!IS_LOGIN) {
      const loadingInstance = Loading.service({
        // text: 'Loading',
        // spinner: 'el-icon-loading',
        // background: 'rgba(0, 0, 0, 0.7)'
      })
      let accessRoutes
      await store.dispatch('user/getUserPerms').then(async () => {
        accessRoutes = await store.dispatch('permission/generateRoutes')
        await router.addRoutes(accessRoutes)

        if (!accessRoutes.length) {
          next({ name: 'Login' })
        } else {
          next({ ...to, replace: true })
        }
      }).catch(async (error) => {
        console.log('getUserPerms-error:::', error)
        await store.dispatch('user/resetToken')
        next({ name: 'Login' })
      }).finally(() => {
        loadingInstance.close()
        NProgress.done()
      })
    }

    // 重定向
    if (authInfo.redirectUrl) {
      const redirectUrl = authInfo.redirectUrl
      delete authInfo.redirectUrl
      localStorage.setItem('LOCAL_OPERATIONS_AUTH', JSON.stringify(authInfo))
      next({ path: redirectUrl })
    }

    next()
  }
})

router.afterEach(() => {
  NProgress.done()
})
