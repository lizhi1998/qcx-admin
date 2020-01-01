<template>
  <div>
    <elnav></elnav>
    <navheader @getName="getMsg"></navheader>
    <input
      type="hidden"
      v-model="monitor_win_size"
    />
    <el-main :style="contentStyle">
      <app-main class="app-main">
      </app-main>
      <div
        class="logo-fankui"
        v-show="isShow"
      >
        <el-tooltip
          class="item"
          effect="dark"
          content="反馈建议"
          placement="top-start"
        >
          <img
            src="../../../static/images/logo3.png"
            @click="feedback"
            style="cursor:pointer"
          >
        </el-tooltip>
        <span
          class="logo-font"
          @click="showLogo"
        >点击隐藏</span>
      </div>
    </el-main>
    <el-dialog
      title="反馈建议"
      :visible.sync="isOpen"
      width="650px"
      :before-close="handleClose"
    >
      <form
        action="http://www.wuyo.fun/student/pchome/qcxadd.php"
        method="post"
        id="commentform"
      >
        <el-input
          type="textarea"
          name="comment"
          id="comment"
          v-model="text"
          placeholder="请输入反馈建议，我们将在第一时间完善改进"
          maxlength="300"
          :autosize="{ minRows: 4, maxRows: 6}"
          size="medium"
          clearable
          show-word-limit
        />
        <el-input
          type='text'
          name="name"
          id="name"
          v-model="name"
          v-show="false"
        />
        <el-input
          type='text'
          name="class"
          id="class"
          v-model="admin"
          v-show="false"
        />
        <div style="margin-top:20px; text-align: right;">
          <input
            type="submit"
            class="el-button"
            id="submit"
            tabindex="5"
            value="点击提交"
            style="background-color:rgb(18,194,171);color:white"
          />
        </div>
      </form>
      <span
        slot="footer"
        class="dialog-footer"
      />
      <!-- <el-button @click="isOpen = false">取 消</el-button>
        <el-button
          type="primary"
          @click="handlText"
        >提 交</el-button> -->
      <!-- </span> -->
    </el-dialog>
  </div>
</template>


<script>
import elnav from "../../components/admin/Sidebar";
import appMain from "../../components/admin/AppMain";
import navheader from "../../components/admin/Header";
import feedbackDialog from "../../components/admin/Feedback";
export default {
  components: { navheader, appMain, elnav, feedbackDialog },
  data() {
    return {
      frameSetStyle: {},
      fullScreen: "",
      contentStyle: "",
      isOpen: false,
      isShow: true,
      text: '',
      name: '',
      admin: '辅导员'
    };
  },
  computed: {
    monitor_win_size: function () {
      let frameSetStyle = this.$store.state.frameSetStyle;
      this.fullScreen = frameSetStyle.fullScreen;
      if (this.fullScreen === true) {
        this.contentStyle = `margin-left:0px !important`;
      } else {
        this.contentStyle = `margin-left:220px !important`;
      }
      return this.$store.state.monitor_win_size;
    }
  },
  created() {

  },
  methods: {
    getMsg(data) {
      this.name = data
    },
    feedback() {
      this.isOpen = true
    },
    showLogo() {
      this.isShow = false
    },
    handleClose(done) {
      if (this.text != '') {
        this.$confirm('内容未提交，确定关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => { });
      } else {
        done();
      }
    }

  }
};
</script>
<style scoped>
.el-main {
  margin-left: 220px;
  position: relative;
  overflow: scroll;
  top: 65px;
  padding: 0;
  font: 14px Helvetica Neue, Helvetica, PingFang SC, Tahoma, Arial, sans-serif;
  background-color: #fff;
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
.logo-fankui {
  position: fixed;
  right: 0;
  bottom: 0;
  margin-right: 20px;
  margin-bottom: 20px;
  z-index: 1;
}
.logo-font {
  font-size: 13px;
  cursor: pointer;
  color: darkgray;
  display: block;
  text-align: right;
  margin-right: 10px;
}
</style>
