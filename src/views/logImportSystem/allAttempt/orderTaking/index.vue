<template>
  <div class="order-taking" v-if="basicInfo.ProductTypeId">
    <div class="header">
      <type-select ref="typeform" :transData="basicInfo"></type-select>
    </div>
    <div class="wrapper">
      <h2 style="text-align: center;">{{ basicInfo.ProductTypeName || '免费样品' }}</h2>
      <base-info ref='baseform' :key="Math.random()" :transData="basicInfo" />
      <product-info ref='productform' :key="Math.random()" :transData="basicInfo" />
      <append-info ref='appendform' :key="Math.random()" :transData="basicInfo" />
      <taking-info ref='takingform' :key="Math.random()" :transData="basicInfo" />
    </div>
    <div class="footer">
      <el-button type="primary" @click="handleComplete">提交
      </el-button>
      <el-button @click="handleClose">返回</el-button>
    </div>
  </div>
</template>

<script>
import typeSelect from '../components/typeSelect'
import baseInfo from '../components/baseInfo'
import productInfo from '../components/productInfo'
import appendInfo from '../components/appendInfo'
import takingInfo from '../components/takingInfo'

import { getDetailsInfo, editImportProductType } from '@/api/logImportSystem'

export default {
  name: 'OrderTaking',
  components: { typeSelect, baseInfo, productInfo, appendInfo, takingInfo },
  data () {
    return {
      basicInfo: {},
      showStatus: null
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
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.showStatus = route?.params?.status || null
        this.handleDetailInfo(route.params)
      },
      immediate: true
    }
  },
  methods: {
    handleDetailInfo (params) {
      const rLoading = this.loadingShow({ target: '.all-order-taking', fullscreen: false })
      getDetailsInfo({ Id: params.Id }).then((res) => {
        if (res?.Code === 200 && res?.Data !== '') {
          this.basicInfo = { ...params, ...res.Data }
          const typeinfo = this.PRODUCT_TYPE.filter((item) => item.value === res.Data.ImportAndExportMain.ProductType)
          this.basicInfo.ProductTypeId = typeinfo[0].enLabel.split(' ')[0]
        }
      }).finally(() => {
        rLoading.close()
      })
    },
    handleComplete () {
      if (this.showStatus === 'TAKING') {
        this.handleOrderSumbit()
      }
      if (this.showStatus === 'INFOEDIT') {
        this.handleEditSumbit()
      }
    },
    handleOrderSumbit () {
      const form = this.$refs.takingform.$refs.takingform
      form.validate((valid) => {
        if (valid) {
          const rLoading = this.loadingShow({
            target: '.order-taking',
            fullscreen: false
          })
          this.basicInfo.ImportAndExportMain = { ...this.basicInfo.ImportAndExportMain, ...form.model }
          editImportProductType({ ...this.basicInfo }).then((res) => {
            if (res?.Code === 200) {
              this.$message.success(res?.Message || '操作成功')
              this.$router.push({ name: 'LogsImportSystem' })
            }
          }).finally(() => {
            rLoading.close()
          })
        }
      })
    },
    handleEditSumbit () {
      const baseform = new Promise((resolve, reject) => {
        const form = this.$refs.baseform.$refs.baseform.$refs.formSearch
        form.validate((valid) => {
          if (valid) {
            resolve(form.model)
          }
        })
      })

      const productform = new Promise((resolve, reject) => {
        const form = this.$refs.productform.$refs.productform.$refs.tableform
        form.validate((valid) => {
          if (valid) {
            resolve(form.model) // 返回form表单数据
          }
        })
      })

      Promise.all([baseform, productform]).then((res) => {
        let ReceiptAddress, ReceiptAddressEng
        // if (!Number.isNaN(Number(res[0].DemandDepartmentName))) {
        const DemandDepartmentName = this.getCellEnumValue(this.DEMAND_DEPARTMENT, res[0].DemandDepartmentCode) // 需求单位名称
        const DemandDepartmentNameEng = this.getCellEnumEnValue(this.DEMAND_DEPARTMENT, res[0].DemandDepartmentCode)
        // } else {
        //   DemandDepartmentName = res[0].DemandDepartmentName
        //   DemandDepartmentNameEng = res[0].DemandDepartmentNameEng
        // }

        if (!Number.isNaN(Number(res[0].ReceiptAddress))) {
          ReceiptAddress = this.getCellEnumValue(this.SHIPPING_ADDRESS, res[0].ReceiptAddress) // 收货地址转码
          ReceiptAddressEng = this.getCellEnumEnValue(this.SHIPPING_ADDRESS, res[0].ReceiptAddress)
        } else {
          ReceiptAddress = res[0].ReceiptAddress
          ReceiptAddressEng = res[0].ReceiptAddressEng
        }

        this.basicInfo.ImportAndExportMain = { ...res[0], DemandDepartmentName, ReceiptAddress, ReceiptAddressEng, DemandDepartmentNameEng }
        this.basicInfo.ProductDetailsList = [...res[1].tableData]
        const rLoading = this.loadingShow({
          target: '.order-taking',
          fullscreen: false
        })
        editImportProductType(this.basicInfo).then((res) => {
          if (res?.Code === 200) {
            this.$message.success(res?.Message || '操作成功')
            this.$router.push({ name: 'LogsImportSystem' })
          }
        }).finally(() => {
          rLoading.close()
        })
      })
    },
    handleClose () {
      this.$router.push({ name: 'LogsImportSystem' })
    }
  }
}
</script>

<style lang="scss" scoped>
.order-taking {
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
