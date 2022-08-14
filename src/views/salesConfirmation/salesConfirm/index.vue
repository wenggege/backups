<template>
  <div class="container">
    销售确认
    <!-- <form-search :form="form.props" :items="form.items" :values.sync="form.values" @reset="handleReset" @search="handleFormSearch" /> -->
  </div>
</template>

<script>
export default {
  name: "SalesConfirmation",
  components: {
  },
  data () {
    return {
      form: {
        props: {
          labelWidth: '110px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        items: [
          {
            name: 'BusinessCode',
            label: '销售订单',
            type: 'input',
            //span:4
          },
          {
            name: 'ProductChiName',
            label: '交货单号',
            type: 'input',
          },
          {
            name: 'CustomsClearanceNumber',
            label: '发票号',
            type: 'input'
          },
          {
            name: 'sendTime',
            label: '创建时间',
            type: 'date',
            paramItems: {
              type: 'date',
              //format: 'yyyy-MM-ddTHH:mm:ss'
            }
          },
          {
            name: 'UnitId',
            label: '文件状态',
            type: 'select',
            paramItems: []
          },
          {
            name: 'Status',
            label: '状态',
            type: 'select',
            paramItems: []
          },
        ],
        values: {
          BusinessCode: '',
          ProductChiName: '',         
          CustomsClearanceNumber: '',
          sendTime: '',
          UnitId: '',
          Status: '',
        }
      },
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
  padding: 0 !important;
  overflow-y: hidden;
}
</style>