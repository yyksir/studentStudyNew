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

// request 拦截
instance.interceptors.request.use(config => {
  const token = Cookies.get('session') // 获取 Cookie
  config.headers = {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
  if (token) {
    config.data['token'] = token
  }
  // else {
  //   config.data['token'] = 'EDU_TOKEN_STU_5b69b9cb83065d403869739ae7f0995e' // 开发时 写死的
  // }
  if (config.method === 'post') { config.data = qs.stringify(config.data) }
  return config
}, err => {
  return Promise.reject(err)
})
// response 拦截
instance.interceptors.response.use(response => {
  // 401 未登录
  if (response.status === 401) {
    location.href = '/sign/'
    return {
      code: 401,
      mag: '登录失效， 请从新登录'
    }
  }
  return response
}, error => {
  return Promise.reject(error)
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
