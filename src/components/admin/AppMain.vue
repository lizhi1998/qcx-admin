<template>
  <section class="app-main" :inline="true">
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </section>
</template>

<script>
  export default {
    name: "appMain"
  };
</script>
<style scoped>
  .app-main {
    min-height: 90%;
    border-top: #ccc 1px solid;
    overflow: hidden;
    overflow-y: scroll;
    overflow-x: scroll;
  }

  .app-main::-webkit-scrollbar {
    display: none;
  }
  /**滚轮样式定义**/
*::-webkit-scrollbar {
  width: 8px;
  height: 6px;
  background-color: #F6F6F6;
  display: none;
}

/*滚动条的轨道*/

*::-webkit-scrollbar-track {
  box-shadow: inset 0 0 5px rgba(200, 200, 200, .5);
  background-color: #F6F6F6;
  display: none;
}

/*滚动条的滑块按钮*/

*::-webkit-scrollbar-thumb {
  border-radius: 10px;
  background-color: #727272;
  box-shadow: inset 0 0 3px #F6F6F6;
  display: none;
}

/*滚动条的上下两端的按钮*/

*::-webkit-scrollbar-button {
  background-color: #F6F6F6;
  display: none;
}
</style>

