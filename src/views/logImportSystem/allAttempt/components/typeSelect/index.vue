<template>
  <div class="type-select">
    <field-set title="进口物流需求申请" :borderBottom="false">
      <el-form ref="typeform" :model="typeinfo" label-position="right" label-width="100px" label-suffix="：">
        <el-row :gutter="16">
          <el-col :span="12">
            <el-form-item label="产品类别" prop="ProductType" :rules="{
              required: true,
              message: '请选择产品类别',
            }">
              <el-select v-model="typeinfo.ProductType" placeholder="请选择" @change="handleProductType"
                :disabled="LOGIS_STATUS || TAKING_STATUS || DETAILS_STATUS">
                <el-option v-for="item in PRODUCT_TYPE" :key="item.id" :label="item.label" :value="item.value" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-popover placement="top-start" width="400" trigger="hover">
              <el-descriptions title="备注" :column="1">
                <el-descriptions-item label="免费样品">客户/供应商免费提供给我司分析检测使用</el-descriptions-item>
                <el-descriptions-item label="仪器/设备">生产、测试用仪器、设备，有固定资产账</el-descriptions-item>
                <el-descriptions-item label="原料（采购）">生产用原料，有订单/合同</el-descriptions-item>
                <el-descriptions-item label="退运物料">原博腾发运出口客户退回货物</el-descriptions-item>
                <el-descriptions-item label="客供料">客户/供应商免费提供给我司生产成品</el-descriptions-item>
                <el-descriptions-item label="包材">原材料、成品、仪器设备等包装用材料</el-descriptions-item>
                <el-descriptions-item label="耗材">例如色谱柱</el-descriptions-item>
                <el-descriptions-item label="其他">未在上述类别中的，例如温度记录仪</el-descriptions-item>
              </el-descriptions>
              <i class="el-icon-question header-tip" slot="reference"></i>
            </el-popover>
          </el-col>
        </el-row>
      </el-form>
    </field-set>
  </div>
</template>

<script>
export default {
  name: 'TypeSelect',
  props: {
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    PRODUCT_TYPE () { // 产品类型下拉框
      return this.allSelectDict.ProductCategory || []
    },
    NEWADD_STATUS () { // 状态为新建可选
      return this.transData.status === 'NEWADD'
    },
    TAKING_STATUS () { // 状态为接单时，下拉框不可用
      return this.transData.status === 'TAKING'
    },
    DETAILS_STATUS () { // 状态为详情时，下拉框不可用
      return this.transData.status === 'DETAILS'
    },
    INFOEDIT_STATUS () { // 状态为编辑时，下拉框不可用
      return this.transData.status === 'INFOEDIT'
    },
    LOGIS_STATUS () { // 状态为编辑时，下拉框不可用
      return this.transData.status === 'LOGIS'
    }
  },
  data () {
    return {
      typeinfo: { // 产品类别表单
        ProductType: null,
        ProductTypeName: '',
        ProductTypeId: ''
      }
    }
  },
  watch: {
    transData: {
      handler (val) {
        if (Object.keys(val).length !== 0 && val.status !== 'NEWADD') {
          this.typeinfo = val.ImportAndExportMain || {}
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    handleProductType (value) { // 产品类别选择
      const typeinfo = this.PRODUCT_TYPE.filter((item) => item.value === value)
      this.typeinfo.ProductTypeName = typeinfo[0].label
      this.typeinfo.ProductTypeId = typeinfo[0].enLabel.split(' ')[0]
      this.$emit('accept', this.typeinfo)
    }
  }
}
</script>

<style lang="scss" scoped>
.type-select {
  .header-tip {
    color: #999999;
    line-height: 40px;
    font-size: 16px;
  }
}
</style>
