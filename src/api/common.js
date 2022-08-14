import request from '@/utils/request/index'

/**
 * @description  通过字典编码获取所有字典信息(币别：Currency； 需求方：DemandDepartment； 针免方式：ExemptionWay； 国际贸易条件：InternationalTradeTerms； 产品类别：ProductCategory； 收货地址：ShippingAddress ；运输方式：ShippingMethod ；监管方式：SupervisionMethod)
 */
export function getAllSelectDict (param) {
  return request.get('/api/DictionariesService/GetList', param)
}

/**
 * @description  获取用户树结构
 */
export function getUserTree (param) {
  return request.get('/api/User/GetUserTree', param)
}
