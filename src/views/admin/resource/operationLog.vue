<template>
  <el-container class="qcx-container">
    <el-main>
      <blockquote class="qcx-quote">操作日志下载（建议使用<a @click="chromeDownload"
                                                  style="color: red; font-weight: bold; cursor: pointer">谷歌浏览器</a>）
      </blockquote>
      <el-form class="qcx-download-form" :inline="true" :model="logForm">
        <el-form-item label="查询管理员">
          <el-select v-model="logForm.masAccount" filterable>
            <el-option v-for="item in accountOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询类型">
          <el-select v-model="logForm.civilType">
            <el-option v-for="item in civilOptions" :key="item.value" :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="开始时间">
          <el-date-picker v-model="logForm.timeValue" type="datetimerange"
                          start-placeholder="开始日期"
                          range-separator="至"
                          end-placeholder="结束日期"
                          :value-format="timeFormat"
                          :picker-options="pickerOptions"></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="dataDownload">导出</el-button>
        </el-form-item>
      </el-form>
    </el-main>
  </el-container>
</template>
<script>
  import qcxUtils from "../../../util/util";
  import fileDownload from "js-file-download";

  export default {
    data() {
      return {
        logForm: {
          masAccount: '',
          civilType: '',
          timeValue: []
        },
        timeFormat: 'yyyy-MM-dd HH:mm:ss',
        accountOptions: [{
          value: '',
          label: '所有管理员'
        }],
        civilOptions: [
          {
            value: 'all',
            label: '所有类型'
          },
          {
            value: 'class',
            label: '课堂文明'
          },
          {
            value: 'dorm',
            label: '宿舍文明'
          },
          {
            value: 'net',
            label: '网络文明'
          }
        ],
        pickerOptions: {
          shortcuts: [
            {
              text: '今天',
              onClick(picker) {
                picker.$emit('pick', new Date())
              }
            },
            {
              text: '昨天',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24);
                picker.$emit('pick', date);
              }
            },
            {
              text: '一周前',
              onClick(picker) {
                const date = new Date();
                date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
                picker.$emit('pick', date);
              }
            }
          ],
          disabledDate: function (time) {
            return time.getTime() > Date.now()
          }
        }
      }
    },

    mounted() {
      this.getMasterList()
    },

    methods: {
      /**
       * 获取管理员列表
       */
      getMasterList: function () {
        let url = '/api/master/query'
        let data = 'queryType=all'
        const settings = qcxUtils.getSettings(url, data)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            if (res.data.data.length === 0) {
              this.accountOptions = {
                value: localStorage.getItem('login_username'),
                label: localStorage.getItem('masAccount')
              }
            }
            res.data.data.map(item => {
              this.accountOptions.push({
                value: item.masAccount,
                label: `${item.masName}(${item.masInstitution})`
              })
            })
          }
        })
      },

      /**
       * 日志下载
       */
      dataDownload: function () {
        this.$showLoading()
        const [startTime, endTime] = this.logForm.timeValue
        let url = '/api/scoreDetail/download'
        let data = `startTime=${startTime}&endTime=${endTime}&category=${this.logForm.civilType}&masAccount=${this.logForm.masAccount}`
        const settings = qcxUtils.getSettings(url, data)
        settings.responseType = 'arraybuffer'
        window.open(`${settings.url}?${data}`)
        setTimeout(() => {
          this.$hideLoading()
        }, 0)
        // qcxUtils.ajaxHandle(this, settings, res => {
        //   if (res !== undefined) {
        //     // 匹配文件名
        //     let regExp = new RegExp(/([:"][\s\t]*)[^\n"";;\s]+(?=[\s\t]*[;"";\n])/g)
        //     let fileName = res.headers['Content-Disposition'].match(regExp)[1]
        //     fileDownload(res.data, fileName)
        //     // let blob = new Blob([res.data], {type: 'application/vnd.ms-excel'})
        //     // console.log(blob)
        //     // let _url = URL.createObjectURL(blob)
        //     // window.location.href = _url
        //   }
        // })
      },

      chromeDownload: function () {
        window.open('https://dl.softmgr.qq.com/original/Browser/70.0.3538.110_chrome_installer.exe')
      }
    }
  }
</script>
<style scoped>
  .qcx-download-form {
    margin: 15px 10px;
  }
</style>
