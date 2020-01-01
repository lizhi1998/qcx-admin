<template>
  <el-table :data="stuTable.data"
            border
            strip
            :max-height="stuTable.maxHeight">
    <el-table-column label="加减分细则" width="320" header-align="left">
      <template slot-scope="scope">
        <el-tag size="mini" type="success qcx-label__dorm" v-if="scope.row.detailCategory === '宿舍文明'">宿舍文明</el-tag>
        <el-tag size="mini" type="danger qcx-label__class" v-else-if="scope.row.detailCategory === '课堂文明'">课堂文明</el-tag>
        <el-tag size="mini" type="primary qcx-label__net" v-else-if="scope.row.detailCategory === '网络文明'">网络文明</el-tag>
        {{scope.row.detailName}}
      </template>
    </el-table-column>
    <el-table-column label="备注" width="280" prop="remarks"></el-table-column>
    <el-table-column label="分值" width="80" prop="score"></el-table-column>
    <el-table-column label="类型" width="80">
      <template slot-scope="scope">
        {{getRecordType(scope.row)}}
      </template>
    </el-table-column>
    <el-table-column label="时间" prop="createTime"></el-table-column>
    <el-table-column label="操作" width="80">
      <template slot-scope="scope">
        <el-button type="danger" size="mini" :disabled="buttonDisabled" @click="cancelConfirm(scope.row)">撤回</el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
  import qcxUtils from '../../../../util/util.js'

  export default {
    name: "query",
    props: ['stuId','stuName'],
    data() {
      return {
        stuData: {
          id: this.stuId,
          name: this.stuName
        },
        stuTable: {
          data: [],
          maxHeight: 450
        },
        typeOptions: {
          person: '个人',
          class: '班级',
          dorm: '宿舍'
        },
        buttonDisabled: false
      }
    },
    mounted() {
      this.tableInit();
    },

    beforeDestroy() {

    },
    methods: {
      getRecordType: function (row) {
        // console.log(row);
        if (row.type !== undefined) {
          return this.typeOptions[row.type]
        } else {
          return ''
        }
      },

      /**
       * 获取学生记录
       */
      getStudentData: function () {
        const url = '/api/scoreDetail/query'
        const data = 'stuId=' + this.stuData.id
        const settings = qcxUtils.getSettings(url, data)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            this.stuTable.data = res.data.data.filter(item => {
              return !parseInt(item.cancel)
            });
          }
        })
      },

      /**
       * 表格初始化
       */
      tableInit: function () {
        this.getStudentData();
      },

      cancelConfirm: function (row) {
        let result = this.$confirm('确认撤回该条记录吗？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then((res) => {
          if (res === 'confirm') {
            this.cancelHandle(row)
          }
        }).catch(err => {

        })
      },
      //通知框
        open2() {
        this.$notify({
          title: this.stuData.name+'分数撤回失败',
          message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
          type: 'error' ,
          duration:5000
        });
      },
      /**
       * 撤回操作
       * @TODO
       * @param row
       */
      cancelHandle: function (row) {
        let type = 'person'
        if(row.type !== 'person')
          type = 'team'
        const url = '/api/scoreDetail/revoke'
        const data = 'stuId=' + row.stuId + '&teamCode=' + row.teamCode + '&type=' + type
        const settings = qcxUtils.getSettings(url, data)
        this.buttonDisabled = true
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            setTimeout(() => {
              this.tableInit()
            }, 0);
            if(res.status === 200){
              if(row.score >= 0){
                this.$notify({
                  title: this.stuData.name+'撤回加分成功',
                  dangerouslyUseHTMLString: true,
                  message: '撤回项目：'+row.detailName+'</br>撤回分值：+'+row.score,
                  type: 'success' ,
                  duration:5000
                });
              }
              else if(row.score < 0){
                this.$notify({
                  title: this.stuData.name+'撤回扣分成功',
                  dangerouslyUseHTMLString: true,
                  message: '撤回项目：'+row.detailName+'</br>撤回分值：'+row.score,
                  type: 'success' ,
                  duration:5000
                });
              }
          }
          else{
            this.open2()
          }
          }
          this.buttonDisabled = false;
        })
      },

      /**
       *
       * @param formName
       */
      formReset: function (formName) {
        // console.log(formName)
        this.$refs[formName].resetFields();
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
