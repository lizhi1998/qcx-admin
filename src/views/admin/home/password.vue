<template>
  <el-main>
    <blockquote class="qcx-quote">修改个人密码</blockquote>
    <el-form
      ref="pwdForm"
      class="qcx-container"
      :model="pwdForm"
      status-icon
      label-width="100"
      label-position="right"
      :rules='pwdRules'
    >
      <!-- <el-form-item label="账号">
      <el-input v-model="pwdForm.account" value="pwdForm.account" disabled></el-input>
    </el-form-item> -->
      <!-- <el-button type="text" @click="open"></el-button> -->

      <el-form-item
        v-if="oldTrigger"
        prop="oldValue"
        label="旧密码"
      >
        <el-input
          v-model="pwdForm.oldValue"
          placeholder="请输入旧密码"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newValue"
      >
        <el-input
          v-model="pwdForm.newValue"
          placeholder="请输入新密码"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="newValues"
      >
        <el-input
          v-model="pwdForm.newValues"
          placeholder="请再次输入新密码"
          type="password"
          show-password
        ></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-button
          type="primary"
          @click="handleSubmit"
        >确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</template>

<script>
import qcxUtils from "../../../util/util";

export default {
  props: ['trigger'],
  name: "password",
  data() {
    return {
      pwdForm: {
        account: localStorage.getItem('login_username'),
        oldValue: '',
        newValue: '',
        newvalues: ''
      },
      pwdRules: {
        oldValue: [{
          validator: (rule, value, callback) => {
            if (value !== '') {
              value = this.pwdForm.oldValue
              if (value !== localStorage.getItem('login_password')) {
                callback(new Error('旧密码错误'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入旧密码'))
            }
          },
          trigger: 'blur'
        }],
        newValue: [{
          validator: (rule, value, callback) => {
            if (value !== '') {
              value = this.pwdForm.newValue
              let result = /^(?=.*[a-z])(?=.*\d)[^]{6,}$/.test(value)
              if (result === false) {
                callback(new Error('新密码至少6个字符，且不能为纯数字!'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入新密码'))
            }
          },
          trigger: 'change'
        }],
        newValues: [{
          validator: (rule, value, callback) => {
            if (value !== '') {
              value = this.pwdForm.newValues
              if (value !== this.pwdForm.newValue) {
                callback(new Error('前后两次输入密码不一致!'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入再次新密码'))
            }
          },
          trigger: 'change'
        }]
      },
      oldTrigger: Boolean(this.trigger) || true
    }
  },
  computed: {},
  methods: {

    /**
     * 确认提交
     */
    handleSubmit: function () {
      this.$refs.pwdForm.validate(valid => {
        if (valid) {
          const url = '/api/master/alterMyPassword'
          const data = `oldPassword=${this.pwdForm.oldValue}&newPassword=${this.pwdForm.newValue}`
          const settings = qcxUtils.getSettings(url, data)
          qcxUtils.ajaxHandle(this, settings, res => {
            if (parseInt(res.data.status) === 200) {
              this.$router.push('/login')
              this.$message({
                message: res.data.info,
                type: 'success',
                duration: 3000
              })
            }
          })
        }
      })

    }
  }
}
</script>

<style scoped>
.qcx-container {
  padding: 10px 25px;
  width: 400px;
}

.el-input {
  width: 250px;
}
</style>
