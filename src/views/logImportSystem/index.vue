<template>
  <div class="logimport-system">
    <el-tabs class="full" v-model="activeName" type="border-card">
      <el-tab-pane
        v-for="tab in tabList"
        :key="tab.component"
        :label="tab.title"
        :name="tab.component"
      >
        <el-scrollbar
          style="height: 100%"
          wrapStyle="padding: 0 16px; overflow-x: hidden;"
        >
          <component
            :is="tab.component"
            :active="activeName === tab.component"
          />
        </el-scrollbar>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script>
export default {
  name: "LogImportSystem",
  components: {
    AllAttempt: () => import("./allAttempt"),
    PendingAttempt: () => import("./pendingAttempt"),
  },
  data () {
    return {
      activeName: "AllAttempt" // 初始所有试图
    }
  },
  computed: {
    tabList () {
      return [
        { title: "所有试图", component: "AllAttempt" },
        { title: "待接单试图", component: "PendingAttempt" },
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
.logimport-system {
  padding: 0 !important;
  // height: 100%;
  overflow-y: hidden;
}
</style>
