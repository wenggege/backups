<template>
  <div class="free-sample">
    <el-dialog :close-on-click-modal="false" :visible="visible" :title="transData.ProductTypeName + '-申报要素' || '申报要素'"
      width="60%" @close="handleClose">
      <div class="form">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="商品编码">
            <el-input v-model="freeInfo.ProductCode" />
          </el-descriptions-item>
          <el-descriptions-item label="品名">
            <el-input v-model="freeInfo.ProductChiName" />
          </el-descriptions-item>
          <el-descriptions-item label="品牌类型">
            <el-input v-model="freeInfo.BrandTypeName" />
          </el-descriptions-item>
          <el-descriptions-item label="出口享惠情况">
            <el-input v-model="freeInfo.DiscountMessage" />
          </el-descriptions-item>
          <el-descriptions-item label="成分含量">
            <el-input v-model="freeInfo.Content" />
          </el-descriptions-item>
          <el-descriptions-item label="用途">
            <el-input v-model="freeInfo.TherapyArea" />
          </el-descriptions-item>
          <el-descriptions-item label="签约日期" prop="tenantName">
            <el-date-picker v-model="freeInfo.ContractDate" value-format="yyyy-MM-ddTHH:mm:ss" type="date"
              placeholder="选择日期"></el-date-picker>
          </el-descriptions-item>
          <el-descriptions-item label="GTIN">
            <el-input v-model="freeInfo.GTIN" />
          </el-descriptions-item>

          <el-descriptions-item label="CAS">
            <el-input v-model="freeInfo.CAS" />
          </el-descriptions-item>
          <el-descriptions-item label="规格型号">
            <el-input v-model="freeInfo.Specifications" />
          </el-descriptions-item>
          <el-descriptions-item label="其他">
            <el-input v-model="freeInfo.Other" placeholder="非必报要素，请根据实际情况填报" />
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
import { getDeclareMain, saveDeclare, downloadFile, previewFile } from '@/api/logImportSystem'

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
      freeInfo: {},
      sumbitLoading: false
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
      getDeclareMain({ MainID: this.transData.Id }).then((res) => {
        if (res?.Code === 200) {
          this.freeInfo = res?.Data
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
      saveDeclare(this.freeInfo).then((res) => {
        if (res?.Code === 200) {
          this.$message.success(`保存${this.transData.ProductTypeName}-申报要素成功`)
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
.free-sample {}
</style>
