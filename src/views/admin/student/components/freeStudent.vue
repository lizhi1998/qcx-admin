<template>
  <el-form :model="freeForm" label-position="right" label-width="100px"
           ref="freeForm" status-icon size="medium">

    <el-form-item label="转出原因">
      <el-input v-model="freeForm.reason" placeholder="请输入转出原因"></el-input>
    </el-form-item>

    <el-form-item class="qcx-btn-group">
      <el-button type="primary" @click="submitHandle('freeForm')">立即提交</el-button>
      <el-button type="info" @click="formReset('freeForm')">重置</el-button>
    </el-form-item>
  </el-form>
</template>

<script>
  import qcxUtils from '../../../../util/util.js'
  import Bus from '../../../../assets/js/bus.js'
  export default {
    name: "free",
    props: ['stuId','stuName','stuClass','stuDorm'],
    data() {
      return {
        freeForm: {
          reason: '',
          id: this.stuId,
          name: this.stuName,
          class: this.stuClass
        },
        dormData: this.stuDorm,
        formStatus: false
      }
    },
    mounted() {

    },
    beforeDestroy() {

    },
    methods: {
      //通知框
       open1() {
        this.$notify({
          title: this.freeForm.name+'转出专业成功',
          dangerouslyUseHTMLString: true,
          message: '原专业班级：'+this.freeForm.class+'</br>转出原因：'+ this.freeForm.reason,
          type: 'success' ,
          duration:5000
        });
      },
        open2() {
        this.$notify({
          title:  this.freeForm.name+'转出专业失败',
          message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
          type: 'error' ,
          duration:5000
        });
      },
      /**
       * 提交表单处理
       * @param formName
       */
      submitHandle: function (formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            this.dataCommit();
          }
        })
      },

      /**
       * 提交表单操作
       */
      dataCommit: function () {
        const data = 'stuId=' + this.freeForm.id +
          '&freeReason=' + this.freeForm.reason;
        const url = '/api/student/setFree';
        const settings = qcxUtils.getSettings(url, data);
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            this.formStatus = true;
            Bus.$emit('form_reset',  true)
            if(res.status == 200){
              this.open1()
            }
            else{
              this.open2()
            }
          }
        })
      },

      /**
       * 表单重置
       * @param formName
       */
      formReset: function (formName) {
        this.$refs[formName].resetFields();
        this.formStatus = false;
      }
    }
  }
</script>

<style scoped>
  .el-input, .el-select, .qcx-input {
    width: 50vh !important;
    float: left;
  }

  .qcx-btn-group {
    float: left;
    margin-left: 13vh;
  }
</style>
