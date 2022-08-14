import Layout from '@/layout'

export default {
  path: '/negotiationInvoice',
  component: Layout,
  name: 'NegotiationInvoice',
  redirect: { name: 'NegotiationInvoice' },
  meta: {
    title: '议付开票',
    icon: 'tenantManage'
  },
  alwaysShow: true,
  children: [
    {
      path: 'negotiationInvoice',
      component: () => import('@/views/negotiationInvoice/invoiceApplication'),
      name: 'NegotiationInvoice',
      meta: {
        title: '发票申请'
      },
    },
    {
      path: 'invoiceApplicationDetail/:Id',
      component: () => import('@/views/negotiationInvoice/invoiceApplication/invoiceApplicationDetail'),
      name: 'InvoiceApplicationDetail',
      // hidden: true,
      meta: {
        title: '发票申请详情'
      },
    },
    {
      path: 'negotiationInvoiceList',
      component: () => import('@/views/negotiationInvoice/invoiceList'),
      name: 'NegotiationInvoiceList',
      meta: {
        title: '发票列表'
      }
    },
    // {
    //   path: 'logsNewAdd',
    //   component: () => import('@/views/logImportSystem/allAttempt/newAdd'),
    //   name: 'LogsNewAdd',
    //   hidden: true,
    //   meta: {
    //     title: '新增'
    //   }
    // },
  ]
}
