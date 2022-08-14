<template>
  <div class="field-title" :class="align">
    <span class="text">
      <template v-if="icon">
        <svg-icon v-if="iconType === 'svg'" :icon-class="icon" />
        <img class="icon" v-else :src="icon" />
      </template>
      <span v-if="title" class="name">{{ title }}</span>
    </span>

    <slot></slot>
  </div>
</template>

<script>
export default {
  name: 'FieldTitle',
  props: {
    title: String,
    icon: String,
    iconType: {
      type: String,
      default: ''
    },
    align: {
      type: String,
      default: 'left' // left center right
    }
  }
}
</script>
