<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <img class="not-found-image" src="../assets/imgs/404.jpg" alt="页面未找到">
      <div class="not-found-text">
        <a href="/">返回主页</a>
      </div>
    </div>
  </div>
</template>

<style scoped>
.not-found-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.not-found-content {
  width: 50%;
  max-width: 600px;
}

.not-found-image {
  width: 100%;
  display: block;
}

.not-found-text {
  text-align: center;
  padding: 20px 0;
  font-size: 20px;
}

.not-found-text a {
  color: #409EFF;
  text-decoration: none;
  font-weight: bold;
}

.not-found-text a:hover {
  text-decoration: underline;
}
</style>