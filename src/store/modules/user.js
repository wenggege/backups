import { logout } from '@/api/user'
import { getToKenByDomainId } from '@/api/logImportSystem'
import { resetRouter } from '@/router'
import { checkDataType } from '@/utils'
import axios from 'axios'

const baseUrl = process.env.VUE_APP_BASE_API2
const getDefaultState = () => {
  return {
    // 基本信息
    token: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJEb21haW5JZCI6InBvcnRvblxcanUudGFuZyIsIk5hbWUiOiLllJDoj4oiLCJFbXBObyI6IlBUMTQ3MTAiLCJEdHBObyI6IiIsIkR0cE5hbWUiOiLmlbDmja7liJvmlrDpg6gtSVRCUC3ov5DokKXkuI7noJTlj5Hnu4QiLCJleHAiOjE2NTg3OTg4NDUsImlzcyI6IlNQQ1AuUEpNIn0.8a3bFUgkRImkZrzyFsew0vrqGGYAhfPgv6_DvUxE7e8',
    userId: '',
    username: '张莫某',
    headUrl: '',
    roleName: '管理员1',
    // 权限码
    permissions: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_USERINFO: (state, userInfo) => {
    if (checkDataType(userInfo) !== 'Object') {
      return false
    }
    for (const key in userInfo) {
      if (key in state) {
        state[key] = userInfo[key]
      }
    }
  }
}

const actions = {
  // set user info
  setUserInfo ({ commit, state }, data) {
    // 获取本地存储用户信息
    let localInfo = localStorage.getItem('LOCAL_AUTH')
    try {
      localInfo = JSON.parse(localInfo)
      localInfo = checkDataType(localInfo) === 'Object' ? localInfo : {}
    } catch (err) {
      localInfo = {}
    }

    // 来源于登录更新，特殊标记
    const isLogin = !!data._isLogin
    delete data._isLogin
    let curInfo = null
    if (!isLogin) {
      curInfo = JSON.parse(JSON.stringify(state))
      delete curInfo.permissions
    }
    const userInfo = Object.assign({}, localInfo, curInfo, data)
    localStorage.setItem('LOCAL_AUTH', JSON.stringify(userInfo))

    return new Promise((resolve, reject) => {
      commit('SET_USERINFO', userInfo)
      resolve()
    })
  },
  getUserToken ({ commit, dispatch }, DomainId) {
    return new Promise((resolve, reject) => {
      axios.get(`${baseUrl}/Authentication/GetToKenByDomainId?DomainId=${DomainId}`).then((res) => {
        if (res.data?.Code === 200) {
          const token = 'Bearer ' + res.data.Data
          commit('SET_USERINFO', { token })
          dispatch('enums/getAllSelectDict', null, { root: true }) // 处理下拉列表
          dispatch('enums/getUserTree', null, { root: true })
          resolve()
        } else {
          reject(res)
        }
      }).catch(error => {
        reject(error)
      })
      // getToKenByDomainId({ DomainId }).then((res) => {
      //   if (res?.Code === 200) {
      //     const token = 'Bearer ' + res.Data
      //     commit('SET_USERINFO', { token })
      //     dispatch('enums/getAllSelectDict', null, { root: true }) // 处理下拉列表
      //     dispatch('enums/getUserTree', null, { root: true })
      //     resolve()
      //   } else {
      //     reject(res)
      //   }
      // }).catch(error => {
      //   reject(error)
      // })
    })
  },
  //
  getUserPerms ({ commit }) {
    return new Promise((resolve, reject) => {
      const permissions = {}
      commit('SET_USERINFO', { permissions })
      resolve()
    })
  },
  // 退出登录
  logout ({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        localStorage.removeItem('LOCAL_AUTH')
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // remove token
  resetToken ({ commit }) {
    return new Promise(resolve => {
      localStorage.removeItem('LOCAL_AUTH')
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
