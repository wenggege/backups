<template>
  <div class="details-info" v-if="basicInfo.ProductTypeId">
    <div class="header">
      <div class="top">
        <span>业务编号：{{ currPageInfo.BusinessCode }}</span>
        <div>
          <span>物流BP：{{ currPageInfo.BP }}</span>
          <span class="top-location">物流OP：{{ currPageInfo.OP }}</span>
        </div>
      </div>
      <type-select ref="typeform" @accept="handleProductType" :transData="basicInfo"></type-select>
    </div>
    <div class="wrapper">
      <field-set :title="typeinfo.ProductTypeName || '免费样品'" :showCollapse="true" :collapse="false"
        :borderBottom="true">
        <div slot="right" class="field-right">
          <el-button type="primary" size="mini" @click="handleElement(ELEMENT)">申报要素</el-button>
          <el-button type="primary" size="mini" @click="handleElement(EXTER_BOOK)">国际托书</el-button>
          <el-button type="primary" size="mini" @click="handleElement(INTER_BOOK)">国内托书</el-button>
          <el-button type="primary" size="mini" @click="handleElement(RECEIPT)">签收单</el-button>
        </div>
        <div slot="collapse">
          <base-info ref='baseform' :key="Math.random()" :transData="basicInfo" />
          <product-info ref='productform' :key="Math.random()" :transData="basicInfo" />
          <append-info ref='appendform' :key="Math.random()" :transData="basicInfo" />
        </div>
      </field-set>
      <field-set title="单证信息" :showCollapse="true" :collapse="false" :borderBottom="true">
        <div slot="right" class="field-right">
          <el-button type="primary" size="mini" @click="handleElement(AGREEMENTS)">合同</el-button>
          <el-button type="primary" size="mini" @click="handleElement(BILL)">发票</el-button>
          <el-button type="primary" size="mini" @click="handleElement(PACKING)">箱单</el-button>
          <el-button type="primary" size="mini" @click="handleElement(DECLARATION)">报关草单</el-button>
        </div>
        <div slot="collapse">
          <document-info ref='documentform' :key="Math.random()" :transData="basicInfo" />
        </div>
      </field-set>
      <field-set title="物流信息及费用" :showCollapse="true" :collapse="false" :borderBottom="true">
        <div slot="collapse">
          <logistics-info ref='logistform' :key="Math.random()" :transData="basicInfo" />
        </div>
      </field-set>
      <field-set title="操作日志" :showCollapse="true" :collapse="false" :borderBottom="true">
        <div slot="collapse">
          <table-list :columns="logInfo.columns" :data="logInfo.data" :paging.sync="logInfo.paging" :showPaging="false">
          </table-list>
        </div>
      </field-set>
    </div>
    <div class="footer">
      <el-button @click="handleClose" type="primary">返回</el-button>
    </div>

    <dialog-free-sample :visible.sync="freeShow.visible" :transData="freeShow.transData" />
    <dialog-device :visible.sync="deviceShow.visible" :transData="deviceShow.transData" />
    <dialog-consumable :visible.sync="consumShow.visible" :transData="consumShow.transData" />
    <dialog-exter-book :visible.sync="exterShow.visible" :transData="exterShow.transData" />
    <dialog-inter-book :visible.sync="interShow.visible" :transData="interShow.transData" />
    <dialog-receipt :visible.sync="receiptShow.visible" :transData="receiptShow.transData" />
    <dialog-declaration :visible.sync="declarationShow.visible" :transData="declarationShow.transData" />
    <dialog-agrement :visible.sync="agreentShow.visible" :transData="agreentShow.transData" />
  </div>
</template>

<script>
import typeSelect from '../components/typeSelect'
import baseInfo from '../components/baseInfo'
import productInfo from '../components/productInfo'
import appendInfo from '../components/appendInfo'

import documentInfo from '../components/documentInfo'
import logisticsInfo from '../components/logisticsInfo'

import DialogFreeSample from '../components/exportDocument/elements/freesample'
import DialogDevice from '../components/exportDocument/elements/device'
import DialogConsumable from '../components/exportDocument/elements/consumable'
import DialogExterBook from '../components/exportDocument/exterBook'
import DialogInterBook from '../components/exportDocument/interBook'
import DialogReceipt from '../components/exportDocument/receipt'
import DialogDeclaration from '../components/exportDocument/declaration'
import DialogAgrement from '../components/exportDocument/agreements'

import { getDetailsInfo } from '@/api/logImportSystem'

export default {
  name: 'DetailsInfo',
  components: {
    typeSelect,
    baseInfo,
    productInfo,
    appendInfo,
    documentInfo,
    logisticsInfo,
    DialogFreeSample,
    DialogDevice,
    DialogConsumable,
    DialogExterBook,
    DialogInterBook,
    DialogReceipt,
    DialogDeclaration,
    DialogAgrement
  },
  data () {
    return {
      typeinfo: { // 产品类别表单
        ProductType: '',
        ProductTypeName: '',
        ProductTypeId: ''
      },
      basicInfo: {},
      currPageInfo: {
        BusinessCode: '',
        BP: '',
        OP: ''
      },
      ELEMENT: 'Declaration',
      INTER_BOOK: 'Domestic',
      EXTER_BOOK: 'International',
      RECEIPT: 'Receipt',
      DECLARATION: 'Draft',
      AGREEMENTS: 'contract',
      BILL: 'invoice',
      PACKING: 'Box',
      freeShow: {
        visible: false,
        transData: {}
      },
      deviceShow: {
        visible: false,
        transData: {}
      },
      consumShow: {
        visible: false,
        transData: {}
      },
      interShow: {
        visible: false,
        transData: {}
      },
      exterShow: {
        visible: false,
        transData: {}
      },
      receiptShow: {
        visible: false,
        transData: {}
      },
      declarationShow: {
        visible: false,
        transData: {}
      },
      agreentShow: {
        visible: false,
        transData: {}
      },
      logInfo: {
        columns: [
          {
            prop: 'ActionName',
            label: '操作',
            minWidth: '80'
          },
          {
            prop: 'CreateDomainName',
            label: '操作人',
            minWidth: '120'
          },
          {
            prop: 'CreateTime',
            label: '操作时间',
            minWidth: '120',
            formatter: ({ cellValue }) => {
              if (cellValue) { return this.$moment(cellValue).format('YYYY-MM-DD HH:mm:ss') }
            }
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
    PRODUCT_TYPE () { // 产品类型下拉框
      return this.allSelectDict.ProductCategory || []
    },
    DEMAND_DEPARTMENT () { // 需求单位
      return this.allSelectDict.DemandDepartment || []
    },
    SHIPPING_ADDRESS () { // 收货地址
      return this.allSelectDict.ShippingAddress || []
    },
    EXEMPTION_TYPE () { // 征免
      return this.allSelectDict.ExemptionWay || []
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        console.log('ddeee', route)
        if (route.params.id !== '') {
          if (!route.query.status) {
            this.handleDetailInfo({ status: 'DETAILS', ...route.params })
          } else {
            this.handleDetailInfo({ ...route.query, ...route.params })
          }
        }
      },
      immediate: true
    }
  },
  methods: {
    handleProductType (param) {
      this.typeinfo = { ...param }
    },
    handleDetailInfo (params) {
      const rLoading = this.loadingShow({ target: '.details-info', fullscreen: false })
      getDetailsInfo({ Id: params.Id }).then((res) => {
        if (res?.Code === 200 && res?.Data !== '') {
          this.currPageInfo.BusinessCode = res.Data.ImportAndExportMain.BusinessCode
          this.currPageInfo.OP = res.Data.ImportAndExportMain.OP
          this.currPageInfo.BP = res.Data.ImportAndExportMain.BP
          this.logInfo.data = res.Data.Logs
          this.basicInfo = { ...params, ...res.Data }

          const typeinfo = this.PRODUCT_TYPE.filter((item) => item.value === res.Data.ImportAndExportMain.ProductType)
          this.basicInfo.ProductTypeId = typeinfo[0]?.enLabel.split(' ')[0]
        }
      }).finally(() => {
        rLoading.close()
      })
    },
    handleElement (param) { // 弹窗要素
      const product = this.basicInfo.ProductTypeId
      const data = { Id: this.basicInfo.Id, ProductTypeName: this.basicInfo.ImportAndExportMain.ProductTypeName }
      switch (param) {
        case this.ELEMENT:
          if (product === 'Free' || product === 'Customer' || product === 'Returned' || product === 'Raw') {
            this.freeShow.transData = { ...data, type: this.ELEMENT }
            this.freeShow.visible = true
          }
          if (product === 'Instruments') {
            this.deviceShow.transData = { ...data, type: this.ELEMENT }
            this.deviceShow.visible = true
          }
          if (product === 'Consumables' || product === 'Packaging') {
            this.consumShow.transData = { ...data, type: this.ELEMENT }
            this.consumShow.visible = true
          }
          break
        case this.INTER_BOOK:
          this.interShow.transData = { ...data, type: this.INTER_BOOK }
          this.interShow.visible = true
          break
        case this.EXTER_BOOK:
          this.exterShow.transData = { ...data, type: this.EXTER_BOOK }
          this.exterShow.visible = true
          break
        case this.RECEIPT:
          this.receiptShow.transData = { ...data, type: this.RECEIPT }
          this.receiptShow.visible = true
          break
        case this.DECLARATION:
          this.declarationShow.transData = { ...data, type: this.DECLARATION }
          this.declarationShow.visible = true
          break
        case this.BILL:
          this.agreentShow.transData = { ...data, type: this.BILL }
          this.agreentShow.visible = true
          break
        case this.PACKING:
          this.agreentShow.transData = { ...data, type: this.PACKING }
          this.agreentShow.visible = true
          break
        case this.AGREEMENTS:
          this.agreentShow.transData = { ...data, type: this.AGREEMENTS }
          this.agreentShow.visible = true
          break
        default:
          break
      }
    },
    handleClose () {
      this.$router.push({ name: 'LogsImportSystem' })
    }
  }
}
</script>

<style lang="scss" scoped>
.details-info {
  .header {
    .top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 0 16px 0 16px;

      .top-location {
        padding-left: 30px;
      }
    }
  }

  .wrapper {
    .field-right {
      display: flex;
      justify-content: center;
      align-items: center;
      padding-right: 15px;
    }
  }

  .footer {
    padding: 0 16px 32px;
    text-align: center;

    .el-button {
      min-width: 84px;
      margin: 0 30px;
    }
  }
}
</style>
