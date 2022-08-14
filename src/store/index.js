import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import app from './modules/app'
import permission from './modules/permission'
import settings from './modules/settings'
import user from './modules/user'
import enums from './modules/enums'

export const canI = (funcCode) => {
  if (typeof funcCode === 'string' && !funcCode) return true
  if (user.state.permissions &&
    typeof funcCode === 'string' &&
    funcCode in user.state.permissions) {
    return true
  }
  return false
}

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: {
    app,
    permission,
    settings,
    user,
    enums
  },
  getters
})

export default store
