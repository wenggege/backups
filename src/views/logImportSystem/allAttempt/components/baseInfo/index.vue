<template>
  <div class="base-info">
    <field-set title="基本信息" :borderBottom="false">
      <form-search ref="baseform" :form="CURRENT_INFO.props" :items="CURRENT_INFO.items" :rules="CURRENT_INFO.rules"
        :treeData="personInfo" :values.sync="CURRENT_INFO.values" :btnstate="false"
        :disabled="TAKING_STATUS || DETAILS_STATUS" />
    </field-set>
  </div>
</template>

<script>
import { regNumber } from '@/utils/regular'

export default {
  name: 'BaseInfo',
  props: {
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    TAKING_STATUS () { // 状态为接单时，下拉框不可用
      return this.transData.status === 'TAKING'
    },
    DETAILS_STATUS () { // 状态为详情时，下拉框不可用
      return this.transData.status === 'DETAILS'
    },
    CURRENT_INFO () {
      return this.basicInfo[this.transData.ProductTypeId]
    }
  },
  data () {
    return {
      personInfo: [], // 人员信息数据
      basicInfo: {
        Free: { // 免费样品
          props: {
            labelWidth: '110px',
            labelPosition: 'right',
            labelSuffix: '：'
          },
          rules: {
            ProjectCode: { required: true, message: '请输入项目代码' },
            DemandDepartmentCode: { required: true, message: '请选择需求单位' },
            OutSideShipOrg: { required: true, message: '请输入境外发货人' },
            OutSideShipAddress: { required: true, message: '请输入境外发货人地址' },
            ReceiptOrg: { required: true, message: '请输入收货人' },
            ReceiptAddress: { required: true, message: '请选择收货地址' },
            ExpectedShipTime: { required: true, message: '请输入预计发运时间' },
            ShipTemperature: { required: true, message: '请输入运输温度要求' },
            Package: { required: true, message: '请输入包装种类' }
          },
          items: [
            {
              name: 'ProjectCode',
              label: '项目代码',
              type: 'input',
              props: {
                maxlength: 16
              }
            },
            {
              name: 'DemandDepartmentCode',
              label: '需求单位',
              type: 'select',
              paramItems: []
            },
            {
              name: 'OutSideShipOrg',
              label: '境外发货人',
              type: 'input'
            },
            {
              name: 'OutSideShipAddress',
              label: '境外发货人地址',
              type: 'input'
            },
            {
              name: 'ReceiptOrg',
              label: '收货人',
              type: 'input-popover',
              props: {
                onFocus: () => {
                  this.personInfo = []
                  this.$nextTick(() => {
                    this.personInfo = this.allPersonDict
                  })
                }
              }
            },
            {
              name: 'ReceiptAddress',
              label: '收货地址',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ExpectedShipTime',
              label: '预计发运时间',
              type: 'date',
              paramItems: {
                type: 'date',
                format: 'yyyy-MM-ddTHH:mm:ss'
              }
            },
            {
              name: 'ShipTemperature',
              label: '运输温度要求',
              type: 'input'
            },
            {
              name: 'Package',
              label: '包装种类',
              type: 'input'
            }
          ],
          values: {
            ProjectCode: '',
            DemandDepartmentCode: '',
            OutSideShipOrg: '',
            OutSideShipAddress: '',
            ReceiptOrg: '',
            ReceiptAddress: '',
            ExpectedShipTime: '',
            ShipTemperature: '',
            Package: ''
          }
        },
        Packaging: { // 包材
          props: {
            labelWidth: '110px',
            labelPosition: 'right',
            labelSuffix: '：'
          },
          rules: {
            ProjectCode: { required: true, message: '请输入关联项目' },
            DemandDepartmentCode: { required: true, message: '请选择需求单位' },
            OrderNo: { required: true, message: '请输入订单号' },
            Trader: { required: true, message: '请输入供应商名称' },
            IncotermsCode: { required: true, message: '请选择国际贸易条件' },
            ReceiptOrg: { required: true, message: '请输入收货人' },
            TraderAddress: { required: true, message: '请输入供应商地址' },
            Package: { required: true, message: '请输入包装种类' },
            ReceiptAddress: { required: true, message: '请选择收货地址' },
            ExpecteArriveTime: { required: true, message: '请输入预计到达时间' }

          },
          items: [
            {
              name: 'ProjectCode',
              label: '关联项目',
              type: 'input',
              props: {
                maxlength: 16
              }
            },
            {
              name: 'DemandDepartmentCode',
              label: '需求单位',
              type: 'select',
              paramItems: []
            },
            {
              name: 'OrderNo',
              label: '订单号',
              type: 'input'
            },
            {
              name: 'Trader',
              label: '供应商名称',
              type: 'input'
            },
            {
              name: 'IncotermsCode',
              label: '国际贸易条件',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ReceiptOrg',
              label: '收货人',
              type: 'input-popover',
              props: {
                onFocus: () => {
                  this.personInfo = []
                  this.$nextTick(() => {
                    this.personInfo = this.allPersonDict
                  })
                }
              }
            },
            {
              name: 'TraderAddress',
              label: '供应商地址',
              type: 'input'
            },
            {
              name: 'Package',
              label: '包装种类',
              type: 'input'
            },
            {
              name: 'ReceiptAddress',
              label: '收货地址',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ExpecteArriveTime',
              label: '预计到达时间',
              type: 'date',
              paramItems: {
                type: 'date',
                format: 'yyyy-MM-ddTHH:mm:ss'
              }
            }

          ],
          values: {
            ProjectCode: '',
            DemandDepartmentCode: '',
            OrderNo: '',
            Trader: '',
            IncotermsCode: '',
            ReceiptOrg: '',
            TraderAddress: '',
            Package: '',
            ReceiptAddress: '',
            ExpecteArriveTime: ''
          }
        },
        Instruments: { // 仪器设备
          props: {
            labelWidth: '110px',
            labelPosition: 'right',
            labelSuffix: '：'
          },
          rules: {
            ProjectCode: { required: true, message: '请输入合同订单号' },
            DemandDepartmentCode: { required: true, message: '请选择需求单位' },
            IsRemittance: { required: true, message: '请选择是否付汇' },
            ShippingMethod: { required: true, message: '请选择运输方式' },
            IncotermsCode: { required: true, message: '请选择国际贸易条件' },
            Trader: { required: true, message: '请输入贸易商名称' },
            ProductionName: { required: true, message: '请输入生产商名称' },
            ProductionAddress: { required: true, message: '请输入生产商地址' },
            TraderAddress: { required: true, message: '请输入贸易商地址' },
            Number: [
              { required: true, message: '请输入件数' },
              { pattern: regNumber, message: '输入格式类型错误' }
            ],
            Package: { required: true, message: '请输入包装种类' },
            ReceiptOrg: { required: true, message: '请输入收货人' },
            ReceiptAddress: { required: true, message: '请选择收货地址' },
            ExpecteArriveTime: { required: true, message: '请输入预计到达时间' }
          },
          items: [
            {
              name: 'ProjectCode',
              label: '合同订单号',
              type: 'input',
              props: {
                maxlength: 16
              }
            },
            {
              name: 'DemandDepartmentCode',
              label: '需求单位',
              type: 'select',
              paramItems: []
            },
            {
              name: 'IsRemittance',
              label: '是否付汇',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ShippingMethod',
              label: '运输方式',
              type: 'select',
              paramItems: []
            },
            {
              name: 'IncotermsCode',
              label: '国际贸易条件',
              type: 'select',
              paramItems: []
            },
            {
              name: 'Trader',
              label: '贸易商名称',
              type: 'input'
            },
            {
              name: 'ProductionName',
              label: '生产商名称',
              type: 'input'
            },
            {
              name: 'ProductionAddress',
              label: '生产商地址',
              type: 'input'
            },
            {
              name: 'TraderAddress',
              label: '贸易商地址',
              type: 'input'
            },
            {
              name: 'Number',
              label: '件数',
              type: 'input'
            },
            {
              name: 'Package',
              label: '包装种类',
              type: 'input'
            },
            {
              name: 'ReceiptOrg',
              label: '收货人',
              type: 'input-popover',
              props: {
                onFocus: () => {
                  this.personInfo = []
                  this.$nextTick(() => {
                    this.personInfo = this.allPersonDict
                  })
                }
              }
            },
            {
              name: 'ReceiptAddress',
              label: '收货地址',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ExpecteArriveTime',
              label: '预计到达时间',
              type: 'date',
              paramItems: {
                type: 'date',
                format: 'yyyy-MM-ddTHH:mm:ss'
              }
            }

          ],
          values: {
            ProjectCode: '',
            DemandDepartmentCode: '',
            IsRemittance: '',
            ShippingMethod: '',
            IncotermsCode: '',
            Trader: '',
            ProductionName: '',
            ProductionAddress: '',
            TraderAddress: '',
            Number: '',
            Package: '',
            ReceiptOrg: '',
            ReceiptAddress: '',
            ExpecteArriveTime: ''
          }
        },
        Raw: { // 原料采购
          props: {
            labelWidth: '110px',
            labelPosition: 'right',
            labelSuffix: '：'
          },
          rules: {
            ProjectCode: { required: true, message: '请输入合同订单号' },
            DemandDepartmentCode: { required: true, message: '请选择需求单位' },
            IsRemittance: { required: true, message: '请选择是否付汇' },
            ShippingMethod: { required: true, message: '请选择运输方式' },
            IncotermsCode: { required: true, message: '请选择国际贸易条件' },
            Trader: { required: true, message: '请输入贸易商名称' },
            ProductionName: { required: true, message: '请输入生产商名称' },
            ProductionAddress: { required: true, message: '请输入生产商地址' },
            TraderAddress: { required: true, message: '请输入贸易商地址' },
            Number: [
              { required: true, message: '请输入件数' },
              { pattern: regNumber, message: '输入格式类型错误' }
            ],
            Package: { required: true, message: '请输入包装种类' },
            ReceiptOrg: { required: true, message: '请输入收货人' },
            ReceiptAddress: { required: true, message: '请选择收货地址' },
            ShipTemperature: { required: true, message: '请输入运输温度要求' }
          },
          items: [
            {
              name: 'ProjectCode',
              label: '合同订单号',
              type: 'input',
              props: {
                maxlength: 16
              }
            },
            {
              name: 'DemandDepartmentCode',
              label: '需求单位',
              type: 'select',
              paramItems: []
            },
            {
              name: 'IsRemittance',
              label: '是否付汇',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ShippingMethod',
              label: '运输方式',
              type: 'select',
              paramItems: []
            },
            {
              name: 'IncotermsCode',
              label: '国际贸易条件',
              type: 'select',
              paramItems: []
            },
            {
              name: 'Trader',
              label: '贸易商名称',
              type: 'input'
            },
            {
              name: 'ProductionName',
              label: '生产商名称',
              type: 'input'
            },
            {
              name: 'ProductionAddress',
              label: '生产商地址',
              type: 'input'
            },
            {
              name: 'TraderAddress',
              label: '贸易商地址',
              type: 'input'
            },
            {
              name: 'Number',
              label: '件数',
              type: 'input'
            },
            {
              name: 'Package',
              label: '包装种类',
              type: 'input'
            },
            {
              name: 'ReceiptOrg',
              label: '收货人',
              type: 'input-popover',
              props: {
                onFocus: () => {
                  this.personInfo = []
                  this.$nextTick(() => {
                    this.personInfo = this.allPersonDict
                  })
                }
              }
            },
            {
              name: 'ReceiptAddress',
              label: '收货地址',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ShipTemperature',
              label: '运输温度要求',
              type: 'input'
            }

          ],
          values: {
            ProjectCode: '',
            DemandDepartmentCode: '',
            IsRemittance: '',
            ShippingMethod: '',
            IncotermsCode: '',
            Trader: '',
            ProductionName: '',
            ProductionAddress: '',
            TraderAddress: '',
            Number: '',
            Package: '',
            ReceiptOrg: '',
            ReceiptAddress: '',
            ShipTemperature: ''
          }
        },
        Customer: { // 客供料
          props: {
            labelWidth: '110px',
            labelPosition: 'right',
            labelSuffix: '：'
          },
          rules: {
            ProjectCode: { required: true, message: '请输入合同订单号' },
            DemandDepartmentCode: { required: true, message: '请选择需求单位' },
            IsRemittance: { required: true, message: '请选择是否付汇' },
            ShippingMethod: { required: true, message: '请选择运输方式' },
            IncotermsCode: { required: true, message: '请选择国际贸易条件' },
            Trader: { required: true, message: '请输入贸易商名称' },
            ProductionName: { required: true, message: '请输入生产商名称' },
            ProductionAddress: { required: true, message: '请输入生产商地址' },
            TraderAddress: { required: true, message: '请输入贸易商地址' },
            Number: [
              { required: true, message: '请输入件数' },
              { pattern: regNumber, message: '输入格式类型错误' }
            ],
            Package: { required: true, message: '请输入包装种类' },
            ReceiptOrg: { required: true, message: '请输入收货人' },
            ReceiptAddress: { required: true, message: '请选择收货地址' },
            ShipTemperature: { required: true, message: '请输入运输温度要求' }
          },
          items: [
            {
              name: 'ProjectCode',
              label: '合同订单号',
              type: 'input',
              props: {
                maxlength: 16
              }
            },
            {
              name: 'DemandDepartmentCode',
              label: '需求单位',
              type: 'select',
              paramItems: []
            },
            {
              name: 'IsRemittance',
              label: '是否付汇',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ShippingMethod',
              label: '运输方式',
              type: 'select',
              paramItems: []
            },
            {
              name: 'IncotermsCode',
              label: '国际贸易条件',
              type: 'select',
              paramItems: []
            },
            {
              name: 'Trader',
              label: '贸易商名称',
              type: 'input'
            },
            {
              name: 'ProductionName',
              label: '生产商名称',
              type: 'input'
            },
            {
              name: 'ProductionAddress',
              label: '生产商地址',
              type: 'input'
            },
            {
              name: 'TraderAddress',
              label: '贸易商地址',
              type: 'input'
            },
            {
              name: 'Number',
              label: '件数',
              type: 'input'
            },
            {
              name: 'Package',
              label: '包装种类',
              type: 'input'
            },
            {
              name: 'ReceiptOrg',
              label: '收货人',
              type: 'input-popover',
              props: {
                onFocus: () => {
                  this.personInfo = []
                  this.$nextTick(() => {
                    this.personInfo = this.allPersonDict
                  })
                }
              }
            },
            {
              name: 'ReceiptAddress',
              label: '收货地址',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ShipTemperature',
              label: '运输温度要求',
              type: 'input'
            }

          ],
          values: {
            ProjectCode: '',
            DemandDepartmentCode: '',
            IsRemittance: '',
            ShippingMethod: '',
            IncotermsCode: '',
            Trader: '',
            ProductionName: '',
            ProductionAddress: '',
            TraderAddress: '',
            Number: '',
            Package: '',
            ReceiptOrg: '',
            ReceiptAddress: '',
            ShipTemperature: ''
          }
        },
        Returned: { // 退运物料
          props: {
            labelWidth: '110px',
            labelPosition: 'right',
            labelSuffix: '：'
          },
          rules: {
            ProjectCode: { required: true, message: '请输入合同订单号' },
            DemandDepartmentCode: { required: true, message: '请选择需求单位' },
            IsRemittance: { required: true, message: '请选择是否付汇' },
            ShippingMethod: { required: true, message: '请选择运输方式' },
            IncotermsCode: { required: true, message: '请选择国际贸易条件' },
            Trader: { required: true, message: '请输入贸易商名称' },
            ProductionName: { required: true, message: '请输入生产商名称' },
            ProductionAddress: { required: true, message: '请输入生产商地址' },
            TraderAddress: { required: true, message: '请输入贸易商地址' },
            Number: [
              { required: true, message: '请输入件数' },
              { pattern: regNumber, message: '输入格式类型错误' }
            ],
            Package: { required: true, message: '请输入包装种类' },
            ReceiptOrg: { required: true, message: '请输入收货人' },
            ReceiptAddress: { required: true, message: '请选择收货地址' },
            ShipTemperature: { required: true, message: '请输入运输温度要求' }
          },
          items: [
            {
              name: 'ProjectCode',
              label: '合同订单号',
              type: 'input',
              props: {
                maxlength: 16
              }
            },
            {
              name: 'DemandDepartmentCode',
              label: '需求单位',
              type: 'select',
              paramItems: []
            },
            {
              name: 'IsRemittance',
              label: '是否付汇',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ShippingMethod',
              label: '运输方式',
              type: 'select',
              paramItems: []
            },
            {
              name: 'IncotermsCode',
              label: '国际贸易条件',
              type: 'select',
              paramItems: []
            },
            {
              name: 'Trader',
              label: '贸易商名称',
              type: 'input'
            },
            {
              name: 'ProductionName',
              label: '生产商名称',
              type: 'input'
            },
            {
              name: 'ProductionAddress',
              label: '生产商地址',
              type: 'input'
            },
            {
              name: 'TraderAddress',
              label: '贸易商地址',
              type: 'input'
            },
            {
              name: 'Number',
              label: '件数',
              type: 'input'
            },
            {
              name: 'Package',
              label: '包装种类',
              type: 'input'
            },
            {
              name: 'ReceiptOrg',
              label: '收货人',
              type: 'input-popover',
              props: {
                onFocus: () => {
                  this.personInfo = []
                  this.$nextTick(() => {
                    this.personInfo = this.allPersonDict
                  })
                }
              }
            },
            {
              name: 'ReceiptAddress',
              label: '收货地址',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ShipTemperature',
              label: '运输温度要求',
              type: 'input'
            }

          ],
          values: {
            ProjectCode: '',
            DemandDepartmentCode: '',
            IsRemittance: '',
            ShippingMethod: '',
            IncotermsCode: '',
            Trader: '',
            ProductionName: '',
            ProductionAddress: '',
            TraderAddress: '',
            Number: '',
            Package: '',
            ReceiptOrg: '',
            ReceiptAddress: '',
            ShipTemperature: ''
          }
        },
        Consumables: { // 耗材
          props: {
            labelWidth: '110px',
            labelPosition: 'right',
            labelSuffix: '：'
          },
          rules: {
            ProjectCode: { required: true, message: '请输入关联项目' },
            DemandDepartmentCode: { required: true, message: '请选择需求单位' },
            OrderNo: { required: true, message: '请输入订单号' },
            Trader: { required: true, message: '请输入供应商名称' },
            IncotermsCode: { required: true, message: '请选择国际贸易条件' },
            ReceiptOrg: { required: true, message: '请输入收货人' },
            TraderAddress: { required: true, message: '请输入供应商地址' },
            Package: { required: true, message: '请输入包装种类' },
            ReceiptAddress: { required: true, message: '请选择收货地址' },
            ExpecteArriveTime: { required: true, message: '请输入预计到达时间' }

          },
          items: [
            {
              name: 'ProjectCode',
              label: '关联项目',
              type: 'input',
              props: {
                maxlength: 16
              }
            },
            {
              name: 'DemandDepartmentCode',
              label: '需求单位',
              type: 'select',
              paramItems: []
            },
            {
              name: 'OrderNo',
              label: '订单号',
              type: 'input'
            },
            {
              name: 'Trader',
              label: '供应商名称',
              type: 'input'
            },
            {
              name: 'IncotermsCode',
              label: '国际贸易条件',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ReceiptOrg',
              label: '收货人',
              type: 'input-popover',
              props: {
                onFocus: () => {
                  this.personInfo = []
                  this.$nextTick(() => {
                    this.personInfo = this.allPersonDict
                  })
                }
              }
            },
            {
              name: 'TraderAddress',
              label: '供应商地址',
              type: 'input'
            },
            {
              name: 'Package',
              label: '包装种类',
              type: 'input'
            },
            {
              name: 'ReceiptAddress',
              label: '收货地址',
              type: 'select',
              paramItems: []
            },
            {
              name: 'ExpecteArriveTime',
              label: '预计到达时间',
              type: 'date',
              paramItems: {
                type: 'date',
                format: 'yyyy-MM-ddTHH:mm:ss'
              }
            }

          ],
          values: {
            ProjectCode: '',
            DemandDepartmentCode: '',
            OrderNo: '',
            Trader: '',
            IncotermsCode: '',
            ReceiptOrg: '',
            TraderAddress: '',
            Package: '',
            ReceiptAddress: '',
            ExpecteArriveTime: ''
          }
        }
      }
    }
  },
  watch: {
    allSelectDict: {
      handler (val) {
        this.$nextTick(() => {
          if (Object.keys(val).length) {
            this.basicInfo[this.transData.ProductTypeId].items.forEach((item) => {
              if (item.name === 'DemandDepartmentCode') {
                item.paramItems = val.DemandDepartment || []
              }
              if (item.name === 'ReceiptAddress') {
                item.paramItems = val.ShippingAddress || []
              }
              if (item.name === 'IsRemittance') {
                item.paramItems = val.GOODS_TYPE || []
              }
              if (item.name === 'ShippingMethod') {
                item.paramItems = val.ShippingMethod || []
              }
              if (item.name === 'IncotermsCode') {
                item.paramItems = val.InternationalTradeTerms || []
              }
            })
          }
        })
      },
      immediate: true,
      deep: true
    },
    transData: {
      handler (val) {
        if (Object.keys(val).length !== 0) {
          this.basicInfo[val.ProductTypeId].values = val.ImportAndExportMain || this.$options.data().basicInfo[val.ProductTypeId].values
        }
      },
      immediate: true,
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
.base-info {}
</style>
