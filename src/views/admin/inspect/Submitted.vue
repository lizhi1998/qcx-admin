<template>
  <el-container class="qcx-container">
    <el-main>
      <blockquote class="qcx-quote">提交记录查看</blockquote>
      <el-table :data="inspectTable.data">
        <el-table-column label="巡查辅导员" prop="masAccount"></el-table-column>
        <el-table-column label="巡查项目" prop="detailCategory"></el-table-column>
        <el-table-column label="巡查细则" prop="detailName"></el-table-column>
        <el-table-column label="提交时间" prop="time" sortable></el-table-column>
        <el-table-column label="备注" prop="remarks"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <el-tag
              v-if="scope.row.status==='pass'"
              size="mini"
              type="success"
              icon="el-icon-success"
            >已处理</el-tag>
            <el-tag
              v-if="scope.row.status==='wait'"
              size="mini"
              type="warning"
              icon="el-icon-warning"
            >待处理</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="qcx-pagination"
        layout="total, sizes, prev, pager, next, jumper"
        :total="inspectTable.data.length"
        :current-page.sync="inspectTable.currentPage"
        :page-size="inspectTable.pageSize"
        :page-sizes="[10,25,50,100]"
        @size-change="tableSizeChange"
        @current-change="tablePageChange"
      ></el-pagination>
    </el-main>
  </el-container>
</template>
<script>
import qcxUtils from "../../../util/util.js";
export default {
  data() {
    return {
      submittedData: [],
      inspectTable: {
        data: [],
        currentPage: 1,
        pageSize: 10,
        height: 540
      }
    };
  },
  mounted() {
    this.tableInit();
  },
  methods: {
    /**
     * 表格初始化
     */
    tableInit() {
      this.getSubmittedData();
    },

    /**
     * 获取提交记录
     */
    getSubmittedData: function() {
      const url = "/api/inspection/getMySubmit";
      const settings = qcxUtils.getSettings(url);
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          if (res.data.data) {
            let page = this.inspectTable.currentPage;
            let size = this.inspectTable.pageSize;
            this.submittedData = res.data.data;
            this.inspectTable.data = this.submittedData.slice(
              (page - 1) * size,
              page * size
            );
          }
        }
      });
    },

    /**
     * 改变每页显示条数时触发
     * @param size 每页显示条数
     */
    tableSizeChange: function(size) {
      let page = this.inspectTable.currentPage;
      this.inspectTable.pageSize = size;
      this.inspectTable.data = this.submittedData.slice(
        (page - 1) * size,
        page * size
      );
    },

    /**
     * 改变当前页时触发
     * @oaram page 页码
     */
    tablePageChange: function(page) {
      let size = this.inspectTable.pageSize;
      this.inspectTable.currentPage = page;
      this.inspectTable.data = this.submittedData.slice(
        (page - 1) * size,
        page * size
      );
    }
  }
};
</script>
<style scoped>
.qcx-pagination {
  margin-top: 15px;
}

.el-form {
  display: grid;
  justify-items: center;
  align-items: center;
}

.el-form-item {
  display: inline-flex;
}

.el-input,
.el-select,
.qcx-input {
  width: 380px !important;
  min-width: 300px;
  float: left;
}
</style>

