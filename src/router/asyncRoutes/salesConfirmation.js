import Layout from '@/layout'

export default {
  path: '/salesConfirmation',
  component: Layout,
  name: 'SalesConfirmation',
  redirect: { name: 'SalesConfirmation' },
  meta: {
    title: '销售确认列表',
    icon: 'tenantManage'
  },
  alwaysShow: true,
  children: [
    {
      path: 'salesConfirmation',
      component: () => import('@/views/salesConfirmation/salesConfirm'),
      name: 'SalesConfirmation',
      meta: {
        title: '销售确认'
      }
    },
    {
      path: 'shippingManagement',
      component: () => import('@/views/salesConfirmation/shippingManagement'),
      name: 'ShippingManagement',
      meta: {
        title: '发运管理'
      }
    },
  ]
}
