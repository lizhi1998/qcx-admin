<template>
  <div class="slot">
    <blockquote class="qcx-quote qcx-quote-slot">通过上传一个Excel文件(.xls/.xlsx均可)来批量{{form.operation}}</blockquote>
    <blockquote class="qcx-quote qcx-quote-slot">
      你可以<a class="qcx-click" @click="templateDownload">点击这里</a>下载Excel模板
    </blockquote>

    <el-form :model="form">
      <el-form-item>
        <el-upload class="qcx-upload" ref="uploadExcel" accept=".xls,.xlsx"
                   :limit="1" :action="form.uploadUrl" :name="form.paramName"
                   :before-upload="beforeUploadFile" :http-request="uploadAction" :file-list="fileList"
                   :auto-upload="false" :on-change="handleChange" :on-success="handleSuccess" :on-error="handleError"
                   :on-exceed="handleExceed" :on-remove="handleRemove">
          <div slot="tip" class="el-upload__tip">只能上传xls/xlsx文件，且最多允许上传一个文件</div>
          <el-button slot="trigger" size="small" class="qcx-btn-select el-button--primary">
            <i class="el-icon-edit"></i>选择文件
          </el-button>
          <el-button size="small" type="success" @click="uploadFile" :disabled="uploadTrigger">
            <i class="el-icon-upload"></i>立即上传
          </el-button>
        </el-upload>
        <el-progress v-if="progress.trigger" :percentage="percentage" :status="progress.status"></el-progress>
      </el-form-item>
    </el-form>

    <el-container v-if="resTrigger" class="qcx-result-container">
      <res-table ref="resTable" :data="resData" :type="this.batchType" :fail="resTable.fail"
                 :succ="resTable.success"></res-table>
    </el-container>
  </div>
</template>

<script>
  import qcxUtils from "../../../../util/util";
  import resTable from './resTable.vue'

  export default {
    props: ['batchType', 'name'],
    components: {
      resTable
    },
    data() {
      return {
        // 存放批量操作类型
        typeOptions: {
          'add_student': {
            operation: '添加学生',
            templateUrl: '/api/download/template/addStudent',
            uploadUrl: '/api/student/addByExcel',
            statusUrl: '/api/status/addStudent'
          },
          'add_score_record': {
            operation: '添加学生的加减分记录',
            templateUrl: '/api/download/template/alterStudentScore',
            uploadUrl: '/api/scoreDetail/addByExcel',
            statusUrl: '/api/status/addScoreDetail'
          },
          'update_dorm': {
            operation: '更新学生宿舍记录',
            templateUrl: '/api/download/template/alterStudentDorm',
            uploadUrl: '/api/student/alterDormByExcel',
            statusUrl: '/api/status/alterDorm'
          },
          'update_dorm_header': {
            operation: '更新宿舍舍长记录',
            templateUrl: '/api/download/template/setDormHeader',
            uploadUrl: '/api/dorm/setHeaderByExcel',
            statusUrl: '/api/status/setDormHeader'
          },
          'update_class_monitor': {
            operation: '更新班级班长记录',
            templateUrl: '/api/download/template/setMonitor',
            uploadUrl: '/api/class/setMonitorByExcel',
            statusUrl: '/api/status/setMonitor'
          }
        },
        fileList: [],
        form: {
          templateUrl: '',
          uploadUrl: '',
          statusUrl: '',
          file: '',
          formData: new FormData(),
          operation: '',
          paramName: 'file'
        },
        resData: [],
        uploadTrigger: true,
        progress: {
          status: '',
          trigger: false
        },
        percentage: 0,
        resTable: {
          total: 0,
          success: 0,
          fail: 0
        },
        resTrigger: false
      }
    },
    mounted() {
      this.dataInit(this.batchType);
    },
    watch: {
      // percentage(val) {
      //   if (val < 100) {
      //
      //   }
      // }
    },
    methods: {
      /**
       * 数据初始化
       */
      dataInit: function (type) {
        if (type !== undefined) {
          this.form.operation = this.typeOptions[type].operation
          this.form.templateUrl = this.typeOptions[type].templateUrl
          this.form.uploadUrl = this.typeOptions[type].uploadUrl
          this.form.statusUrl = this.typeOptions[type].statusUrl
        }
      },

      /**
       * 获取上传进度
       */
      getStatus: function (val) {
        const url = this.form.statusUrl
        const settings = qcxUtils.getSettings(url)
        settings.config = {
          showLoading: false
        }
        qcxUtils.ajaxHandle(this, settings, res => {
          let data = res.data.data || ''
          if (data !== '') {
            this.percentage = Math.round(data.fail * 100 / (data.fail + data.underway))
          }
        })
      },

      handleChange(file, fileList) {
        this.form.file = file.raw
        this.uploadTrigger = false
      },

      /**
       * 文件上传之前
       */
      beforeUploadFile(file) {
        let extIdx = file.name.lastIndexOf('.') + 1;
        let extension = file.name.substring(extIdx);
        if (extension !== 'xlsx' && extension !== 'xls') {
          this.$message({
            message: '只允许上传xls/xlsx格式的文件',
            type: 'warning'
          });
        }
      },
      //通知框
      open1() {
        this.$notify({
          title: '文件上传成功',
          type: 'success' ,
          duration:3000
        });
      },
      /**
       * 文件上传成功
       */
      handleSuccess(res, file, fileList) {
        this.open1()
        this.progress.status = 'success'
        this.percentage = 100
        if (res !== undefined) {
          if (res.data.fail.length > 0) {
            this.resData = res.data.fail
            this.$nextTick(() => {
            this.resTrigger = true
            })
          } else {
            this.resTrigger = false
          }
          this.resTable.fail = res.data.fail.length
          this.resTable.success = res.data.success.length
          this.resTable.total = res.data.success.length + res.data.fail.length
        }
      },

      /**
       * 文件超出个数限制
       */
      handleExceed(files, fileList) {
        this.$message({
          message: '只允许上传一个文件',
          type: 'warning'
        })
      },

      /**
       * 文件上传失败
       * @param err
       * @param file
       * @param fileList
       */
      handleError(err, file, fileList) {
        // console.log(err);
      },

      /**
       * 文件上传
       */
      uploadFile() {
        this.$refs.uploadExcel.submit()
      },

      /**
       * 文件移除
       */
      handleRemove(file, fileList) {
        this.uploadTrigger = true;
      },

      /**
       * 模板下载
       */
      templateDownload: function () {
        window.open(this.form.templateUrl.replace('/api', 'https://qcxapi.fjut.edu.cn'))
      },

      /**
       * 文件上传处理
       */
      fileUploadHandler: function () {

      },

      statusInit: function () {
        if (this.resTrigger === true) {
          this.resTrigger = false
        }
        this.progress = {
          trigger: false,
          status: ''
        }
        this.percentage = 0
      },

      uploadAction: function (params) {
        const file = params.file
        let fd = new FormData()
        fd.append('file', file)
        const settings = qcxUtils.getSettings(this.form.uploadUrl, fd)
        settings.config = {
          showLoading: false
        }
        this.statusInit()
        this.progress.trigger = true
        let percentChange = setInterval(() => {
          if (this.percentage === 100) {
            clearInterval(percentChange)
          } else {
            this.getStatus()
          }
        }, 500)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res.status === 500) {
            clearInterval(percentChange)
          }
          this.handleSuccess(res.data)
        })

      }
    }
  }
</script>

<style scoped>
  .qcx-quote-slot {
    margin-bottom: 10px;
    padding: 15px;
  }

  .qcx-result-container {
    display: block;
    width: 100%;
  }

  .qcx-click {
    font-weight: bold;
    color: red
  }

  .qcx-click:hover {
    cursor: pointer;
  }

  .qcx-upload {
    display: block;
    padding-top: 10px;
    border: 1px solid #ebebeb;
    border-radius: 3px;
  }

  .qcx-btn-select {
    background-color: #409eff !important;
    border-color: #409eff !important;
    color: white;
    border-radius: 3px;
    margin-right: 5px;
  }

  .el-progress {
    margin-top: 15px;
  }
</style>
