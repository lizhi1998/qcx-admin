// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import VueResource from 'vue-resource'
import store from './../vuex/store';
// import echarts from 'echarts'
import axios from 'axios'
import { showFullScreenLoading, tryHideFullScreenLoading } from './../src/assets/js/loading.js'

axios.defaults.withCredentials = true
axios.defaults.config = { showLoading: true }

Vue.prototype.$axios = axios
Vue.prototype.$showLoading = showFullScreenLoading
Vue.prototype.$hideLoading = tryHideFullScreenLoading
Vue.use(ElementUI)
Vue.use(VueResource)
Vue.config.productionTip = false
Vue.prototype.$eui = ElementUI
// Vue.prototype.$echarts = echarts

axios.defaults.withCredentials = true

// http request 请求拦截器
axios.interceptors.request.use(
  request => {
    if (request.config.showLoading) {
      showFullScreenLoading()
    }
    return request
  },
  err => {
    return Promise.reject(err)
  })


// http response请求拦截器
axios.interceptors.response.use(
  response => {
    if (parseInt(response.status) >= 500) {
      router.replace({
        path: '/admin/login',
        redirect: '/admin/login'
      })
    }
    else {
      let status = parseInt(response.data.status)
      if (localStorage.getItem('USER_ROLE') === '1') {
        switch (status) {
          case 200:
            if (response.data.info !== '') {
              // ElementUI.Message({
              //   message: response.data.info,
              //   type: 'success'
              // })
            }
            break
          case 502:
            router.replace({
              path: '/admin/login',
              redirect: '/admin/login'
            })
            break
          default:
            // ElementUI.Message({
            //   message: response.data.info,
            //   type: 'warning'
            // })
            break
        }
      }
    }

    if (response.config.config.showLoading) {
      tryHideFullScreenLoading()
    }
    return response
  },
  err => {
    tryHideFullScreenLoading(500)
    return Promise.reject(err)
  })

new Vue({
  el: '#app',
  mode: 'history',
  router,
  store,
  components: { App },
  template: '<App/>'
})
