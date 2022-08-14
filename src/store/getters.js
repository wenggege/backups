const getters = {
  sidebar: state => state.app.sidebar,
  permission_routes: state => state.permission.routes,
  // 用户信息
  token: state => state.user.token,
  userId: state => state.user.userId,
  username: state => state.user.username,
  roleName: state => state.user.roleName,
  headUrl: state => state.user.headUrl,
  permissions: state => state.user.permissions,
  // 下拉选择配置
  allSelectDict: state => state.enums.allSelectDict,
  clientSelect: state => state.enums.clientSelect,
  allPersonDict: state => state.enums.allPersonDict
}

export default getters
