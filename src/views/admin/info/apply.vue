<template>
  <el-container class="qcx-container">
    <el-main>
      <blockquote class="qcx-quote">加分申报</blockquote>
      <el-table :data="applyData">
        <el-table-column
          label="加分申报流水号"
          prop="id"
        ></el-table-column>
        <el-table-column
          label="申诉人学号"
          prop="stuId"
        ></el-table-column>
        <el-table-column
          label="申报原因"
          prop="detailName"
        ></el-table-column>
        <el-table-column
          label="分值"
          prop="detailScore"
        ></el-table-column>
        <el-table-column
          label="时间"
          prop="time"
        ></el-table-column>
        <el-table-column
          label="备注"
          prop="remarks"
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <span style="margin-left: 10px">{{scope.row.status}}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-main>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      applyData: []
    };
  },
  mounted() {
    this.tableInit();
  },
  methods: {
    /**
     * 加分申报消息
     */
    getApplyData: function () {
      const settings = {
        url: '/api/applyScore/getList/',
        method: 'POST',
        crossDomain: true,
        async: true,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
        },
        xhrFields: {
          withCredentials: true
        }
      };
      this.$axios(settings)
        .then(res => {
          // console.log(res);
        })
        .catch(err => {
          this.$message.error('页面上发生错误，请联系管理员')
        })
    },

    tableInit() {
      this.getApplyData();
    }
  }
};
</script>
<style scoped>
</style>

