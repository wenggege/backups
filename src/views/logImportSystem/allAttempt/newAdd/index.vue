<template>
  <div class="new-add">
    <div class="header">
      <type-select ref="typeform" @accept="handleProductType" :transData="{ status }"></type-select>
    </div>
    <div class="wrapper" v-if="typeinfo.ProductType">
      <h2 style="text-align: center;">{{ typeinfo.ProductTypeName || '免费样品' }}</h2>
      <base-info ref='baseform' :key="Math.random()" :transData="typeinfo" />
      <product-info ref='productform' :key="Math.random()" :transData="typeinfo" />
      <append-info ref='appendform' :key="Math.random()" />
    </div>
    <div class="footer" v-if="typeinfo.ProductType">
      <el-button type="primary" :loading="sumbitLoading" @click="handleSumbit">提交
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

import { addImportProductType } from '@/api/logImportSystem'
export default {
  name: 'NewAdd',
  components: { typeSelect, baseInfo, productInfo, appendInfo },
  data () {
    return {
      typeinfo: { // 产品类别表单
        ProductType: null,
        ProductTypeName: '',
        ProductTypeId: 'Free'
      },
      sumbitLoading: false,
      status: null
    }
  },
  computed: {
    DEMAND_DEPARTMENT () { // 需求单位
      return this.allSelectDict.DemandDepartment || []
    },
    SHIPPING_ADDRESS () { // 收货地址
      return this.allSelectDict.ShippingAddress || []
    },
    SHIPPING_METHOD () { // 运输方式
      return this.allSelectDict.ShippingMethod || []
    }
  },
  watch: {
    $route: {
      handler: function (route) {
        this.status = route?.params?.status || null
      },
      immediate: true
    }
  },
  methods: {
    handleProductType (param) {
      this.typeinfo = { ...param }
    },
    handleSumbit () {
      const typeform = new Promise((resolve, reject) => {
        const form = this.$refs.typeform.$refs.typeform
        form.validate((valid) => {
          if (valid) {
            resolve(form.model)
          }
        })
      })

      const baseform = new Promise((resolve, reject) => {
        const form = this.$refs.baseform.$refs.baseform.$refs.formSearch
        console.log('sdsd', form.model)
        form.validate((valid) => {
          if (valid) {
            resolve(form.model)
          }
        })
      })

      const productform = new Promise((resolve, reject) => {
        const form = this.$refs.productform.$refs.productform.$refs.tableform
        console.log('kdke', form.model)
        form.validate((valid) => {
          if (valid) {
            resolve(form.model) // 返回form表单数据
          }
        })
      })

      const appendform = new Promise((resolve, reject) => {
        const form = this.$refs.appendform.$refs.appendform
        form.validate((valid) => {
          if (valid) {
            resolve(this.$refs.appendform.appendInfo)
          }
        })
      })

      Promise.all([typeform, baseform, productform, appendform]).then((res) => {
        const DemandDepartmentName = this.getCellEnumValue(this.DEMAND_DEPARTMENT, res[1].DemandDepartmentCode) // 需求单位名称
        const DemandDepartmentNameEng = this.getCellEnumEnValue(this.DEMAND_DEPARTMENT, res[1].DemandDepartmentCode) // 需求单位英文名称
        const ReceiptAddress = this.getCellEnumValue(this.SHIPPING_ADDRESS, res[1].ReceiptAddress) // 收货地址转码
        const ReceiptAddressEng = this.getCellEnumEnValue(this.SHIPPING_ADDRESS, res[1].ReceiptAddress) // 收货地址转码
        const ShippingMethod = this.getCellEnumValue(this.SHIPPING_METHOD, res[1].ShippingMethod)

        const param = {}
        param.ImportAndExportMain = { ...res[0], ...res[1], DemandDepartmentName, DemandDepartmentNameEng, ReceiptAddress, ReceiptAddressEng, ShippingMethod }
        param.ProductDetailsList = [...res[2].tableData]
        param.AttachmentList = [...res[3]]

        const rLoading = this.loadingShow({
          target: '.new-add',
          fullscreen: false
        })
        addImportProductType(param).then((ret) => {
          if (ret?.Code === 200) {
            this.$message.success(`新增${res[0].ProductTypeName}类型成功！`)
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
.new-add {

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
