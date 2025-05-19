<template>
  <AppLayout>
    <div class="login-container">
      <el-card class="login-card">
        <template #header>
          <div class="card-header">
            <h2>用户登录</h2>
          </div>
        </template>

        <el-form 
          :model="loginForm" 
          :rules="rules"
          ref="loginFormRef"
          label-width="80px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input 
              v-model="loginForm.username" 
              placeholder="请输入用户名"
            />
          </el-form-item>

          <el-form-item label="密码" prop="password">
            <el-input 
              v-model="loginForm.password" 
              type="password" 
              placeholder="请输入密码"
              show-password
            />
          </el-form-item>

          <el-form-item>
            <el-button 
              type="primary" 
              @click="handleLogin"
              :loading="loading"
            >
              登录
            </el-button>
            <el-button @click="goToRegister">注册账号</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </AppLayout>
</template>

<script setup>
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import AppLayout from '../components/AppLayout.vue'
import { userService } from '../api/userService'
import { loadCurrentUser, updateUserInfo, userInfo } from '../store/user'

const router = useRouter()
const loginFormRef = ref(null)
const loading = ref(false)

const API_BASE_URL = 'http://localhost:8080/api';

const loginForm = reactive({
  username: '',
  password: ''
})

const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!loginFormRef.value) return
  
  try {
    await loginFormRef.value.validate()
    loading.value = true
    
    try {
      console.log('开始登录操作');
      // 调用API服务进行登录
      const token = await userService.login(loginForm.username, loginForm.password)
      console.log('登录成功，获取到令牌:', token);
      
      // 特殊处理管理员登录
      if (loginForm.username === 'admin') {
        localStorage.setItem('userRole', 'admin')
        console.log('设置管理员角色');
      } else {
        localStorage.setItem('userRole', 'user')
        console.log('设置普通用户角色');
      }
      
      // 手动获取用户信息
      console.log('使用直接axios调用获取用户信息');
      try {
        const userResponse = await axios.get(`${API_BASE_URL}/users/current`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        console.log('用户信息响应:', userResponse.data);
        
        if (userResponse.data.code === '200') {
          const user = userResponse.data.data;
          // 手动更新用户信息
          updateUserInfo({
            username: user.username,
            nickname: user.username,
            role: user.role,
            email: user.email,
            phone: user.phone,
            avatar: user.avatar || userInfo.value.avatar
          });
          
          console.log('用户信息已更新:', userInfo.value);
        }
      } catch (userError) {
        console.error('获取用户信息失败:', userError);
      }
      
      // 导航到相应页面
      if (loginForm.username === 'admin') {
        ElMessage.success('管理员登录成功')
        router.push('/manager')
      } else {
        ElMessage.success('登录成功')
        router.push('/')
      }
      
      loading.value = false;
    } catch (error) {
      console.error('登录失败:', error);
      ElMessage.error(error.message || '登录失败，请检查用户名和密码')
      loading.value = false
    }
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.login-card {
  width: 400px;
}

.card-header {
  text-align: center;
}

.card-header h2 {
  margin: 0;
  color: #303133;
}

.el-form {
  margin-top: 20px;
}

.el-button {
  margin-right: 10px;
}
</style> 