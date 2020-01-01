<template>
  <el-main class="qcx-container">
    <blockquote class="qcx-quote">开启新学期</blockquote>
    <el-card class="qcx-card">
      <div slot="header">
        <span class="qcx-header">将会执行的事情</span>
      </div>
      <div class="qcx-list">
        <div class="qcx-text qcx-item">重置所有学生的分数为100分</div>
        <div class="qcx-text qcx-item">清空所有学生加减分记录</div>
        <div class="qcx-text qcx-item">所有消息（含有申诉、申请和转专业的信息）</div>
        <div class="qcx-item">
          <el-button type="danger" size="medium" @click="submitHandle">开启新学期</el-button>
        </div>
      </div>
    </el-card>
  </el-main>
</template>

<script>
  import qcxUtils from '../../../util/util.js'

  export default {
    name: "reset",
    data() {
      return {
        password: '',
      }
    },
    methods: {
      submitHandle: function () {
        this.$confirm('该操作将清空目前所有学生的加减分记录，是否确认执行该操作？', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(res => {
          this.dataReset()
        })
          .catch(err => {
          })
      },

      /**
       * 开启新学期
       */
      dataReset: function () {
        const url = '/api/system/setNewTerm/';
        const data = 'password=' + this.password;
        const settings = qcxUtils.getSettings(url, data);
        this.$axios(settings)
          .then(res => {
            if (parseInt(res.data.status) === 200) {
              this.$message({
                message: '成功开启新学期',
                type: 'success'
              })
            }
          })
          .catch(err => {
            this.$message.error('页面上发生错误，请联系管理员');
          })
      }
    }
  }
</script>

<style scoped>
  .qcx-header {
    margin-left: 20px;
    padding: 0 10px;
    display: table;
    content: "";
    font-size: 20px;
    font-weight: 300;
    text-align: left;
  }

  .qcx-list {
    display: block;
  }

  .qcx-item {
    margin-bottom: 18px;
    margin-left: 30px;
  }

  .qcx-text {
    text-align: left;
  }
</style>
