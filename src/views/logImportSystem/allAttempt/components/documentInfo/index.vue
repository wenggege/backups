<template>
  <div class="document-info">
    <field-set title="鉴定信息" :borderBottom="false">
      <table-edit-list ref="valuationform" :columns="valuationInfo.columns" :key="Math.random()"
        :data="valuationInfo.tableDataFrom.tableData" :paging.sync="valuationInfo.paging"
        :tableDataFrom="valuationInfo.tableDataFrom" :showPaging="false" :tableProps="{ class: 'customTable' }"
        @refresh="handleSearch" :disabled="DETAILS_STATUS">
        <template #IsDangerousGoods="{ row, item }">
          <el-select v-show="(row.edit && row.edit !== undefined) || item.edit" v-model="row.IsDangerousGoods"
            placeholder="请选择" :disabled="DETAILS_STATUS">
            <el-option v-for="item in GOODS_TYPE" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span v-show="!row.edit && row.edit !== undefined">
            {{ getCellEnumValue(GOODS_TYPE, row.IsDangerousGoods) }}
          </span>
        </template>
        <template #IsDangerChemicals="{ row, item }">
          <el-select v-show="(row.edit && row.edit !== undefined) || item.edit" v-model="row.IsDangerChemicals"
            placeholder="请选择" :disabled="DETAILS_STATUS">
            <el-option v-for="item in GHS_TYPE" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span v-show="!row.edit && row.edit !== undefined">
            {{ getCellEnumValue(GHS_TYPE, row.IsDangerChemicals) }}
          </span>
        </template>
      </table-edit-list>
    </field-set>
    <field-set title="报关信息" :borderBottom="false">
      <form-search ref="declarationform" :form="declarationInfo.props" :items="declarationInfo.items"
        :rules="declarationInfo.rules" :values.sync="declarationInfo.values" :btnstate="false"
        :disabled="DETAILS_STATUS" />
    </field-set>
    <field-set title="关增税回填" :borderBottom="false" v-show="!DETAILS_STATUS">
      <form-search ref="taxform" :form="taxInfo.props" :items="taxInfo.items" :rules="taxInfo.rules"
        :values.sync="taxInfo.values" :btnstate="false" />
    </field-set>
  </div>
</template>

<script>
import { regMoney } from '@/utils/regular'

export default {
  name: 'DocumentInfo',
  props: {
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    GOODS_TYPE () {
      return this.allSelectDict.GOODS_TYPE || []
    },
    GHS_TYPE () {
      return this.allSelectDict.GHS_TYPE || []
    },
    DETAILS_STATUS () { // 状态为详情时，下拉框不可用
      return this.transData.status === 'DETAILS'
    },
    LOGIS_STATUS () { // 状态为物流时，下拉框不可用
      return this.transData.status === 'LOGIS'
    }
  },
  watch: {
    allSelectDict: {
      handler (val) {
        if (Object.keys(val).length) {
          this.declarationInfo.items.forEach((item) => {
            if (item.name === 'SupervisionCode') {
              item.paramItems = val.SupervisionMethod || []
            }
            if (item.name === 'Exemption') {
              item.paramItems = val.ExemptionWay || []
            }
            if (item.name === 'IsSpecialrelationConfirm') {
              item.paramItems = val.SPECIAL_TYPE || []
            }
            if (item.name === 'PriceConfirm') {
              item.paramItems = val.PRICE_TYPE || []
            }
            if (item.name === 'TradingCountryCode') {
              item.paramItems = val.TradingCountry || []
            }
            if (item.name === 'PortEntry') {
              item.paramItems = val.PortOfEntry || []
            }
          })
        }
      },
      immediate: true,
      deep: true
    },
    transData: {
      handler (val) {
        if (Object.keys(val).length !== 0) {
          this.handleProductList(JSON.stringify(val))
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      valuationInfo: { // 鉴定信息
        props: {
          height: 'calc(100vh - 220px)'
        },
        columns: [
          {
            prop: 'seque',
            label: '序号',
            type: 'index',
            width: '80'
          },
          {
            prop: 'ProductChiName',
            label: '产品中文名称',
            minWidth: '120',
            edit: false
          },
          {
            prop: 'CommodityCode',
            label: '商品编码',
            minWidth: '100',
            edit: true
          },
          {
            prop: 'Supervision',
            label: '监管条件',
            width: '100',
            edit: true
          },
          {
            type: 'slot',
            prop: 'IsDangerousGoods',
            label: '是否危险货物',
            minWidth: '120',
            edit: true
          },
          {
            type: 'slot',
            prop: 'IsDangerChemicals',
            label: '是否危险化学品',
            minWidth: '120',
            edit: true
          },
          {
            prop: 'CountryOrigin',
            label: '原产国',
            minWidth: '120',
            edit: true
          }
        ],
        tableDataFrom: {
          tableData: [
            {
              ProductChiName: '',
              CommodityCode: '',
              Supervision: '',
              IsDangerousGoods: '',
              IsDangerChemicals: '',
              CountryOrigin: ''
            }
          ]
        },
        paging: {
          Total: 0,
          PageSize: 10,
          PageIndex: 1
        }
      },
      declarationInfo: { // 报关信息
        props: {
          labelWidth: '110px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        rules: {
          GrossWeight: [
            { pattern: regMoney, message: '输入格式类型错误' }
          ],
          Freight: [
            { pattern: regMoney, message: '输入格式类型错误' }
          ],
          Premium: [
            { pattern: regMoney, message: '输入格式类型错误' }
          ],
          OtherAmount: [
            { pattern: regMoney, message: '输入格式类型错误' }
          ]
        },
        items: [
          {
            name: 'EntryClearance',
            label: '进境关别',
            type: 'input',
            props: {
              maxlength: 16
            }
          },
          {
            name: 'SupervisionCode',
            label: '监管方式',
            type: 'select',
            paramItems: []
          },
          {
            name: 'TradingCountryCode',
            label: '贸易国',
            type: 'select',
            paramItems: []
          },
          {
            name: 'FinallyDestinationCountry',
            label: '最终目的国',
            type: 'input'
          },
          {
            name: 'GrossWeight',
            label: '毛重',
            type: 'input'
          },
          {
            name: 'Exemption',
            label: '征免',
            type: 'select',
            paramItems: []
          },
          {
            name: 'ExemptionNature',
            label: '征免性质',
            type: 'input'
          },
          {
            name: 'IsSpecialrelationConfirm',
            label: '特殊关系确认',
            type: 'select',
            paramItems: []
          },
          {
            name: 'CountryDeparture',
            label: '启运国',
            type: 'input'
          },
          {
            name: 'PriceConfirm',
            label: '价格影响确认',
            type: 'select',
            paramItems: []
          },
          {
            name: 'PaidConcessionConfirm',
            label: '支付特许权使用费确认',
            type: 'input'
          },
          {
            name: 'ClinchWay',
            label: '成交方式',
            type: 'input'
          },
          {
            name: 'PortEntry',
            label: '入境口岸',
            type: 'select',
            paramItems: []
          },
          {
            name: 'Freight',
            label: '运费',
            type: 'input'
          },
          {
            name: 'Premium',
            label: '保费',
            type: 'input'
          },
          {
            name: 'OtherAmount',
            label: '杂费',
            type: 'input'
          },
          {
            name: 'Reamrk',
            label: '标记唛码及备注',
            type: 'input'
          },
          {
            name: 'DeclarationDate',
            label: '申报日期',
            type: 'date',
            paramItems: {
              type: 'date',
              format: 'yyyy-MM-ddTHH:mm:ss'
            }
          },
          {
            name: 'ComesWithFile',
            label: '随附单证及编号',
            type: 'input'
          }
        ],
        values: {
          EntryClearance: '',
          SupervisionCode: '',
          TradingCountryCode: 3,
          FinallyDestinationCountry: '',
          GrossWeight: '',
          Exemption: '',
          ExemptionNature: '',
          IsSpecialrelationConfirm: '',
          CountryDeparture: '',
          PriceConfirm: '',
          PaidConcessionConfirm: '',
          ClinchWay: '',
          PortEntry: 'XXXX',
          Freight: '',
          Premium: '',
          OtherAmount: '',
          Reamrk: '',
          DeclarationDate: '',
          ComesWithFile: ''
        }
      },
      taxInfo: { // 报关信息
        props: {
          labelWidth: '110px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        rules: {
          Tariff: [
            { pattern: regMoney, message: '输入格式类型错误' }
          ],
          VAT: [
            { pattern: regMoney, message: '输入格式类型错误' }
          ],
          LatePaymentFee: [
            { pattern: regMoney, message: '输入格式类型错误' }
          ]

        },
        items: [
          {
            name: 'CustomsClearanceNumber',
            label: '报关单号',
            type: 'input',
            props: {
              maxlength: 16
            }
          },
          {
            name: 'Tariff',
            label: '关税',
            type: 'input'
          },
          {
            name: 'VAT',
            label: '增值税',
            type: 'input'
          },
          {
            name: 'LatePaymentFee',
            label: '滞报金',
            type: 'input'
          }
        ],
        values: {
          CustomsClearanceNumber: '',
          Tariff: '',
          VAT: '',
          LatePaymentFee: ''
        }
      },
      detailList: []
    }
  },
  methods: {
    handleProductList (params) { // 处理查询回的数据
      const tempList = JSON.parse(params)
      if (tempList.ValuationList.length === 0) {
        this.detailList = tempList.ProductDetailsList.map((item) => {
          return {
            ProductChiName: item.ProductChiName
          }
        })
      } else {
        this.valuationInfo.tableDataFrom.tableData = [...tempList.ValuationList]
      }
      if (this.detailList.length !== 0) {
        this.valuationInfo.tableDataFrom.tableData = [...this.detailList]
      }
      this.declarationInfo.values = { ...tempList.CustomsClearance }
      this.taxInfo.values.CustomsClearanceNumber = this.declarationInfo.values.CustomsClearanceNumber
      this.taxInfo.values.Tariff = this.declarationInfo.values.Tariff
      this.taxInfo.values.VAT = this.declarationInfo.values.VAT
      this.taxInfo.values.LatePaymentFee = this.declarationInfo.values.LatePaymentFee
    },
    handleSearch () { }
  }
}
</script>

<style lang="scss" scoped>
.document-info {}
</style>
