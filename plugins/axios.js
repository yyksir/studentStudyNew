import axios from 'axios'
import Cookies from 'js-cookie'
import qs from 'qs'

import {
  BASE_URL,
  API
} from '../assets/config/'

const instance = axios.create({
  baseURL: BASE_URL + API,
  timeout: 20000
})
const checkoutStatusFn = function checkoutStatusFn (res, isError) {
  if (!isError) {
    if (res.status === 401 && !isError) {
      // console.log(res, 'res 25')
      location.href = '/sign/'
      return {
        code: 401,
        msg: '登录失效， 请从新登录'
      }
    }
  } else {
    if (!res.response && res.config.url.includes('doStLogin') && isError) {
      return Promise.reject(res)
    }
    if (res.response.status === 401 && isError) {
      // console.log(res.response, 'res.response 20')
      location.href = '/sign/'
      return Promise.reject(res.response.data)
    }
    if (res.response.status !== 401 && res.response.status !== 200 && isError) {
      return Promise.reject(res.response.data)
    }
  }
  return res
}
// request 拦截
instance.interceptors.request.use(config => {
  const token = Cookies.get('session') // 获取 Cookie
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  if (token) {
    config.data['token'] = token
    /*config.method === 'post'
    ? config.data['token'] = token
    : (config.method === 'get'
      ? config.params['token'] = token
      : console.log('不符合'))*/
  } else {
    // config.data['token'] = 'EDU_TOKEN_STU_5b69b9cb83065d403869739ae7f0995e' // 开发时 写死的
  }
  if (config.method === 'post') { config.data = qs.stringify(config.data) }
  return config
}, err => {
  return Promise.reject(err)
})
// response 拦截
instance.interceptors.response.use(response => {
  return checkoutStatusFn(response, false)
}, error => {
  console.log(error, 'error 61')
  // console.log(error.config, 'error.config 62')
  // console.log(error.request, 'error.request 63')
  // console.log(error.response, 'error.response 64')
  // console.log(error.isAxiosError, 'error.isAxiosError 65')
  // console.log(error.toJSON, 'error.toJSON 66')
  console.log(Object.keys(error), 'error 67')
  console.log(error.message, 'error 61')
  return checkoutStatusFn(error, true)
})

export default instance

/**
 * fetch 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get (url, params = {}) {
  return new Promise((resolve, reject) => {
    instance.get(url, { params: params })
    .then(response => {
      resolve(response.data)
    })
    .catch(err => {
      reject(err)
    })
  })
}

/**
 * post 请求方法
 * @param url
 * @param data
 * @returns {Promise}
 */
export function post (url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.post(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * patch 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.patch(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}

/**
 * put 方法封装
 * @param url
 * @param data
 * @returns {Promise}
 */
export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    instance.put(url, data)
      .then(response => {
        resolve(response.data)
      }, err => {
        reject(err)
      })
  })
}
