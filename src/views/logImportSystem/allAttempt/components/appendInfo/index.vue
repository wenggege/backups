<template>
  <div class="append-info">
    <field-set title="附件信息" :borderBottom="false">
      <div slot="right" class="append-right">
        传递附件需求（除样品外，所有资料全部上传，不限于MSDS、合同、发票、箱单等）
      </div>
      <el-form ref="appendform" :model="form" status-icon label-suffix="：" label-position="right">
        <el-row>
          <el-col :span="24">
            <el-form-item label="附件" prop="SourceFileName" :rules="{
              required: true,
              message: '附件信息不能为空',
              trigger: 'blur',
            }">
              <upload-file ref="uploadFile" v-show="!TAKING_STATUS && !DETAILS_STATUS" v-model="form.SourceFileName"
                accept=".xls,.xlsx,.doc,.docx,.pdf" :limit="10" @remove="handleRemove" @httpRequest="httpRequest"
                @preview="handlePreview">
              </upload-file>
              <div v-show="TAKING_STATUS || DETAILS_STATUS" class="file-list">
                <ul>
                  <li v-for="item in appendInfo" :key="item.name">
                    <a :href="item.url" target="_blank">
                      {{ item.name }}
                    </a>
                  </li>
                </ul>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </field-set>
  </div>
</template>

<script>
import { fileUpload } from '@/api/logImportSystem'

export default {
  name: 'AppendInfo',
  props: {
    transData: {
      type: Object,
      default: () => ({})
    }
  },
  computed: {
    TAKING_STATUS () { // 状态为接单时，下拉框不可用
      return this.transData.status === 'TAKING'
    },
    DETAILS_STATUS () { // 状态为详情时，下拉框不可用
      return this.transData.status === 'DETAILS'
    }
  },
  data () {
    return {
      form: {
        SourceFileName: ''
      },
      appendInfo: [],
      isUpload: false
    }
  },
  watch: {
    transData: {
      handler (val) {
        if (Object.keys(val).length !== 0) {
          this.handleAppendInfo(JSON.stringify(val))
          this.form.SourceFileName = 'success'
        }
      },
      immediate: true,
      deep: true
    }
  },
  mounted () {
    this.$refs.uploadFile.fileList = this.appendInfo
  },
  methods: {
    httpRequest (params) {
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
          this.$refs.uploadFile.fileList = [...this.$refs.uploadFile.fileList, ...ret]
          this.appendInfo = this.$refs.uploadFile.fileList.map((item) => {
            return {
              SourceFileName: item.name,
              FilePath: item.url
            }
          })
          this.isUpload = true
          this.form.SourceFileName = 'success'
          this.$message.success(res?.Message || '上传成功')
        } else {
          this.$message.error(res?.Message || '上传失败')
        }
      }).catch((err) => {
        this.$message.error(err || '上传失败')
      }).finally(() => {
        this.$refs.uploadFile.uploadLoading = false
      })
    },
    handleAppendInfo (params) {
      const tempList = JSON.parse(params)

      if (tempList?.AttachmentList) {
        this.appendInfo = tempList.AttachmentList.map((item) => {
          return {
            name: item.SourceFileName,
            url: item.FilePath
          }
        })
      }
    },
    handleRemove (file, fileList) {
      this.appendInfo = fileList.map((item) => {
        return {
          SourceFileName: item.name,
          FilePath: item.url
        }
      })
    },
    handlePreview (file) {
      window.open(file.url)
    }
  }
}
</script>

<style lang="scss" scoped>
.append-info {
  .append-right {
    line-height: 40px;
  }

  .file-list {
    display: inline-block;
    color: blue;

    ul {
      margin: 0;
      padding: 0;
    }

    li {
      margin: 0;
      padding: 0;
      list-style: none;
    }
  }
}
</style>
