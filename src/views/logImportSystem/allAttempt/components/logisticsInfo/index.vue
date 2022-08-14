<template>
  <div class="logistics-info">
    <field-set title="物流信息" :borderBottom="false">
      <form-search ref="logisticsform" :form="logisticsInfo.props" :items="logisticsInfo.items"
        :rules="logisticsInfo.rules" :values.sync="logisticsInfo.values" :btnstate="false" :disabled="DETAILS_STATUS" />
    </field-set>
    <field-set title="物流费用及报销信息" :borderBottom="false">
      <table-edit-list ref="costform" :columns="costInfo.columns" :data="costInfo.tableDataFrom.tableData"
        :paging.sync="costInfo.paging" :tableDataFrom="costInfo.tableDataFrom" :showPaging="false"
        :disabled="DETAILS_STATUS" :tableProps="{ class: 'customTable' }">
        <template #CompanyName="{ row }">
          <el-input v-model="row.CompanyName" placeholder="请选择" :disabled="DETAILS_STATUS">
            <i slot="suffix" class="el-input__icon el-icon-search" @click="handleCommpany(row)"></i>
          </el-input>
        </template>
        <template #PayStatus="{ row, item }">
          <el-select v-show="(row.edit && row.edit !== undefined) || item.edit" v-model="row.PayStatus"
            :disabled="DETAILS_STATUS" placeholder="请选择">
            <el-option v-for="item in PAY_TYPE" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span v-show="!row.edit && row.edit !== undefined">
            {{ getCellEnumValue(PAY_TYPE, row.PayStatus) }}
          </span>
        </template>
      </table-edit-list>
      <el-popover placement="right" width="1000" trigger="click" ref="popover">
        <dialog-trans-proxy-company @confirm="handlePopover" :transData='visabled' />
      </el-popover>
    </field-set>

  </div>
</template>

<script>
import DialogTransProxyCompany from '../transProxyCompany'

export default {
  name: 'LogisticsInfo',
  components: { DialogTransProxyCompany },
  props: {
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    PAY_TYPE () {
      return this.allSelectDict.PayStatus || []
    },
    DETAILS_STATUS () { // 状态为详情时，下拉框不可用
      return this.transData.status === 'DETAILS'
    }
  },
  watch: {
    transData: {
      handler (val) {
        if (Object.keys(val).length !== 0) { // ProductDetailsList
          this.handleProductList(JSON.stringify(val))
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      visabled: null,
      logisticsInfo: { // 物流信息
        props: {
          labelWidth: '110px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        rules: {},
        items: [
          {
            name: 'WayBillNumber',
            label: '运单号',
            type: 'input',
            props: {
              maxlength: 16
            }
          },
          {
            name: 'ManifestTime',
            label: '舱单建立时间',
            type: 'date',
            paramItems: {
              type: 'date',
              format: 'yyyy-MM-ddTHH:mm:ss'
            },
            props: {
              onChange: (val) => {
                if (this.logisticsInfo.values.ClearCustomsTime) {
                  const t1 = this.$moment(this.logisticsInfo.values.ManifestTime)
                  const t2 = this.$moment(this.logisticsInfo.values.ClearCustomsTime)
                  const dura = t2.format('x') - t1.format('x')
                  const tempTime = this.$moment.duration(dura)
                  this.$set(this.logisticsInfo.values, 'OperatingDays', tempTime.days())
                }
              }
            }
          },
          {
            name: 'ActualArrivalTime',
            label: '实际到港时间',
            type: 'date',
            paramItems: {
              type: 'date',
              format: 'yyyy-MM-ddTHH:mm:ss'
            },
            props: {
              onChange: () => {
                if (this.logisticsInfo.values.ManifestTime) {
                  const t1 = this.$moment(this.logisticsInfo.values.ManifestTime)
                  const t2 = this.$moment(this.logisticsInfo.values.ActualArrivalTime)
                  const dura = t1.format('x') - t2.format('x')
                  const tempTime = this.$moment.duration(dura)
                  this.$set(this.logisticsInfo.values, 'BuildCabinAging', tempTime.days())
                }
              }
            }
          },
          {
            name: 'ClearCustomsTime',
            label: '清关完成时间',
            type: 'date',
            paramItems: {
              type: 'date',
              format: 'yyyy-MM-ddTHH:mm:ss'
            },
            props: {
              onChange: () => {
                if (this.logisticsInfo.values.ManifestTime) {
                  const t1 = this.$moment(this.logisticsInfo.values.ManifestTime)
                  const t2 = this.$moment(this.logisticsInfo.values.ClearCustomsTime)
                  const dura = t2.format('x') - t1.format('x')
                  const tempTime = this.$moment.duration(dura)
                  this.$set(this.logisticsInfo.values, 'OperatingDays', tempTime.days())
                }
              }
            }
          },
          {
            name: 'DeliveryTime',
            label: '送达时间',
            type: 'date',
            paramItems: {
              type: 'date',
              format: 'yyyy-MM-ddTHH:mm:ss'
            }
          },
          {
            name: 'OperatingDays',
            label: '物流操作天数',
            type: 'input',
            disabled: true
          },
          {
            name: 'Remark',
            label: '备注',
            type: 'input'
          },
          {
            name: 'BuildCabinAging',
            label: '建舱时效',
            type: 'input',
            disabled: true
          }
        ],
        values: {
          WayBillNumber: '',
          ManifestTime: '',
          ActualArrivalTime: '',
          ClearCustomsTime: '',
          DeliveryTime: '',
          OperatingDays: '',
          Remark: '',
          BuildCabinAging: ''
        }
      },
      costInfo: { // 费用信息
        props: {
          height: 'calc(100vh - 220px)'
        },
        columns: [
          {
            prop: 'Type',
            label: '类别',
            minWidth: '80',
            edit: false
          },
          {
            prop: 'CompanyName',
            label: '公司名称',
            minWidth: '120',
            type: 'slot',
            edit: true
          },
          {
            prop: 'CountAmount',
            label: '总费用/金额',
            minWidth: '100',
            edit: true
          },
          {
            prop: 'PaymentRequestNumber',
            label: '付款申请单号',
            minWidth: '120',
            edit: true
          },
          {
            type: 'slot',
            prop: 'PayStatus',
            label: '付款状态',
            minWidth: '80',
            edit: true
          }
        ],
        tableDataFrom: {
          tableData: [
            {
              id: 'extertrans',
              Type: '国际运输',
              CompanyName: '',
              CountAmount: null,
              PaymentRequestNumber: '',
              PayStatus: null
            },
            {
              id: 'intertrans',
              Type: '国内运输',
              CompanyName: '',
              CountAmount: null,
              PaymentRequestNumber: '',
              PayStatus: null
            },
            {
              id: 'intercustom',
              Type: '国内清关代理',
              CompanyName: '',
              CountAmount: null,
              PaymentRequestNumber: '',
              PayStatus: null
            },
            {
              id: 'safe',
              Type: '保险',
              CompanyName: '',
              CountAmount: null,
              PaymentRequestNumber: '',
              PayStatus: null
            }
          ]
        },
        paging: {
          Total: 0,
          PageSize: 10,
          PageIndex: 1
        }
      }
    }
  },
  methods: {
    handleCommpany (row) {
      this.$refs.popover.showPopper = true
      this.visabled = row.id
    },
    handlePopover (row, id) {
      this.$refs.popover.showPopper = false
      if (row !== null) {
        this.costInfo.tableDataFrom.tableData.forEach((item) => {
          if (item.id === id) item.CompanyName = row.KOINH || ''
        })
      }
    },
    handleProductList (params) {
      const tempList = JSON.parse(params)
      this.logisticsInfo.values = { ...tempList.Information }
      this.costInfo.tableDataFrom.tableData = tempList.CostList.length !== 0 ? [...tempList.CostList] : this.$options.data().costInfo.tableDataFrom.tableData
    }
  }
}
</script>

<style lang="scss" scoped>
.logistics-info {}
</style>
