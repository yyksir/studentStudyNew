/*import {
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
    path = req.originalUrl;
    token = cookies.session ? cookies.session : ''
  }
  //在客户端判读是否需要登陆
  if (isClient) {
    token = getcookiesInClient('session')
    path = route.path;
  }
  if (path) {
    // redirectURL = '/sign/' + encodeURIComponent(path)
    redirectURL = '/sign/'
  }
  //需要进行权限判断的页面开头
  if (!token) {
    redirect(redirectURL)
  }
}*/
