<template>
  <div class="inter-book">
    <el-dialog :close-on-click-modal="false" :visible="visible"
      :title="transData.ProductTypeName + '-国内托运单(进口)' || '国内托运单(进口)'" width="60%" @close="handleClose">
      <div class="form">
        <div style="text-align: right;padding-bottom: 10px;">编号：{{ interbookInfo.BusinessCode }}</div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="托运人">
            <el-descriptions :column="1" border>
              <el-descriptions-item label="公司名称">
                <el-input v-model="interbookInfo.DemandDepartmentName" />
              </el-descriptions-item>
              <el-descriptions-item label="地址">
                <el-input v-model="interbookInfo.ReceiptAddress" />
              </el-descriptions-item>
              <el-descriptions-item label="联系人">
                <el-input v-model="interbookInfo.ReceiptOrg" />
              </el-descriptions-item>
              <el-descriptions-item label="电话">
                <el-input v-model="interbookInfo.ShipperTelephone" />
              </el-descriptions-item>
            </el-descriptions>
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="发运货物详情" :labelStyle="{
            'background': 'darkgray',
            'color': 'white'
          }" :contentStyle="{ 'width': '0px', 'padding': '0px' }">
          </el-descriptions-item>
        </el-descriptions>
        <el-table :data="tableData" height="250" border style="width: 100%" show-summary :summary-method="getSummaries">
          <el-table-column prop="LineNumber" label="序号" width="180">
          </el-table-column>
          <el-table-column prop="ProductNameEng" label="货物描述" width="180">
          </el-table-column>
          <el-table-column prop="NetWeight" label="净重" width="180">
          </el-table-column>
          <el-table-column prop="Nuit" label="单位" width="180">
          </el-table-column>
          <el-table-column prop="IsDangerGoods" label="货物性质" width="180">
          </el-table-column>
          <el-table-column prop="TemperatureRequire" label="温度要求" width="180">
          </el-table-column>
        </el-table>
        <el-descriptions class="margin-top" :column="2" border>
          <el-descriptions-item label="包装方式" :span="2">
            <el-input v-model="interbookInfo.Packing" />
          </el-descriptions-item>
          <el-descriptions-item label="毛重">
            <el-input v-model.number="interbookInfo.GrossWeight" />
          </el-descriptions-item>
          <el-descriptions-item label="体积">
            <el-input v-model="interbookInfo.volume" />
          </el-descriptions-item>
          <el-descriptions-item label="其他要求">
            <el-input v-model="interbookInfo.OtherRequire" />
          </el-descriptions-item>
          <el-descriptions-item label="要求到达时间">
            <el-date-picker v-model="interbookInfo.RequiredArrivalTime" value-format="yyyy-MM-ddTHH:mm:ss" type="date"
              placeholder="选择日期"></el-date-picker>
          </el-descriptions-item>
          <el-descriptions-item label="提货地点" :span="2">
            <el-input v-model="interbookInfo.PickupLocation" />
          </el-descriptions-item>
          <el-descriptions-item label="国内费用确认">
            <el-input v-model="interbookInfo.FeeConfirm" />
          </el-descriptions-item>
          <el-descriptions-item label="货值">
            <el-input v-model.number="interbookInfo.Value" />
          </el-descriptions-item>
          <el-descriptions-item label="特殊要求" :span="2">
            <el-input v-model="interbookInfo.SpecialRequire" />
          </el-descriptions-item>
          <el-descriptions-item label="发运人签章">
            <el-input v-model="interbookInfo.OP" />
          </el-descriptions-item>
          <el-descriptions-item label="供应商签章">
            <el-input v-model="interbookInfo.Supplier" />
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
import { getIdomesticEntrustMain, saveIdomesticEntrust, downloadFile, previewFile } from '@/api/logImportSystem'

export default {
  name: 'InterBook',
  props: {
    visible: Boolean,
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    INVOICE_TYPE () {
      return this.allSelectDict.invoice || []
    }
  },
  data () {
    return {
      interbookInfo: {},
      sumbitLoading: false,
      tableData: []
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
          sums[index] = '合计'
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
      getIdomesticEntrustMain({ MainID: this.transData.Id }).then((res) => {
        if (res?.Code === 200) {
          this.interbookInfo = res?.Data
          this.tableData = res?.Data?.GoodsList
        }
      }).finally(() => {
        rLoading.close()
      })
    },
    handleDownload () {
      const typeinfo = this.INVOICE_TYPE.filter((item) => item.enLabel.split(' ')[0] === this.transData.type)
      downloadFile({ MainID: this.transData.Id, InvoiceType: typeinfo[0].value })
    },
    handlePrint () {
      const typeinfo = this.INVOICE_TYPE.filter((item) => item.enLabel.split(' ')[0] === this.transData.type)
      previewFile({ MainID: this.transData.Id, InvoiceType: typeinfo[0].value })
    },
    handleSubmit () {
      this.sumbitLoading = true
      saveIdomesticEntrust({ ...this.interbookInfo, GoodsList: this.tableData }).then((res) => {
        if (res?.Code === 200) {
          this.$message.success(`保存${this.transData.ProductTypeName}-国内托运单(进口)`)
          this.handleCancel()
        }
      }).finally(() => {
        this.sumbitLoading = false
      })
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
