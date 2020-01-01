<template>
  <el-container>
    <el-aside
      width="5003px;"
      style="margin:15px;"
      class="che"
    >
      <div style="height:300px">
        <el-card class="box-card">
          <div
            slot="header"
            class="clearfix"
          >
            <span style="font-size:16px;"><strong>学生搜索</strong>
              <el-input
                placeholder="请输入学生学号或姓名"
                v-model="stuName"
                class="input-with-select"
                style="width:300px;margin-left:35px;"
                @keyup.native.enter='searchStu()'
              >
                <el-button
                  slot="append"
                  type="primary"
                  @click="searchStu"
                  :disabled="stuName.length ===0 ?true:false"
                ><span class="qcx-button"><i class="el-icon-search"></i>查询</span></el-button>
              </el-input>
            </span>
          </div>
          <div>
            <el-tabs
              v-model="activeName"
              type="border-card"
            >
              <el-tab-pane
                label="班级管理"
                name="first"
              >
                <el-input
                  placeholder="输入专业进行检索"
                  v-model="filterMajor"
                >
                </el-input>
                <el-tree
                  :data="classDatas"
                  style="margin-top:15px;"
                  node-key="id"
                  ref="tree"
                  :highlight-current="true"
                  :filter-node-method="filterNode"
                  @node-click="handleClassClick"
                />
              </el-tab-pane>
              <el-tab-pane
                label="宿舍管理"
                name="second"
              >
                <el-input
                  placeholder="输入宿舍进行检索"
                  v-model="filterText"
                >
                </el-input>
                <el-tree
                  :data="dormList"
                  style="margin-top:15px;"
                  node-key="value"
                  ref="trees"
                  :highlight-current="true"
                  :filter-node-method="filterNode"
                  @node-click="handleDormClick"
                />
              </el-tab-pane>
              <el-tab-pane
                label="批量操作"
                name="third"
              >开发中。。。</el-tab-pane>
              <el-tab-pane
                label="添加新学生"
                name="fourth"
              >
                <StudentAdd v-on:updatas="upClassTable" />
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-card>
      </div>
    </el-aside>
    <el-main style="height:100%">
      <!-- <div style="margin-top: 15px;">
        <el-input
          placeholder="请输入搜索内容（温馨提示：全局搜索耗时就长，请耐心等待。）"
          v-model="stuName"
          class="input-with-select"
          width="300px"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="searchStu"
          ></el-button>
        </el-input>
      </div> -->
      <div style="margin-top: 15px;">
        <!-- <blockquote
          class="qcx-quote"
          style="display:inline;"
        >{{classTitle}}
        </blockquote> -->
        <div v-show="isTitle === 'first'">
          <span class="class-title-show">{{classTitle}}
          </span>
          <el-divider direction="vertical" />
          <el-button
            size="mini"
            type="primary"
            style="margin-left:5px;"
            @click="addClass"
            :disabled="classTitle ==='班级管理' ?true:false"
          >+新增班级记录</el-button>
        </div>
        <div v-show="isTitle === 'second'">
          <span class="class-title-show">{{dormTitle}}
          </span>
          <el-divider direction="vertical" />
          <el-button
            size="mini"
            type="primary"
            style="margin-left:5px;"
            @click="addDorm"
            :disabled="classTitle ==='宿舍管理' ?true:false"
          >+新增宿舍记录</el-button>
        </div>
        <div v-show="isTitle === 'add'">
          <span class="class-title-show">{{classTitle}}
          </span>
          <el-divider direction="vertical" />
          <span>{{'“' + stuName + '”'}}</span>
          <!-- <el-button
            size="mini"
            type="primary"
            style="margin-left:5px;"
          >+新增班级记录</el-button> -->
        </div>

      </div>
      <div>
        <el-drawer
          :title="addTitle"
          :visible.sync="drawer"
          :direction="direction"
          :before-close="handleClose"
        >
          <addRecord
            :stuId="dialogData.stuId"
            :stuName="dialogData.stuName"
            :stuAcademic="dialogData.stuAcademic"
            :stuMajor="dialogData.stuMajor"
            :stuClass="dialogData.stuClass"
            :stuDorm="dialogData.stuDorm"
            :addType="dialogData.addType"
            :dormHeader="dialogData.dormHeader"
            :monitor="dialogData.monitor"
          />
        </el-drawer>
        <stuTables
          :classTable="classTable"
          v-on:listenTochildEvent="showMessageFromChild"
          v-on:updata="upClassTable"
        ></stuTables>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import StudentAdd from './components/addStudent'
import stuTables from './components/stuTable'
import qcxUtils from '../../../util/util.js'
import addRecord from './components/addRecord'
export default {
  components: {
    stuTables,
    StudentAdd,
    addRecord
  },
  data() {
    return {
      isTitle: 'first',
      addTitle: '',
      filterText: '',
      filterMajor: '',
      stuName: '',
      classData: '',
      classTitle: '班级管理',
      classDatas: '',
      classTable: '',
      classAllTable: '',
      dormData: '',
      dormTitle: '宿舍管理',
      dormList: [{
        label: '',
        children: []
      }],
      activeName: 'first',
      drawer: false,
      direction: 'rtl',
      dialogData: {
        stuId: '',
        stuName: '',
        stuAcademic: '',
        stuMajor: '',
        stuClass: '',
        stuDorm: '',
        addType: '',
        dormHeader: 0,
        monitor: 0
      },
    };
  },
  watch: {
    filterText(val) {
      this.$refs.trees.filter(val);
    },
    filterMajor(val) {
      this.$refs.tree.filter(val);
    }
  },
  mounted() {
    this.getClassData()
    this.getdormData()
  },

  methods: {
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    searchStu() {
      // if (this.classAllTable.length === 0) {
      //   this.getAllStudent()
      //   this.classTable = this.classAllTable.filter(item => {
      //     return item.stuName.indexOf(this.stuName) !== -1        }
      //   )
      // }
      // else {
      //   this.classTable = this.classAllTable.filter(item => {
      //     return item.stuId.indexOf(this.stuName) !== -1 || itemitem.stuName.indexOf(this.stuName) !== -1 ||
      //       item.stuClass.indexOf(this.stuName) !== -1 || item.stuDorm.indexOf(this.stuName) !== -1 || item.stuAcademic.indexOf(this.stuName) !== -1        }
      //   )
      // }
      this.isTitle = 'add'
      this.classTitle = '搜索结果'
      const re = /^[0-9]+.?[0-9]*$/;
      if (re.test(this.stuName) === true) {
        // this.classTable = this.classTable.filter(item => {
        //   return item.stuName.indexOf(this.stuName) !== -1
        // })
        const url = '/api/student/query'
        const datas = `stuId=${this.stuName}&type=stuId`
        const settings = qcxUtils.getSettings(url, datas)
        this.$axios(settings).then(res => {
          this.classTable = res.data.data
        })
      }
      else {
        const url = '/api/student/query'
        const datas = `stuName=${this.stuName}&type=stuName`
        const settings = qcxUtils.getSettings(url, datas)
        this.$axios(settings).then(res => {
          this.classTable = res.data.data
        })
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      return data.label.indexOf(value) !== -1;
    },
    deleteDuplication(data) {
      let obj = {}
      data = data.reduce((cur, next) => {
        obj[next.id] ? "" : obj[next.id] = true && cur.push(next);
        return cur;
      }, []);
      return data;
    },
    getClassData() {
      const url = '/api/class/query'
      const settings = qcxUtils.getSettings(url)
      this.$axios(settings).then(res => {
        if (parseInt(res.data.status) === 200) {
          this.classData = res.data.data;
          let obj = {}
          const classDatas = this.classData.reduce((cur, next) => {
            obj[next.major] ? "" : obj[next.major] = true && cur.push(next);
            return cur;
          }, []);

          let newClassData = [];
          this.classData.forEach(item => {
            newClassData.push({
              'id': item.academic,
              'label': item.academic,
              'children': [],
            });
          })
          let objs = {}
          newClassData = newClassData.reduce((cur, next) => {
            objs[next.id] ? "" : objs[next.id] = true && cur.push(next);
            return cur;
          }, []);
          // console.log(newClassData)
          //数组对象去重方法
          for (let i = 0; i < newClassData.length; i++) {
            classDatas.forEach(item => {
              if (item.academic === newClassData[i].label) {
                newClassData[i]['children'].push({
                  'id': item.major,
                  'label': item.major,
                  'children': [],
                })
              }
            })
          }
          // console.log(this.classData)
          for (let i = 0; i < newClassData.length; i++) {
            for (let j = 0; j < newClassData[i]['children'].length; j++) {
              this.classData.forEach(item => {
                if (item.major === newClassData[i]['children'][j].label) {
                  newClassData[i]['children'][j]['children'].push({
                    'id': item.className,
                    'label': item.className,
                  })
                }
              })
            }
          }
          this.classDatas = newClassData;
          // console.log(newClassData)
        }
      })
        .catch(err => {
          this.$message.error("页面上发生错误，请重试或联系管理员")
        })
    },
    getdormData() {
      const url = '/api/dorm/query'
      const settings = qcxUtils.getSettings(url)
      this.$axios(settings).then(res => {
        if (parseInt(res.data.status) === 200) {
          this.dormData = res.data.data.filter(item => {
            return item !== null && item !== ''
          })
          this.dormList = this.dormDataHandle()
          // console.log(this.dormList)
          // console.log(this.dormData)

          // constthis.dormData.forEach(item => {
          //   console.log(String(item).split("", 1))
          //   newDormData.push({
          //     'id': 1,
          //     'label': 1,
          //     'children': [],
          //   });
          // })
          //   let obj = {}
          //   const classDatas = this.classData.reduce((cur, next) => {
          //     obj[next.major] ? "" : obj[next.major] = true && cur.push(next);
          //     return cur;
          //   }, []);

          //   let newClassData = [];
          //   this.classData.forEach(item => {
          //     newClassData.push({
          //       'id': item.academic,
          //       'label': item.academic,
          //       'children': [],
          //     });
          //   })
          //   let objs = {}
          //   newClassData = newClassData.reduce((cur, next) => {
          //     objs[next.id] ? "" : objs[next.id] = true && cur.push(next);
          //     return cur;
          //   }, []);
          //   console.log(newClassData)
          //   //数组对象去重方法
          //   for (let i = 0; i < newClassData.length; i++) {
          //     classDatas.forEach(item => {
          //       if (item.academic === newClassData[i].label) {
          //         newClassData[i]['children'].push({
          //           'id': item.major,
          //           'label': item.major,
          //           'children': [],
          //         })
          //       }
          //     })
          //   }
          //   // console.log(this.classData)
          //   for (let i = 0; i < newClassData.length; i++) {
          //     for (let j = 0; j < newClassData[i]['children'].length; j++) {
          //       this.classData.forEach(item => {
          //         if (item.major === newClassData[i]['children'][j].label) {
          //           newClassData[i]['children'][j]['children'].push({
          //             'id': item.className,
          //             'label': item.className,
          //           })
          //         }
          //       })
          //     }
          //   }
          //   this.classDatas = newClassData;
          //   console.log(newClassData)
        }
      })
        .catch(err => {
          this.$message.error("页面上发生错误，请重试或联系管理员")
        })

    },
    dormDataHandle: function () {
      // 获取宿舍区列表
      const _data = Array.from(new Set(
        this.dormData.map(item => {
          return item.charAt(0).toUpperCase()
        })
      ));

      return _data.map(item => {
        return {
          label: item.toUpperCase() + '区',
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
    getUniqueArray: function (array) {
      return Array.from(new Set(array))
    },
    /**
    * 宿舍房间数据填充
    */
    getRooms: function (layer_label) {
      if (this.dormData.length > 0) {
        // 获取楼层
        let _rooms = this.getUniqueArray(
          this.dormData.map(item => {
            if (item.indexOf('-') >= 0 || item.split('－') >= 0) {
              let _item = item.split('-') || item.split('－');
              let layer = _item[0];
              if (layer === layer_label) {
                return {
                  value: _item[0].toUpperCase() + '-' + _item[1],
                  label: _item[0].toUpperCase() + '-' + _item[1],
                }
              }
            }
          }));
        return _rooms.filter(item => {
          return item !== undefined
        });
      }
      // console.log(_item)
    },

    // getClassTable() {
    //   const url = '/api/student/query'
    //   // let [stuId, stuName, academic, major, className, dorm] = queryData
    //   const data = `academic=信息科学与工程学院&major=计算机科学与技术&className=计算机1601&type=stuClass`
    //   const settings = qcxUtils.getSettings(url, data)
    //   this.$axios(settings).then(res => {
    //     this.classTable = res.data.data
    //     // console.log(this.classTable)
    //   })
    // },
    getAllStudent() {
      const url = '/api/student/query'
      const datas = `stuName=&type=stuName`
      const settings = qcxUtils.getSettings(url, datas)
      this.$axios(settings).then(res => {
        this.classTable = res.data.data
        this.classAllTable = this.classTable
      })
    },
    handleClassClick(data) {
      // console.log(data.id)
      const queryData = this.classData.filter(item => {
        return item.className === data.id
      })
      this.dialogData.stuAcademic = queryData[0].academic
      this.dialogData.stuMajor = queryData[0].major
      this.dialogData.stuClass = queryData[0].className
      this.classTitle = queryData[0].className
      if (queryData.length != 0) {
        this.isTitle = 'first'
        const url = '/api/student/query'
        const data = `academic=${queryData[0].academic}&major=${queryData[0].major}&className=${queryData[0].className}&type=stuClass`
        const settings = qcxUtils.getSettings(url, data)
        this.$axios(settings).then(res => {
          this.classTable = res.data.data
        })
      }
    },
    handleDormClick(data) {
      if (data.value.length > 2) {
        this.dormTitle = data.value
        this.dialogData.stuDorm = data.value
        const url = '/api/student/query'
        const datas = `dorm=${data.value}&type=stuDorm`
        const settings = qcxUtils.getSettings(url, datas)
        this.$axios(settings).then(res => {
          this.isTitle = 'second'
          this.classTable = res.data.data
        })
      }
      else {

      }
    },
    resTree() {
      this.classTable = '';
    },
    upClassTable() {
      if (this.isTitle === 'second') {
        const url = '/api/student/query'
        const datas = `dorm=${this.dialogData.stuDorm}&type=stuDorm`
        const settings = qcxUtils.getSettings(url, datas)
        this.$axios(settings).then(res => {
          this.isTitle = 'second'
          this.classTable = res.data.data
        })
      }
      else if (this.isTitle === 'add') {
        const url = '/api/student/query'
        const datas = `stuId=${this.dialogData.stuId}&type=stuId`
        const settings = qcxUtils.getSettings(url, datas)
        this.$axios(settings).then(res => {
          this.classTable = res.data.data
        })
      }
      else {
        const url = '/api/student/query'
        const data = `academic=${this.dialogData.stuAcademic}&major=${this.dialogData.stuMajor}&className=${this.dialogData.stuClass}&type=stuClass`
        const settings = qcxUtils.getSettings(url, data)
        this.$axios(settings).then(res => {
          this.classTable = res.data.data
        })
      }    },

    handleClose() {
      this.drawer = false
      this.upClassTable()
    },
    addClass() {
      this.drawer = true;
      this.addTitle = '新增班级记录（' + this.dialogData.stuClass + '）：'
      this.dialogData.addType = 'class'
    },
    addDorm() {
      this.drawer = true;
      this.addTitle = '新增宿舍记录（' + this.dialogData.stuDorm + '）：'
      this.dialogData.addType = 'dorm'
    },
    showMessageFromChild(data) {
      this.dialogData.stuName = data.stuName
      this.dialogData.stuId = data.stuId
      this.drawer = true;
      this.addTitle = '新增学生记录（' + this.dialogData.stuName + '）：'
      this.dialogData.addType = 'person'
    }
    //   getCheckedNodes() {
    //     console.log(this.$refs.tree.getCheckedNodes());
    //   },
    //   getCheckedKeys() {
    //     console.log(this.$refs.tree.getCheckedKeys());
    //   },
    //   setCheckedNodes() {
    //     this.$refs.tree.setCheckedNodes([{
    //       id: 5,
    //       label: '二级 2-1'
    //     }, {
    //       id: 9,
    //       label: '三级 1-1-1'
    //     }]);
    //   },
    //   setCheckedKeys() {
    //     this.$refs.tree.setCheckedKeys([3]);
    //   },
    //   resetChecked() {
    //     this.$refs.tree.setCheckedKeys([]);
    //   }
  }
};
</script>

<style >
.text {
  font-size: 14px;
}

/* .item {
  margin-bottom: 18px;
} */

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: auto;
  height: auto;
  margin-top: 16px;
}
.class-title {
  position: absolute;
  left: 500px;
  margin-bottom: 15px;
}
.class-title-show {
  font-size: 20px;
  font-weight: bold;
}

.qcx-button {
  color: white;
}
.el-select-dropdown__wrap .el-scrollbar__wrap {
  overflow: scroll;
}
/* #sidebar-nav ul li.el-menu-item.is-active {
    background: #12c2ab !important;
  } */
/**滚轮样式定义**/
::-webkit-scrollbar {
  width: 5px;
  height: 15px;
  background-color: #636364;
  overflow: scroll;
}
.che::-webkit-scrollbar {
  display: none;
}
/*滚动条的轨道*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(200, 200, 200, 0.5);
  background-color: #636364;
}

/*滚动条的滑块按钮*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #636364;
  box-shadow: inset 0 0 3px #fff;
}

/*滚动条的上下两端的按钮*/
::-webkit-scrollbar-button {
  background-color: #636364;
}
/**滚轮样式定义**/
/* *::-webkit-scrollbar {
  width: 8px;
  height: 6px;
  background-color: #f6f6f6;
} */

/*滚动条的轨道*/

*::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(200, 200, 200, 0.5);
  background-color: #f6f6f6;
}

/*滚动条的滑块按钮*/

*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #727272;
  box-shadow: inset 0 0 3px #f6f6f6;
}

/*滚动条的上下两端的按钮*/

*::-webkit-scrollbar-button {
  background-color: #f6f6f6;
}

/* .sidebar li.el-submenu{
      border-bottom: 1px solid #2c2d31;
  } */

/* .sidebar li.el-submenu ul.el-menu {
      background: #313235!important;
  } */
</style>