<template>
  <div class="taking">
    <field-set :title="pageTitle" :borderBottom="false">
      <el-form v-show="!INFOEDIT_STATUS" ref="takingform" :model="takingInfo" :rules="rules" status-icon
        label-suffix="：" label-position="right" label-width="100px">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item label="是否接单" prop="IsAcceptOrder">
              <el-radio-group v-model="takingInfo.IsAcceptOrder" @change="handleOrder">
                <el-radio :label=true>接单</el-radio>
                <el-radio :label=false>不接单</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="24" v-show="!takingInfo.IsAcceptOrder">
            <el-form-item label="不接单原因" prop="NOAcceptRemark" ref="NOAcceptRemark">
              <el-input v-model="takingInfo.NOAcceptRemark" placeholder="请输入" type="textarea" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流BP" prop="BP">
              <el-popover placement="right" width="400" trigger="click">
                <el-tree :data="personInfo" accordion :props="defaultProps" :render-content="renderContent"
                  :style="{ height: '500px', overflow: 'auto', display: 'flex' }" :highlight-current="true"
                  @node-click="data => handleNodeClick(data, 'BP', 'BPDoMainId')"></el-tree>
                <el-input slot="reference" v-model="takingInfo.BP" placeholder="请输入" @focus="handleButtonFocus" />
              </el-popover>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="物流OP" prop="OP">
              <el-popover placement="right" width="400" trigger="click">
                <el-tree :data="personInfo" accordion :props="defaultProps" :render-content="renderContent"
                  :style="{ height: '500px', overflow: 'auto', display: 'flex' }" :highlight-current="true"
                  @node-click="data => handleNodeClick(data, 'OP', 'OPDoMainId')"></el-tree>
                <el-input slot="reference" v-model="takingInfo.OP" placeholder="请输入" @focus="handleButtonFocus" />
              </el-popover>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div v-show="INFOEDIT_STATUS">
        <el-descriptions :column="1">
          <el-descriptions-item label="是否接单">{{ takingInfo.IsAcceptOrder ? '是' : '否' }}</el-descriptions-item>
          <el-descriptions-item label="不接单原因">{{ takingInfo.NOAcceptRemark }}</el-descriptions-item>
          <el-descriptions-item label="操作人">{{ takingInfo.IsAcceptOrder }}</el-descriptions-item>
          <el-descriptions-item label="操作时间">{{ takingInfo.IsAcceptOrder }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </field-set>
  </div>
</template>

<script>
export default {
  name: 'Taking',
  props: {
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    INFOEDIT_STATUS () { // 状态为编辑时
      return this.transData.status === 'INFOEDIT'
    }
  },
  watch: {
    transData: {
      handler (val) {
        if (Object.keys(val).length !== 0) {
          this.takingInfo = { ...val.ImportAndExportMain } || {}
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      takingInfo: {
        IsAcceptOrder: true,
        NOAcceptRemark: '',
        BPDoMainId: '',
        OPDoMainId: '',
        BP: '',
        OP: ''
      },
      rules: {
        IsAcceptOrder: [{ required: true, message: '请选择是否接单' }]
      },
      defaultProps: {
        children: 'Children',
        label: 'DeptName'
      },
      personInfo: [] // 人员信息数据
    }
  },
  methods: {
    handleOrder (value) {
      if (value) { // 接单 将不接单原因置为空
        this.rules.NOAcceptRemark = null
      } else {
        this.$refs.NOAcceptRemark.resetField()
        this.rules.NOAcceptRemark = [{ required: true, message: '请输入不接单原因' }]
      }
      this.rules = JSON.parse(JSON.stringify(this.rules))
      this.$nextTick(() => {
        this.$refs.NOAcceptRemark.clearValidate()
      })
    },
    handleNodeClick (data, item1, item2) {
      if (data.UserGUID) {
        this.takingInfo[item1] = data.EmpName
        this.takingInfo[item2] = data.DomainID
      }
    },
    renderContent (h, { node, data, store }) {
      return (
        <div>
          {data.UserGUID ? (
            <span>
              {data.EmpName}
            </span>
          ) : (
            <span>{data.DeptName}</span>
          )}
        </div>
      )
    },
    handleButtonFocus () {
      this.personInfo = []
      this.$nextTick(() => {
        this.personInfo = this.allPersonDict
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.taking {}
</style>
