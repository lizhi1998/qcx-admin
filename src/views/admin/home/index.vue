<template>
  <div class="home">
    <blockquote class="qcx-quote">公告通知栏<br>
    </blockquote>
    <!--<span>新版首页正在建设中，将于后续开放</span>-->
    <el-card class="box-card">
      <div
        slot="header"
        class="clearfix"
      >
        <span style="color:red">更新说明</span>
        <!-- <el-button style="float: right; padding: 3px 0" type="text">更新</el-button> 公告接口加入更新-->
      </div>
      <!-- <div v-for="o in 4" :key="o" class="text item">
    {{'列表内容 ' + o }}
  </div> -->
      <div class="text item">
        {{'1.增加反馈建议组件，可点击右下角的logo向开发团队提出意见及建议。 ' }}
      </div>
      <div class="text item">
        {{'2.增加逐个学生管理全新交互体验，可点击 “ 学生事务 ” 菜单下的 “ 全新交互体验 ” 进行体验。 ' }}
      </div>
      <div class="text item">
        {{'3.如管理员对新版操作页面满意的话，后续将取消旧版操作页面。' }}
      </div>
      <div class="text item">
        {{'4.希望老师辅导员们能多多填写反馈建议，也是对我们学生工作的一种鼓励及肯定。' }}
      </div>
      <!-- <div class="text item">
        {{'1.优化管理员登录接口。 ' }}
      </div>
      <div class="text item">
        {{'2.修改密码时可选择是否显示当前输入内容。 ' }}
      </div> -->
      <!-- <div  class="text item">
    {{'3.右上角添加了退出登录按钮，取消悬浮用户名触发退出登录选项。 ' }}
  </div>
   <div  class="text item">
    {{'4.左侧导航栏进行优化，可进行滑动且无权限时不会显示对应选项。 ' }}
  </div>
   <div  class="text item">
    {{'5.每次提交相关信息后不会清空选项框，优化了提示保存信息的逻辑。' }}
  </div> -->
    </el-card>
  </div>
</template>

<script>

export default {
  data() {
    return {
      noticeData: []
    };
  },
  mounted() {
    // this.getNotice()

  },
  methods: {
    // getNotice:function(){
    //   const url = '/api/notice/getInfo'
    //   const data = `type=${'valid'}`
    //   const settings = qcxUtils.getSettings(url, data)
    //   qcxUtils.$ajaxHandle(this, settings, res => {
    //   this.noticeData = res.data.data;
    //   console.log(this.noticeData)
    //   this.civilData.map(item => {
    //     civilSet.add(item.civilType);
    //   });
    //   this.civilOptions.type = Array.from(civilSet).map(item => {
    //     return {
    //       value: item,
    //       label: item
    //     };
    //   });
    // })
    // }
  }
};
</script>


<style scoped>
.home {
  padding: 15px;
}

.home span {
  font-size: larger;
  font-weight: bold;
  text-align: center;
}
.text {
  font-size: 16px;
}

.item {
  margin-bottom: 18px;
}
.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}
.clearfix:after {
  clear: both;
}

.box-card {
  width: 100%;
  margin-top: 20px;
}
</style>
