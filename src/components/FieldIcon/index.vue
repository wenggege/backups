<template>
  <div :style="{ color: color }" class="field-icon">
    <svg-icon v-if="$attrs['icon-class']" v-bind="$attrs" :style="iconStyleRules" />
    <div class="field-icon--text">
      <span v-if="text">{{ text }}</span>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'FieldIcon',
  props: {
    iconStyleRules: {
      type: Object
    },
    // 文字
    text: {
      type: String
    },
    color: {
      type: String
    }
  }
}
</script>

<style lang="less" scoped>
.field-icon {
  display: inline-block;
  margin-right: 18px;
  cursor: pointer;
  font-size: 14px;

  .field-icon--text {
    display: inline-block;
    padding-left: 5px;
  }
}

.field-icon:last-child {
  margin-right: 0;
}
</style>
