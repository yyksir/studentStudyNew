import {
  get,
  post,
  patch,
  put
} from './axios'

export default {
  POST (link, data) {
    return post(link,data)
  },
  GET (link, data) {
    return get(link,data)
  },
  PATCH (link, data) {
    return patch(link,data)
  },
  PUT (link, data) {
    return put(link,data)
  }
}
