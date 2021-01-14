import axios from 'axios'
import JSONbig from 'json-bigint'
// import router from '@/router'

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

export default request
