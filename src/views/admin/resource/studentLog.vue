<template>
  <el-container class="qcx-container">
    <el-main>
      <blockquote class="qcx-quote">学生记录导出（建议使用<a @click="chromeDownload"
                                                  style="color: red; font-weight: bold; cursor: pointer">谷歌浏览器</a>）
      </blockquote>
      <el-table :data="templateData" border>
        <el-table-column label="类别" width="300">
          <template slot-scope="scope">
            <span>{{scope.row.type}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button size="mini" type="primary"
                       @click="templateDownload(scope.$index, scope.row)">下载
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
  import qcxUtils from "../../../util/util";
  import fileDownload from 'js-file-download'

  export default {
    data() {
      return {
        templateData: [{
          type: '学生记录下载',
          url: '/api/student/download'
        }]
      }
    },
    methods: {
      /**
       * 模板下载触发事件
       */
      templateDownload: function (index, row) {
        this.$showLoading()
        let url = row.url
        const settings = qcxUtils.getSettings(url)
        settings.responseType = 'arraybuffer'
        window.open(settings.url)
        setTimeout(() => {
          this.$hideLoading()
        }, 0)
        // qcxUtils.ajaxHandle(this, settings, res => {
        //   // 匹配文件名
        //   let regExp = new RegExp(/([:"][\s\t]*)[^\n"";;\s]+(?=[\s\t]*[;"";\n])/g)
        //   let fileName = res.headers['content-disposition'].match(regExp)[1]
        //   fileDownload(res.data, fileName)
        // })
      },

      chromeDownload: function () {
        window.open('https://dl.softmgr.qq.com/original/Browser/70.0.3538.110_chrome_installer.exe')
      }
    }
  }
</script>
<style scoped>

</style>
