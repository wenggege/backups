<template>
  <div class="all-attempt">
    <field-set :title=viewDesc :showCollapse="true" :collapse="false" :borderBottom="true">
      <div slot="right" class="field-right">
        <el-select v-model="viewType" placeholder="请选择" @change="handleView">
          <el-option v-for="item in VIEW_TYPE" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div slot="collapse">
        <form-search :form="form.props" :items="form.items" :values.sync="form.values" @reset="handleReset"
          @search="handleFormSearch" />
      </div>
    </field-set>
    <table-handle :buttons="buttons" />

    <table-list :columns="table.columns" :data="table.data" :paging.sync="table.paging" @refresh="handleSearch">
      <template #operation="{ row }">
        <table-button :list="getButtons(row)" />
      </template>
    </table-list>
  </div>
</template>

<script>
import { checkDataType } from '@/utils'

import { importAllGetList, pendingGetList, getExport } from '@/api/logImportSystem'
export default {
  name: 'AllAttempt',
  data () {
    return {
      viewDesc: '所有试图',
      viewType: 1,
      form: {
        props: {
          labelWidth: '110px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        items: [
          {
            name: 'BusinessCode',
            label: '业务编号',
            type: 'input',
            props: {
              maxlength: 16
            }
          },
          {
            name: 'ProductChiName',
            label: '产品中文名称',
            type: 'input'
          },
          {
            name: 'ProductType',
            label: '产品类别',
            type: 'select',
            paramItems: []
          },
          {
            name: 'Status',
            label: '状态',
            type: 'select',
            paramItems: []
          },
          {
            name: 'CustomsClearanceNumber',
            label: '报关单号',
            type: 'input'
          },
          {
            name: 'BP',
            label: '物流BP',
            type: 'input'
          },
          {
            name: 'OP',
            label: '物流OP',
            type: 'input'
          },
          {
            name: 'WayBillNumber',
            label: '运单号',
            type: 'input'
          },
          {
            name: 'UnitId',
            label: '需求单位',
            type: 'select',
            paramItems: []
          },
          {
            name: 'sendTime',
            label: '送达时间',
            type: 'date',
            paramItems: {
              type: 'daterange'
            }
          },
          {
            name: 'ProductCode',
            label: '产品代码',
            type: 'input'
          }
        ],
        values: {
          BusinessCode: '',
          ProductChiName: '',
          ProductType: '',
          Status: '',
          CustomsClearanceNumber: '',
          BP: '',
          OP: '',
          WayBillNumber: '',
          UnitId: '',
          sendTime: '',
          StartDeliveryTime: '',
          EndDeliveryTime: '',
          ProductCode: ''
        }
      },
      buttons: [
        {
          type: 'primary',
          icon: 'el-icon-circle-plus-outline',
          label: '新增',
          onClick: () => {
            this.$router.push({ name: 'LogsNewAdd', params: { status: 'NEWADD' } })
          }
        },
        {
          type: '',
          icon: 'el-icon-download',
          label: '导出',
          onClick: () => {
            this.handleExport()
          }
        }
      ],
      table: {
        props: {
          // height: "calc(100vh - 420px)",
        },
        columns: [
          {
            prop: 'BusinessCode',
            label: '业务编号',
            minWidth: '140'
          },
          {
            prop: 'ProductChiNames',
            label: '产品中文名称',
            minWidth: '150'
          },
          {
            prop: 'ProjectCode',
            label: '产品代码',
            minWidth: '120'
          },
          {
            prop: 'ProductTypeName',
            label: '产品类别',
            minWidth: '120'
          },
          {
            prop: 'CustomsClearanceNumber',
            label: '报关单号',
            width: '120'
          },
          {
            prop: 'WayBillNumber',
            label: '运单号',
            minWidth: '120'
          },
          {
            prop: 'DemandDepartmentName',
            label: '需求单位',
            minWidth: '120'
          },
          {
            prop: 'BP',
            label: '物流BP',
            minWidth: '120'
          },
          {
            prop: 'OP',
            label: '物流OP',
            minWidth: '120'
          },
          {
            prop: 'CommodityCode',
            label: '商品编码',
            minWidth: '120'
          },
          {
            prop: 'DeclareTime',
            label: '申报日期',
            minWidth: '120'
          },
          {
            prop: 'ShippingMethodCode',
            label: '海关商品编码',
            minWidth: '120'
          },
          {
            prop: 'ExpecteArriveTime',
            label: '送达时间',
            minWidth: '120',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD') }
            }
          },
          {
            prop: 'Status',
            label: '状态',
            minWidth: '120',
            formatter: ({ cellValue }) => {
              return this.getCellEnumValue(this.ORDER_STATUS, cellValue)
            }
          },
          {
            type: 'slot',
            prop: 'operation',
            label: '操作',
            width: '180',
            fixed: 'right'
          }
        ],
        data: [],
        paging: {
          Total: 0,
          PageSize: 10,
          PageIndex: 1
        }
      }
    }
  },
  computed: {
    ORDER_STATUS () {
      return this.allSelectDict.ImportAndExportStatus || []
    },
    VIEW_TYPE () {
      return this.allSelectDict.VIEW_TYPE || []
    }
  },
  watch: {
    allSelectDict: {
      handler (val) {
        if (Object.keys(val).length) {
          this.form.items.forEach((item) => {
            if (item.name === 'ProductType') {
              item.paramItems = val.ProductCategory || []
            }
            if (item.name === 'Status') {
              item.paramItems = val.ImportAndExportStatus || []
            }
            if (item.name === 'UnitId') {
              item.paramItems = val.DemandDepartment || []
            }
          })
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {

    getButtons (row) {
      const btns = []
      if (row.Status === 1) { // 待接单
        btns.push({
          type: 'primary',
          label: '接单',
          icon: '',
          id: 'btnOrder',
          onClick: () => {
            this.$router.push({ name: 'OrderTaking', params: { status: 'TAKING', Id: row.Id } })
          }
        })
      } else if (row.Status === 2) { // 已驳回
        btns.push({
          type: 'primary',
          label: '编辑',
          icon: '',
          id: 'btnEdit',
          onClick: () => {
            this.$router.push({ name: 'EditOrderTaking', params: { status: 'INFOEDIT', Id: row.Id } })
          }
        })
      } else { // 已接单 已到港 已送到 已报税 已报销
        btns.push({
          type: 'primary',
          label: '物流跟踪',
          icon: '',
          id: 'btnLogis',
          onClick: () => {
            this.$router.push({ name: 'LogisticsTracking', params: { status: 'LOGIS', Id: row.Id } })
          }
        })
      }
      btns.push({
        type: '',
        label: '详情',
        icon: '',
        id: 'btnDetail',
        onClick: () => {
          // this.$router.push({ name: 'DetailsImport', params: { status: 'DETAILS', Id: row.Id } })
          this.$router.push({ path: `./detailsImport/${row.Id}`, query: { status: 'DETAILS' } })
        }
      })
      return btns
    },
    handleView (value) { // 视图切换
      this.viewDesc = this.getCellEnumValue(this.VIEW_TYPE, value)
      this.form.values = this.$options.data().form.values
      this.table.paging = this.$options.data().table.paging
      this.handleSearch()
    },
    handleFormSearch () { // 查询
      this.table.paging = this.$options.data().table.paging
      this.handleSearch()
    },
    handleReset () { // 重置
      this.form.values = this.$options.data().form.values
      this.table.paging = this.$options.data().table.paging
      this.handleSearch()
    },
    handleSearch () { // 查询列表信息
      const rLoading = this.loadingShow({ target: '.all-attempt', fullscreen: false })
      const params = {
        ...this.table.paging,
        ...this.form.values
      }

      if (checkDataType(params.sendTime) === 'Array') {
        [params.StartDeliveryTime, params.EndDeliveryTime] = params.sendTime
      }
      const { sendTime, ...tparams } = params
      if (this.viewType === 1) { // 所有视图
        importAllGetList(tparams).then((res) => {
          if (res?.Code === 200) {
            this.table.data = res?.Data
            this.table.paging.PageIndex = res?.PageIndex
            this.table.paging.PageSize = res?.PageSize
            this.table.paging.Total = res?.Total
          }
        }).finally(() => {
          rLoading.close()
        })
      }
      if (this.viewType === 2) { // 待接单视图
        pendingGetList(tparams).then((res) => {
          if (res?.Code === 200) {
            this.table.data = res?.Data
            this.table.paging.PageIndex = res?.PageIndex
            this.table.paging.PageSize = res?.PageSize
            this.table.paging.Total = res?.Total
          }
        }).finally(() => {
          rLoading.close()
        })
      }
    },
    handleExport () { // 导出excel
      const params = {
        ...this.form.values
      }
      if (checkDataType(params.sendTime) === 'Array') {
        [params.StartDeliveryTime, params.EndDeliveryTime] = params.sendTime
      }
      const { sendTime, ...tparams } = params
      console.log('downld........................')
      getExport(tparams) // 下载
    }
  }
}
</script>

<style lang="scss" scoped>
.all-attempt {
  .field-right {
    display: inline-block;
    width: 120px;
    padding-right: 10px;
  }
}
</style>
