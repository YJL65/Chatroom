<template>
    <div class="index-container">
      <div class="entry register" @click="goToRegister">
        <h2>注册</h2>
      </div>
      <div class="entry login" @click="goToLogin">
        <h2>登录</h2>
      </div>
      <div class="entry passwd" @click="goToPasswd">
        <h2>修改密码</h2>
      </div>
    </div>
  </template>
  
  <script lang="ts">
  export default {
    name: 'Index',
    methods: {
      goToLogin() {
        this.$router.push('/login');
      },
      goToRegister() {
        this.$router.push('/register');
      },
      goToPasswd() {
        this.$router.push('/passwd');
      },
    },
  };
  </script>
  
  <style scoped>
.index-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}

.entry {
  width: 250px;
  height: 120px;
  border-radius: 15px;
  margin: 20px;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 18px;
  color: #fff; /* 文字颜色为白色 */
  transition: background-color 0.3s ease; /* 添加背景颜色过渡效果 */
}

.login {
  background-color: #5e92f3; /* 淡蓝色 */
}

.register {
  background-color: #6ed1b5; /* 淡绿色 */
}
.passwd {
  background-color: #b06ed1; /* 淡绿色 */
}

.entry:hover {
  background-color: #34495e; /* 鼠标悬停时的背景颜色，深蓝色 */
}
</style>