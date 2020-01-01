<template>
  <div
    class="qcx-nav sidebar"
    id="sidebar-nav"
    :style="frameSetStyle.sidebarStyle"
  >
    <input
      type="hidden"
      :value="listenInit"
    >
    <input
      type="hidden"
      v-model="monitor_win_size"
    >
    <div style="width:218px;height:65px;text-align: center; background-color:#393A3E;border-bottom: 1px solid #2c2d31;">
      <div class="qcx-logo">亲苍霞 - 管理系统</div>
    </div>
    <el-scrollbar>
      <div
        id="menu-main"
        :style="frameSetStyle.menuStyle"
        class="sidebar-content"
      >
        <el-menu
          id="sidebarLeftMenu"
          :isCollapse="isCollapse"
          :default-active="$route.path"
          @open="handleOpen"
          @close="handleClose"
          @select="handleSelect"
          text-color="#fff"
          active-text-color="#fff"
          :style="frameSetStyle.sidebarLeftMenuStyle"
          style="height:100%;margin-bottom:100px;"
          router
        >

          <el-submenu index="/admin/home">
            <template slot="title">
              <span>个人中心</span>
            </template>
            <el-menu-item index="/admin/home">公告</el-menu-item>
            <el-menu-item index="/admin/password">密码修改</el-menu-item>
            <!--<el-menu-item index="#">更新说明</el-menu-item>-->
          </el-submenu>
          <el-submenu index="/admin/transaction/single">
            <template slot="title">
              <span>学生事务</span>
            </template>
            <el-menu-item
              index="/admin/transaction/new"
              v-if="menus.student.single"
            >全新交互体验</el-menu-item>
            <el-menu-item
              index="/admin/transaction/single"
              v-if="menus.student.single"
            >逐个操作</el-menu-item>
            <el-menu-item
              index="/admin/transaction/batch"
              v-if="menus.student.batch"
            >批量操作</el-menu-item>
            <el-menu-item
              index="/admin/transaction/add"
              v-if="menus.student.add"
            >添加学生</el-menu-item>
            <el-menu-item
              index="/admin/transaction/free"
              v-if="menus.student.free"
            >无专业学生处理</el-menu-item>
          </el-submenu>

          <el-submenu
            index="/admin/info/apply"
            v-if="menus.info.appeal"
          >
            <template slot="title">
              <span>消息</span>
            </template>
            <el-menu-item
              index="/admin/info/appeal"
              v-if="menus.info.appeal"
            >申诉消息</el-menu-item>
            <!--<el-menu-item index="/info/apply">加分申报消息</el-menu-item>-->
          </el-submenu>

          <el-submenu
            index="/admin/resource/template"
            v-if="menus.resource.operationLog"
          >
            <template slot="title">
              <span>数据管理</span>
            </template>
            <el-menu-item
              index="/admin/resource/dateReset"
              v-if="menus.resource.dataReset"
            >数据重置</el-menu-item>
            <el-menu-item
              index="/admin/resource/studentLog"
              v-if="menus.resource.studentLog"
            >学生记录导出</el-menu-item>
            <el-menu-item
              index="/admin/resource/operationLog"
              v-if="menus.resource.operationLog"
            >操作日志导出</el-menu-item>
          </el-submenu>

          <el-submenu
            index="/admin/manage/charge"
            v-if="menus.user.charge"
          >
            <template slot="title">
              <span>用户管理</span>
            </template>
            <el-menu-item
              index="/admin/manage/charge"
              v-if="menus.user.charge"
            >更新带班表</el-menu-item>
            <el-menu-item
              index="/admin/respassword"
              v-if="menus.user.charge"
            >重置其他管理员密码</el-menu-item>
          </el-submenu>

          <el-submenu index="/admin/inspect/add">
            <template slot="title">
              <span>巡查</span>
            </template>
            <el-menu-item index="/admin/inspect/add">发起巡查</el-menu-item>
            <el-menu-item index="/admin/inspect/submitted">提交记录查看</el-menu-item>
            <el-menu-item index="/admin/inspect/pending">待处理巡查</el-menu-item>
          </el-submenu>

        </el-menu>

      </div>
    </el-scrollbar>
  </div>
</template>
<script>
import Bus from "../../assets/js/bus.js";

export default {
  data() {
    return {
      isCollapse: true,
      frameSetStyle: {},
      menus: {
        resource: {
          show: false,      //用于显示菜单
          dataReset: false, // 数据重置
          studentLog: false, // 学生记录导出
          operationLog: false // 操作日志导出
        },
        user: {
          show: false,
          charge: false // 更新帶班表
        },
        student: {
          show: false,
          add: false, // 添加学生
          free: false, // 无班级学生修改
          batch: false, // 批量修改
          single: false // 单个修改
        },
        info: {
          show: false,
          appeal: false, // 申诉处理
          apply: false // 加减分处理
        }
      }
    };
  },

  created: function () {
    this.isCollapse = localStorage.getItem("isExpend");
  },

  computed: {
    //监听初始化入口
    listenInit() {
      return this.$store.state.listenInit;
    },
    //监听框架样式
    monitor_win_size: function () {
      let frameSetStyleTmp = this.$store.state.frameSetStyle;
      this.frameSetStyle = frameSetStyleTmp.init();
      return this.$store.state.monitor_win_size;
    },
    //监听默认菜单
    defaultMenuActive() {
      return this.$store.state.defActiveMenu;

    },

  },
  watch: {
    listenInit: "getNowRoleMenu"
  },
  mounted: function () {
    this.isCollapse = localStorage.getItem("isExpend");
    Bus.$on("menu", res => {
      if (parseInt(res) === 200) {
        this.menus = this.$store.state.menus;
      }
    });
  },
  methods: {
    handleOpen(key, keyPath) {
      //  this.showMenu()
      //   console.log(key, keyPath)
    },
    handleClose(key, keyPath) {
      //   console.log(key, keyPath)
    },
    handleSelect() { },
    //是否显示菜单选项
    // showMenu(){
    //   if(menus.resource.dataReset == false || menus.resource.studentLog !== false || menus.resource.operationLog !== false){
    //     menus.resource.show === true
    //   }
    //   if(menus.user.charge === true ){
    //     menus.user.show === true
    //   }
    //   if(menus.student.add === true || menus.student.free === true || menus.student.batch === true || menus.student.single === true){
    //     menus.student.show === true
    //   }
    //   if(menus.info.appeal === true || menus.info.apply){
    //     menus.info.show === true
    //   }
    // }
  }
};
</script>
<style scoped>
.qcx-logo {
  position: absolute;
  left: 0;
  top: 0;
  width: 200px;
  height: 100%;
  line-height: 60px;
  text-align: center;
  color: #009688;
  font-size: 16px;
}

.qcx-nav {
  margin: 0;
  padding: 0;
  float: left;
  overflow: hidden;
  position: fixed;
  z-index: 1001;
  height: 100%;
}

#menu-main {
  overflow-y: auto;
  overflow-x: hidden !important;
}

.el-menu {
  margin-right: -1px;
  overflow-y: auto;
}
.el-scrollbar {
  height: 100%;
}
.el-scrollbar__wrap.default-scrollbar__wrap {
  overflow-x: auto;
}
.el-select-dropdown .el-scrollbar .el-scrollbar__wrap {
  overflow: scroll;
}
.el-scrollbar__view.p20-scrollbar__view {
  padding: 20px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
  -moz-box-sizing: border-box;
  -o-box-sizing: border-box;
  -ms-box-sizing: border-box;
}

/* #sidebar-nav ul li.el-menu-item.is-active {
    background: #12c2ab !important;
  } */
/**滚轮样式定义**/
::-webkit-scrollbar {
  width: 5px;
  height: 5px;
  background-color: #2c2d31;
}

/*滚动条的轨道*/
::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(200, 200, 200, 0.5);
  background-color: #2c2d31;
}

/*滚动条的滑块按钮*/
::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #2c2d31;
  box-shadow: inset 0 0 3px #fff;
}

/*滚动条的上下两端的按钮*/
::-webkit-scrollbar-button {
  background-color: #2c2d31;
}
/**滚轮样式定义**/
*::-webkit-scrollbar {
  width: 8px;
  height: 6px;
  background-color: #f6f6f6;
  display: none;
}

/*滚动条的轨道*/

*::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(200, 200, 200, 0.5);
  background-color: #f6f6f6;
  display: none;
}

/*滚动条的滑块按钮*/

*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #727272;
  box-shadow: inset 0 0 3px #f6f6f6;
  display: none;
}

/*滚动条的上下两端的按钮*/

*::-webkit-scrollbar-button {
  background-color: #f6f6f6;
  display: none;
}
/* .sidebar li.el-submenu{
      border-bottom: 1px solid #2c2d31;
  } */

/* .sidebar li.el-submenu ul.el-menu {
      background: #313235!important;
  } */
</style>
