<template>
  <div class="field-set">
    <el-row class="field-set-header" :class="{ borderBottom: borderBottom }" :style="headerStyle" type="flex">
      <el-col :span="10" class="field-set-header--title">
        <i class="mark" :style="{ backgroundColor: markColor }"></i>
        {{ title }}
      </el-col>
      <el-col :span="14" class="field-set-header-right">
        <slot name="right"></slot>
        <field-icon v-if="showCollapse" :text="collapseStatus ? '展开' : '收起'" color="#4C7EE9" icon-class="collapse"
          @click.native="handleCollapse">
        </field-icon>
      </el-col>
    </el-row>

    <div class="field-set-content" :style="contentStyle">
      <collapse v-if="showCollapse" v-model="collapseStatus">
        <slot name="collapse"></slot>
      </collapse>

      <slot></slot>
    </div>

    <div class="field-set-footer" v-if="$slots.footer">
      <slot name="footer"></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldSet',
  props: {
    // 标题
    title: {
      type: String,
      default: ''
    },
    // 是否显示展开搜索
    showCollapse: {
      type: Boolean,
      default: false
    },
    // false表示默认展开，true表示默认折叠
    collapse: {
      type: Boolean,
      default: true
    },
    borderBottom: {
      type: Boolean,
      default: true
    },
    headerStyle: {
      type: Object,
      default: () => ({})
    },
    contentStyle: {
      type: Object,
      default: () => ({})
    },
    markColor: {
      type: String,
      default: '#5873DB'
    }
  },
  data () {
    return {
      collapseStatus: this.collapse
    }
  },
  methods: {
    async handleCollapse () {
      this.collapseStatus = !this.collapseStatus
      await this.$nextTick()
      if (this.$listeners.handleCollapse) {
        this.$emit('handleCollapse', this.collapseStatus)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import "@styles/variables.scss";

.field-set {
  background: #fff;
  position: relative;

  .field-set-header {
    margin-left: 16px;
    padding: 16px 16px 16px 0;

    &.borderBottom {
      border-bottom: 1px solid $colorBorder;

      +.field-set-content {
        padding-top: 20px;
      }
    }
  }

  .field-set-header--title {
    position: relative;
    padding-left: 16px;
    font-size: 16px;
    color: #303133;
    font-weight: 500;
    line-height: 40px;

    .mark {
      content: '';
      width: 4px;
      height: 16px;
      border-radius: 3px;
      background-color: $colorPrimary;
      position: absolute;
      display: inline-block;
      top: 11px;
      left: 0;
    }
  }

  .field-set-header-right {
    // position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    text-align: right;
    margin-left: 20px;
    line-height: 40px;
  }

  .field-set-content {
    padding: 0 16px 20px;
  }

  .field-set-footer {
    padding: 0 16px 32px;
    text-align: center;

    .el-button {
      min-width: 84px;
      margin: 0 30px;
    }
  }
}
</style>
