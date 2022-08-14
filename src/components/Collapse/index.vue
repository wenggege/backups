<template>
  <div class="collapse">
    <el-collapse-transition>
      <div v-show="!value" class="collapse-content">
        <slot></slot>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script>
export default {
  name: 'Collapse',
  props: {
    // true为收起
    value: {
      type: Boolean
    }
  },
  methods: {
    handleChange () {
      this.$emit('input', !this.value)
    }
  }
}
</script>
