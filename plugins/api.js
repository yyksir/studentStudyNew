import Vue from 'vue'
import API from './index.js'

Vue.prototype.$API = API
Vue.use(API)