<template>
  <div class="declaration">
    <el-dialog :close-on-click-modal="false" :visible="visible" :title="transData.ProductTypeName + '-进口报关单' || '进口报关单'"
      width="80%" @close="handleClose" class="form">
      <div>
        <div style="text-align: right;padding-bottom: 10px;">编号：{{ declarationInfo.BusinessCode }}</div>
        <el-descriptions :column="5" direction="vertical" border>
          <el-descriptions-item label="境内收货人">
            <el-input v-model="declarationInfo.ReceiptOrg" />
          </el-descriptions-item>
          <el-descriptions-item label="进境关别">
            <el-input v-model="declarationInfo.EntryClearance" />
          </el-descriptions-item>
          <el-descriptions-item label="进口日期">
            <el-date-picker v-model="declarationInfo.ImportDate" value-format="yyyy-MM-ddTHH:mm:ss" type="date"
              placeholder="选择日期"></el-date-picker>
          </el-descriptions-item>
          <el-descriptions-item label="申报日期">
            <el-date-picker v-model="declarationInfo.DeclarationDate" value-format="yyyy-MM-ddTHH:mm:ss" type="date"
              placeholder="选择日期"></el-date-picker>
          </el-descriptions-item>
          <el-descriptions-item label="备案号">
            <el-input v-model="declarationInfo.RecordNumber" />
          </el-descriptions-item>

          <el-descriptions-item label="境外发货人">
            <el-input v-model="declarationInfo.OutSideShipOrg" />
          </el-descriptions-item>
          <el-descriptions-item label="运输方式">
            <el-input v-model="declarationInfo.ByWay" />
          </el-descriptions-item>
          <el-descriptions-item label="运输工具名称及航次号">
            <el-input v-model="declarationInfo.Transportation" />
          </el-descriptions-item>
          <el-descriptions-item label="提运单号">
            <el-input v-model="declarationInfo.WayBillNumber" />
          </el-descriptions-item>
          <el-descriptions-item label="货物存放地点">
            <el-input v-model="declarationInfo.GoodsStorageLocation" />
          </el-descriptions-item>

          <el-descriptions-item label="消费使用单位">
            <el-input v-model="declarationInfo.ConsumptionDepartment" />
          </el-descriptions-item>
          <el-descriptions-item label="监管方式">
            <el-input v-model="declarationInfo.Supervision" />
          </el-descriptions-item>
          <el-descriptions-item label="征免性质">
            <el-input v-model="declarationInfo.ExemptionNature" />
          </el-descriptions-item>
          <el-descriptions-item label="许可证号">
            <el-input v-model="declarationInfo.PermitNumber" />
          </el-descriptions-item>
          <el-descriptions-item label="启运港">
            <el-input v-model="declarationInfo.PortOfDeparture" />
          </el-descriptions-item>

          <el-descriptions-item label="合同协议号">
            <el-input v-model="declarationInfo.Agreement" />
          </el-descriptions-item>
          <el-descriptions-item label="贸易国(地区)">
            <el-input v-model="declarationInfo.TradingCountry" />
          </el-descriptions-item>
          <el-descriptions-item label="启运国(地区)">
            <el-input v-model="declarationInfo.CountryDeparture" />
          </el-descriptions-item>
          <el-descriptions-item label="经停港">
            <el-input v-model="declarationInfo.PortOfCall" />
          </el-descriptions-item>
          <el-descriptions-item label="入境口岸">
            <el-input v-model="declarationInfo.PortEntry" />
          </el-descriptions-item>

        </el-descriptions>
        <el-descriptions :column="8" direction="vertical" border>
          <el-descriptions-item label="包装种类">
            <el-input v-model="declarationInfo.packagingType" />
          </el-descriptions-item>
          <el-descriptions-item label="件数">
            <el-input v-model="declarationInfo.NumberPieces" />
          </el-descriptions-item>
          <el-descriptions-item label="毛重(千克)">
            <el-input v-model="declarationInfo.GrossWeight" />
          </el-descriptions-item>
          <el-descriptions-item label="净重">
            <el-input v-model="declarationInfo.NetWeight" />
          </el-descriptions-item>
          <el-descriptions-item label="成交方式">
            <el-input v-model="declarationInfo.ClinchWay" />
          </el-descriptions-item>
          <el-descriptions-item label="运费">
            <el-input v-model="declarationInfo.Freight" />
          </el-descriptions-item>
          <el-descriptions-item label="保费">
            <el-input v-model="declarationInfo.Premium" />
          </el-descriptions-item>
          <el-descriptions-item label="杂费">
            <el-input v-model="declarationInfo.OtherAmount" />
          </el-descriptions-item>
        </el-descriptions>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="随附单证及编号">
            <el-input v-model="declarationInfo.ComesWithFile" />
          </el-descriptions-item>
          <el-descriptions-item label="标记唛码及备注">
            <el-input v-model="declarationInfo.Reamrk" />
          </el-descriptions-item>
        </el-descriptions>
        <el-table :data="tableData" height="250" border style="width: 100%">
          <el-table-column prop="LineNumber" label="序号" width="180">
          </el-table-column>
          <el-table-column prop="ProductNumber" label="商品编号" width="180">
          </el-table-column>
          <el-table-column prop="ProductNameOrmodel" label="商品名称及规格型号" width="180">
          </el-table-column>
          <el-table-column prop="QuantityUnit" label="数量及单位" width="180">
          </el-table-column>
          <el-table-column prop="PriceOrCurrencyOrTotal" label="单价/总价/币制" width="180">
          </el-table-column>
          <el-table-column prop="CountryOrigin" label="原产国(地区)" width="180">
          </el-table-column>
          <el-table-column prop="FinallyDestinationCountry" label="最终目的国(地区)" width="180">
          </el-table-column>
          <el-table-column prop="DomesticDestination" label="境内目的地" width="180">
          </el-table-column>
          <el-table-column prop="Exemption" label="征免" width="180">
          </el-table-column>
        </el-table>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="特殊关系确认">
            <el-input v-model="declarationInfo.SpecialConfirm" />
          </el-descriptions-item>
          <el-descriptions-item label="价格影响确认">
            <el-input v-model="declarationInfo.PriceConfirm" />
          </el-descriptions-item>
          <el-descriptions-item label="支付特许权使用费确认">
            <el-input v-model="declarationInfo.PayConcessionConfirm" />
          </el-descriptions-item>
          <el-descriptions-item label="自报自缴">
            <el-input v-model="declarationInfo.SelfReportSelfPay" />
          </el-descriptions-item>
        </el-descriptions>
        <div class="form flex">
          <div style="line-height: 80px;">
            <div class="flex">
              <span>报关人员</span>
              <span style="padding: 0 90px">报关人员证号</span>
              <span style="padding: 0 90px">电话</span>
              <span> 兹申明对以上内容承担如实申报、依法纳税责任</span>
            </div>
            <div class="form-top flex">
              <span style="padding-left:100px;">申报单位</span>
              <span style="padding-right:100px;">申报单位(签章)</span>
            </div>
          </div>
          <div class="form-after">
            <span>海关批注及签章</span>
          </div>
        </div>
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
import { getDraftCustomsDeclaration, saveDraftCustomsDeclaration, downloadFile, previewFile } from '@/api/logImportSystem'

export default {
  name: 'Declaration',
  props: {
    visible: Boolean,
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      declarationInfo: {},
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
    handleQuery () {
      const rLoading = this.loadingShow({
        target: '.form',
        fullscreen: false
      })
      getDraftCustomsDeclaration({ MainID: this.transData.Id }).then((res) => {
        if (res?.Code === 200) {
          this.declarationInfo = res?.Data
          this.tableData = res?.Data?.DetailsList
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
      saveDraftCustomsDeclaration({ ...this.declarationInfo, DetailsList: this.tableData }).then((res) => {
        if (res?.Code === 200) {
          this.$message.success(`保存${this.transData.ProductTypeName}-进口报关单`)
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
.declaration {
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .form {
    border: 1px solid #EBEEF5;

    .form-top {
      border-top: 1px solid #EBEEF5;
      line-height: 40px;
    }

    .form-after {
      border-left: 1px solid #EBEEF5;
      line-height: 120px;
      padding: 0 40px;
    }
  }
}
</style>
