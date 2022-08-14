<template>
  <div class="app-navbar">
    <!--
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar"/>
    -->

    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="link-menu">
        <span>信息门户</span>
        <span>RDMP</span>
        <span>ELN</span>
      </div>
      <el-popover
        ref="popUserMenu"
        popper-class="el-popover-user"
        placement="bottom"
        width="240"
        trigger="hover"
        transition="el-zoom-in-bottom"
        :open-delay="300"
      >
        <div class="user-info-box">
          <div class="user-down-header">
            <h4>{{ username }}</h4>
            <p>{{ roleName }}</p>
          </div>
          <ul>
            <li>
              <a @click.prevent="handleChangePw">
                <i class="fa fa-unlock-alt"></i>
                重置密码
              </a>
            </li>
            <li>
              <a @click.prevent="handleLogout">
                <i class="fa fa-sign-out"></i>
                退出登录
              </a>
            </li>
          </ul>
        </div>

        <div slot="reference" class="user-info">
          <user-face class="user-avatar" :src="headUrl" />
          <span>张嬷嬷</span>
        </div>
      </el-popover>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["sidebar", "username", "roleName", "headUrl"]),
  },
  methods: {
    handleViewUserInfo() {
      this.$refs.popUserMenu.doClose();
      this.$router.push({ name: "Info" });
    },
    handleChangePw() {
      this.$refs.popUserMenu.doClose();
      this.$router.push({ name: "Password" });
    },
    async handleLogout() {
      this.$refs.popUserMenu.doClose();
      await this.$store.dispatch("user/logout");
      await this.$router.push({ name: "Login" });
    },
    // toggleSideBar () {
    //   this.$store.dispatch('app/toggleSideBar')
    // },
  },
};
</script>

<style lang="scss" scoped>
@import "@styles/variables.scss";

.app-navbar {
  width: 100%;
  height: 75px;
  overflow: hidden;
  position: relative;
  background: $menuBg;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  justify-content: space-between;
  align-items: center;
  display: flex;
  flex-wrap: wrap;

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    // float: left;
  }

  .right-menu {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-right: 45px;
    .link-menu {
      padding-right: 45px;
      span {
        padding-left: 40px;
        position: relative;
        &:after {
          content: "";
          position: absolute;
          right: -20px;
          top: 0;
          height: 100%;
          border: solid #878787 1px;
          opacity: 0.2;
        }
        &:last-child::after {
          display: none;
        }
      }
    }
    .user-info{
      display: flex;
      justify-content: space-between;
      align-items: center;
      span{
        padding-left: 11px;
      }
    }
  }
}
</style>

<style lang="scss">
@import "@styles/variables.scss";

.el-popover-user[x-placement^="bottom"] {
  .popper__arrow {
    &:after {
      border-bottom-color: $colorPrimary;
    }
  }
}
.el-popover-user {
  padding: 0 !important;
  border-radius: 10px !important;
  color: #22223e !important;
  width: 200px !important;

  .user-info-box {
    .user-down-header {
      background: $colorPrimary;
      color: $colorBG;
      padding: 15px 20px 5px 20px;
      text-align: center;
      border: none;
      border-radius: 10px 10px 0 0;
      line-height: 1.65;
      h4 {
        font-size: 20px;
        font-weight: 600;
        color: $colorBG;
        margin-bottom: 4px;
        display: inline;
      }
      p {
        margin: 0;
        padding: 0;
      }
    }
    ul {
      padding: 0;
      margin: 0;
      list-style: none;
      padding: 15px 20px 3px;
      line-height: 1.65;
      li {
        width: 100%;
        display: inline-block;
        margin-bottom: 10px;
        font-weight: 500;
        text-transform: capitalize;
        &:hover {
          color: $colorPrimary;
        }
        i {
          margin-right: 3px;
          color: $colorPrimary;
        }
      }
    }
  }
}
</style>
