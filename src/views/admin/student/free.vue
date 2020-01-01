<template>
  <el-container class="qcx-container">
    <el-main>
      <blockquote class="qcx-quote">无专业学生处理</blockquote>
      <el-table :data="studentTable.data">
        <el-table-column label="学号" prop="stuId"></el-table-column>
        <el-table-column label="姓名" prop="stuName"></el-table-column>
        <el-table-column label="原学院" prop="stuAcademic"></el-table-column>
        <el-table-column label="原专业" prop="stuMajor"></el-table-column>
        <el-table-column label="原班级" prop="stuClass"></el-table-column>
        <el-table-column label="原宿舍" prop="stuDorm"></el-table-column>
        <el-table-column label="转出时间" prop="freeTime"></el-table-column>
        <el-table-column label="转出原因" prop="freeReason"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" size="mini" @click="freeHandler(scope.row)">分配</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
                     class="qcx-pagination"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="studentTable.data.length"
                     :current-page.sync="studentTable.currentPage"
                     :page-size="studentTable.pageSize"
                     :page-sizes="[10,25,50,100]"
                     @size-change="tableSizeChange"
                     @current-change="tablePageChange">

      </el-pagination>
    </el-main>
    <el-dialog :visible.sync="dialogOptions.visible" :width="dialogOptions.width"
               :title="dialogOptions.title"
               :center="false">
      <el-form class="qcx-form-container">
        <el-form-item label="学号">
          <el-input v-model="dialogData.stuId" disabled></el-input>
        </el-form-item>
     
      <el-form-item label="学院" prop="stuAcademic">
        <el-select class="qcx-form-container" v-model="dialogData.stuAcademic" @change="getMajorList" filterable>
          <el-option v-model="item.value"
                     v-for="item in classList.academic"
                     :label="item.label"
                     :value="item.value"
                     :key="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="专业" prop="stuMajor">
        <el-select class="qcx-form-container" v-model="dialogData.stuMajor" @change="getClassNameList" filterable>
          <el-option v-for="item in classList.major"
                     v-model="item.value"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>


      <el-form-item label="班级" prop="stuClass">
        <el-select class="qcx-form-container" v-model="dialogData.stuClass" filterable>
          <el-option v-for="item in classList.class"
                     v-model="item.value"
                     :key="item.value"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
        <el-form-item label="宿舍">
          <el-input v-model="dialogData.stuDorm" placeholder="请输入新宿舍(如A1-101)"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" size="mini" @click="infoSubmit">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>
  </el-container>
</template>
<script>
  import qcxUtils from '../../../util/util.js'
  import Bus from '../../../assets/js/bus.js'

  export default {
    data() {
      return {
        classData: [],
         classList: {
          major: [],
          academic: [],
          class: []
        },
        studentTable: {
          data: [],
          currentPage: 1,
          pageSize: 10,
          height: 540
        },
        dialogOptions: {
          visible: false,
          title: '',
          status: false,
          width: '55%'
        },
        dialogData: {
          stuId: '',
          stuName: '',
          stuAcademic:'',
          stuMajor:'',
          stuClass: '',
          stuDorm: ''
        }
      };
    },
    mounted() {
      this.tableInit();
      this.getClassList();
    },
    methods: {
      /**
       * 表格初始化
       */
      tableInit() {
        this.getApplyData();
      },

      /**
       * 无专业学生处理
       */
      getApplyData: function () {
        const url = '/api/student/getFreeStuList'
        const settings = qcxUtils.getSettings(url)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            if (res.data.data) {
              let page = this.studentTable.currentPage
              let size = this.studentTable.pageSize
              this.studentData = res.data.data
              this.studentTable.data = this.studentData.slice(
                (page - 1) * size, page * size
              )
            }
          }
        })
      },

      /**
       * 获取有权限管理的班级
       */
 /*     getClassList: function () {
        this.$message({
          message: "正在加载班级列表...",
          type: "warning"
        });
        const url = '/api/class/query'
        const settings = qcxUtils.getSettings(url)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            let dataSet = new Set()
            res.data.data.map(item => {
              dataSet.add(item.className)
            })
            this.classData = Array.from(new Set(dataSet)).map(item => {
              return {
                value: item,
                label: item
              }
            })
          }
        })
      },*/
       dataHandle: function (_data, _from, _to, value) {
        return Array.from(new Set(
          _data.map(item => {
            return item[_to]
          })
        ))
          .map(item => {
            return {
              label: item,
              value: item
            }
          })
      },
 getClassList: function () {
  /* this.$message({
          message: "正在加载学院列表...",
          type: "warning"
        });*/
        const url = '/api/class/query'
        const settings = qcxUtils.getSettings(url)
        this.$axios(settings)
          .then(res => {
            if (parseInt(res.data.status) === 200) {
              this.classData = res.data.data;
              this.classList.academic = this.dataHandle(this.classData, "", "academic");
              
            }
          })
          .catch(err => {
            this.$message.error("页面上发生错误，请重试或联系管理员")
          })
      },

      freeHandler: function (row) {
        this.getClassList()
        this.dialogOptions.title = '当前分配学生（' + row.stuName + '）'
        this.dialogOptions.visible = true
        this.dialogData.stuId = row.stuId
        this.dialogData.stuName = row.stuName
      },
      getMajorList: function (value) {
        const data = this.classData.filter(item => {
          return item["academic"] === this.dialogData.stuAcademic
        })
        this.classList.major = this.dataHandle(data, "academic", "major", value);
        if (this.classList.major.length > 0) {
          this.dialogData.stuMajor = this.classList.major[0].value;
          this.getClassNameList(this.dialogData.stuMajor);
        }
      },

      /**
       * 班级信息填充处理
       */
      getClassNameList: function (value) {
        const data = this.classData.filter(item => {
          return item["academic"] === this.dialogData.stuAcademic && item["major"] === this.dialogData.stuMajor
        })
        this.classList.class = this.dataHandle(data, "major", "className", value);
        if (this.classList.class.length > 0) {
          this.dialogData.stuClass = this.classList.class[0].value;
        }
      },
        open1() {
        this.$notify({
          title: this.dialogData.stuName+' 分配专业成功',
          dangerouslyUseHTMLString: true,
          message: '分配信息：'+'</br>学号：'+this.dialogData.stuId+'</br>姓名：'+this.dialogData.stuName+'</br>学院：'+this.dialogData.stuAcademic+'</br>专业：'+this.dialogData.stuMajor+'</br>班级：'+this.dialogData.stuClass,
          type: 'success' ,
          duration:5000
        });
      },
        open2() {
        this.$notify({
          title: this.dialogData.stuName+'分配专业失败',
          message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
          type: 'error' ,
          duration:5000
        });
      },
      /**
       * 分配专业处理
       */
      infoSubmit: function () {
        let url = '/api/student/takeFreeStuIn'
        let data = `stuId=${this.dialogData.stuId}&stuAcademic=${this.dialogData.stuAcademic}&stuMajor=${this.dialogData.stuMajor}&stuClass=${this.dialogData.stuClass}`
      
        if (this.dialogData.stuDorm !== '') {
          data = data + '&stuDorm=' + this.dialogData.stuDorm
        }
        
        const settings = qcxUtils.getSettings(url, data)
        qcxUtils.ajaxHandle(this, settings, res => {
          if (res !== undefined) {
            if(res.status == 200){
              this.open1()
            }
            else{
              this.open2()
            }
            this.dialogOptions = false
            this.tableInit()
          }
        })
      },

      /**
       * 改变每页显示条数时触发
       * @param size 每页显示条数
       */
      tableSizeChange: function (size) {
        let page = this.studentTable.currentPage
        this.studentTable.pageSize = size
        this.studentTable.data = this.studentData.slice((page - 1) * size, page * size)
      },

      /**
       * 改变当前页时触发
       * @oaram page 页码
       */
      tablePageChange: function (page) {
        let size = this.studentTable.pageSize
        this.studentTable.currentPage = page
        this.studentTable.data = this.studentData.slice((page - 1) * size, page * size)
      },

    }
  }
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

  .el-input, .el-select, .qcx-input {
    width: 380px !important;
    min-width: 300px;
    float: left;
  }

  .el-button {

  }
</style>

