<template>
  <div>
    <p style="color:red">温馨提示：点击学号前的 “ > ” 可查看学生分数详情（若显示异常请点击左上方管理系统左边的图标收缩侧边栏）</p>
    <el-table
      :data="classTable.slice((currentPage-1)*pagesize,currentPage*pagesize)"
      height="720"
      border
      style="width: 100%;"
    >
      <el-table-column type="expand">
        <template slot-scope="props">
          <el-form
            label-position="left"
            inline
            class="demo-table-expand"
          >
            <el-card class="box-card">
              <div
                slot="header"
                class="clearfix"
              >
                <h4 style="margin:0">{{props.row.stuName+'个人分数详情'}}</h4>
                <!-- <el-button
                  style="float: right; padding: 3px 0"
                  type="text"
                >添加记录</el-button> -->
              </div>
              <div>
                <queryRecord
                  :stuId="props.row.stuId"
                  :stuName="props.row.stuName"
                />
              </div>
            </el-card>
          </el-form>
        </template>
      </el-table-column>
      <el-table-column
        label="学号"
        prop="stuId"
        width="120"
        sortable
      >
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span style="margin-left: 10px">{{ scope.row.stuId }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="姓名"
        prop="stuName"
        width="80"
      >
      </el-table-column>
      <el-table-column
        label="班级"
        prop="stuClass"
        width="230"
      >
        <template slot-scope="scope">
          <span style="margin-left: 5px">{{scope.row.stuClass}}
            <el-button
              size="mini"
              class="table-btn"
              v-if="parseInt(scope.row.monitor) === 0"
              @click="monitorHandle(scope.row)"
            >设为班长</el-button>
            <el-tag
              type="warning"
              size="mini"
              v-else-if="parseInt(scope.row.monitor)=== 1"
            >班长</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="宿舍"
        prop="stuDorm"
        width="180"
      >
        <template slot-scope="scope">
          <span
            style="margin-left: 5px"
            v-if="scope.row.stuDorm !== undefined"
          >
            {{scope.row.stuDorm.trim()}}
            <!--<el-tag type="info" size="small" v-if="parseInt(scope.row.dormHeader) === 0">舍员</el-tag>-->
            <el-button
              size="mini"
              class="table-btn"
              v-if="parseInt(scope.row.dormHeader) === 0"
              @click="dormHeaderHandle(scope.row)"
            >设为舍长</el-button>
            <el-tag
              type="warning"
              size="mini"
              v-else-if="parseInt(scope.row.dormHeader) === 1"
            >舍长</el-tag>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        label="分数"
        prop="stuScore"
        width="110"
        sortable
      >
        <template slot-scope="scope">
          <!-- <i class="el-icon-time"></i> -->
          <span :style="{'color': (scope.row.stuScore >= 100 ? '#67c23a':'red')}">{{ scope.row.stuScore }}</span>
          <el-tag
            size="mini"
            type='danger'
            v-if="scope.row.stuScore <= 70 ? true:false"
          >警告</el-tag>
          <el-tag
            size="mini"
            type='success'
            v-if="scope.row.stuScore >= 110 ? true:false"
          >优秀</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        prop="desc"
      >
        <template slot-scope="scope">
          <el-button
            size="mini"
            @click="addStuId(scope.row)"
          >添加记录</el-button>
          <el-button
            size="mini"
            @click="upDorm(scope.row)"
          >更新宿舍</el-button>
          <el-button
            size="mini"
            @click="upClass(scope.row)"
          >转出专业</el-button>
          <el-button
            size="mini"
            @click="deleteStudent(scope.row)"
          >删除学生</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="table-pagzie-show">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        background
        layout="total, sizes, prev, pager, next, jumper"
        :page-sizes="[13, 30, 60]"
        :page-size="13"
        :total="classTable.length"
      />
    </div>
    <!-- <el-button
      @click="drawer = true"
      type="primary"
      style="margin-left: 16px;"
    ></el-button>
    <el-drawer
      title="我是标题"
      :visible.sync="drawer"
      :direction="direction"
      :before-close="handleClose"
    >
      <span>我来啦!</span>
    </el-drawer> -->
    <el-drawer
      :title="drawersTitle"
      :visible.sync="drawers"
      :direction="direction"
      :before-close="handleClose"
    >
      <div v-if="isDrawers === 'upDorm'">
        <el-form
          label-width="80px"
          :model="upFrom"
          ref="upFrom"
          class="qcxs-input"
        >
          <el-form-item label="原宿舍">
            <el-input
              v-model="upFrom.oldDorm"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="更新宿舍"
            prop="dorm"
          >
            <el-input
              v-model="upFrom.stuDorm"
              placeholder="请按此格式填写（例：A1-101）"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="qcx-btn-groups">
          <el-button
            type="primary"
            @click="submitForm('upFrom')"
          >立即更新</el-button>
          <el-button
            type="info"
            @click="formReset()"
          >重置</el-button>
        </div>
      </div>
      <div v-if="isDrawers === 'upClass'">
        <el-form
          label-width="80px"
          :model="upFrom"
          class="qcxs-input"
        >
          <el-form-item label="原专业">
            <el-input
              v-model="upFrom.stuClass"
              :disabled="true"
            ></el-input>
          </el-form-item>
          <el-form-item
            label="转出原因"
            prop="upReson"
          >
            <el-input
              v-model="upFrom.upReson"
              placeholder="选填项"
            ></el-input>
          </el-form-item>
        </el-form>
        <div class="qcx-btn-groups">
          <el-button
            type="primary"
            @click="dataCommit()"
          >立即转出</el-button>
          <el-button
            type="info"
            @click="formReset()"
          >重置</el-button>
        </div>
      </div>
    </el-drawer>
  </div>
</template>

<script>
import queryRecord from './queryRecord'
import qcxUtils from '../../../../util/util'
export default {
  components: {
    queryRecord
  },
  props: {
    classTable: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentPage: 1, // 初始页
      pagesize: 13, //    每页的数据
      drawer: false,
      direction: 'rtl',
      drawers: false,
      drawerss: false,
      drawersTitle: '',
      isDrawers: '',
      upFrom: {
        stuId: '',
        stuDorm: '',
        stuName: '',
        stuClass: '',
        oldDorm: '',
        upReson: ''
      },
      rules: {
        dorm: [{
          required: true,
          validator: (rule, value, callback) => {
            if (value !== '') {
              value = this.upFrom.stuDorm
              const result = /[a-zA-Z0-9^-]/.test(value)
              if (result === false) {
                callback(new Error('请输入正确的宿舍格式（例：A1-101）'))
              } else {
                callback()
              }
            } else {
              callback(new Error('请输入宿舍'))
            }
          },
          trigger: 'change'
        }]
      }
    }
  },
  mounted() {

  },
  methods: {
    getStu(data) {
      this.drawer = true;
    },
    handleSizeChange: function (size) {
      this.pagesize = size;
      // console.log(this.pagesize) // 每页下拉显示数据
    },
    handleCurrentChange: function (currentPage) {
      this.currentPage = currentPage;
      // console.log(this.currentPage) // 点击第几页
    },
    addStuId(data) {
      this.$emit("listenTochildEvent", data);
    },
    deleteStudent(row) {
      let result = this.$confirm('确定删除该学生？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then((result) => {
          if (result === 'confirm') {
            const url = '/api/student/delete'
            const data = `stuId=${row.stuId}`
            const settings = qcxUtils.getSettings(url, data)
            this.$axios(settings).then(res => {
              if (res !== undefined) {
                // console.log(res)
                // this.dataQueryExceed(this.queryIdx)
                if (res.data.status == 200) {
                  this.$notify({
                    title: '学生' + row.stuName + '删除成功',
                    dangerouslyUseHTMLString: true,
                    message: '学号：' + row.stuId + '</br>专业班级：' + row.stuClass,
                    type: 'success',
                    duration: 5000
                  });
                  this.$emit("updata", row);
                }
                else {
                  this.open2()
                }
              }
            })
          }
        })
        .catch(err => {
        });

    },
    open2() {
      this.$notify({
        title: '删除学生失败',
        message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
        type: 'error',
        duration: 3000
      });
    },
    /**
     * 设置舍长
     * @param row
     */
    dormHeaderHandle: function (row) {
      const url = '/api/dorm/setHeader';
      const data = 'stuId=' + row.stuId;
      const settings = qcxUtils.getSettings(url, data);
      this.$axios(settings)
        .then(res => {
          if (parseInt(res.data.status) === 200) {
            this.$emit("updata", row);
          }
        })
        .catch(err => {
          this.$message.error('页面上发生错误，请联系管理员')
        })
    },

    /**
     * 设置班长
     * @param row
     */
    monitorHandle(row) {
      const url = '/api/class/setMonitor'
      const data = 'stuId=' + row.stuId
      const settings = qcxUtils.getSettings(url, data)
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          this.$emit("updata", row);
        }
      })
    },
    //通知框
    open1() {
      this.$notify({
        title: this.upFrom.stuName + '更新宿舍成功',
        dangerouslyUseHTMLString: true,
        message: '新宿舍：' + this.upFrom.stuDorm + '</br>原宿舍：' + this.upFrom.oldDorm.match(/[a-zA-Z0-9^-]/g).join(''),
        type: 'success',
        duration: 5000
      });
    },
    open2() {
      this.$notify({
        title: this.upFrom.stuName + '更新宿舍失败',
        message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
        type: 'error',
        duration: 5000
      });
    },
    open3() {
      this.$notify({
        title: this.upFrom.stuName + '转出专业成功',
        dangerouslyUseHTMLString: true,
        message: '原专业班级：' + this.upFrom.stuClass + '</br>转出原因：' + this.upFrom.upReson,
        type: 'success',
        duration: 5000
      });
    },
    open4() {
      this.$notify({
        title: this.upFrom.stuName + '转出专业失败',
        message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
        type: 'error',
        duration: 5000
      });
    },
    upDorm(row) {
      this.drawers = true
      this.isDrawers = 'upDorm'
      this.upFrom.stuName = row.stuName
      this.drawersTitle = '更新宿舍（' + row.stuName + '）:'
      this.upFrom.oldDorm = row.stuDorm + '（请按此格式填写）'
      this.upFrom.stuId = row.stuId
    },
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.submitHandle()
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    submitHandle() {

      const data = 'stuId=' + this.upFrom.stuId +
        '&newDorm=' + this.upFrom.stuDorm
      const url = '/api/student/alterDorm'
      const settings = qcxUtils.getSettings(url, data)
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          // console.log(res)
          // this.$message({
          //   message: '成功修改宿舍',
          //   type: 'success'
          // });
          if (res.data.status == 200) {
            this.open1()
          }
          else {
            this.open2()
          }
          this.$emit("updata", row);
        }
      })

    },
    upClass(row) {
      this.drawers = true
      this.isDrawers = 'upClass'
      this.drawersTitle = '转出专业（' + row.stuName + '）:'
      this.upFrom.stuId = row.stuId
      this.upFrom.stuName = row.stuName
      this.upFrom.stuClass = row.stuClass
    },
    dataCommit() {
      const data = 'stuId=' + this.upFrom.stuId +
        '&freeReason=' + this.upFrom.upReson;
      const url = '/api/student/setFree';
      const settings = qcxUtils.getSettings(url, data);
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          if (res.data.status == 200) {
            this.open3()
          }
          else {
            this.open4()
          }
        }
      })
    },
    formReset() {
      this.upFrom.stuDorm = ''
      this.upFrom.upReson = ''
    },
    handleClose() {
      this.drawers = false
      this.$emit("updata");
    }
  }
}
</script>

<style>
.demo-table-expand {
  padding: 0;
}
.demo-table-expand label {
  width: 90px;
  color: #99a9bf;
}
.demo-table-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 50%;
  text-align: left;
}
.table-pagzie-show {
  text-align: center;
  margin-top: 5px;
}
.table-btn {
  padding: 5px !important;
}
.qcx-btn-groups {
  text-align: center;
}
.qcxs-input {
  width: 450px !important;
  min-width: 300px;
  margin-left: 50px;
}
</style>