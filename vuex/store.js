import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex);

const store = new Vuex.Store({
  state: {
    isAdmin: '', // 是否为管理员
    isLogin: '', // 是否已登录
    listenInit: undefined,
    //左边栏宽度
    leftMenuW: 218,
    //监听浏览器窗口变化
    monitor_win_size: undefined,
    //框架样式
    frameSetStyle: {
      //左边栏宽度
      leftMenuW: 218,
      headerW: 220,
      //是否全屏
      fullScreen: false,
      //头部高度
      headH: 65,
      //初始化
      init: function () {
        let leftMenuW = this.leftMenuW
        let fullScreen = this.fullScreen
        let headH = this.headH
        let headerW = this.headerW
        let screenW = window.innerWidth
        // let screenH = $(window).outerHeight + window.innerHeight - headH height: ${screenH}px!important;
        let contentW = (screenW - leftMenuW)
        let mainMinW = 1000
        return {
          fullScreen: fullScreen,
          sidebarStyle: `float:left; width:${leftMenuW}px`,
          menuStyle: `float:left;  overflow:auto;`, //曲线救国，以后记得优化
          sidebarLeftMenuStyle: `width:${leftMenuW}px!important;height: 100%; overflow:auto;`
        }
      },

    }
  },
  mutations: {
    //左边菜单栏展开或者收缩
    LEFT_MENU_WIDTH: state => {
      if (state.leftMenuW !== 0) {
        state.leftMenuW = 0
        state.fullScreen = true
      } else {
        state.leftMenuW = 218
        state.fullScreen = false
      }
      state.frameSetStyle.leftMenuW = state.leftMenuW
      state.frameSetStyle.fullScreen = state.fullScreen
      state.monitor_win_size = new Date().getTime()
    },

    ADMIN_CONFIRM: (state, { status }) => {
      state.isAdmin = status
    },

    USER_LOGIN: (state, { status }) => {
      state.isLogin = status
    }
  },
  actions: {
    ADMIN_CONFIRM: ({ commit }, { status }) => {
      commit('ADMIN_CONFIRM', { status })
    },

    USER_LOGIN: ({ commit }, { status }) => {
      commit('USER_LOGIN', { status })
    }
  }
})

export default store
