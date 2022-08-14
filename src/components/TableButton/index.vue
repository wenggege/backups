<template>
  <div v-if="list.length" class="TableButton">
    <el-dropdown v-if="more" size="medium" placement="bottom" @command="handleCommand">
      <i class="el-icon-more dropdown-more"></i>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item v-for="(item, i) in list" :key="i" :disabled="item.disabled" :command="item.id">
          <i v-if="item.icon" :class="item.icon"></i>
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>

    <template v-else>
      <template v-for="(item, i) in list">
        <el-popconfirm v-if="item.confirm" :key="'btn_' + i" placement="top-end" width="180"
          :title="(item.confirm && item.confirm.text) || `你确定${item.label}吗？`" cancel-button-text='取消'
          confirm-button-text='确定' @confirm="handleClick(item)">
          <el-button slot="reference" v-bind="item" :size="item.size || 'mini'" style="margin-left: 10px;"
            v-preventReclick icon="" onClick="" plain>
            <i v-if="item.icon" :class="item.icon"></i>
            {{ item.label }}
          </el-button>
        </el-popconfirm>

        <el-button v-else :key="'btn_' + i" v-bind="item" :size="item.size || 'mini'" icon="" v-preventReclick
          onClick="" @click="handleClick(item)" plain>
          <i v-if="item.icon" :class="item.icon"></i>
          {{ item.label }}
        </el-button>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: 'TableButton',
  props: {
    list: {
      type: Array,
      default: () => ([])
    },
    more: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    handleCommand (id) {
      const curBtn = this.list.find((item) => item.id === id)
      if (curBtn?.confirm) {
        this.$confirm((curBtn.confirm && curBtn.confirm.text) || `你确定要${curBtn.label}吗？`, '', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          center: true
        }).then(() => {
          this.handleClick(curBtn)
        }).catch(() => {
        })
      } else {
        this.handleClick(curBtn)
      }
    },
    handleClick (btn) {
      if (btn?.onClick && typeof btn.onClick === 'function') {
        btn.onClick.call(undefined, btn)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@styles/variables.scss';

.TableButton {
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

  .dropdown-more {
    color: $colorPrimary;
    cursor: pointer;
  }
}
</style>
