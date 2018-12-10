import Vue from 'vue'
import $ from 'jquery'
import App from './App'
import router from './router'
import axios from 'axios'
import qs from 'qs'
import Moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import 'vue-easytable/libs/themes-base/index.css'
import {VPagination, VTable} from 'vue-easytable'

import '@/assets/css/style.css'
import '@/assets/css/iconfont.css'
import 'vue-orgchart/dist/style.min.css'

import Publicfn from './components/publicfn'
// require('./assets/js/orgchart2.1.1jsjquery.orgchart.min.js')

Vue.config.productionTip = false
// eventsBus
let eventsBus = new Vue()
Vue.prototype.eventsBus = eventsBus

//将Axios配置到全局
Vue.prototype.$http = axios
Vue.prototype.moment = Moment
Vue.prototype.qs = qs
Vue.prototype.publicfn = Publicfn

axios.defaults.baseURL = process.env.API_ROOT
//记录登录状态
axios.defaults.withCredentials = true
// axios.defaults.baseURL = host
axios.defaults.headers['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.headers['XPS-Version'] = '1.0.0'
// 接口状态处理（没有权限/未登录）
axios.interceptors.response.use(function (response) {
  // console.log('响应数据成功')
  if (response.data.resStatus == 998) {
    // window.location.href = '/login'
  }
  return response
}, function (error) {
  console.log(error)
  console.log('响应错误')
  return Promise.reject(error)
})

Vue.prototype.localstorageFn = function (n) {
  //leftSelect
  localStorage.setItem('leftSelect', n)
}

Vue.use(ElementUI)

// easyTable注册到全局
Vue.component('treeselect', Treeselect)
Vue.component(VTable.name, VTable)
Vue.component(VPagination.name, VPagination)

//右侧内容窗口高度适配
let rightH = jq('.index_Con_right_con')
// jq('.index_Con_right_con').height(jq(window).height() - 160 + 'px')
if (rightH) {
  jq('.index_Con_right_con').height(jq(window).height() - 160 + 'px')
  jq(window).resize(function () {
    jq('.index_Con_right_con').height(jq(window).height() - 160 + 'px')
    // console.log(jq(window).height() - 88)
  })
}
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: {
    App
  },
  template: '<App/>'
})
