import {get, post} from './axios'

export default {
  POST (link,data) {
    return post(link,data)
  },
  GET (link,data) {
    return get(link,data)
  }
}
