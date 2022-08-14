<template>
  <section class="app-main">
    <keep-alive>
      <router-view v-if="isKeep" :key="key"></router-view>
    </keep-alive>

    <router-view v-if="!isKeep" :key="key"></router-view>
  </section>
</template>

<script>
export default {
  name: 'AppMain',
  computed: {
    key () {
      return this.$route.path
    },
    isKeep () {
      // 获取当前路由是否缓存
      return this.$route?.meta?.keepAlive
    }
  }
}
</script>

<style lang="scss" scoped>
.app-main {
  /*70 = navbar  */
  position: relative;
  height: calc(100vh - 75px);
  overflow: auto;
  padding: 21px;

  > * {
    min-width: 960px;
    background-color: #fff;
    padding: 21px;
  }
}

.fixed-header + .app-main {
  margin-top: 75px;
}
</style>
