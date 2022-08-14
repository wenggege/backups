import Layout from '@/layout'

export default {
  path: '/logImportSystem',
  component: Layout,
  name: 'LogImportSystem',
  redirect: { name: 'LogsImportSystem' },
  meta: {
    title: '进口管理列表',
    icon: 'tenantManage'
  },
  alwaysShow: true,
  children: [
    {
      path: 'logsImportSystem',
      component: () => import('@/views/logImportSystem/allAttempt'),
      name: 'LogsImportSystem',
      meta: {
        title: '进口管理列表'
      }
    },
    {
      path: 'logsNewAdd',
      component: () => import('@/views/logImportSystem/allAttempt/newAdd'),
      name: 'LogsNewAdd',
      hidden: true,
      meta: {
        title: '新增'
      }
    },
    {
      path: 'orderTaking',
      component: () => import('@/views/logImportSystem/allAttempt/orderTaking'),
      name: 'OrderTaking',
      hidden: true,
      meta: {
        title: '接单'
      }
    },
    {
      path: 'logisticsTracking',
      component: () => import('@/views/logImportSystem/allAttempt/logisticsTracking'),
      name: 'LogisticsTracking',
      hidden: true,
      meta: {
        title: '物流跟踪'
      }
    },
    {
      path: 'editOrderTaking',
      component: () => import('@/views/logImportSystem/allAttempt/orderTaking'),
      name: 'EditOrderTaking',
      hidden: true,
      meta: {
        title: '编辑'
      }
    },
    {
      path: 'detailsImport/:Id',
      component: () => import('@/views/logImportSystem/allAttempt/detailsInfo'),
      name: 'DetailsImport',
      hidden: true,
      meta: {
        title: '详情'
      }
    }
  ]
}
