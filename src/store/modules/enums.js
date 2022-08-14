
import { Message } from 'element-ui'
import enums from '@/utils/field-mapping'
import { getAllSelectDict, getUserTree } from '@/api/common'

const getDefaultState = () => {
  return {
    allSelectDict: '', // 所有下拉框配置项
    allPersonDict: '' // 公司所有人员信息
  }
}

const state = getDefaultState()

const mutations = {
  SET_ALL_SELECT_DICT (state, value) {
    state.allSelectDict = value
  },
  SET_ALL_PERSON_DICT (state, value) {
    state.allPersonDict = value
  }
}

const actions = {
  // 获取所有下拉配置项

  async getAllSelectDict ({ commit }) {
    const disctType = ['Currency', 'DemandDepartment', 'ExemptionWay', 'InternationalTradeTerms', 'ProductCategory',
      'ShippingAddress', 'ShippingMethod', 'SupervisionMethod', 'ImportAndExportStatus', 'PayStatus', 'invoice', 'PortOfEntry', 'TradingCountry']
    const dicts = { ...enums }
    try {
      disctType.forEach(async (type) => {
        const res = await getAllSelectDict({ code: type })
        if (res?.Code === 200 && res?.Data.length) {
          dicts[type] = res.Data.map((item) => {
            return {
              id: item.DataKey,
              label: item.DataName,
              value: item.DataKey,
              enLabel: item.DataEnName
            }
          })
        }
      })
      commit('SET_ALL_SELECT_DICT', dicts)
    } catch (e) {
      Message.error('获取全局配置失败，请刷新重新！')
    }
  },
  async getUserTree ({ commit }) {
    try {
      const res = await getUserTree()
      if (res?.Code === 200 && res?.Data.length) {
        commit('SET_ALL_PERSON_DICT', res.Data)
      } else {
        Message.error('获取人员信息失败，请刷新重新！')
      }
    } catch (e) {
      Message.error('获取人员信息失败，请刷新重新！')
    }
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
