<template>
  <div class="exter-book">
    <el-dialog :close-on-click-modal="false" :visible="visible"
      :title="transData.ProductTypeName + '-国际托书(进口)' || '国际托书(进口)'" width="60%" @close="handleClose">
      <div class="form">
        <div style="text-align: right;padding-bottom: 10px;">编号：{{ exterbookInfo.BusinessCode }}</div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Consigner">
            <el-descriptions :column="1" border>
              <el-descriptions-item label=" 公司名称">
                <el-input v-model="exterbookInfo.OutSideShipOrg" />
              </el-descriptions-item>
              <el-descriptions-item label="地址">
                <el-input v-model="exterbookInfo.OutSideShipAddress" />
              </el-descriptions-item>
              <el-descriptions-item label="电话">
                <el-input v-model="exterbookInfo.ShipTelephone" />
              </el-descriptions-item>
            </el-descriptions>
          </el-descriptions-item>
          <el-descriptions-item label="Consignee">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="公司名称">
                <el-input v-model="exterbookInfo.DemandDepartmentName" />
              </el-descriptions-item>
              <el-descriptions-item label="地址">
                <el-input v-model="exterbookInfo.ReceiptAddress" />
              </el-descriptions-item>
              <el-descriptions-item label="联系人">
                <el-input v-model="exterbookInfo.ReceiptOrg" />
              </el-descriptions-item>
              <el-descriptions-item label="电话">
                <el-input v-model="exterbookInfo.ReceiptTelephone" />
              </el-descriptions-item>
            </el-descriptions>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="DETAILS FOR SHIPMENT" :labelStyle="{
            'background': 'darkgray',
            'color': 'white'
          }" :contentStyle="{ 'width': '0px', 'padding': '0px' }">
          </el-descriptions-item>
        </el-descriptions>
        <el-table :data="tableData" height="250" border style="width: 100%" show-summary :summary-method="getSummaries">
          <el-table-column prop="LineNumber" label="ITEM" width="180">
          </el-table-column>
          <el-table-column prop="ProductNameEng" label="DESCRIPTION" width="180">
          </el-table-column>
          <el-table-column prop="NetWeight" label="NET WEIGHT" width="180">
          </el-table-column>
          <el-table-column prop="Nuit" label="UNIT" width="180">
          </el-table-column>
          <el-table-column prop="IsDangerGoods" label="SHIPPING CONDITION" width="180">
          </el-table-column>
          <el-table-column prop="TemperatureRequire" label="TEMPRATURE REQUIREMENT" width="180">
          </el-table-column>
        </el-table>
        <el-descriptions class="margin-top" :column="2" border>
          <el-descriptions-item label="TERM OF DELIVERY">
            <el-input v-model="exterbookInfo.IncotermsName" />
          </el-descriptions-item>
          <el-descriptions-item label="REQUESTED ARRIVAL DATE">
            <el-input v-model="exterbookInfo.RequestedArrivaldate" />
          </el-descriptions-item>
          <el-descriptions-item label="PARTIAL SHIPMENT">NOT ALLOWED</el-descriptions-item>
          <el-descriptions-item label="TRANSSHIPMENT">
            ALLOWED
          </el-descriptions-item>
          <el-descriptions-item label="PACKAGES" :span="2">
            <el-input v-model.number="exterbookInfo.Number" />
          </el-descriptions-item>
          <el-descriptions-item label="Packing specification" :span="2">
            <el-input v-model.number="exterbookInfo.PackingSpecification" />
          </el-descriptions-item>
          <el-descriptions-item label="TOTAL GROSS WEIGHT">
            <el-input v-model.number="exterbookInfo.GrossWeight" />
          </el-descriptions-item>
          <el-descriptions-item label="TOTAL VOLUME">
            <el-input v-model.number="exterbookInfo.TotalVolume" />
          </el-descriptions-item>

          <el-descriptions-item label="FREIGHT QUOTATION" :span="2">
            <el-input v-model.number="exterbookInfo.FreightQuotation" />
          </el-descriptions-item>
          <el-descriptions-item label="SPECIAL REQUIREMENT" :span="2">
            <el-input v-model="exterbookInfo.SpecialRequirement" />
          </el-descriptions-item>
          <el-descriptions-item label="SHIPPER SIGNATURE">
            <el-input v-model="exterbookInfo.OP" />
          </el-descriptions-item>
          <el-descriptions-item label="FORWARDER SIGNATURE">
            <el-input v-model="exterbookInfo.RorwarderSignature" />
          </el-descriptions-item>
        </el-descriptions>
      </div>
      <template #footer>
        <el-button v-preventReclick :loading="sumbitLoading" type="primary" @click="handleSubmit">保存</el-button>
        <el-button v-preventReclick type="primary" @click="handlePrint">打印</el-button>
        <el-button v-preventReclick type="primary" @click="handleDownload">下载</el-button>
        <el-button @click="handleCancel">返回</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { getInternationalTrusteeMain, saveInternationalTrustee, downloadFile, previewFile } from '@/api/logImportSystem'

export default {
  name: 'FreeSample',
  props: {
    visible: Boolean,
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      exterbookInfo: {},
      sumbitLoading: false,
      tableData: []
    }
  },
  computed: {
    INVOICE_TYPE () {
      return this.allSelectDict.invoice || []
    }
  },
  methods: {
    handleCancel () {
      this.$emit('update:visible', false)
    },
    handleClose () {
      this.$emit('update:visible', false)
      this.sumbitLoading = false
    },
    getSummaries (param) {
      const { columns, data } = param
      const sums = []
      columns.forEach((column, index) => {
        if (index === 0) {
          sums[index] = 'TOTAL'
          column.colSpan = 2
          return
        }
        if (index === 3) {
          column.colSpan = 3
          return
        }
        if (index === 1) {
          this.$nextTick(() => {
            const tds = document.querySelectorAll(
              '.el-table__footer-wrapper tr>td'
            )
            tds[1].style.display = 'none'
          })
          return
        }
        const values = data.map(item => Number(item[column.property]))
        if (!values.every(value => isNaN(value))) {
          sums[index] = values.reduce((prev, curr) => {
            const value = Number(curr)
            if (!isNaN(value)) {
              return prev + curr
            } else {
              return prev
            }
          }, 0)
        } else {
          sums[index] = ''
        }
      })

      return sums
    },
    handleQuery () {
      const rLoading = this.loadingShow({
        target: '.form',
        fullscreen: false
      })
      getInternationalTrusteeMain({ MainID: this.transData.Id }).then((res) => {
        if (res?.Code === 200) {
          this.exterbookInfo = res?.Data
          this.tableData = res?.Data?.GoodsList
        }
      }).finally(() => {
        rLoading.close()
      })
    },
    handleSubmit () {
      this.sumbitLoading = true
      saveInternationalTrustee({ ...this.exterbookInfo, GoodsList: this.tableData }).then((res) => {
        if (res?.Code === 200) {
          this.$message.success(`保存${this.transData.ProductTypeName}-国际托书(进口)成功`)
          this.handleCancel()
        }
      }).finally(() => {
        this.sumbitLoading = false
      })
    },
    handleDownload () {
      const typeinfo = this.INVOICE_TYPE.filter((item) => item.enLabel.split(' ')[0] === this.transData.type)
      downloadFile({ MainID: this.transData.Id, InvoiceType: typeinfo[0].value })
    },
    handlePrint () {
      const typeinfo = this.INVOICE_TYPE.filter((item) => item.enLabel.split(' ')[0] === this.transData.type)
      previewFile({ MainID: this.transData.Id, InvoiceType: typeinfo[0].value })
    }
  },
  watch: {
    visible (val) {
      if (val) {
        this.$nextTick(async () => {
          this.sumbitLoading = false
          this.handleQuery()
        })
      }
    }
  }
}
</script>

<style  lang='scss' scoped>
</style>
