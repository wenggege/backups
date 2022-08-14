<template>
  <div class="product-info">
    <field-set title="进口产品信息" :borderBottom="false">
      <table-handle :buttons="listButtons" v-if="!TAKING_STATUS && !DETAILS_STATUS" />
      <table-edit-list :key="Math.random()" ref="productform" :columns="CURRENT_INFO.columns"
        :data="CURRENT_INFO.tableDataFrom.tableData" :paging.sync="CURRENT_INFO.paging"
        :tableDataFrom="CURRENT_INFO.tableDataFrom" :showPaging="false" :tableProps="{ class: 'customTable' }">
        <template #Quantity="{ row }">
          <el-input v-show="row.edit" v-model="row.Quantity" placeholder="请输入" @change="handlePrice(row)">
          </el-input>
          <span v-show="!row.edit">
            {{ row.Quantity }}
          </span>
        </template>
        <template #Unit="{ row, index }">
          <el-input v-show="row.edit" :disabled="index >= 1" v-model="row.Unit" placeholder="请输入"
            @change="handlePrice(row)">
          </el-input>
          <span v-show="!row.edit">
            {{ row.Unit }}
          </span>
        </template>
        <template #CountAmount="{ row }">
          <el-input v-show="row.edit" v-model="row.CountAmount" placeholder="请输入" @change="handlePrice(row)">
          </el-input>
          <span v-show="!row.edit">
            {{ row.CountAmount }}
          </span>
        </template>
        <template #CurrencyCode="{ row }">
          <el-select v-show="row.edit" v-model="row.CurrencyCode" placeholder="请选择">
            <el-option v-for="item in CURRENCY_TYPE" :key="item.value" :label="`${item.label}(${item.enLabel})`"
              :value="item.value" />
          </el-select>
          <span v-show="!row.edit">
            {{ getCellEnumValue(CURRENCY_TYPE, row.CurrencyCode) }} ({{ getCellEnumEnValue(CURRENCY_TYPE,
                row.CurrencyCode)
            }})
          </span>
        </template>
        <template #IsOldMachine="{ row }">
          <el-select v-show="row.edit" v-model="row.IsOldMachine" placeholder="请选择">
            <el-option v-for="item in MACHINE_TYPE" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span v-show="!row.edit">
            {{ getCellEnumValue(MACHINE_TYPE, row.IsOldMachine) }}
          </span>
        </template>
        <template #BrandType="{ row }">
          <el-select v-show="row.edit" v-model="row.BrandType" placeholder="请选择">
            <el-option v-for="item in BRAND_TYPE" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <span v-show="!row.edit">
            {{ getCellEnumValue(BRAND_TYPE, row.BrandType) }}
          </span>
        </template>
        <template #StructuralFormula="{ row, index }">
          <el-upload class="upload-file" action="" v-model="row.StructuralFormula" list-type="picture-card"
            :on-preview="uploadPreview" :on-remove="uploadRemove"
            :class="{ 'httpRequestImg': httpRequestImg || row.StructuralFormula }" accept=".jpg, .jpeg, .png" :limit="1"
            :http-request="options => httpRequest(options, row)" :file-list="fileList[index]">
            <i class="el-icon-plus" style="font-size: 30px;"></i>
          </el-upload>
        </template>
        <template #operation="{ row, column }">
          <table-button :list="getButtons(row, column)" />
        </template>
      </table-edit-list>
    </field-set>
    <el-dialog :visible.sync="previewVisible" custom-class="image-preview" @close="handleDialog">
      <img width="100%" :src="previewImageUrl" alt />
    </el-dialog>
  </div>
</template>

<script>
import { fileUpload } from '@/api/logImportSystem'
import { regTrueMoney, regQuantity } from '@/utils/regular'

export default {
  name: 'ProductInfo',
  props: {
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    CURRENCY_TYPE () { // 币种下拉框
      return this.allSelectDict.Currency || []
    },
    DETAILS_STATUS () { // 状态为详情时，下拉框不可用
      return this.transData.status === 'DETAILS'
    },
    TAKING_STATUS () { // 状态为接单时时
      return this.transData.status === 'TAKING'
    },
    CURRENT_INFO () {
      return this.productinfo[this.transData.ProductTypeId]
    },
    BRAND_TYPE () { // 品牌类型
      return this.allSelectDict.BRAND_TYPE || []
    },
    MACHINE_TYPE () { // 是否旧机电
      return this.allSelectDict.PRICE_TYPE || []
    }
  },
  watch: {
    transData: {
      handler (val) {
        if (Object.keys(val).length !== 0 && val.status) {
          this.handleProductList(JSON.stringify(val))
        }
      },
      immediate: true,
      deep: true
    }
  },
  data () {
    return {
      fileList: [],
      httpRequestImg: false, // 展示单个图片
      detailList: [],
      previewImageUrl: '',
      previewVisible: false,
      listButtons: [ // 列表添加按钮
        {
          type: 'primary',
          icon: 'el-icon-circle-plus-outline',
          label: '添加',
          onClick: () => {
            let isSave = false // 判断是否有保存的数据
            const tabRefs = this.$refs.productform.$refs.tableform
            tabRefs.model.tableData.forEach((item) => {
              if (item.edit) isSave = true
            })
            if (isSave) { // 有未保存的数据
              this.$message.info('有未保存的数据，请先保存')
              return
            }
            tabRefs.validate((valid) => {
              if (valid) {
                this.httpRequestImg = false
                const tempData = tabRefs.model.tableData
                this.CURRENT_INFO.tableDataFrom.tableData.push(
                  this.$options.data().productinfo[this.transData.ProductTypeId].tableDataFrom.tableData[0]
                )
                if (tempData.length > 1 && tempData[0].Unit) {
                  tempData[tempData.length - 1].Unit = tempData[0].Unit
                }
                this.handleDialog()
              }
            })
          }
        }
      ],
      productinfo: {
        Free: { // 免费样品
          props: {
            height: 'calc(100vh - 220px)'
          },
          columns: [
            {
              prop: 'ProductCode',
              label: '产品代码',
              minWidth: '120',
              required: true
            },
            {
              prop: 'ProductChiName',
              label: '产品中文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'ProductEngName',
              label: '产品英文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'Quantity',
              type: 'slot',
              label: '数量',
              minWidth: '150',
              required: true,
              rules: [{ pattern: regQuantity, message: '输入小数点后4位' }]
            },
            {
              prop: 'Unit',
              label: '单位',
              type: 'slot',
              minWidth: '100',
              placeholder: '例：KG',
              required: true
            },
            {
              prop: 'UnitPrice',
              label: '单价',
              width: '120',
              required: true,
              disabled: true
            },
            {
              prop: 'CountAmount',
              type: 'slot',
              label: '总金额',
              minWidth: '150',
              required: true,
              rules: [{ pattern: regTrueMoney, message: '输入小数点后2位' }]
            },
            {
              type: 'slot',
              prop: 'CurrencyCode',
              label: '币种',
              minWidth: '140',
              required: true
            },
            {
              prop: 'ProductOutward',
              label: '产品外观',
              minWidth: '120',
              placeholder: '例：淡黄色至黄色粉末',
              required: true
            },
            {
              prop: 'CAS',
              label: 'CAS号码',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Content',
              label: '含量',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Molecular',
              label: '分子式',
              minWidth: '120',
              required: true
            },
            {
              prop: 'MolecularWeight',
              label: '分子量',
              minWidth: '120',
              required: true
            },
            {
              prop: 'TherapyArea',
              label: '用途及治疗领域',
              minWidth: '120',
              placeholder: '例：用于心脑血管领域医药中间体',
              required: true
            },
            {
              type: 'slot',
              prop: 'StructuralFormula',
              label: '结构式',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'operation',
              label: '操作',
              width: '140',
              fixed: 'right',
              rules: []
            }
          ],
          tableDataFrom: {
            tableData: [
              {
                ProductCode: '',
                ProductChiName: '',
                ProductEngName: '',
                Quantity: '',
                Unit: '',
                UnitPrice: '',
                CountAmount: '',
                CurrencyCode: '',
                ProductOutward: '',
                CAS: '',
                Content: '',
                Molecular: '',
                MolecularWeight: '',
                TherapyArea: '',
                StructuralFormula: '',
                edit: true
              }
            ]
          },
          paging: {
            Total: 0,
            PageSize: 10,
            PageIndex: 1
          }
        },
        Packaging: { // 包材
          props: {
            height: 'calc(100vh - 220px)'
          },
          columns: [
            {
              prop: 'ProductChiName',
              label: '产品中文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'Quantity',
              type: 'slot',
              label: '数量',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regQuantity, message: '输入小数点后4位' }]
            },
            {
              prop: 'Unit',
              label: '单位',
              minWidth: '100',
              placeholder: '例：KG',
              required: true
            },
            {
              prop: 'UnitPrice',
              label: '单价',
              width: '100',
              required: true,
              disabled: true
            },
            {
              prop: 'CountAmount',
              type: 'slot',
              label: '总金额',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regTrueMoney, message: '输入小数点后2位' }]
            },
            {
              type: 'slot',
              prop: 'CurrencyCode',
              label: '币种',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Brand',
              label: '品牌',
              minWidth: '120',
              placeholder: '例：淡黄色至黄色粉末',
              required: true
            },
            {
              prop: 'Material',
              label: '材质',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Function',
              label: '用途',
              minWidth: '120',
              required: true
            },
            {
              prop: 'CountryOrigin',
              label: '原产国',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'operation',
              label: '操作',
              width: '140',
              fixed: 'right'
            }
          ],
          tableDataFrom: {
            tableData: [
              {
                ProductChiName: '',
                Quantity: '',
                Unit: '',
                UnitPrice: '',
                CountAmount: '',
                CurrencyCode: '',
                Brand: '',
                Material: '',
                Function: '',
                CountryOrigin: '',
                edit: true
              }
            ]
          },
          paging: {
            Total: 0,
            PageSize: 10,
            PageIndex: 1
          }
        },
        Customer: { // 客供料
          props: {
            height: 'calc(100vh - 220px)'
          },
          columns: [
            {
              prop: 'ProductCode',
              label: '产品代码',
              minWidth: '120',
              required: true
            },
            {
              prop: 'ProductChiName',
              label: '产品中文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'ProductEngName',
              label: '产品英文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'Quantity',
              type: 'slot',
              label: '数量',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regQuantity, message: '输入小数点后4位' }]
            },
            {
              prop: 'Unit',
              label: '单位',
              minWidth: '100',
              placeholder: '例：KG',
              required: true
            },
            {
              prop: 'UnitPrice',
              label: '单价',
              width: '100',
              required: true,
              disabled: true
            },
            {
              prop: 'CountAmount',
              type: 'slot',
              label: '总金额',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regTrueMoney, message: '输入小数点后2位' }]
            },
            {
              type: 'slot',
              prop: 'CurrencyCode',
              label: '币种',
              minWidth: '120',
              required: true
            },
            {
              prop: 'ProductOutward',
              label: '产品外观',
              minWidth: '120',
              placeholder: '例：淡黄色至黄色粉末',
              required: true
            },
            {
              prop: 'CAS',
              label: 'CAS号码',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Content',
              label: '含量',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Molecular',
              label: '分子式',
              minWidth: '120',
              required: true
            },
            {
              prop: 'MolecularWeight',
              label: '分子量',
              minWidth: '120',
              required: true
            },
            {
              prop: 'TherapyArea',
              label: '用途及治疗领域',
              minWidth: '120',
              placeholder: '例：用于心脑血管领域医药中间体',
              required: true
            },
            {
              prop: 'CountryOrigin',
              label: '原产国',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'StructuralFormula',
              label: '结构式',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'operation',
              label: '操作',
              width: '140',
              fixed: 'right'
            }
          ],
          tableDataFrom: {
            tableData: [
              {
                ProductCode: '',
                ProductChiName: '',
                ProductEngName: '',
                Quantity: '',
                Unit: '',
                UnitPrice: '',
                CountAmount: '',
                CurrencyCode: '',
                ProductOutward: '',
                CAS: '',
                Content: '',
                Molecular: '',
                MolecularWeight: '',
                TherapyArea: '',
                CountryOrigin: '',
                StructuralFormula: '',
                edit: true
              }
            ]
          },
          paging: {
            Total: 0,
            PageSize: 10,
            PageIndex: 1
          }
        },
        Raw: { // 原料采购
          props: {
            height: 'calc(100vh - 220px)'
          },
          columns: [
            {
              prop: 'ProductCode',
              label: '产品代码',
              minWidth: '120',
              required: true
            },
            {
              prop: 'ProductChiName',
              label: '产品中文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'ProductEngName',
              label: '产品英文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'Quantity',
              label: '数量',
              type: 'slot',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regQuantity, message: '输入小数点后4位' }]
            },
            {
              prop: 'Unit',
              label: '单位',
              minWidth: '100',
              placeholder: '例：KG',
              required: true
            },
            {
              prop: 'UnitPrice',
              label: '单价',
              width: '100',
              required: true,
              disabled: true
            },
            {
              prop: 'CountAmount',
              type: 'slot',
              label: '总金额',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regTrueMoney, message: '输入小数点后2位' }]
            },
            {
              type: 'slot',
              prop: 'CurrencyCode',
              label: '币种',
              minWidth: '120',
              required: true
            },
            {
              prop: 'ProductOutward',
              label: '产品外观',
              minWidth: '120',
              placeholder: '例：淡黄色至黄色粉末',
              required: true
            },
            {
              prop: 'CAS',
              label: 'CAS号码',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Content',
              label: '含量',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Molecular',
              label: '分子式',
              minWidth: '120',
              required: true
            },
            {
              prop: 'MolecularWeight',
              label: '分子量',
              minWidth: '120',
              required: true
            },
            {
              prop: 'TherapyArea',
              label: '用途及治疗领域',
              minWidth: '120',
              placeholder: '例：用于心脑血管领域医药中间体',
              required: true
            },
            {
              prop: 'CountryOrigin',
              label: '原产国',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'StructuralFormula',
              label: '结构式',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'operation',
              label: '操作',
              width: '140',
              fixed: 'right'
            }
          ],
          tableDataFrom: {
            tableData: [
              {
                ProductCode: '',
                ProductChiName: '',
                ProductEngName: '',
                Quantity: '',
                Unit: '',
                UnitPrice: '',
                CountAmount: '',
                CurrencyCode: '',
                ProductOutward: '',
                CAS: '',
                Content: '',
                Molecular: '',
                MolecularWeight: '',
                TherapyArea: '',
                CountryOrigin: '',
                StructuralFormula: '',
                edit: true
              }
            ]
          },
          paging: {
            Total: 0,
            PageSize: 10,
            PageIndex: 1
          }
        },
        Instruments: { // 仪器设备
          props: {
            height: 'calc(100vh - 220px)'
          },
          columns: [
            {
              prop: 'ProductChiName',
              label: '产品中文名称',
              minWidth: '150',
              required: true
            },
            {
              type: 'slot',
              prop: 'IsOldMachine',
              label: '是否为旧机电',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Quantity',
              type: 'slot',
              label: '数量',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regQuantity, message: '输入小数点后4位' }]
            },
            {
              prop: 'Unit',
              label: '单位',
              minWidth: '100',
              placeholder: '例：KG',
              required: true
            },
            {
              prop: 'UnitPrice',
              label: '单价',
              width: '100',
              required: true,
              disabled: true
            },
            {
              prop: 'CountAmount',
              type: 'slot',
              label: '总金额',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regTrueMoney, message: '输入小数点后2位' }]
            },
            {
              type: 'slot',
              prop: 'CurrencyCode',
              label: '币种',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Brand',
              label: '品牌',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'BrandType',
              label: '品牌类型',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Function',
              label: '功能',
              minWidth: '120',
              required: true
            },
            {
              prop: 'WorkingPrinciple',
              label: '工作原理',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Model',
              label: '型号',
              minWidth: '120',
              required: true
            },
            {
              prop: 'CountryOrigin',
              label: '原产国',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Other',
              label: '其他',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'operation',
              label: '操作',
              width: '140',
              fixed: 'right'
            }
          ],
          tableDataFrom: {
            tableData: [
              {
                ProductChiName: '',
                IsOldMachine: '',
                Quantity: '',
                Unit: '',
                UnitPrice: '',
                CountAmount: '',
                CurrencyCode: '',
                Brand: '',
                BrandType: '',
                Function: '',
                WorkingPrinciple: '',
                Model: '',
                CountryOrigin: '',
                Other: '',
                edit: true
              }
            ]
          },
          paging: {
            Total: 0,
            PageSize: 10,
            PageIndex: 1
          }
        },
        Returned: { // 退运物料
          props: {
            height: 'calc(100vh - 220px)'
          },
          columns: [
            {
              prop: 'ProductCode',
              label: '产品代码',
              minWidth: '120',
              required: true
            },
            {
              prop: 'ProductChiName',
              label: '产品中文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'ProductEngName',
              label: '产品英文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'Quantity',
              type: 'slot',
              label: '数量',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regQuantity, message: '输入小数点后4位' }]
            },
            {
              prop: 'Unit',
              label: '单位',
              minWidth: '100',
              placeholder: '例：KG',
              required: true
            },
            {
              prop: 'UnitPrice',
              label: '单价',
              width: '100',
              required: true,
              disabled: true
            },
            {
              prop: 'CountAmount',
              type: 'slot',
              label: '总金额',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regTrueMoney, message: '输入小数点后2位' }]
            },
            {
              type: 'slot',
              prop: 'CurrencyCode',
              label: '币种',
              minWidth: '120',
              required: true
            },
            {
              prop: 'ProductOutward',
              label: '产品外观',
              minWidth: '120',
              placeholder: '例：淡黄色至黄色粉末',
              required: true
            },
            {
              prop: 'CAS',
              label: 'CAS号码',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Content',
              label: '含量',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Molecular',
              label: '分子式',
              minWidth: '120',
              required: true
            },
            {
              prop: 'MolecularWeight',
              label: '分子量',
              minWidth: '120',
              required: true
            },
            {
              prop: 'TherapyArea',
              label: '用途及治疗领域',
              minWidth: '120',
              placeholder: '例：用于心脑血管领域医药中间体',
              required: true
            },
            {
              prop: 'CountryOrigin',
              label: '原产国',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'StructuralFormula',
              label: '结构式',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'operation',
              label: '操作',
              width: '140',
              fixed: 'right'
            }
          ],
          tableDataFrom: {
            tableData: [
              {
                ProductCode: '',
                ProductChiName: '',
                ProductEngName: '',
                Quantity: '',
                Unit: '',
                UnitPrice: '',
                CountAmount: '',
                CurrencyCode: '',
                ProductOutward: '',
                CAS: '',
                Content: '',
                Molecular: '',
                MolecularWeight: '',
                TherapyArea: '',
                CountryOrigin: '',
                StructuralFormula: '',
                edit: true
              }
            ]
          },
          paging: {
            Total: 0,
            PageSize: 10,
            PageIndex: 1
          }
        },
        Consumables: { // 耗材
          props: {
            height: 'calc(100vh - 220px)'
          },
          columns: [
            {
              prop: 'ProductChiName',
              label: '产品中文名称',
              minWidth: '150',
              required: true
            },
            {
              prop: 'Quantity',
              type: 'slot',
              label: '数量',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regQuantity, message: '输入小数点后4位' }]
            },
            {
              prop: 'Unit',
              label: '单位',
              minWidth: '100',
              placeholder: '例：KG',
              required: true
            },
            {
              prop: 'UnitPrice',
              label: '单价',
              width: '100',
              required: true,
              disabled: true
            },
            {
              prop: 'CountAmount',
              type: 'slot',
              label: '总金额',
              minWidth: '120',
              required: true,
              rules: [{ pattern: regTrueMoney, message: '输入小数点后2位' }]
            },
            {
              type: 'slot',
              prop: 'CurrencyCode',
              label: '币种',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Brand',
              label: '品牌',
              minWidth: '120',
              placeholder: '例：淡黄色至黄色粉末',
              required: true
            },
            {
              prop: 'Material',
              label: '材质',
              minWidth: '120',
              required: true
            },
            {
              prop: 'Function',
              label: '用途',
              minWidth: '120',
              required: true
            },
            {
              prop: 'CountryOrigin',
              label: '原产国',
              minWidth: '120',
              required: true
            },
            {
              type: 'slot',
              prop: 'operation',
              label: '操作',
              width: '140',
              fixed: 'right'
            }
          ],
          tableDataFrom: {
            tableData: [
              {
                ProductChiName: '',
                Quantity: '',
                Unit: '',
                UnitPrice: '',
                CountAmount: '',
                CurrencyCode: '',
                Brand: '',
                Material: '',
                Function: '',
                CountryOrigin: '',
                edit: true
              }
            ]
          },
          paging: {
            Total: 0,
            PageSize: 10,
            PageIndex: 1
          }
        }
      }
    }
  },
  methods: {
    getButtons (row, column) { // 列表中操作项按钮处理
      const btns = []
      if (this.TAKING_STATUS || this.DETAILS_STATUS) { // 待定
        const tds = document.querySelectorAll('.' + column.id)
        tds.forEach((item) => {
          item.style.display = 'none'
        })
      }
      if (!row.edit) {
        btns.push({
          type: 'info',
          label: '编辑',
          icon: '',
          id: 'btnEdit',
          onClick: () => {
            row.edit = true
            const localIndex = this.CURRENT_INFO.tableDataFrom.tableData.indexOf(row)
            this.$set(this.CURRENT_INFO.tableDataFrom.tableData, localIndex, row)
            if (localIndex !== -1) {
              this.handleDialog()
            }
          }
        })
      } else {
        btns.push({
          type: 'success',
          label: '保存',
          icon: '',
          id: 'btnSave',
          onClick: () => {
            const tabRefs = this.$refs.productform.$refs.tableform
            console.log('FILET Save', this.fileList, tabRefs)
            tabRefs.validate(async (valid) => {
              if (valid) {
                row.edit = false
                const localIndex = this.CURRENT_INFO.tableDataFrom.tableData.indexOf(row)
                this.$set(this.CURRENT_INFO.tableDataFrom.tableData, localIndex, row)
                if (localIndex !== -1) {
                  this.handleDialog()
                }
              }
            })
          }
        })
      }

      btns.push({
        type: 'danger',
        label: '删除',
        icon: '',
        id: 'btnDel',
        onClick: () => {
          this.$confirm('确定删除该数据', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          })
            .then(() => {
              const tableData = this.CURRENT_INFO.tableDataFrom.tableData

              const localIndex = tableData.indexOf(row)
              tableData.splice(localIndex, 1)
              this.fileList.splice(localIndex, 1)

              this.handleDialog()
            })
            .catch(() => {
              this.$message.info('已取消删除')
            })
        }
      })

      return btns
    },
    handleProductList (params) { // 处理查询回的数据
      const tempList = JSON.parse(params)
      this.detailList = tempList.ProductDetailsList
      if (this.detailList.length !== 0) {
        this.detailList.forEach((item) => {
          item.edit = false
        })

        this.detailList.forEach((item, index) => { // 图片单独处理
          this.fileList[index] = [{
            url: item.StructuralFormula,
            name: item.StructuralFormula
          }]
        })
        this.CURRENT_INFO.tableDataFrom.tableData = [...this.detailList]
      }
    },
    handlePrice (row) {
      const num = Number(row.Quantity)
      let total = Number(row.CountAmount)
      if (Number.isNaN(total)) total = 0
      if (Number.isNaN(num) || row.Quantity === '') {
        row.UnitPrice = 0
      } else {
        row.UnitPrice = (total / num).toFixed(2)
      }
    },
    httpRequest (params, row) {
      this.httpRequestImg = true
      const file = params.file
      var form = new FormData()
      form.append('file', file)
      fileUpload(form).then((res) => {
        if (res?.Code === 200) {
          const ret = res.Data.map((item) => {
            return {
              name: item.FileName,
              url: item.WebUrl
            }
          })
          const localIndex = this.CURRENT_INFO.tableDataFrom.tableData.indexOf(row)
          this.fileList[localIndex] = ret
          row.StructuralFormula = res.Data[0].WebUrl
          this.$set(this.CURRENT_INFO.tableDataFrom.tableData, localIndex, row)
          this.$message.success(res?.Message || '上传成功')

          this.handleDialog()
        } else {
          this.$message.error(res?.Message || '上传失败')
        }
      }).catch((err) => {
        this.$message.error(err || '上传失败')
      }).finally(() => {

      })
    },
    uploadRemove (file, fileList) { // 删除图片
      const localIndex = this.fileList.findIndex((item) => item[0] === file)
      this.fileList[localIndex] = []
      this.httpRequestImg = false
      this.CURRENT_INFO.tableDataFrom.tableData[localIndex].StructuralFormula = ''
    },
    uploadPreview (file) { // 预览图片
      this.previewImageUrl = file.url
      this.previewVisible = true
    },
    handleDialog () {
      this.$nextTick(() => { // 编辑后 隐藏图片上的删除按钮
        const editArray = []
        const tableData = this.CURRENT_INFO.tableDataFrom.tableData
        for (let index = 0; index < tableData.length; index++) {
          if (!tableData[index].edit) editArray.push(index)
        }

        const tds = document.querySelectorAll(
          '.customTable .upload-file .el-upload-list__item-actions'
        )
        if (tds.length !== 0) { // 隐藏保存状态下的 图片删除按钮
          [...tds].forEach((item, index) => {
            editArray.forEach((res) => {
              if (res === index) item.childNodes[1].style.display = 'none'
            })
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.product-info {
  ::v-deep .customTable {
    .upload-file {
      .el-upload-list--picture-card .el-upload-list__item {
        margin: 0px 0 0 0;
      }
    }

    .el-form-item__content {
      //  line-height: 0px;
    }

    .httpRequestImg {
      .el-upload--picture-card {
        display: none;
      }

    }
  }

  ::v-deep .image-preview {
    .el-dialog__header {
      border: none;
    }

    .el-dialog__title {
      &:before {
        content: none;
      }
    }
  }
}
</style>
