<template>
  <el-form :model="dormForm" label-position="right" label-width="100px"
           ref="dormForm" status-icon size="medium">

    <el-form-item label="新宿舍">
      <el-input v-model="dormForm.dormitory" placeholder="请输入该学生的新宿舍（如A1-101）"></el-input>
    </el-form-item>

    <div class="qcx-btn-group">
      <el-button type="primary" @click="submitHandle('dormForm')">立即提交</el-button>
      <el-button type="info" @click="formReset('dormForm')">重置</el-button>
    </div>
  </el-form>
</template>

<script>
  import qcxUtils from '../../../../util/util.js'
  export default {
    name: "update",
    props: ['stuId', 'stuName','stuDorm'],
    data() {
      return {
        dormForm: {
          dormitory: '',
          id: this.stuId,
          name: this.stuName
        },
        dormData: this.stuDorm,
        formStatus: false
      }
    },
    mounted() {
      this.$nextTick(()=>{
        // console.log(this.stuDorm);
      });
      // this.getCivilLists();
    },
    beforeDestroy() {

    },
    methods: {
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
      //通知框
       open1() {
        this.$notify({
          title: this.dormForm.name+'更新宿舍成功',
          dangerouslyUseHTMLString: true,
          message: '新宿舍：'+this.dormForm.dormitory+'</br>原宿舍：'+this.stuDorm,
          type: 'success' ,
          duration:5000
        });
      },
        open2() {
        this.$notify({
          title:  this.dormForm.name+'更新宿舍失败',
          message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
          type: 'error' ,
          duration:5000
        });
      },
      /**
       * 提交表单操作
       */
      dataCommit: function () {
        const data = 'stuId=' + this.dormForm.id +
          '&newDorm=' + this.dormForm.dormitory
        const url = '/api/student/alterDorm'
        const settings = qcxUtils.getSettings(url, data)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            // this.$message({
            //   message: '成功修改宿舍',
            //   type: 'success'
            // });
            if(res.status == 200){
              this.open1()
            }
            else{
              this.open2()
            }
            this.formStatus = true;
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
