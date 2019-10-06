
import Cookie from 'js-cookie'

// 获取服务端cookie
const getcookiesInServer = function getcookiesInServer (req) {
  let service_cookie = {};
  req && req.headers.cookie && req.headers.cookie.split(';').forEach(function (val) {
    let parts = val.split('=');
    service_cookie[parts[0].trim()] = (parts[1] || '').trim();
  });
  return service_cookie;
}

// 获取客户端cookie
const getcookiesInClient = function getcookiesInClient (key) {
  return Cookie.get(key) ? Cookie.get(key) : ''
}

export {
  getcookiesInServer,
  getcookiesInClient
}
