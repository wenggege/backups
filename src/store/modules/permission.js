import { constantRoutes } from '@/router'
import { asyncRoutes } from '@/router/asyncRoutes'
import { canI } from '../index'

/**
 * Use meta.authCode to determine if the current user has permission
 * @param route
 */
function hasPermission (route) {
  if (route.meta && route.meta.authCode) {
    return canI(route.meta.authCode)
  } else {
    return true
  }
}

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 */
export function filterAsyncRoutes (routes) {
  const res = []
  routes.forEach(route => {
    const tmp = { ...route }
    if (hasPermission(tmp)) {
      if (tmp.children) {
        tmp.children = filterAsyncRoutes(tmp.children)
      }
      const HAS_CHILDREN = Array.isArray(tmp.children) && tmp.children.length
      const AVAILABLE = HAS_CHILDREN || !tmp.children
      AVAILABLE && res.push(tmp)
    }
  })

  return res
}

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

const actions = {
  generateRoutes ({ commit }) {
    return new Promise(resolve => {
      const accessedRoutes = filterAsyncRoutes(asyncRoutes)
      commit('SET_ROUTES', accessedRoutes)
      resolve(accessedRoutes)
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
