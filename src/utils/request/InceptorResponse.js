import { Message } from 'element-ui'
import store from '@/store'
import Router from '@/router'

// 响应拦截
export const responseInceptor = async function (response) {
  if (response?.data?.Code) {
    response.data.Code = +response?.data?.Code
  }

  // 806: 客户端未认证
  if (response?.data?.Code === 806) {
    // 非权限获取API，需提示再跳转
    if (!response.config.url.includes('queryUserMenuPerms')) {
      Message.closeAll()
      Message.error(response.data.msg)
    }
    await store.dispatch('user/resetToken')
    setTimeout(() => {
      Router.replace('/login')
    }, 500)
    return
  }

  if (response.config.url.includes('/restcloud/sap/mm/zmm_vender_get')) {
    return response.data
  }

  if (response?.data?.Code === 401) {
    Message.error('登录已过期，请重新登录！')
    await store.dispatch('user/resetToken')
    setTimeout(() => {
      Router.replace('/login')
    }, 500)
    return
  }

  // 0: 正常请求
  if (response?.data?.Code !== 200) {
    Message.closeAll()
    Message.error(response.data.Message || '请求失败！')
  }
  return response.data
}

// 响应错误
export const responseErrorInceptor = async function (error) {
  Message.closeAll()

  if (error && error.response) {
    console.log('响应发生错误:::\n', error.response)
    switch (error.response.status) {
      case 401:
        Message.error('登录已过期，请重新登录！')
        await store.dispatch('user/resetToken')
        setTimeout(() => {
          Router.replace('/login')
        }, 500)
        break
      case 403:
        Message.error('没有权限访问此内容！')
        break
      case 404:
        Message.error('访问内容不存在！')
        break
      case 500:
        Message.error('服务器错误，请稍后再试！')
        break
      default:
        Message.error('系统异常，未获取到数据！')
    }
  } else {
    // 请求超时或者网络有问题
    if (error.message.includes('timeout')) {
      Message.error('请求超时！请检查网络是否正常')
    }

    if (error.message.includes('Network Error')) {
      Message.error('请检查网络是否正常')
    }
  }

  return Promise.reject(error)
}
