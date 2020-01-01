<template>

    <div class="page-error">
    <img src="../../../static/images/404.png" class="page-logo">
    <p class="page-container">此页面不存在点<router-link to="/login">此</router-link>返回管理员登录页面</p>
    <p class="page-container" >若为学生账号点<a :href="'https://qcx.fjut.edu.cn'">此</a>跳转至学生登录页面</P>
    </div>

</template>

<style scoped>
.page-error{
 
  text-align: center;
}n
.page-logo{
  width: 75%;
  height: 75%;
  position: fixed;
}
.page-container {
  font-size: 20px;
  text-indent:1em; 
  line-height: 20px;
  text-align: center;
  color: rgb(84, 102, 123);
}
</style>
