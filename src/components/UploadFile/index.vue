<template>
  <el-upload ref="upload" class="UploadFile" :class="{ hide: hideUpload }" :key="'upload_' + new Date().getTime()"
    :action="action" :accept="accept" :name="name" :data="localData" :multiple="multiple" :limit="limit"
    :file-list="fileList" :disabled="disabled" :auto-upload="autoUpload" :headers="headers" :list-type="listType"
    :before-upload="beforeUpload" :on-change="handleChange" :on-success="handleSuccess" :on-error="handleError"
    :on-exceed="handleExceed" :on-remove="handleRemove" :on-preview="handlePictureCardPreview"
    :http-request="httpRequest" :before-remove="beforeRemove">
    <el-button :loading="uploadLoading" v-if="listType === 'text'" type="primary" :size="buttonSize"
      :disabled="disabled" v-preventReclick="reclick" :icon="btnIcon">{{ btnText }}</el-button>
    <div v-else class="btn">
      <i :class="btnIcon"></i>
      <p>{{ btnText }}</p>
    </div>

    <slot name="download"></slot>
  </el-upload>
</template>

<script>
// import { getFileInfo } from '@/api/common'

export default {
  name: 'UploadFile',
  props: {
    // 绑定的值
    value: [String, Number],
    limit: {
      type: Number,
      default: 1
    },
    multiple: {
      type: Boolean,
      default: false
    },
    autoUpload: {
      type: Boolean,
      default: true
    },
    disabled: {
      type: Boolean,
      default: false
    },
    accept: {
      type: String,
      default: '' // .jpg,.jpeg,.png,.xls,.xlsx,.doc,.docx,.wav,.mp3,.msg
    },
    action: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: 'fileName'
    },
    data: {
      type: Object,
      default: () => ({})
    },
    buttonText: {
      type: String
    },
    buttonIcon: {
      // 仅支持el-icon
      type: String
    },
    buttonSize: {
      type: String,
      default: 'medium'
    },
    // 上传文件大小限制（单位：M）
    limitSize: {
      type: Number,
      default: 0
    },
    // 上传按钮点击间隔
    reclick: {
      type: Number,
      default: 2000
    },
    // v-model 绑定值
    bindKey: {
      type: String,
      default: 'id'
    },
    // 文件列表的类型
    listType: {
      type: String,
      default: 'text' // text、picture、picture-card
    }
  },
  data () {
    return {
      fileList: [],
      chooseNum: 0,
      hideUpload: false, // 隐藏上传按钮
      uploadLoading: false
    }
  },
  computed: {
    localData () {
      return {
        ...this.data
      }
    },
    headers () {
      return {
        Authorization: this.$store.getters.token
      }
    },
    btnText () {
      return this.buttonText ?? (this.autoUpload ? '上传' : '选择')
    },
    btnIcon () {
      return (
        this.buttonIcon ??
        (this.listType === 'text' ? 'el-icon-upload2' : 'el-icon-plus')
      )
    }
  },
  mounted () {
    // this.initFileList()
  },
  methods: {
    // 图片列表-缩略图回显
    initFileList () {
      if (/^(\d+(,)?)+$/.test(this.value)) {
        const ids = this.value.split(',')
        const fileList = []
        ids.forEach(async (id) => {
          const res = await getFileInfo(id)
          if (res?.code === 0 && res?.data) {
            fileList.push({
              uid: res.data.id,
              name: res.data.fileName,
              url: this.getFileFullPath(res.data.path),
              status: 'success'
            })
          }
        })
        this.$set(this, 'fileList', fileList)
      } else if (/^group/.test(this.value)) {
        this.fileList.push({
          uid: new Date().getTime(),
          name: this.value,
          url: this.getFileFullPath(this.value),
          status: 'success'
        })
      }
    },
    blobToBase64 (blob) {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader()
        fileReader.onload = (e) => {
          resolve(e.target.result)
        }
        // readAsDataURL
        fileReader.readAsDataURL(blob)
        fileReader.onerror = () => {
          reject(new Error('blobToBase64 error'))
        }
      })
    },
    // 更新FileList (解决上传多张图片时，缩略图无法显示问题)
    updateFileList (file, fileList) {
      if (this.listType !== 'text') {
        this.blobToBase64(file.raw).then((res) => {
          // 转化后的base64
          fileList.some((item) => {
            if (item.uid === file.uid) {
              item.url = res
              return true
            }
          })
          this.$set(this, 'fileList', fileList)
        })
      } else {
        this.$set(this, 'fileList', fileList)
      }
    },
    /**
     * 文件上传相关
     */
    handleExceed () {
      this.$message.error(`最多上传${this.limit}个文件`)
    },
    beforeUpload (file) {
      console.log('beforeUpload:::', file)
      if (this.chooseNum > this.limit) {
        this.$message.error(`一次最多上传${this.limit}个文件`)
        return false
      }
      if (file.name.length > 50) {
        this.$message.error('上传文件名不能超过50个字符')
        return false
      }
      if (this.limitSize) {
        if (file.size / 1024 / 1024 > this.limitSize) {
          this.$message.error(`上传文件不能大于${this.limitSize}M`)
          return false
        }
      }
      if (this.accept) {
        const ext = file.name.split('.').pop()
        if (!this.accept.includes(ext)) {
          this.$message.error(`无效的文件类型！仅支持 ${this.accept} 的格式`)
          return false
        }
      }
      this.uploadLoading = true
    },
    // 选择文件
    handleChange (file, fileList) {
      console.log('handleChange:::', file, fileList)
      const chooseNum =
        this.$refs.upload.$refs['upload-inner'].$refs.input.files.length
      if (chooseNum) {
        this.chooseNum = chooseNum
      }

      if (!this.autoUpload) {
        this.updateFileList(file, fileList)
        this.$emit('change', file, fileList)
      }
    },
    // 删除附件
    handleRemove (file, fileList) {
      this.fileList = fileList
      this.$emit('remove', file, fileList)
    },
    //
    handlePictureCardPreview (file) {
      this.$emit('preview', file)
    },
    beforeRemove (file, fileList) {
      if (file && file.status === 'success') {
        this.$emit('beforeRemove', file, fileList)
      }
    },
    httpRequest (params) {
      this.$emit('httpRequest', params, this.bindKey)
    },
    // 上传成功
    handleSuccess (res, file, fileList) {
      console.log(res)
      console.log(file, fileList)
      if (res?.code === 0 || res?.code === '0') {
        this.updateFileList(file, fileList)
        if (this.$listeners.success) {
          this.$emit('success', res, file, fileList)
        } else {
          this.$emit('input', res[this.bindKey])
        }
      } else {
        this.$message.error(res.msg || '上传失败')
        this.$nextTick(() => {
          this.fileList = fileList.filter((item) => item.uid !== file.uid)
          this.$listeners.error && this.$emit('error', res, file, fileList)
        })
      }
      this.uploadLoading = false
    },
    // 上传失败
    handleError (err, file, fileList) {
      console.log(err)
      this.$message.error(err)
      this.$nextTick(() => {
        this.fileList = fileList.filter((item) => item.uid !== file.uid)
        this.$listeners.error && this.$emit('error', err, file, fileList)
      })
      this.uploadLoading = false
    },
    // 触发上传
    submit () {
      this.$refs.upload.submit()
    }
  },
  watch: {
    fileList: {
      handler () {
        if (this.listType !== 'text') {
          // 隐藏上传按钮
          this.$nextTick(() => {
            this.hideUpload = this.fileList.length >= this.limit
          })
        }
      },
      immediate: true
    }
  }
}
</script>

<style lang="scss">
//@import "@styles/variables.scss";

.UploadFile {
  &.hide {
    .el-upload--picture-card {
      display: none;
    }
  }
}
</style>
