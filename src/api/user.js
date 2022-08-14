import request from '@/utils/request/index'

/**
 * @description  登录
 */
export function login (param = {}) {
  return request.post('/admin-api/login/adminlogin', param)
}

/**
 * @description  获取登录秘钥
 */
export function getPublicKey (param = {}) {
  return request.post('/admin-api/login/getPublicKey', param)
}

/**
 * @description  获取当前用户权限
 */
export function getUserPerms (param) {
  return request.post('/admin-api/sys/menu/queryUserMenuPerms')
}

/**
 * @description  修改密码
 */
export function changePassword (param) {
  return request.post('/admin-api/adminuser/password', param)
}

/**
 * @description  登出
 */
export function logout () {
  return request.get('/admin-api/adminuser/loginOut')
}

/**
 * @description  用户详细信息
 */
export function getUserInfo (param = {}) {
  return request.post('/admin-api/adminuser/info', param)
}

/**
 * @description  用户头像更换
 */
export function updateHead (param = {}) {
  return request.post('/admin-api/sys/user/updateHead', param)
}
