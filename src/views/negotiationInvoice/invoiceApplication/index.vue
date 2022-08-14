<template>
  <div class="container">
    <form-search :form="form.props" :items="form.items" :values.sync="form.values" @reset="handleReset" @search="search" />
    <table-list :columns="table.columns" :data="table.data" :paging.sync="table.paging" :showPaging="false" multipleSelect @refresh="handleSearch" @selection="selectChange">
      <template #OrderInfoId="{ row }">
        <a  @click.prevent="handleLink(row)">{{ row.OrderInfoId }}</a>
      </template>
      <template #InvoiceType="{ row }">
        <span v-if="!row.isSelect" @click="typeClick(row)"> {{ typeList.find(item => item.id === row.InvoiceType ).label}} </span>
        <el-select v-else v-model="row.InvoiceType" size="mini" placeholder="请选择" @change="typeChange(row)">
          <el-option v-for="item in typeList" :key="item.id" :label="item.label" :value="item.value" />
        </el-select>
      </template>
      <template #operation="{ row }">
        <table-button :list="getButtons(row)" />
      </template>
    </table-list>
    <div class="footer">
      <div class="footer_content">
        <div>已选择<span>{{selectRows.length}}</span>项内容</div>
      <div><table-handle :buttons="buttons" /></div>
      </div>
      <div>
        <el-pagination v-bind="innerPage" background @current-change="handleCurrentChange" @size-change="handleSizeChange" />
      </div>
    </div>
  </div>
</template>

<script>
import { getApplylist, } from '@/api/negotiationInvoice'
export default {
  name: "NegotiationInvoice",
  components: {
  },
  data () {
    const INVOICE_TYPE = [
      {
        label:'增值',
        id:0,
        value:0
      },
      {
        label:'商业',
        id:1,
        value:1
      },
      {
        label:'红票(冲销)',
        id:2,
        value:2
      },
    ]
    return {
      typeList:INVOICE_TYPE,
      form: {
        props: {
          labelWidth: '110px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        items: [
          {
            name: 'SalesOrderNumber',
            label: '订单号',
            type: 'input',
          },
          {
            name: 'PortonCode',
            label: '产品号',
            type: 'input',
          },
        ],
        values: {
          SalesOrderNumber: '',
          PortonCode: '',
        },
      },
      buttons: [
        {
          id:'invoiceApplication',
          type: '',
          label: '申请开票',
          disabled: true,
          onClick: () => {
            this.checkType()
            //this.$router.push({ name: 'InvoiceApplicationDetail', params: {} })
          }
        },
      ],
      table: {
        props: {
        },
        columns: [
          {
            prop: 'OrderInfoId',
            type: 'slot',
            label: '订单号',
            minWidth: '140'
          },
          {
            prop: 'PortonCode',
            label: '产品号',
            minWidth: '150'
          },
          {
            prop: 'OrderCurrency',
            label: '币别',
            minWidth: '120'
          },
          {
            prop: 'OrderTotalAmount',
            label: '订单金额',
            minWidth: '120'
          },
          {
            prop: 'CompleteAmount',
            label: '已开票金额',
            width: '120'
          },
          {
            prop: 'SurplusAmount',
            label: '剩余可开票金额',
            minWidth: '120'
          },
          {
            prop: 'InvoiceType',
            type: 'slot',
            label: '发票类型',
            minWidth: '120'
          },
          {
            prop: 'Num',
            label: '数量',
            minWidth: '120'
          },
          {
            prop: 'Unit',
            label: '单位',
            minWidth: '120'
          },
          {
            prop: 'InvoicRemarks',
            label: '特殊要求',
            minWidth: '120'
          },
          {
            type: 'slot',
            prop: 'operation',
            label: '操作',
            width: '220',
            fixed: 'right'
          }
        ],
        data: [],
        paging: {
          Total: 0,
          PageSize: 10,
          PageIndex: 1
        }
      },
      innerPage: {
        pageSize: 20,
        currentPage: 1,
        total: 0,
        pageSizes: [10, 20, 50,100, 200],
        layout: 'total, sizes, prev, pager, next'
      },
      selectRows: []
    }
  },
  computed: {},
  watch: {
    selectRows(val) {
      this.buttons.forEach(item => {
        if (item.id === 'invoiceApplication' && val.length) {
          item.disabled = false
          item.type = 'primary'
        } else {
          item.disabled = true
          item.type = ''
        }
      })
    }
  },
  methods:{
    search() {},
    getButtons (row) {
      const btns = []
      btns.push({
        type: 'primary',
        label: '文件',
        icon: '',
        id: 'fileId',
        onClick: () => {
          //this.$router.push({ name: 'OrderTaking', params: { status: 'TAKING', Id: row.Id } })
        }
      })
      btns.push({
        type: 'primary',
        label: '冲销发票',
        icon: '',
        id: 'invoiceId',
        onClick: () => {
          // this.$router.push({ name: 'DetailsImport', params: { status: 'DETAILS', Id: row.Id } })
          //this.$router.push({ path: `./detailsImport/${row.Id}`, query: { status: 'DETAILS' } })
        }
      })
      btns.push({
        type: 'primary',
        label: '导出ISO',
        icon: '',
        id: 'export',
        onClick: () => {
          //this.$router.push({ name: 'OrderTaking', params: { status: 'TAKING', Id: row.Id } })
        }
      })
      return btns
    },

    // 表单重置
    handleReset () {
      this.form.values = this.$options.data().form.values
      this.innerPage = this.$options.data().innerPage
      this.handleSearch()
    },

    // 表单查询
    search () {
      this.innerPage.currentPage = 1,
      this.handleSearch()
    },

    // 查询列表信息
    handleSearch () {
      const params = {
        ...this.form.values,
        pageSize: this.innerPage.pageSize,
        pageIndex: this.innerPage.currentPage
      }
      getApplylist(params).then((res) => {
        if (res?.Code === 0) {
          this.table.data = res?.Data
          this.innerPage.total = res?.Count
          if (this.table.data.length) {
            this.table.data.forEach(item => {
              item.isSelect = false
            })
          }
        }
      }).finally(() => {
      })
    },

    // 发票类型选择
    typeChange (row) {
      row.isSelect = false
      this.table.data.forEach((item,index) => {
        if (item.OrderInfoId === row.OrderInfoId) {
          item = row
          this.$set(this.table.data,index,item)
        }
      })
    },

    // 表格checkbox发生改变时
    selectChange(row) {
      this.selectRows = row
    },

    //切换每页条数
    handleSizeChange(val) {
      this.innerPage.pageSize = val
      this.innerPage.currentPage = 1;
      this.handleSearch()
    },

    //切换当前页
    handleCurrentChange(val) {
      this.innerPage.currentPage = val;
      this.handleSearch()
    },

    //订单号跳转详情
    handleLink(row) {
      this.$router.push({ path: `./InvoiceApplicationDetail/${row.OrderInfoId}`})
    },

    // 点击发票类型文本，切换为下拉框选择
    typeClick(row) {
      row.isSelect = true
      this.table.data.forEach((item,index) => {
        if (item.OrderInfoId === row.OrderInfoId) {
          item = row
          this.$set(this.table.data,index,item)
        }
      })
    },

    // 申请开票
    checkType() {
      console.log(this.selectRows)
      const isSameType = this.selectRows.every((item, i, arr) => item.InvoiceType === arr[0].InvoiceType) //判断所选订单的发票类型是否一致
      console.log(isSameType)
      if (isSameType) {
        // todo  申请开票
      } else {
        this.$message.error(`请选择发票类型一致的订单号`)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.container{
  padding: 0 !important;
  overflow-y: hidden;
  .footer{
    display: flex;
    align-items: center;
    justify-content: space-between;
    .footer_content{
      margin-left: 50px;
      display: flex;
      align-items: center;
    }
    .TableHandle {
      background-color: #fff;
      border: 0;
    }
  }
}
a {
    font-size: 14px;
    color: #1765EC;
  }
</style>