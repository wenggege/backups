// 身份证号码
export const regIdentNo = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/

// 金额
export const regMoney = /^\d+(\.)?(\d{1,2})?$/

// 手机号
export const regMobile = /^1[3456789]\d{9}$/

// 座机号
export const regTel = /^(\d{3,4}-)?(\d{7,8})$/

// 邮箱
export const regEmail = /^[\w-.]{1,30}@[\w-.]{1,20}$/

// 费率
export const regRate = /^(\d{1,2}(\.[0-9]{1,2})?)$|^100(\.00)?$/

// 信用代码
export const regCreditCode = /^[^_IOZSVa-z\W]{2}\d{6}[^_IOZSVa-z\W]{10}$/g

// 输入不以0开头的数字
export const regNumber = /^([1-9][0-9]*)$/

// 数量判断
export const regQuantity = /^([0-9]{1,}[.][0-9]{4})$/

// 特殊金额判断
export const regTrueMoney = /^([0-9]{1,}[.][0-9]{2})$/
