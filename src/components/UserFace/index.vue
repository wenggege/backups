<template>
  <img class="userFace" @error="getDefaultFace" :src="getFileFullPath(src)">
</template>

<script>
export default {
  name: 'UserFace',
  props: ['src'],
  computed: {
    // 默认头像
    defaultFace () {
      return require('@imgs/svg-icons/user.svg')
    }
  },
  methods: {
    // 设置默认头像
    getDefaultFace (e) {
      const img = e.target
      img.src = this.defaultFace
      img.onerror = null
    }
  }
}
</script>

<style lang="scss" scoped>
.userFace {
  width: 32px;
  height: 32px;
  border-radius: 100%;
  object-fit: cover;
}
</style>
