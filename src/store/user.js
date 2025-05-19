import { ref } from 'vue'
import { userService } from '../api/userService'

// 创建用户信息的响应式引用
export const userInfo = ref({
  username: '',
  nickname: '',
  role: '',
  email: '',
  phone: '',
  avatar: 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'
})

// 更新用户信息的方法
export const updateUserInfo = (newInfo) => {
  userInfo.value = { ...userInfo.value, ...newInfo }
}

// 加载当前用户信息
export const loadCurrentUser = async () => {
  console.log('开始加载当前用户信息');
  
  // 首先检查令牌状态
  const tokenStatus = userService.checkTokenStatus();
  console.log('令牌状态检查:', tokenStatus);
  
  if (!tokenStatus.tokenExists) {
    console.log('没有找到令牌，不加载用户信息');
    return null;
  }
  
  if (!tokenStatus.authHeaderExists) {
    console.log('Authorization头未设置，尝试重新设置');
  }
  
  try {
    console.log('调用API获取用户信息');
    const user = await userService.getCurrentUser();
    console.log('获取到的用户信息:', user);
    
    if (!user) {
      console.error('API返回了空的用户信息');
      return null;
    }
    
    // 更新用户信息
    updateUserInfo({
      username: user.username,
      nickname: user.username, // 如果没有nickname字段，使用username替代
      role: user.role,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar || userInfo.value.avatar
    });
    
    console.log('用户信息已更新:', userInfo.value);
    return user;
  } catch (error) {
    console.error('加载用户信息失败:', error);
    // 如果是未授权错误，可能令牌过期，清除令牌
    if (error.response && error.response.status === 401) {
      console.log('令牌可能已过期，正在清除');
      userService.logout();
    }
    return null;
  }
} 