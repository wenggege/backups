<template>
  <div class="agreements">
    <el-dialog :close-on-click-modal="false" :visible="visible"
      :title="transData.ProductTypeName + '-' + SHOW_TYPE || SHOW_TYPE" width="60%" @close="handleClose" class="form">
      <div>
        <div style="text-align: right;padding-bottom: 10px;" v-if="BUTTON_TYPE === 'contract'">
          <h3>SAMPLE AGREEMENT</h3>
          <h4>货样协议</h4>
        </div>
        <div style="text-align: right;padding-bottom: 10px;" v-else>
          <h3>Commercial invoice</h3>
          <h4>商业发票</h4>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Seller(卖方公司)">
            <el-input v-model="agreementInfo.OutSideShipOrg" />
          </el-descriptions-item>
          <el-descriptions-item label="Contact person(联系人)">
            <el-input v-model="agreementInfo.SellerContactPerson" />
          </el-descriptions-item>
          <el-descriptions-item label="Phone NO(电话)">
            <el-input v-model="agreementInfo.SellerTelephone" />
          </el-descriptions-item>
          <el-descriptions-item label="Address(地址)">
            <el-input v-model="agreementInfo.OutSideShipAddress" />
          </el-descriptions-item>
        </el-descriptions>

        <div class="location">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="Buyer(买方公司)">
              <el-input v-model="agreementInfo.DemandDepartmentNameEng" />
            </el-descriptions-item>
            <el-descriptions-item label="Contact person(联系人)">
              <el-input v-model="agreementInfo.BuyerContactPerson" />
            </el-descriptions-item>
            <el-descriptions-item label="Phone NO(电话)">
              <el-input v-model="agreementInfo.BuyerTelephone" />
            </el-descriptions-item>
            <el-descriptions-item label="Address(地址)">
              <el-input v-model="agreementInfo.ReceiptAddressEng" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <div>Hereby agreed by both parties,signed an agreement according to the following terms:</div>
        <div class="location">SAMPLE ONLY</div>
        <el-table :data="tableData" height="250" border style="width: 100%">
          <el-table-column prop="ProductNameEng" label="Name of goods（商品名称）" width="180">
          </el-table-column>
          <el-table-column prop="NetWeight" label="Quantity（数量）" width="180">
          </el-table-column>
          <el-table-column prop="Nuit" label="Unit （单位）" width="180">
          </el-table-column>
          <el-table-column prop="UnitPric" label="Unit value" width="180">
          </el-table-column>
          <el-table-column prop="TotalAmount" label="Total value" width="180">
          </el-table-column>
        </el-table>
        <div class="location">(Free of Charge)</div>
        <div class="location-fs">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="成交方式">
              <el-input v-model="agreementInfo.ClinchWay" />
            </el-descriptions-item>
            <el-descriptions-item label="Freight">
              <el-input v-model="agreementInfo.Freight" />
            </el-descriptions-item>
            <el-descriptions-item label="Insurance">
              <el-input v-model="agreementInfo.Premium" />
            </el-descriptions-item>
            <el-descriptions-item label="Total value">
              <el-input v-model="agreementInfo.TotalValue" />
            </el-descriptions-item>
          </el-descriptions>
        </div>
        <el-descriptions :column="1" border>
          <el-descriptions-item label="Country of origin(原产国)">
            <el-input v-model="agreementInfo.CountryOrigin" />
          </el-descriptions-item>
        </el-descriptions>
        <div class="flex">
          <span>Seller's signature/chop</span>
          <span>Buyer's signature and chop</span>
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
import {
  getInvoiceMain, saveInvoice, getPackingListMain,
  savePackingList, getContractMain, saveContract, downloadFile, previewFile
} from '@/api/logImportSystem'

export default {
  name: 'Agreements',
  props: {
    visible: Boolean,
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    BUTTON_TYPE () {
      return this.transData.type
    },
    INVOICE_TYPE () {
      return this.allSelectDict.invoice || []
    },
    SHOW_TYPE () {
      let rets = ''
      if (this.BUTTON_TYPE === 'contract') {
        rets = '合同'
      }
      if (this.BUTTON_TYPE === 'invoice') {
        rets = '发票'
      }
      if (this.BUTTON_TYPE === 'Box') {
        rets = '箱单'
      }
      return rets
    }
  },
  data () {
    return {
      agreementInfo: {},
      sumbitLoading: false,
      tableData: [],
      requestGet: {
        contract: getContractMain,
        invoice: getInvoiceMain,
        Box: getPackingListMain
      },
      requestSave: {
        contract: saveContract,
        invoice: saveInvoice,
        Box: savePackingList
      }
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
      this.requestGet[this.BUTTON_TYPE]({ MainID: this.transData.Id }).then((res) => {
        if (res?.Code === 200) {
          this.agreementInfo = res?.Data
          this.tableData = res?.Data?.CommodityList
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
      this.requestSave[this.BUTTON_TYPE]({ ...this.agreementInfo, CommodityList: this.tableData }).then((res) => {
        if (res?.Code === 200) {
          this.$message.success(`保存${this.transData.ProductTypeName}-${this.SHOW_TYPE}成功`)
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
          this.agreementInfo = {}
          this.handleQuery()
        })
      }
    }
  }
}
</script>

<style  lang='scss' scoped>
.agreements {
  .flex {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .location {
    padding: 20px 0;
  }

  .location-fs {
    width: 50%;
    left: 50%;
    position: relative;
  }
}
</style>
