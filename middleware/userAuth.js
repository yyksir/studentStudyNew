import {
  getcookiesInServer,
  getcookiesInClient
} from '../assets/utils/index.js'
 
export default function ({route, req, res, redirect}) {
  let isClient = process.client;
  let isServer = process.server;
  let redirectURL = '/login';
  var token, path
  //在服务端
  if (isServer) {
    let cookies = getcookiesInServer(req)
    console.log(req.originalUrl, 'req')
    console.log(cookies, 'cookies')
    path = req.originalUrl;
    token = cookies.token ? cookies.token : ''
  }
  //在客户端判读是否需要登陆
  if (isClient) {
    token = getcookiesInClient('token')
    console.log(route, 'route isClient')
    path = route.path;
  }
  if (path) {
    console.log(path, 'path')
    // redirectURL = '/login?ref=' + encodeURIComponent(path)
    redirectURL = '/sign/'
  }
  //需要进行权限判断的页面开头
  if (!token) {
    console.log(redirectURL, 'redirectURL')
    redirect(redirectURL)
  }
}
