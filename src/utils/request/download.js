import axios from 'axios'
import { requestErrorInceptor, requestInceptor } from './InceptorRequest'
import { Message } from 'element-ui'
// import qs from 'qs'
const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API, // url = base url + request url
  withCredentials: true, // send cookies when cross-domain requests
  timeout: 1800000 // request timeout
})

// 公共的请求拦截函数
service.interceptors.request.use(requestInceptor, requestErrorInceptor)

export default {
  post (url, data = null, config = {}) {
    return service({ // 用axios发送post请求
      method: 'post',
      url,
      data, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then(res => {
      const data = res?.data
      const reader = new FileReader()
      reader.onload = function () {
        try {
          const jsonData = JSON.parse(this.result) // 说明是普通对象数据，后台转换失败
          if (jsonData.code !== 0) {
            Message.error(jsonData.msg || '下载文件失败')
          }
        } catch (err) { // 解析成对象失败，说明是正常的文件流
          const content = res.data
          const blob = new Blob([content])
          const contentDisposition = res.headers['content-disposition']
          let fileName = ''
          if (contentDisposition) {
            fileName = window.decodeURI(res.headers['content-disposition'].split('=')[1], 'UTF-8')
          }
          const elink = document.createElement('a')
          elink.download = fileName
          elink.style.display = 'none'
          elink.href = URL.createObjectURL(blob)
          document.body.appendChild(elink)
          elink.click()
          URL.revokeObjectURL(elink.href) // 释放URL 对象
          document.body.removeChild(elink)
        }
      }
      reader.readAsText(data) // FileReader的API
    }).catch(error => {
      console.log(error)
      Message.error('下载文件失败')
    })
  },
  get (url, params = null, config = {}) {
    return service({ // 用axios发送post请求
      method: 'get',
      url,
      params, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then(res => {
      try {
        const jsonData = JSON.parse(this.result) // 说明是普通对象数据，后台转换失败
        if (jsonData.code !== 0) {
          Message.error(jsonData.msg || '下载文件失败')
        }
      } catch (err) { // 解析成对象失败，说明是正常的文件流
        console.log('dddd', res)
        const content = res?.data
        const blob = new Blob([content])
        const contentDisposition = res.headers['content-disposition']
        let fileName = ''
        if (contentDisposition) {
          let tempDis = res.headers['content-disposition'].split(';')[1]
          tempDis = tempDis.split('=')[1]
          fileName = window.decodeURI(tempDis, 'UTF-8')
        }
        const elink = document.createElement('a')
        elink.download = fileName
        elink.style.display = 'none'
        elink.href = URL.createObjectURL(blob)
        document.body.appendChild(elink)
        elink.click()
        URL.revokeObjectURL(elink.href) // 释放URL 对象
        document.body.removeChild(elink)
      }
    }).catch(error => {
      console.log(error)
      Message.error('下载文件失败')
    })
  },
  preview (url, params = null, config = {}) { // 打印
    return service({ // 用axios发送post请求
      method: 'get',
      url,
      params, // 参数
      responseType: 'blob' // 表明返回服务器返回的数据类型
    }).then(res => {
      try {
        const jsonData = JSON.parse(this.result) // 说明是普通对象数据，后台转换失败
        if (jsonData.code !== 0) {
          Message.error(jsonData.msg || '下载文件失败')
        }
      } catch (err) { // 解析成对象失败，说明是正常的文件流
        const content = res.data
        const pdfUrl = window.URL.createObjectURL(
          new Blob([content], { type: 'application/pdf' })
        )
        const date = new Date().getTime()
        const iframe = document.createElement('iframe')
        iframe.style.frameborder = 'no'
        iframe.style.display = 'none'
        iframe.style.pageBreakBefore = 'always'
        iframe.setAttribute('id', 'printPdf' + date)
        iframe.setAttribute('name', 'printPdf' + date)
        iframe.src = pdfUrl
        document.body.appendChild(iframe)
        const Print = document.getElementById('printPdf' + date).contentWindow
        setTimeout(() => {
          Print.print()
        }, 100)
        window.URL.revokeObjectURL(iframe.src) // 释放URL 对象
      }
    }).catch(error => {
      console.log(error)
      Message.error('下载文件失败')
    })
  }
}
