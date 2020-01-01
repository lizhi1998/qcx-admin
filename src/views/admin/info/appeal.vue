<template>
  <el-container class="qcx-container">
    <el-main>
      <blockquote class="qcx-quote">申诉消息</blockquote>
      <el-table :data="appealData"
                border>
        <el-table-column label="申诉人姓名"
                         prop="stuName">

        </el-table-column>
        <el-table-column label="申诉理由"
                         prop="state">

        </el-table-column>
        <el-table-column label="操作人"
                         prop="updateMasName">

        </el-table-column>
        <el-table-column label="操作时间"
                         prop="updateTime">

        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <div class="qcx-btn-group" v-if="scope.row.status === 'underway'">
              <el-button type="primary" size="mini" :disabled="buttonDisabled" @click="checkHandle(scope.row, 'pass')">
                通过
              </el-button>
              <el-button type="danger" size="mini" :disabled="buttonDisabled" @click="checkHandle(scope.row, 'ignore')">
                忽略
              </el-button>
            </div>
            <div class="qcx-btn-group" v-else>
              <el-tag type="success" v-if="scope.row.status === 'success'">成功</el-tag>
              <el-tag type="danger" v-else-if="scope.row.status === 'failure'">失败</el-tag>
              <el-tag type="info" v-else-if="scope.row.status === 'termination'">已失效</el-tag>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
  import qcxUtils from "../../../util/util";

  export default {
    data() {
      return {
        appealData: [],
        buttonDisabled: false
      };
    },
    mounted() {
      this.tableInit();
    },
    methods: {
      tableInit: function () {
        this.getAppealData();
      },

      /**
       * 获取申诉消息
       */
      getAppealData: function () {
        let url = '/api/appealScore/getList'
        const settings = qcxUtils.getSettings(url)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            this.appealData = res.data.data
          }
        })
      },

      /**
       * 管理员审核申诉
       * @param row
       * @param type 撤回类型
       * @param status 审核结果
       */
      checkHandle: function (row, status = 'pass') {
        let url = '/api/appealScore/check'
        let data = `teamCode=${row.teamCode}&stuId=${row.stuId}&type=${row.type}&status=${status}`
        const settings = qcxUtils.getSettings(url, data)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            const status = parseInt(res.data.status)
            this.$message({
              message: res.data.info,
              type: status === 200 ? 'success' : 'warning'
            })
            this.tableInit()
          }
        })
      }
    }
  };
</script>
<style scoped>

</style>

