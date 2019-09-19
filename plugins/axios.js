import axios from 'axios' //引用axios
import Cookies from 'js-cookie'
import qs from 'qs'

// axios 配置
axios.defaults.timeout = 20000;

// axios.defaults.baseURL = 'https://test-usercenter.tojoycloud.com:40001/dubbo-customer-admin-api'; //这是调用数据接口
//axios.defaults.baseURL = 'http://192.168.31.136:8610';
axios.defaults.baseURL = 'http://121.40.138.216:8080/engEdu'

// http request 拦截器，通过这个，我们就可以把Cookie传到后台
axios.interceptors.request.use(
  config => {
    const token = Cookies.get('session'); //获取Cookie
    //config.data = JSON.stringify(config.data);
    config.headers = {
      //'Content-Type':'application/json', //设置跨域头部
       'Content-Type': 'application/x-www-form-urlencoded',
      // 'userId':Cookies.get("userId"),
      //'token': 'EDU_TOKEN_STU_5b69b9cb83065d403869739ae7f0995e'
    };
    if (token) {
      config.data = {'token': token} //后台接收的参数，后面我们将说明后台如何接收
    } else {
      config.data = Object.assign({}, config.data, {
        token: 'EDU_TOKEN_STU_5b69b9cb83065d403869739ae7f0995e' //后台接收的参数，后面我们将说明后台如何接收
      })
    }
    if (config.method === 'post') {
    //将请求参数进行转换，这里是全局配置post请求参数
      config.data = qs.stringify(config.data)
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);


// http response 拦截器
axios.interceptors.response.use(
  response => {
//response.data.errCode是我接口返回的值，如果值为2，说明Cookie丢失，然后跳转到登录页，这里根据大家自己的情况来设定
   // window.location.href = "http://wwww.baidu.com"
    //console.log(redirect)
    return response;
  },
  error => {
    console.log(error)
    //window.location.href = '/404'
    return Promise.reject(error)
  });

export default axios;

/**
 * fetch 请求方法
 * @param url
 * @param params
 * @returns {Promise}
 */
export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
    .then(response => {
      resolve(response.data);
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
export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
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
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
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
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err);
      })
  })
}
