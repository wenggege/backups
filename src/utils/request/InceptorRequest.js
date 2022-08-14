import store from '@/store'
import Router from '@/router'
import { Message } from 'element-ui'
import { checkDataType } from '@/utils'

export const requestInceptor = function (config = {}) {
  const token = store.getters.token ?? ''
  const commonHeader = {
    Authorization: token
  }
  if (token) { // ...
    config.headers = {
      ...config.headers,
      ...commonHeader
    }
  }

  // let authInfo = localStorage.getItem('LOCAL_OPERATIONS_AUTH')
  // if (!authInfo) {
  //   Router.replace('/login')
  // } else {
  //   try {
  //     authInfo = JSON.parse(authInfo)
  //     authInfo = checkDataType(authInfo) === 'Object' ? authInfo : {}
  //   } catch (err) {
  //     authInfo = {}
  //   }
  //   if (!authInfo.token || authInfo.token !== token) {
  //     Message.error('登录信息有误')
  //     Router.replace('/login')
  //     return false
  //   }
  // }

  return config
}

export const requestErrorInceptor = function (error) {
  // 请求错误
  // 对请求错误做些什么
  console.log('请求发生错误')
  console.log(error)
  return Promise.reject(error)
}
