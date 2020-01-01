<template>
  <el-container class="qcx-container">
    <el-main>
      <el-tabs
        type="border-card"
        @tab-click="tabClick"
      >
        <el-tab-pane
          index="0"
          label="查学号"
        >
          <el-form
            label-position="left"
            @submit.native.prevent
          >
            <el-form-item label="学号">
              <el-input
                v-model="form.stuId"
                placeholder="请输入学号"
                @keyup.native.enter='dataQueryExceed(0)'
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                class="qcx-button"
                type="primary"
                @click="dataQueryExceed(0)"
              >立即查询
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          index="1"
          label="查姓名"
        >
          <el-form
            label-position="left"
            @submit.native.prevent
          >
            <el-form-item label="姓名">
              <el-input
                v-model="form.stuName"
                placeholder="请输入姓名"
                @keyup.native.enter='dataQueryExceed(1)'
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                class="qcx-button"
                type="primary"
                @click="dataQueryExceed(1)"
              >立即查询
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          index="2"
          label="查班级"
        >
          <el-form label-position="left">
            <el-form-item label="班级">
              <el-select
                v-model="form.class.academic"
                filterable
                placeholder="请选择学院"
                @change="getMajorList"
              >
                <el-option
                  v-for="item in classList.academic"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="form.class.major"
                filterable
                placeholder="请选择专业"
                @change="getClassNameList"
              >
                <el-option
                  v-for="item in classList.major"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
              <el-select
                v-model="form.class.className"
                filterable
                placeholder="请选择班级"
              >
                <el-option
                  v-for="item in classList.className"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button
                class="qcx-button"
                type="primary"
                @click="dataQueryExceed(2)"
              >立即查询
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
        <el-tab-pane
          index="3"
          label="查宿舍"
        >
          <el-form label-position="left">
            <el-form-item label="宿舍号">
              <el-cascader
                :options="dormList"
                v-model="form.dormitory"
                separator="/"
                filterable
              >
              </el-cascader>
            </el-form-item>
            <el-form-item>
              <el-button
                class="qcx-button"
                type="primary"
                @click="dataQueryExceed(3)"
              >立即查询
              </el-button>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
      <blockquote class="qcx-quote qcx-quote-single">查询方式：{{queryText}}
        <el-button
          size="mini"
          type="primary"
          v-if="queryIdx === 2"
          @click="showDialog('add_record')"
        >新增班级记录</el-button>
        <el-button
          size="mini"
          type="primary"
          v-else-if="queryIdx === 3"
          @click="showDialog('add_record')"
        >新增宿舍记录
        </el-button>
      </blockquote>
      <el-table
        :data="studentTable.data"
        border
        strip
        :max-height="studentTable.height"
      >
        <el-table-column
          label="学号"
          width="120"
          prop="stuId"
          sortable
        ></el-table-column>
        <el-table-column
          label="姓名"
          width="80"
          prop="stuName"
        ></el-table-column>
        <el-table-column
          label="班级"
          width="250"
          sortable
        >
          <template slot-scope="scope">
            <span style="margin-left: 5px">{{scope.row.stuClass}}
              <el-button
                size="mini"
                class="padding-left: 5px; padding-right: 5px"
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
          width="160"
          sortable
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
          width="80"
          prop="stuScore"
          sortable
        ></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="showDialog('query_record', scope.row)"
            >查看记录</el-button>
            <el-button
              size="mini"
              @click="showDialog('add_record', scope.row)"
            >添加记录</el-button>
            <el-button
              size="mini"
              @click="showDialog('update_dorm', scope.row)"
            >更新宿舍</el-button>
            <el-button
              size="mini"
              @click="showDialog('free_major', scope.row)"
            >转出专业</el-button>
            <el-button
              size="mini"
              @click="deleteStudent(scope.row)"
            >删除学生</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        background
        class="qcx-pagination"
        layout="total, sizes, prev, pager, next, jumper"
        :total="studentData.length"
        :current-page.sync="studentTable.currentPage"
        :page-size="studentTable.pageSize"
        :page-sizes="[5,10,25,50,100]"
        @size-change="tableSizeChange"
        @current-change="tablePageChange"
      >

      </el-pagination>
    </el-main>
    <el-dialog
      :visible.sync="dialogOptions.visible"
      :width="dialogOptions.width"
      :title="dialogOptions.title"
      :before-close="statusCheck"
      :center="false"
    >
      <el-container class="qcx-form-container">
        <template v-if="dialogOptions.type === 'add_student'">
          <add-student ref="addStudent"></add-student>
        </template>
        <template v-if="dialogOptions.type === 'add_record'">
          <add-record
            class="qcx-add-form"
            ref="addRecord"
            :stuId="dialogData.stuId"
            :stuName="dialogData.stuName"
            :stuClass="dialogData.stuClass"
            :stuDorm="dialogData.stuDorm"
            :addType="dialogData.addType"
            :dormHeader="dialogData.dormHeader"
            :monitor="dialogData.monitor"
          >
          </add-record>
        </template>
        <template v-if="dialogOptions.type === 'query_record'">
          <query-record
            ref="queryRecord"
            :stuId="dialogData.stuId"
            :stuName="dialogData.stuName"
          ></query-record>
        </template>
        <template v-if="dialogOptions.type === 'update_dorm'">
          <update-dorm
            ref="updateDorm"
            :stuId="dialogData.stuId"
            :stuName="dialogData.stuName"
            :stuDorm="dialogData.stuDorm"
          ></update-dorm>
        </template>
        <template v-if="dialogOptions.type === 'free_major'">
          <free-student
            ref="freeStudent"
            :stuId="dialogData.stuId"
            :stuName="dialogData.stuName"
            :stuClass="dialogData.stuClass"
          ></free-student>
        </template>
      </el-container>
    </el-dialog>
  </el-container>
</template>

<script>
import addRecord from './components/addRecord.vue'
import queryRecord from './components/queryRecord.vue'
import updateDorm from './components/updateDorm.vue'
import freeStudent from './components/freeStudent.vue'
import addStudent from './add.vue'

import Bus from '../../../assets/js/bus.js'
import qcxUtils from '../../../util/util.js'

export default {
  components: {
    addRecord,
    queryRecord,
    updateDorm,
    addStudent,
    freeStudent
  },
  data() {
    return {
      form: {
        stuName: '',
        stuId: '',
        class: {
          major: '',
          academic: '',
          className: ''
        },
        dormitory: []
      },
      queryText: '未进行查询',
      queryIdx: 0,
      queryOptions: [
        {
          type: 'stuId',
          text: '学号'
        }, {
          type: 'stuName',
          text: '姓名'
        }, {
          type: 'stuClass',
          text: '班级'
        }, {
          type: 'stuDorm',
          text: '宿舍'
        }],
      classList: {
        major: [],
        academic: [],
        className: []
      },
      dormList: [{
        label: '',
        children: []
      }],
      studentTable: {
        data: [],
        currentPage: 1,
        pageSize: 10,
        height: 540
      },
      dialogOptions: {
        visible: false,
        type: '',
        title: '',
        status: false,
        width: '55%'
      },
      dialogData: {
        stuId: '',
        stuName: '',
        stuClass: '',
        stuDorm: '',
        addType: '',
        dormHeader: 0,
        monitor: 0
      },
      classData: [],
      studentData: [],
      dormData: [],
      propOptions: {
        query_record: {
          title: '查看学生所有个人记录',
          width: '80%'
        },
        add_record: {
          title: '增加新记录',
          width: '55%'
        },
        add_student: {
          title: '添加新学生'
        },
        reset_password: {
          title: '重置密码'
        },
        update_dorm: {
          title: '更新宿舍'
        },
        free_major: {
          title: '转出专业'
        }
      }
    }
  },
  watch: {},
  mounted() {
    Bus.$on('form_reset', res => {
      if (res === 'true') {
        // console.log(res)
      }
    })

  },
  computed: {},
  methods: {
    formDataInit: function () {
      this.form = {
        stuName: '',
        stuId: '',
        class: {
          major: '',
          academic: '',
          className: ''
        },
        dormitory: []
      }
    },

    /**
     *  数组去重
     */
    getUniqueArray: function (array) {
      return Array.from(new Set(array))
    },

    tabClick: function (ev) {
      const idx = parseInt(ev.index);
      this.formDataInit()
      this.queryIdx = idx
      this.queryText = `${this.queryOptions[idx].text}`
      switch (idx) {
        case 2:
          if (this.classData.length === 0)
            this.getClassList();
          break;
        case 3:
          if (this.dormData.length === 0)
            this.getDormitoryData();
          break;
        default:
          break;
      }
    },

    /**
     * 数据处理
     * @param _data
     * @param _from 源属性名
     * @param _to 目标属性名
     */
    dataHandle: function (_data, _from, _to) {
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

    /**
     * 获取班级信息
     */
    getClassList: function () {
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

    /**
     * 专业信息填充处理
     */
    getMajorList: function (value) {
      const data = this.classData.filter(item => {
        return item["academic"] === this.form.class.academic
      })
      this.classList.major = this.dataHandle(data, "academic", "major", value);
      if (this.classList.major.length > 0) {
        this.form.class.major = this.classList.major[0].value;
        this.getClassNameList(this.form.class.major);
      }
    },

    /**
     * 班级信息填充处理
     */
    getClassNameList: function (value) {
      const data = this.classData.filter(item => {
        return item["academic"] === this.form.class.academic && item["major"] === this.form.class.major
      })
      this.classList.className = this.dataHandle(data, "major", "className", value);
      if (this.classList.className.length > 0) {
        this.form.class.className = this.classList.className[0].value;
      }
    },

    /**
     * 获取宿舍数据
     */
    getDormitoryData: function () {
      // this.$message({
      //   message: "正在加载宿舍列表...",
      //   type: "warning"
      // })
      const url = '/api/dorm/query'
      const settings = qcxUtils.getSettings(url)
      // settings.config = {
      //   showLoading: false
      // }
      this.$axios(settings)
        .then(res => {
          if (parseInt(res.data.status) === 200) {
            this.dormData = res.data.data.filter(item => {
              return item !== null && item !== ''
            })
            this.dormList = this.dormDataHandle()
            console.log(this.dormList)
          }
        })
      // .catch(err => {
      //   this.$message.error("页面上发生错误，请重试或联系管理员")
      // })
    },

    /**
     * 宿舍数据处理
     */
    dormDataHandle: function () {
      // 获取宿舍区列表
      const _data = Array.from(new Set(
        this.dormData.map(item => {
          return item.charAt(0).toUpperCase()
        })
      ));

      return _data.map(item => {
        return {
          label: item.toUpperCase(),
          value: item.toUpperCase(),
          children: this.getBuildings(item) // 返回各区宿舍楼号
        }
      })
    },

    /**
     * 获取楼层列表
     */
    getBuildings: function (label) {
      if (this.dormData.length > 0) {
        // 获取楼层
        let _buildings = this.getUniqueArray(this.dormData.map(item => {
          return item.indexOf("-") >= 0 ? item.split('-')[0].toUpperCase() : item.split('－')[0].toUpperCase();
        }));

        return _buildings.filter(item => {
          return item.indexOf(label.toUpperCase()) !== -1;
        }).map(item => {
          return {
            value: item.toUpperCase(),
            label: item.toUpperCase(),
            children: this.getRooms(item.toUpperCase())
          }
        });
      }

    },

    /**
     * 宿舍房间数据填充
     */
    getRooms: function (layer_label) {
      if (this.dormData.length > 0) {
        // 获取楼层
        let _rooms = this.getUniqueArray(
          this.dormData
            .map(item => {
              if (item.indexOf('-') >= 0 || item.split('－') >= 0) {
                let _item = item.split('-') || item.split('－');
                let layer = _item[0];
                if (layer === layer_label) {
                  return {
                    value: _item[1].toUpperCase(),
                    label: _item[1].toUpperCase(),
                  }
                }
              }
            }));

        return _rooms.filter(item => {
          return item !== undefined
        });
      }
      console.log(this.dormList)
    },

    /**
     * 改变每页显示条数时触发
     * @param size 每页显示条数
     */
    tableSizeChange: function (size) {
      let page = this.studentTable.currentPage;
      this.studentTable.pageSize = size;
      this.studentTable.data = this.studentData.slice((page - 1) * size, page * size);
    },

    /**
     * 改变当前页时触发
     * @oaram page 页码
     */
    tablePageChange: function (page) {
      let size = this.studentTable.pageSize;
      this.studentTable.currentPage = page;
      this.studentTable.data = this.studentData.slice((page - 1) * size, page * size);
    },

    /**
     * 条件查询预处理
     * @param idx
     */
    dataQueryExceed: function (idx) {
      this.queryIdx = idx
      const _this = this
      let queryType = this.queryOptions[idx].type
      let dorm = this.form.dormitory.length > 0 ? `${this.form.dormitory[1]}-${this.form.dormitory[2]}` : ''
      let queryData = []
      queryData.push(this.form.stuId)
      queryData.push(this.form.stuName)
      queryData.push(this.form.class.academic)
      queryData.push(this.form.class.major)
      queryData.push(this.form.class.className)
      queryData.push(dorm)
      let textData = (function (idx) {
        switch (idx) {
          case 0:
            return _this.form.stuId
          case 1:
            return _this.form.stuName
          case 2:
            return _this.form.class.className
          case 3:
            return dorm
        }
      })(idx)
      // 查询区文本修改
      this.queryText = (textData === '') ? `${this.queryOptions[idx].text}` : `${this.queryOptions[idx].text}（${textData}）`
      this.dataQuery(queryType, queryData);
    },

    /**
     * 条件查询
     * @param queryData
     * @param queryType
     */
    dataQuery: function (queryType, queryData) {
      const url = '/api/student/query'
      let [stuId, stuName, academic, major, className, dorm] = queryData
      const data = `stuId=${stuId}&stuName=${stuName}&dorm=${dorm}&academic=${academic}&major=${major}&className=${className}&type=${queryType}`
      const settings = qcxUtils.getSettings(url, data)
      this.$axios(settings).then(res => {
        {
          if (res.data.status == 200) {
            // this.$message({
            //     message:  '查询成功',
            //     type: 'success',
            //     duration:3000
            // })
          }
          else {
            this.$message({
              message: res.data.info,
              type: 'warning',
              duration: 3000
            })
          }
        }
        if (res.data.data) {
          let page = this.studentTable.currentPage;
          let size = this.studentTable.pageSize;
          this.studentData = res.data.data;
          this.studentTable.data = this.studentData.slice(
            (page - 1) * size, page * size
          );
        }
      })



    },

    /**
     * 关闭状态检测
     */
    statusCheck: function () {
      if (this.dialogOptions.type === 'add_record') {
        this.$nextTick(() => {
          if (this.$refs.addRecord.formStatus === false) {
            let result = this.$confirm('当前记录尚未提交，确认关闭吗？', '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
              .then((result) => {
                if (result === 'confirm') {
                  this.handleClose()
                }
              })
              .catch(err => {

              });
          } else {
            this.handleClose()
          }

        })
      } else {
        this.handleClose()
      }
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
            this.dataQueryExceed(this.queryIdx)
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
    monitorHandle: function (row) {
      const url = '/api/class/setMonitor'
      const data = 'stuId=' + row.stuId
      const settings = qcxUtils.getSettings(url, data)
      qcxUtils.ajaxHandle(this, settings, res => {
        if (res !== undefined) {
          this.dataQueryExceed(this.queryIdx)
        }
      })
    },
    //通知框
    open2() {
      this.$notify({
        title: '删除学生失败',
        message: '页面出现错误，请检查网络或重新登录后再试，如无法解决请联系管理员！',
        type: 'error',
        duration: 3000
      });
    },
    /**
     * 删除学生
     * @TODO 使用POPOVER组件
     */
    deleteStudent: function (row) {
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
            qcxUtils.ajaxHandle(this, settings, res => {
              if (res !== undefined) {
                this.dataQueryExceed(this.queryIdx)
                if (res.status == 200) {
                  this.$notify({
                    title: '学生' + row.stuName + '删除成功',
                    dangerouslyUseHTMLString: true,
                    message: '学号：' + row.stuId + '</br>专业班级：' + row.stuClass,
                    type: 'success',
                    duration: 5000
                  });
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

    handleClose: function () {
      this.dialogOptions.type = '';
      setTimeout(() => {
        this.dialogOptions.visible = false;
      }, 0);
      this.dataQueryExceed(this.queryIdx);
    },

    /**
     * 显示对话框
     * @param type
     * @param row
     */
    showDialog: function (type, row) {
      this.dialogOptions.visible = true
      this.dialogOptions.type = type
      this.dialogOptions.title = this.propOptions[type].title
      this.dialogOptions.width = (this.propOptions[type].width !== undefined) ? this.propOptions[type].width : '55%'
      const isRowUndefined = (row === undefined)
      this.dialogData.stuId = !isRowUndefined ? row.stuId : ''
      this.dialogData.stuName = !isRowUndefined ? row.stuName : ''
      this.dialogData.stuClass = !isRowUndefined ? row.stuClass :
        this.form.class.className !== undefined ? this.form.class.className : ''
      this.dialogData.stuDorm = !isRowUndefined ? row.stuDorm : this.form.dormitory.length > 0 ? (this.form.dormitory[1] + '-' + this.form.dormitory[2]) : ''
      this.dialogData.addType = !isRowUndefined ? 'person' :
        this.form.class.className !== '' ? 'class' : 'dorm'
      this.dialogData.dormHeader = !isRowUndefined ? parseInt(row.dormHeader) : ''
      this.dialogData.monitor = !isRowUndefined ? parseInt(row.monitor) : ''
    }
  }
}
</script>

<style scoped>
.qcx-quote-single {
  margin-top: 15px;
  border-bottom: 1px solid;
  border-top: 1px solid;
  border-right: 1px solid;
  border-color: #e6e6e6;
  background-color: #ffffff;
}

.qcx-button {
  float: left;
  margin: -10px 50px;
}

.el-button--mini {
  padding: 5px 5px !important;
}

.el-form {
  /*display: grid;*/
  justify-items: center;
  align-items: center;
}

.el-form-item {
  padding-left: 25px;
  padding-top: 10px;
}

.el-input,
.el-select {
  width: 50%;
  float: left;
}

.el-select {
  width: auto;
  padding-right: 10px;
}

.el-cascader {
  float: left;
}

.el-dialog {
  max-width: 85%;
}

.qcx-form-container {
  padding: 10px;
}

.qcx-add-form {
  margin-left: 12%;
}
</style>
