<template>
  <div class="TableEditList">
    <el-form ref="tableform" :model="tableDataFrom">
      <el-table v-if="showList" v-bind="tableProps" :key="Math.random()" :border="
        typeof tableProps.border === 'boolean' ? tableProps.border : true
      " style="width: 100%" :data="data" :max-height="tableProps.maxHeight || 600" :size="tableProps.size || 'medium'"
        @selection-change="selectionChange" :span-method="arraySpanMethod">
        <el-table-column v-if="multipleSelect" fixed="left" type="selection" align="center" width="50">
        </el-table-column>

        <template v-for="(item, index) in columns">
          <el-table-column v-if="item.type === 'slot'" v-bind="item" :key="item.prop + index"
            :align="item.align || 'center'">
            <template v-slot="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.' + item.prop" :rules="item.rules ? [{
                required: item.required || false,
                message: item.label + '不能为空',
                trigger: 'change',
              }, ...item.rules] : [{
                required: item.required || false,
                message: item.label + '不能为空',
                trigger: 'change',
              }]">
                <slot v-bind="{ ...scope, item, index: scope.$index }" :name="item.prop" />
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === ' index'" v-bind="item" :key="item.prop + index"
            :align="item.align || 'center'"
            :formatter="(row, columnData, cellValue) => transformFormatter(item, row, columnData, cellValue)"
            show-overflow-tooltip>
          </el-table-column>
          <el-table-column v-else v-bind="item" :key="item.prop + index" :align="item.align || 'center'" :formatter="
            (row, columnData, cellValue) =>
              transformFormatter(item, row, columnData, cellValue)
          " show-overflow-tooltip>
            <template slot-scope="scope">
              <el-form-item :prop="'tableData.' + scope.$index + '.' + item.prop" :rules="item.rules ? [{
                required: item.required || false,
                message: item.label + '不能为空',
                trigger: 'change',
              }, ...item.rules] : [{
                required: item.required || false,
                message: item.label + '不能为空',
                trigger: 'change',
              }]">
                <el-input :disabled="disabled || item.disabled"
                  v-show="(item.edit && item.edit !== undefined) || (scope.row.edit && scope.row.edit !== undefined)"
                  v-model="scope.row[item.prop]" :placeholder="item.placeholder || '请输入'" />
                <span
                  v-show="(!item.edit && item.edit !== undefined) || (!scope.row.edit && scope.row.edit !== undefined)">
                  {{ scope.row[item.prop] }}
                </span>
              </el-form-item>

            </template>
          </el-table-column>
        </template>
      </el-table>
    </el-form>
    <slot></slot>

    <el-pagination v-if="showPaging" v-bind="innerPage" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>

export default {
  name: 'TableEditList',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    columns: {
      type: Array
    },
    data: {
      type: Array
    },
    tableProps: {
      type: Object,
      default: () => ({})
    },
    multipleSelect: {
      type: Boolean,
      default: false
    },
    showList: {
      type: Boolean,
      default: true
    },
    showPaging: {
      type: Boolean,
      default: true
    },
    paging: {
      type: Object,
      default: () => ({})
    },
    autoLoad: {
      type: Boolean,
      default: true
    },
    tableDataFrom: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      innerPage: {
        pageSize: 10,
        currentPage: 1,
        total: 0,
        pagerCount: 7,
        pageSizes: [10, 20, 50, 200],
        layout: 'total, sizes, jumper, prev, pager, next'
      }
    }
  },
  mounted () {
    if (this.autoLoad) {
      this.$nextTick(() => {
        this.$emit('refresh')
      })
    }
  },
  methods: {
    transformFormatter (data, row, column, cellValue) {
      return typeof data.formatter === 'function'
        ? data.formatter({ row, column, cellValue })
        : cellValue
    },
    selectionChange (rows) {
      this.$emit('selection', rows)
    },
    arraySpanMethod ({ row, column, rowIndex, columnIndex }) {
      this.$emit('spanmethod', { row, column, rowIndex, columnIndex })
    },
    handleSizeChange (val) {
      this.$emit('update:paging', {
        pageSize: val,
        currentPage: 1,
        total: this.innerPage.total
      })
      this.$emit('refresh')
    },
    handleCurrentChange (val) {
      this.$emit('update:paging', {
        pageSize: this.innerPage.pageSize,
        currentPage: val,
        total: this.innerPage.total
      })
      this.$emit('refresh')
    }
  },
  watch: {
    paging: {
      handler (val) {
        this.innerPage.total = val.total || 0
        this.innerPage.pageSize = val.pageSize || 0
        this.innerPage.currentPage = val.currentPage || 1
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.TableEditList {
  .el-button {
    border: none;
    font-size: 14px;
    padding: 2px;
    border-radius: 2px;
    // background-color: transparent;

    & [class*="el-icon-"]+span {
      margin-left: 0;
    }
  }

  .el-form-item {
    // margin-bottom: 0px;
  }

  .el-pagination {
    margin-top: 14px;
    text-align: right;
  }

  .el-pagination__sizes,
  .el-pagination__total {
    float: left;
  }
}
</style>
