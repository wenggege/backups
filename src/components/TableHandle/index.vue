<template>
  <div class="TableHandle" :class="{ borderBottom }">
    <div v-if="filters.length" class="TableHandle-filters">
      <el-button v-for="(item, index) in filters" :key="item.label" :class="{ active: active === index }" size="mini"
        type="text" v-preventReclick onClick="" @click="handleFilterClick(index)">
        {{ item.label }}（{{ item.num }}）
      </el-button>
    </div>

    <div class="TableHandle-buttons">
      <slot name="buttonBefore" />

      <template v-if="buttons.length">
        <el-button v-for="(item, index) in buttons" :key="index" v-bind="item" v-preventReclick onClick=""
          @click="handleButtonClick(item)" size="medium">
          {{ item.label }}
        </el-button>
      </template>

      <slot name="buttonAfter" />
    </div>

    <slot />

  </div>
</template>

<script>
export default {
  name: 'TableHandle',
  props: {
    filters: {
      type: Array,
      default: () => []
    },
    buttons: {
      type: Array,
      default: () => []
    },
    borderBottom: Boolean
  },
  data () {
    return {
      active: -1
    }
  },
  methods: {
    handleFilterClick (index) {
      this.active = index
    },
    handleButtonClick (btn) {
      if (btn?.onClick && typeof btn.onClick === 'function') {
        btn.onClick.call(undefined, btn)
      }
    }
  }
}
</script>

<style lang="scss">
@import '@styles/variables.scss';

.TableHandle {
  position: relative;
  padding: 0.1px;
  border: 1px solid $colorBorder;
  border-bottom: none;
  background-color: $colorBG;
  border-radius: 5px 5px 0 0;

  &.borderBottom {
    border-bottom: 1px solid $colorBorder;
  }

  &-filters {
    margin: 12px 8px;

    .el-button {
      margin: 0 8px;
      color: #666;
      border: none;
      border-bottom: 2px solid transparent;
      border-radius: 0;

      &+.el-button {
        margin-left: 8px;
      }

      &:hover,
      &:focus {
        color: $colorPrimary;
      }

      &.active {
        color: $colorPrimary;
        border-bottom-color: $colorPrimary;
      }
    }
  }

  &-buttons {
    margin: 16px;
    min-height: 36px;

    .el-button {
      padding: 10px 12px;
      min-width: 80px;

      &--text {
        padding-left: 0;
        padding-right: 0;
      }
    }
  }
}
</style>
