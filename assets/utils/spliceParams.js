// get 方法 拼接参数
const spliceParams = function spliceParams (data) {
  if (!data) {
    throw new Error('函数 spliceParams 缺失参数')
  }
  if (Object.prototype.toString.call(data) !== '[object Object]' && Object.keys(data).length < 1) {
    throw new Error('函数 spliceParams 参数类型必须是对象, 且不能为空')
  }
  let dataStr = '?'
  Object.keys(data).forEach(key => {
    dataStr += key + '=' + data[key] + '&'
  })
  dataStr = dataStr.substr(0, dataStr.lastIndexOf('&'))
  return dataStr
}

export {
  spliceParams
}
