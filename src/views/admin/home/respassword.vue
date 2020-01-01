<template>
  <el-main>
    <blockquote class="qcx-quote">重置管理员密码</blockquote>
    <el-form :model="chargeForm" class="qcx-add-form" label-position="right" label-width="100px"
             ref="chargeForm" :rules="chargeRules" status-icon
             size="medium">

      <el-form-item label="管理员账号" prop="instructor">
        <el-select class="qcx-input" v-model="chargeForm.instructor" @change="getMasname" filterable>
          <el-option v-for="item in classList.instructor"
                     v-model="item.value"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="">
        <el-button type="primary" @click="submitHandle('chargeForm')">重置密码</el-button>
      </el-form-item>
    </el-form>

  </el-main>
  
</template>


<script>
  import qcxUtils from '../../../util/util.js'

  export default {
    data() {
      return {
        chargeForm: {
          instructor: '',
        },
        chargeRules: {
          instructor: [{
            required: true,
            message: '请选择辅导员',
            trigger: 'change'
          }]
        },
        classList: {
          instructor: []
        },
        masName:'',
        formStatus: false
      }
    },
    mounted() {
      this.getInstructorList()
    },
    beforeDestroy() {

    },
    methods: {
        getMasname:function(){
            const cont =this.classList.instructor.filter(item => {
              return item.value === this.chargeForm.instructor
            })
            this.masName = cont[0].label

        },
        getInstructorList: function(value) {
        const url = '/api/master/queryAll'
        const data = 'queryString=&queryType=all'
        const settings = qcxUtils.getSettings(url, data)
        qcxUtils.ajaxHandle(this, settings, res => {
          if(res !== undefined) {
            const insData = res.data.data
            this.classList.instructor =insData.map(item => {
              return {
                label: item.masName,
                value: item.masAccount,
              }
            })
            //  console.log(this.classList.instructor)
           
          }
        })
        
      },

       /**
       * 通过班级获取辅导员
       */
    //   getoldMaster:function(){
    //     const url = '/api/class/getMaster'
    //     const data = `academic=${this.chargeForm.academic}&major=${this.chargeForm.major}&className=${this.chargeForm.class}` 
    //     const settings = qcxUtils.getSettings(url, data)
    //     qcxUtils.ajaxHandle(this, settings, res => {
    //       if (res !== undefined) {
    //         this.masName = res.data.data.masName
    //       }
    //     })
    //   },
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
          title: this.masName+'的密码重置成功',
        //   dangerouslyUseHTMLString: true,
        //   message: '辅导员：'+this.masName+'</br>新带班学院：'+this.chargeForm.academic+'</br>新专业班级：'+this.chargeForm.class,
          type: 'success' ,
          duration:5000
        });
      },
        open2() {
        this.$notify({
          title: '重置密码失败',
          message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
          type: 'error' ,
          duration:3000
        });
      },
        open3() {
        this.$notify({
          title: '权限不足',
          message: '请联系管理员查看自己是否拥有权限！',
          type: 'warning' ,
          duration:3000
        });
      },
      /**
       * 提交表单操作
       */
      dataCommit: function () {
        const url = '/api/master/resetOthersPassword'
        const data = `masAccount=${this.chargeForm.instructor}`
        const settings = qcxUtils.getSettings(url, data)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            if(res.status === 200){
              this.open1()
            }
            else if(res.status === 501 || res.status === 401 ){
              this.open3()
            }
            else{
              this.open2()
            }
            this.formStatus = true
            // this.formReset('chargeForm')
          }
        })
      }

    }
  }
</script>

<style scoped>
  .el-input, .el-select, .qcx-input {
    width: 380px !important;
    min-width: 300px;
    float: left;
  }

  .qcx-add-form {
    margin: 40px 10px;
  }
  .text {
    font-size: 16px;
  }

  .item {
    margin-bottom: 18px;
  }

</style>