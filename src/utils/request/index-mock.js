import axios from 'axios'
import qs from 'qs'
import { requestErrorInceptor, requestInceptor } from './InceptorRequest'
import { responseErrorInceptor, responseInceptor } from './InceptorResponse'
import download from './download'

const CONFIG_AXIOS = {
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 30000,
  withCredentials: true,
}

const CONFIG_MOCK_AXIOS = {
  baseURL: '/mock',
  timeout: 30000,
  withCredentials: true,
}

const Axios = axios.create(CONFIG_AXIOS)
// 添加请求拦截器
Axios.interceptors.request.use(requestInceptor, requestErrorInceptor)
// 添加请求拦截器
Axios.interceptors.response.use(responseInceptor, responseErrorInceptor)

// —————— mock请求实例end ————————————————
const AxiosMock = axios.create(CONFIG_MOCK_AXIOS)
AxiosMock.interceptors.request.use(requestInceptor, requestErrorInceptor)
AxiosMock.interceptors.response.use(responseInceptor, responseErrorInceptor)
// ———————— mock 请求实例 ——————————————

export default {
  get (url, param = {}, config = {}) {
    // 开发模式下 且配置中有 isMock选项  则调用mock
    const IS_MOCK = process.env.NODE_ENV === 'development' && !!config.isMock
    const RequestInstance = IS_MOCK ? AxiosMock : Axios

    return RequestInstance.get(url, {
      ...config,
      params: param
    })
  },
  post (url, data = {}, config = {}) {
    if (config.contentType === 'formdata') {
      config.headers = {
        ...config.headers,
        'content-type': 'application/x-www-form-urlencoded'
      }
      config.dataJSON = data
      data = qs.stringify(data)
    } else {
      config.headers = {
        ...config.headers,
        'content-type': 'application/json;charset=UTF-8'
      }
    }

    // 开发模式下 且配置中有 isMock选项  则调用mock
    const IS_MOCK = process.env.NODE_ENV === 'development' && !!config.isMock
    const RequestInstance = IS_MOCK ? AxiosMock : Axios

    return RequestInstance.post(url, data, {
      ...config,
    })
  },
  upload (url, formData, config = {}) {
    return Axios.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data;charset=iso-8859-1;'
      },
      ...config
    })
  },
  download
}
