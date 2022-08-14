import logImportSystem from './logImportSystem'
import salesConfirmation from './salesConfirmation'
import negotiationInvoice from './negotiationInvoice'

export const asyncRoutes = [
  logImportSystem,
  salesConfirmation,
  negotiationInvoice,
  // 兜底路由：只能动态加入，否则在动态路由下刷新会优先匹配到它
  {
    path: '*',
    redirect: '/404',
    hidden: true
  }
]
