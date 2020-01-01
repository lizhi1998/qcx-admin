import Vue from 'vue'

const qcxUtils = {
  getSettings: function (url, data, method = 'POST') {
    // let reg = new RegExp('/api')
    // if (url.match(reg).index === 0) {
    //   // url = url.replace(reg, 'https://qcxapi.fjut.edu.cn')
    //   // url = url.replace(reg, 'http://47.106.151.144:8080')
    //   // console.log(reg)
    //   // url = url.replace(reg, 'http://182.61.12.29:8080')
    //   // url = url.replace(reg, 'http://10.12.75.252:8081')


    // }
    console.log(url)
    return {
      url: url,
      method: method,
      async: true,
      crossDomain: true,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded;  charset=UTF-8',
      },
      // 使得每次上传的session保持一致
      xhrFields: {
        withCredentials: true
      },
      data: data || ''
    }
  },

  ajaxHandle: function (_this, settings, fn) {
    _this.$axios(settings)
      .then(res => {
        if (parseInt(res.data.status) === 200 || res.data.status === undefined) {
          fn(res)
        }
      })
      .catch(err => {
        fn({
          status: 500,
          info: '操作错误'
        })
      })
  }
}

export default qcxUtils
