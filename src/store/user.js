import { ref } from 'vue'

// 创建用户信息的响应式引用
export const userInfo = ref({
  username: 'admin',
  nickname: '管理员',
  role: '系统管理员',
  email: 'admin@example.com',
  phone: '13800138000',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 更新用户信息的方法
export const updateUserInfo = (newInfo) => {
  userInfo.value = { ...userInfo.value, ...newInfo }
} 