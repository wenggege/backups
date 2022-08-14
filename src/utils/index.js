/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj (url) {
  const search = decodeURIComponent(url.split('?')[1]).replace(/\+/g, ' ')
  if (!search) {
    return {}
  }
  const obj = {}
  const searchArr = search.split('&')
  searchArr.forEach(v => {
    const index = v.indexOf('=')
    if (index !== -1) {
      const name = v.substring(0, index)
      const val = v.substring(index + 1, v.length)
      obj[name] = val
    }
  })
  return obj
}

/**
 * @param {string} name 需要获取的key值
 * @param {string} hrefName 传入的需要解析的字段名
 * @returns {string}
 * @description 返回location.search中指定的key对应的值
 */
export function parseUrl (name, hrefName) {
  const url = location.href
  const paraUrl = url.substring(url.indexOf('?') + 1, url.length).split(/&|#/)
  const param = {}
  for (let i = 0; i < paraUrl.length; i++) {
    const j = paraUrl[i]
    param[j.substring(0, j.indexOf('=')).toLowerCase()] = j.substring(j.indexOf('=') + 1, j.length)
  }
  const returnValue = param[name.toLowerCase()]
  if (typeof (returnValue) === 'undefined') {
    return ''
  } else {
    return returnValue
  }
}

/**
 * @param {string, number} num
 * @description 判断一个参数是否为纯数字 且是否为有穷数
 */
export function isNumber (num) {
  if (!['string', 'number'].includes(typeof num)) return false

  const reg = /^(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*))$/

  if (!reg.test(num)) return false

  num = Number(num)

  if (typeof num === 'number') {
    return Number.isFinite(num)
  }

  num = num.trim()
  if (num === 'NaN') return false
  if (Number.isNaN(num)) return false
  if (Number.isFinite(num)) return true
  return false
}

/**
 * @param {number} randomFlag 长度
 * @param {number} min 最小长度
 * @param {number} max 最大长度
 * @description 生成随机中英文字符串
 */
export function randomWord (randomFlag = 10, min = 5, max = 10) {
  var str = ''
  var range = min
  var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z']
  // 随机产生
  if (randomFlag) {
    range = Math.round(Math.random() * (max - min)) + min
  }
  for (var i = 0; i < range; i++) {
    var pos = Math.round(Math.random() * (arr.length - 1))
    str += arr[pos]
  }
  return str
}

/**
 * @Description 复制文本
 * @param copyValue {string} 需要複製的文本
 * @param callback {function} 复制完成的回调函数
 * @param el {object} 指定input节点插入的位置，不填默认插入到body
 */
export function copyValue (copyValue, callback, el) {
  if (window.clipboardData) {
    window.clipboardData.clearData()
    window.clipboardData.setData('Text', copyValue)
  } else {
    var input = document.createElement('input')
    input.style.opacity = 0
    input.setAttribute('id', 'input')
    if (el) {
      el.append(input)
    } else {
      document.getElementsByTagName('body')[0].appendChild(input)
    }
    input.value = copyValue
    input.select()
    document.execCommand('Copy')
    input.remove()
  }
  typeof callback === 'function' && callback()
}

/**
 * @Description 金额格式化
 * @param num {Number}
 * @return {string|number}
 */
export function numFormat (num) {
  if (!num) {
    return 0
  }
  const res = parseFloat(num).toFixed(2).toString().replace(/\d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ','
    })
  })
  return res
}

/**
 * @param {string} path
 * @returns {Boolean}
 */
export function isExternal (path) {
  return /^(https?:|mailto:|tel:)/.test(path)
}

/**
 * @description:对象转数组对象（针对下拉选项值）
 * @param: { k:v}
 * @return: [ {id: k, label: v, value: k}]
 */
export function objToArr (obj) {
  if (obj === undefined || obj === null || JSON.stringify(obj) === '{}') return []
  const arr = []
  for (const key in obj) {
    arr.push({
      id: key,
      label: obj[key],
      value: key,
    })
  }
  return arr
}

/**
 * @description: 两数组取差集
 * @param: argv1, argv2
 * @return: [ arr ]
 */
export function arrayDiffSet (argv1, argv2) {
  const oldArgv1 = new Set(argv1)
  const oldArgv2 = new Set(argv2)

  const newArgv1 = new Set(argv1.filter(item => !oldArgv2.has(item)))
  const newArgv2 = new Set(argv2.filter(item => !oldArgv1.has(item)))

  return [...newArgv1, ...newArgv2]
}

/**
 * @description: 两数组取交集
 * @param: argv1, argv2
 * @return: [ arr ]
 */
export function arrayMixSet (argv1, argv2) {
  const oldArgv2 = new Set(argv2)
  const newArgv1 = new Set(argv1.filter(item => oldArgv2.has(item)))

  return [...newArgv1]
}

/**
 * @description: 数据类型判断
 * @param: argv 数据
 * @return: Array Object Number
 */

export function checkDataType (argv) {
  return Object.prototype.toString.call(argv).slice(8, -1)
}

/**
 * @description: 账号过滤
 * @param: argv 数据  type 类型 '3*4' '1*4'
 * @return: String
 */
export function acctFilter (argv, type) {
  if (checkDataType(argv) !== 'String') return argv

  const first = type?.slice(0, 1) !== undefined || 3
  const second = type?.slice(2) !== undefined || 4

  const reg = `/^(.{${first}}).*(.{${second}})$/`
  return argv.replace(eval(reg), '$1****$2')
}

/**
 * @Description 数量格式化
 * @param num {Number}
 * @return {string|number}
 */
export function quantityFormat (num) {
  if (checkDataType(num) !== 'String' && checkDataType(num) !== 'Number') {
    return 0
  }
  const res = num.toString().replace(/\d+/, function (n) {
    // 先提取整数部分
    return n.replace(/(\d)(?=(\d{3})+$)/g, function ($1) {
      return $1 + ','
    })
  })
  return res
}

export function getSFM(seconds, dateFormat = 'H:i:s') {
  const obj = {}
  obj.H = Number.parseInt(seconds / 3600)
  obj.i = Number.parseInt((seconds - obj.H * 3600) / 60)
  obj.s = Number.parseInt(seconds - obj.H * 3600 - obj.i * 60)
  if (obj.H < 10) {
    obj.H = '0' + obj.H
  }
  if (obj.i < 10) {
    obj.i = '0' + obj.i
  }
  if (obj.s < 10) {
    obj.s = '0' + obj.s
  }

  const rs = dateFormat.replace('H', obj.H).replace('i', obj.i).replace('s', obj.s)
  return rs
}
