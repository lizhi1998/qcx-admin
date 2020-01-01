<template>
  <el-main>
    <blockquote class="qcx-quote">
      本次操作共导入{{resTable.total}}条记录，失败{{resTable.fail}}条，成功{{resTable.success}}条。操作失败的记录将以额外表格的形式加载。
    </blockquote>
    <el-table :data="resTable.data" :height="resTable.height">
      <el-table-column label="学号" prop="stuId"></el-table-column>
      <el-table-column label="类型" prop="detailCategory"></el-table-column>
      <el-table-column label="细项" prop="detailName"></el-table-column>
      <el-table-column label="分值" prop="score"></el-table-column>
      <el-table-column label="失败原因" prop="errorReason"></el-table-column>
    </el-table>
    <el-pagination background
                   class="qcx-pagination"
                   layout="total, sizes, prev, pager, next, jumper"
                   :total="data.length"
                   :current-page.sync="resTable.currentPage"
                   :page-size="resTable.pageSize"
                   :page-sizes="[5,10,25,50,100]"
                   @size-change="tableSizeChange"
                   @current-change="tablePageChange">

    </el-pagination>
  </el-main>
</template>

<script>

  export default {
    props: ['data', 'type', 'succ', 'fail'],
    name: "resTable",
    data() {
      return {
        resType: parseInt(this.type),
        resTable: {
          data: [],
          height: 400,
          success: this.succ,
          fail: this.fail,
          total: this.succ + this.fail,
          currentPage: 1,
          pageSize: 10
        }
      }
    },
    created() {

    },
    mounted() {
      this.$nextTick(() => {
        if (this.data !== undefined && this.data.length) {
          let page = this.resTable.currentPage
          let size = this.resTable.pageSize
          this.resTable.data = this.data.slice(
            (page - 1) * size, page * size
          )
        }
      })
    },
    methods: {
      /**
       * 改变每页显示条数时触发
       * @param size 每页显示条数
       */
      tableSizeChange: function (size) {
        let page = this.resTable.currentPage;
        this.resTable.pageSize = size;
        this.resTable.data = this.data.slice((page - 1) * size, page * size);
      },

      /**
       * 改变当前页时触发
       * @oaram page 页码
       */
      tablePageChange: function (page) {
        let size = this.resTable.pageSize;
        this.resTable.currentPage = page;
        this.resTable.data = this.data.slice((page - 1) * size, page * size);
      },
    }
  }
</script>

<style scoped>
  .el-main {
    padding: 0;
  }
</style>
