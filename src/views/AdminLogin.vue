<template>
  <div class="login-container">
    <div class="login-box">
      <h2>管理员登录</h2>
      <el-form :model="loginForm" :rules="rules" ref="loginFormRef">
        <el-form-item prop="username">
          <el-input 
            v-model="loginForm.username" 
            placeholder="管理员账号"
            prefix-icon="User"
            disabled
          />
        </el-form-item>
        <el-form-item prop="password">
          <el-input 
            v-model="loginForm.password" 
            type="password" 
            placeholder="管理员密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleLogin" style="width: 100%">登录</el-button>
        </el-form-item>
        <el-form-item>
          <el-button type="text" @click="router.push('/login')" style="width: 100%">返回普通登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const loginForm = ref({
  username: 'admin',
  password: '',
})

const rules = {
  password: [
    { required: true, message: '请输入管理员密码', trigger: 'blur' },
  ]
}

const handleLogin = () => {
  loginFormRef.value.validate((valid) => {
    if (valid) {
      loading.value = true
      // 模拟登录请求
      setTimeout(() => {
        if (loginForm.value.password === 'admin123') {
          localStorage.setItem('token', 'admin-token')
          localStorage.setItem('userRole', 'admin')
          ElMessage.success('管理员登录成功')
          router.push('/home')
        } else {
          ElMessage.error('管理员密码错误')
        }
        loading.value = false
      }, 1000)
    }
  })
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #409EFF 0%, #36D1DC 100%);
}

.login-box {
  width: 400px;
  padding: 40px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.login-box h2 {
  text-align: center;
  color: #409EFF;
  margin-bottom: 30px;
}

.el-form-item {
  margin-bottom: 25px;
}

.el-button {
  margin-top: 10px;
}
</style> 