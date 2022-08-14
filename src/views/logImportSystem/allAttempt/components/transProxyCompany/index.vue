<template>
  <div class="trans-proxy-company">
    <div style="text-align: right; cursor: pointer;"><i class=" el-icon-close" style="cursor: pointer;"
        @click="handleClose()"></i></div>
    <field-set title=" 物流供应商" :borderBottom="true" class="transport-list">
      <form-search :form="form.props" :items="form.items" :values.sync="form.values" @search="handleFormSearch"
        @reset="handleReset" />
      <table-list class="transport-list" :tableProps="table.props" :columns="table.columns" :data="table.data"
        :paging.sync="table.paging" @refresh="handleSearch" :autoLoad='false'>
        <template #operation="{ row }">
          <table-button :list="getButtons(row)" />
        </template>
      </table-list>
    </field-set>
  </div>
</template>

<script>
import { getSupplierData } from '@/api/logImportSystem'
import axios from 'axios'

export default {
  name: 'TransProxyCompany',
  props: {
    transData: String
  },
  watch: {
    transData (val) {
      this.$nextTick(() => {
        this.handleSearch()
      })
    }
  },
  data () {
    return {
      baseUrl: process.env.VUE_APP_BASE_API3,
      form: {
        props: {
          labelWidth: '110px',
          labelPosition: 'right',
          labelSuffix: '：'
        },
        items: [
          {
            name: 'IMP_LIFNR',
            label: '供应商编码',
            type: 'input',
            props: {
              maxlength: 16
            }
          },
          {
            name: 'IMP_NAME',
            label: '供应商名称',
            type: 'input'
          }
        ],
        values: {
          IMP_LIFNR: '',
          IMP_NAME: ''
        }
      },
      table: {
        props: {
          height: 'calc(100vh - 220px)'
        },
        columns: [
          {
            prop: 'seque',
            label: '序号',
            type: 'index',
            width: '80'
          },
          {
            prop: 'LIFNR',
            label: '供应商编码',
            minWidth: '160'
          },
          {
            prop: 'KOINH',
            label: '供应商名称',
            minWidth: '220'
          },
          {
            prop: 'TELF1',
            label: '联系方式',
            minWidth: '220'
          },
          {
            type: 'slot',
            prop: 'operation',
            label: '操作',
            width: '120',
            fixed: 'right'
          }
        ],
        data: [],
        paging: {
          Total: 0,
          PageSize: 10,
          PageIndex: 1
        }
      }

    }
  },
  methods: {
    getButtons (row) {
      const btns = []
      btns.push({
        type: 'primary',
        label: '确认',
        icon: '',
        id: 'btnView',
        onClick: () => {
          this.$emit('confirm', row, this.transData)
        }
      })
      return btns
    },
    handleClose () {
      this.$emit('confirm', null, this.transData)
    },
    handleFormSearch () {
      this.table.paging = this.$options.data().table.paging
      this.handleSearch()
    },
    handleReset () {
      this.form.values = this.$options.data().form.values
      this.table.paging = this.$options.data().table.paging
      this.handleSearch()
    },
    handleSearch () {
      const rLoading = this.loadingShow({
        target: '.transport-list',
        fullscreen: false
      })
      const params = {}
      params.IMP_PAGE = this.table.paging.PageIndex
      params.IMP_AMOUNT = this.table.paging.PageSize

      // getSupplierData({ ...params, ...this.form.values })
      //   .then((res) => {
      //     if (res?.EXP_TOTAL.length !== 0) {
      //       this.table.data = res?.IT_ITEM || []
      //       this.table.paging.Total = res?.EXP_TOTAL
      //     }
      //   })
      //   .finally(() => {
      //     rLoading.close()
      //   })

      axios.get(`${this.baseUrl}/restcloud/sap/mm/zmm_vender_get`, {
        params: { ...params, ...this.form.values }
      }).then((res) => {
        if (res.status === 200) {
          if (res?.data.EXP_TOTAL.length !== 0) {
            this.table.data = res?.data.IT_ITEM || []
            this.table.paging.Total = res?.data.EXP_TOTAL
          }
        }
      }).finally(() => {
        rLoading.close()
      })
    }
  }
}
</script>

<style>
</style>
