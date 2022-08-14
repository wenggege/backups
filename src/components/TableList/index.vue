<template>
  <div class="TableList">
    <el-table v-if="showList" v-bind="tableProps" :border="
      typeof tableProps.border === 'boolean' ? tableProps.border : true
    " style="width: 100%" :data="data" :max-height="tableProps.maxHeight || 600" :size="tableProps.size || 'medium'"
      @selection-change="selectionChange">
      <el-table-column v-if="multipleSelect" fixed="left" type="selection" align="center" width="50">
      </el-table-column>

      <template v-for="(column, index) in columns">
        <el-table-column v-if="column.type === 'slot'" v-bind="column" :key="column.prop + index"
          :align="column.align || 'center'" scoped-slot>
          <template v-slot="scope">
            <slot v-bind="scope" :name="column.prop" />
          </template>
          <template v-slot:header>
            {{ column.label }}
            <slot :name="'h-' + column.prop" />
          </template>
        </el-table-column>

        <el-table-column v-else v-bind="column" :key="column.prop + index" :align="column.align || 'center'" :formatter="
          (row, columnData, cellValue) =>
            transformFormatter(column, row, columnData, cellValue)
        " show-overflow-tooltip scoped-slot>
          <template v-slot:header>
            {{ column.label }}
            <slot :name="'h-' + column.prop" />
          </template>
        </el-table-column>
      </template>
    </el-table>

    <slot></slot>

    <el-pagination v-if="showPaging" v-bind="innerPage" @size-change="handleSizeChange"
      @current-change="handleCurrentChange" />
  </div>
</template>

<script>
export default {
  name: 'TableList',
  props: {
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
      return typeof data.formatter === 'function' ? data.formatter({ row, column, cellValue }) : cellValue
    },
    selectionChange (rows) {
      this.$emit('selection', rows)
    },
    handleSizeChange (val) {
      this.$emit('update:paging', {
        PageSize: val,
        PageIndex: 1,
        Total: this.innerPage.total
      })
      this.$emit('refresh')
    },
    handleCurrentChange (val) {
      this.$emit('update:paging', {
        PageSize: this.innerPage.pageSize,
        PageIndex: val,
        Total: this.innerPage.total
      })
      this.$emit('refresh')
    }
  },
  watch: {
    paging: {
      handler (val) {
        this.innerPage.total = val.Total || 0
        this.innerPage.pageSize = val.PageSize || 0
        this.innerPage.currentPage = val.PageIndex || 1
      },
      deep: true
    }
  }
}
</script>

<style lang="scss">
.TableList {
  .el-button {
    border: none;
    font-size: 14px;
    padding: 2px;
    border-radius: 2px;
    // background-color: transparent;

    & [class*='el-icon-']+span {
      margin-left: 0;
    }
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
