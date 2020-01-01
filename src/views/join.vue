<template>
  <div class="login-wrapper">
    <div class="login-container">
      <el-form class="login-form"
               v-if="succCard === false"
               ref='recruitForm'
               :model='recruitForm'
               :rules='rules'
               status-icon>
        <h2 class="form-title">加入我们</h2>
        <el-form-item prop='id' label="学号">
          <el-input placeholder='学号' v-model='recruitForm.id' type='text'></el-input>
        </el-form-item>
        <el-form-item prop='name' label="姓名">
          <el-input placeholder='姓名' v-model='recruitForm.name' type='text'></el-input>
        </el-form-item>
        <el-form-item prop='phone' label="E-MAIL">
          <el-input placeholder='邮箱地址' v-model='recruitForm.phone' type='phone'></el-input>
        </el-form-item>
        <!--<el-form-item prop='mail' label="E-MAIL">-->
          <!--<el-input placeholder='邮箱地址' v-model='recruitForm.mail' type='mail'></el-input>-->
        <!--</el-form-item>-->
        <el-form-item prop='reason' label="申请原因">
          <el-input placeholder='申请原因' v-model='recruitForm.reason' type='text'></el-input>
        </el-form-item>
        <el-form-item prop='group' label="选择方向">
          <el-select v-model="recruitForm.group">
            <el-option value="前端" label="前端" key="前端"></el-option>
            <el-option value="后端" label="后端" key="后端"></el-option>
            <el-option value="交互" label="交互" key="交互"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="qcx-btn-group">
          <el-button type='primary' @click='submit()'>提交申请</el-button>
        </el-form-item>
      </el-form>

      <el-form class="login-form" v-else>
        <i class="el-icon-success qcx-recruit__succ">
          <span>提交成功</span>
        </i>
      </el-form>

      <footer>
        @Copyright By 苍小易网络文化工作室
      </footer>
    </div>
  </div>
</template>

<script>
  import qcxUtils from "../util/util";

  export default {
    name: "join",
    data() {
      return {
        recruitForm: {
          id: '',
          name: '',
          phone: '',
          group: '',
          mail: '',
          reason: ''
        },
        rules: {
          id: [{
            required: true,
            validator: (rule, value, callback) => {
              if (value !== '') {
                value = this.recruitForm.id
                let result = /^\d{10}$/.test(value)
                if(result === false) {
                  callback(new Error('请输入正确的学号格式'))
                } else {
                  callback()
                }
              } else {
                callback(new Error('请输入学号'))
              }
            },
            trigger: 'change'
          }],
          name: {
            required: true,
            message: '请输入姓名',
            trigger: 'blur'
          },
          phone: {
            required: true,
            message: '输入联系方式',
            trigger: 'blur'
          },
          mail: {
            required: true,
            message: '输入邮箱地址',
            trigger: 'blur'
          },
          reason: {
            required: true,
            message: '简单描述申请原因',
            trigger: 'blur'
          },
          group: {
            required: true,
            message: '请选择组别',
            trigger: 'change'
          }
        },
        succCard: false
      }
    },
    methods: {
      submit: function () {
        this.$refs.recruitForm.validate(valid => {
          if(valid) {
            const url='https://www.polydimen.cn:8888/api/join'
            const data = `stuId=${this.recruitForm.id}&stuName=${this.recruitForm.name}` +
              `&phone=${this.recruitForm.phone}&group=${this.recruitForm.group}`
              // `&mail=${this.recruitForm.mail}&reason=${this.recruitForm.reason}`
            const settings = {
              async: true,
              crossDomain: true,
              url: `${url}?${data}`,
              method: 'POST',
              withCredentials: true
            }

            this.$axios(settings)
              .then(res => {
                if(parseInt(res.status) === 200) {
                  this.succCard = true
                } else {

                }
              })
              .catch(err => {

              })
          }
        })
      }
    }
  }
</script>

<style scoped>
  .login-wrapper {
    margin: 0;
    padding: 0;
    background: url("https://img.alicdn.com/tfs/TB1kOoAqv1TBuNjy0FjXXajyXXa-600-600.png") 0% 0% / contain rgb(240, 242, 245);
  }

  .login-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
    width: 100%;
    z-index: 1;
  }

  .login-form {
    margin-bottom: 5vh;
  }

  .el-form-item {
    margin: 10px;
  }

  .el-input,
  .el-button,
  .el-select {
    width: 35vw;
    max-width: 350px;
    min-width: 300px;
    text-align: center;
    margin-bottom: 10px;
    background: rgba(255, 255, 255, 0.1);
  }

  .el-button {
    color: floralwhite;
  }

  .el-button:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.2);
    transition: background 0.5s ease-in-out;
  }

  .el-form-item p {
    margin: 0;
    color: #0cbad8 !important;
  }

  .form-title {
    color: #1bcbb4;
    text-align: center;
    margin-bottom: 30px;
  }

  footer {
    padding-bottom: 35px;
    position: relative;
    width: 100%;
    font-size: 14px;
    text-align: center;
    /* margin-bottom: 20px; */
    color: rgba(0, 0, 0, 0.45) !important;
  }

  .qcx-btn-group {
    margin-top: 30px;
  }

  .qcx-recruit__succ {
    font-size: 30px;
    color: #00d1b2;
  }

  .qcx-recruit__succ span {
    margin: 0 0 0 15px;
  }
</style>
