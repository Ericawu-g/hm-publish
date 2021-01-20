import axios from 'axios'
import { Message } from 'element-ui'
import JSONbig from 'json-bigint'
import router from '@/router'

const request = axios.create({
  baseURL: 'http://api-toutiao-web.itheima.net/', // 请求基础路径
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (err) {
      console.log('转换失败', err)
      return data
    }
  }]
})

// 请求拦截器
request.interceptors.request.use(function (config) {
  const user = JSON.parse(window.localStorage.getItem('user'))
  // 如果有登录信息，则统一设置token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  // 请求失败经过这里
  return Promise.reject(error)
})

// 响应拦截器
request.interceptors.response.use(function (response) {
  return response
}, function (error) {
  if (error.response && error.response.status === 401) {
    window.localStorage.removeItem('user')
    router.push('/login')
    Message.error('登录状态无效，请重新登录')
  } else if (error.response.status === 403) {
    // token未携带或已过期
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (error.response.status === 400) {
    // 客户端参数错误
    Message.error('参数错误，请检查请求参数')
  } else if (error.response.status >= 500) {
    Message.error('服务端内部错误，请稍后重试')
  }
  return Promise.rejext(error)
})
export default request
