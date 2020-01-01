<template>
  <div>
    <div class="login-module">
      <!--<img src='../../../static/images/login-logo.png' style='width:auto;height:auto'>-->
      <div class="hontr">
        <img
          src="../../..//static/images/logologin.png"
          style='height:65px;width:400px;margin-left: 250px;margin-top: 15px;'
        >
      </div>
      <div class="login-form-container">
        <header></header>
        <div class="right">
          <el-form
            class="login-form"
            ref='loginForm'
            :style="loginClass"
            :model='loginForm'
            :rules='loginRules'
            status-icon
            @keyup.native.enter='loginEvent'
          >
            <!-- <h2 class="form-title">亲苍霞 - 管理端</h2> -->
            <h4 style="padding-top: 0;margin-top: 0;"><img
                src="../../..//static/images/logoin.png"
                style="height: 50px;width: 50px;margin-right: 15px;"
              ><span style="font-size: 20px;">管理员登录</span></h4>
            <el-form-item prop='username'>
              <el-input
                placeholder='用户名'
                v-model='loginForm.username'
                type='text'
                prefix-icon="el-icon-user"
              ></el-input>
            </el-form-item>
            <el-form-item
              class='password-input'
              prop='password'
            >
              <el-input
                placeholder='密码'
                v-model='loginForm.password'
                type='password'
                prefix-icon="el-icon-lock"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type='primary'
                class='login-btn'
                @click='doLogin()'
              >登录</el-button>
              <!-- <el-button
                type='primary'
                class='login-btn'
                @click='ssdoLogin'
              >test</el-button> -->
            </el-form-item>
            <p style="text-align:right;cursor:pointer;white-space:nowrap;"> <span style="margin-right: 200px;">
                <el-checkbox
                  v-model="checked"
                  size="medium"
                >记住密码</el-checkbox>
              </span> <span
                style="color: #1BCBB4;font-size: 15px;"
                @click="forget()"
              >忘记密码？</span></p>
            <div style="text-align: right;font-size: 13px;color: #096DD3; margin-top: 0;"><a :href="'https://qcx.fjut.edu.cn/login'"><i class="el-icon-s-home
"></i>学生登录入口</a></div>
          </el-form>
        </div>

      </div>

    </div>
    <footer>
      <a
        :href="'https://www.fjut.edu.cn'"
        target="_blank"
      >福建工程学院首页</a> | <a
        :href="'http://www.yiban.cn/school/index?school_id=549'"
        target="_blank"
      >苍霞易班</a> | <a
        :href="'https://dh.fjut.edu.cn'"
        target="_blank"
      >校内导航</a> | <a
        :href="'https://nids.fjut.edu.cn/authserver/login?service=http://i.fjut.edu.cn/index.portal'"
        target="_blank"
      >
        校园信息门户</a> | <a
        :href="'https://jwxt.fjut.edu.cn/jwglxt/xtgl/login_slogin.html'"
        target="_blank"
      >教务管理系统</a> | <a
        :href="'https://mail.fjut.edu.cn'"
        target="_blank"
      >教师邮件系统</a> | <a
        :href="'https://jwc.fjut.edu.cn/2186/list.htm'"
        target="_blank"
      >学校年历</a>
      <br><br>
      Copyright ©2018-2019 By 苍小易网络文化工作室 福建省福州市大学新区学府南路33号 350118
    </footer>
  </div>
</template>
<script>
import qcxUtils from "../../util/util";

export default {
  data() {
    return {
      loginForm: {
        username: localStorage.getItem('login_username'),
        password: localStorage.getItem('login_password')
      },
      loginRules: {
        username: {
          required: true,
          message: '请输入用户名',
          trigger: 'blur'
        },
        password: {
          required: true,
          message: '请输入密码',
          trigger: 'blur'
        }
      },
      loginStatus: '',
      checked: true,
      clientHeight: window.outerHeight,
      loginClass: {
        top: ""
      }
    };
  },
  created: function () {

  },
  mounted: function () {
    this.loginEvent();
    this.getHeight();
    let _this = this;//赋值vue的this
    window.onresize = () => {
      //调用methods中的事件
      _this.getHeight();

    }
    this.loginStatus = 'false';
    localStorage.setItem('login_status', this.loginStatus);
  },
  destroyed() {
    window.onresize = null;
  },
  watch: {},
  methods: {
    getHeight: function () {
      this.clientHeight = window.outerHeight
      if (this.clientHeight <= 679) {
        this.loginClass.top = "35.453px"
      }
      else {
        this.loginClass.top = "10%"
      }
      //  console.log(this.clientHeight)
    },
    forget() {
      this.$notify({
        title: '忘记密码',
        message: '如忘记密码请联系苍小易工作室！（初始密码为：123456）',
        type: 'warning',
        duration: 2000
      });
    },
    // 回车事件监听，按下enter键登录
    loginEvent() {
      if (this.loginStatus === 'false') {
        this.doLogin();
      } else {
        return
      }
    },
    //提交修改密码
    handleSubmit(password) {
      const url = '/api/master/alterMyPassword'
      const data = `oldPassword=${'123456'}&newPassword=${password}`
      const settings = qcxUtils.getSettings(url, data)
      qcxUtils.ajaxHandle(this, settings, res => {
        if (parseInt(res.data.status) === 200) {
          this.$router.push('/login')
        }
      })
    },
    //修改密码弹窗
    open() {
      this.$prompt('检测到密码为初始密码，需强制修改密码，请输入新密码：', '警告', {
        confirmButtonText: '确定',
        inputType: 'password',
        inputPattern: /^(?=.*[a-z])(?=.*\d)[^]{6,}$/,
        inputErrorMessage: '新密码至少6个字符，且不能为纯数字!',
        // inputValue:'请输入新密码',
        showCancelButton: false,
        showClose: false
      }).then(({ value }) => {
        this.handleSubmit(value);

      }).catch(() => {
        this.$router.push('/login')
      });
    },
    // ssdoLogin() {
    //   const url = `/qcx/add`
    //   const settings = qcxUtils.getSettings(url)
    //   // settings.config = {
    //   //   showLoading: false
    //   // }
    //   this.$axios(settings)
    //     .then(res => {
    //       console.log(res.data)
    //     })
    // },
    // 提交登录信息
    doLogin() {
      const _this = this;
      this.$refs['loginForm'].validate(valid => {
        if (valid) {
          const url = `/api/master/login`
          const data = `account=${_this.loginForm.username}&password=${_this.loginForm.password}`
          const settings = qcxUtils.getSettings(url, data)
          this.$axios(settings)
            .then(res => {
              console.log(res)
              const resCode = parseInt(res.data.status)
              // if(resCode !== 200) {
              //   this.$message({
              //     message: res.data.info,
              //     type: 'warning'
              //   })
              //   return
              // }
              if (resCode === 501) {
                this.$router.push('/login')
                //this.$router.push('/join')
                this.$message({
                  message: res.data.info,
                  type: 'warning'
                })
                return
              }
              else if (resCode === 200) {
                this.$message({
                  message: res.data.info,
                  type: 'success',
                  duration: 2000
                })
              }
              else {
                this.$router.push('/login')
                this.$message.error(res.data.info)
              }
              this.loginStatus = 'true'
              if (this.checked === true) {
                localStorage.setItem('login_username', _this.loginForm.username)
                localStorage.setItem('login_password', _this.loginForm.password)
                localStorage.setItem('login_status', _this.loginStatus) //保存是否登录成功状态
              }
              else {
                localStorage.setItem('login_username', _this.loginForm.username)
                localStorage.setItem('login_password', '')
                localStorage.setItem('login_status', _this.loginStatus)
              }
              const role = 'Master'
              this.$store.commit('USER_LOGIN', { status: true })
              //身份为管理员则重定向至首页
              if (localStorage.getItem('login_password') === '123456') {
                this.$store.commit('ADMIN_CONFIRM', { status: true })
                localStorage.setItem('USER_ROLE', 1)
                this.$router.push('/login')
                this.$message({
                  message: '检测到当前使用的是初始密码123456，请立即修改密码',
                  type: 'warning'
                })
                this.open()
              } else if (resCode == 200) {
                this.$store.commit('ADMIN_CONFIRM', { status: true })
                localStorage.setItem('USER_ROLE', 1)
                this.$router.push('/admin/home')
              }
              else {
                this.$store.commit('ADMIN_CONFIRM', { status: false })
                localStorage.setItem('USER_ROLE', 0)
                alert("系统检测到该账号为学生账号，请在页面点击学生登录入口进行登录！");
                //   this.$alert('新版学生端将于本月中下旬上线，如果您有兴趣，欢迎加入开发团队')
              }
            }
            )
        }
      })
    },
  }
}
</script>

<style scoped>
.hontr {
  width: 100%;
  height: 100px;
  background-color: white;
  position: relative;
}
html,
body {
  margin: 0;
  padding: 0;
}

.login-module {
  /* background: url("https://img.alicdn.com/tfs/TB1kOoAqv1TBuNjy0FjXXajyXXa-600-600.png") 0% 0% / contain rgb(240, 242, 245); */
  background-image: url(../../../static/images/backgroud.jpg);
  height: 100%;
  width: 100%;
  background-size: cover;
  min-height: 600px;
}

.login-form-container {
  position: relative;
  height: 60vh;
  z-index: 1;
}
.right {
  position: absolute;
  width: 50%;
  height: 100%;
  left: 50%;
}
.login-form {
  background-color: white;
  border: 10px solid #1bcbb4;
  padding: 20px;
  margin: 10px;
  position: absolute;
  left: 180px;
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
  position: relative;
  padding-top: 20px;
  white-space: nowrap;
  font-size: 14px;
  text-align: center;
  background-color: white;
  color: rgba(0, 0, 0, 0.45) !important;
}

a {
  text-decoration: none;
  color: #096dd3;
}
a:hover,
a:visited,
a:link,
a:active {
}
</style>
