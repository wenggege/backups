import request from '@/utils/request/index'
import download from '@/utils/request/download'
// const BASE_URL1 = process.env.VUE_APP_BASE_API
// const BASE_URL2 = process.env.VUE_APP_BASE_API2

/**
 * @description  获取发票申请列表信息
 */
export function getApplylist (param) {
  return request.get('/api/invoice/applylist', param)
}

