<template>
  <header
    class="header"
    :style="headerStyle"
  >
    <div class="header-breadcrumb">
      <input
        type="hidden"
        v-model="monitor_win_size"
      />
      <input
        type="hidden"
        v-model="monitor_win_size"
      />
      <div @click="frameReset">
        <div
          class="shrink"
          v-if="leftW != 0"
        >
          <img
            src="../../../static/images/shrink.png"
            style="margin-top:0px;height:16px;margin-right:20px;"
          >
        </div>
        <div
          v-else
          class="expend"
        >
          <img
            src="../../../static/images/expend.png"
            style="margin-top:0px;height:16px;margin-right:20px;"
          />
        </div>
      </div>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item
          v-for="(item,index) in breadList"
          :key=item.path+index
          :to="{path:item.path}"
        >
          {{item.name}}
        </el-breadcrumb-item>
      </el-breadcrumb>
    </div>
    <div class="nav-setting">
      <el-dropdown @command="handleCommand">
        <span class="el-dropdown-link">
          <img src="../../../static/images/user2.png">{{username}}</span>
        <el-dropdown-menu slot="dropdown">
          <!--<el-dropdown-item command="reset">修改密码</el-dropdown-item>-->
          <!-- <el-dropdown-item command='logout'>退出登录</el-dropdown-item> -->
        </el-dropdown-menu>
      </el-dropdown>
      <el-tag
        size="mini"
        type="primary"
      >{{role}}</el-tag>
      <el-button
        type="danger"
        round="true"
        size="mini"
        @click="doLogout"
      >退出登录</el-button>
    </div>
  </header>
</template>

<script>
import Bus from '../../assets/js/bus.js'
import qcxUtils from "../../util/util";

export default {
  data() {
    return {
      breadList: '',
      username: '',
      role: '',
      menus: [],
      isExpand: true, //开始默认展开
      leftW: undefined,
      frameSetStyle: {},
      headerStyle: ''
    };
  },
  created() {
    this.getBread()
    this.getUserName()
  },
  computed: {
    monitor_win_size: function () {
      let frameSetStyle = this.$store.state.frameSetStyle;
      this.leftW = frameSetStyle.leftMenuW;
      return this.$store.state.monitor_win_size;
    }
  },
  methods: {
    // 获取用户信息
    getUserName: function () {
      let _this = this.$router;
      const url = '/api/master/getInfo'
      const settings = qcxUtils.getSettings(url)
      this.$axios(settings)
        .then(res => {
          this.username = res.data.data.master.masName
          this.$emit('getName', this.username)
          localStorage.setItem('masAccount', this.username)
          this.role = res.data.data.groups[0]
          this.menus = res.data.data.menus
          this.$store.state.menus = {
            resource: {
              studentLog: this.getMenuStatus("data.student.out") >= 0, // 学生日志导出
              dataReset: this.getMenuStatus("data.reset") >= 0, // 数据重置
              operationLog: this.getMenuStatus("data.scoreDetail.out") >= 0 // 操作日志导出
            },
            student: {
              free: this.getMenuStatus("student.free") >= 0, // 无班级学生修改
              add: this.getMenuStatus("student.add") >= 0, // 添加学生
              batch: this.getMenuStatus("student.batch") >= 0, // 批量修改
              single: this.getMenuStatus("student.simple") >= 0 // 单个修改
            },
            info: {
              appeal: this.getMenuStatus("message.appeal") >= 0, // 申诉处理
              apply: this.getMenuStatus("message.apply") >= 0 // 加减分处理
            },
            user: {
              charge: this.getMenuStatus("user.charge") >= 0 // 更新带班表
            }
          }
          Bus.$emit('menu', 200)
        });
    },
    // 注销
    doLogout: function () {
      let result = this.$confirm('确定退出当前登录账号？', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then((result) => {
          if (result === 'confirm') {
            const url = '/api/master/logout'
            const settings = qcxUtils.getSettings(url)
            qcxUtils.ajaxHandle(this, settings, res => {
              if (res !== undefined) {
                if (res.status === 200) {
                  // console.log(res)
                  this.$message({
                    message: '注销成功',
                    type: 'success',
                    duration: 2000
                  })
                }
                this.$router.push("/login") // 页面跳转
              }
            })
            // this.$store.commit(this.$storeTypes.LOGOUT);
            // this.$nextTick(function () {
            //   this.$router.push("/login");
            // });
          }
        })
        .catch(err => {

        });
    },
    handleCommand(command) {
      if (command === "logout") {
        this.doLogout();
      }
      if (command === 'reset') {
        Bus.$emit('reset_password', true)
      }
    },
    getBread: function () {
      this.breadList = this.$route.matched;
      this.$route.matched.forEach((item, index) => {
        return item.path === this.$route.path
      })
    },
    //重新设置框架布局
    frameReset: function () {
      this.$store.commit("LEFT_MENU_WIDTH")
      if (this.isExpand === true) {
        this.headerStyle = `margin-left:0px !important`
      } else {
        this.headerStyle = `margin-left:220px !important`
      }
      this.isExpand = !this.isExpand;
    },
    getMenuStatus: function (item) {
      let result = this.menus.findIndex(_item => {
        return _item.mName === item
      })
      return result
    }
  },
  watch: {
    $route() {
      this.getBread()
    }
  }
};
</script>

<style scoped>
.header {
  left: 0;
  right: 0;
  height: 65px;
  position: fixed;
  background-color: #fff;
  margin-left: 218px;
  z-index: 1000;
}

.nav-setting {
  float: right;
  display: block;
  margin-right: 20px;
  line-height: 65px;
}

img {
  float: left;
  height: 25px;
  margin-top: 20px;
  margin-right: 10px;
}

.header-breadcrumb {
  margin: 25px;
  width: 50%;
  float: left;
}
</style>

