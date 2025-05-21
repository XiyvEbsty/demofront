<template>
  <div class="user-manager">
    <h1 class="page-title">用户管理</h1>
    
    <el-alert
      title="管理系统中的所有用户账户"
      type="info"
      description="查看、编辑用户信息，设置用户权限，重置密码"
      show-icon
      :closable="false"
      class="info-alert"
    />
    
    <div class="toolbar">
      <el-button type="primary" @click="openUserDialog(null)">添加用户</el-button>
      <div class="search-area">
        <el-input 
          v-model="searchKeyword" 
          placeholder="搜索用户" 
          class="search-input"
          clearable
        >
          <template #append>
            <el-button :icon="Search" />
          </template>
        </el-input>
        <el-select v-model="roleFilter" placeholder="角色筛选" clearable>
          <el-option label="全部" value="" />
          <el-option label="管理员" value="admin" />
          <el-option label="普通用户" value="user" />
        </el-select>
      </div>
    </div>
    
    <el-table :data="filteredUsers" border stripe style="width: 100%">
      <el-table-column prop="id" label="ID" width="80" />
      <el-table-column prop="username" label="用户名" width="120" />
      <el-table-column prop="nickname" label="昵称" width="120" />
      <el-table-column prop="email" label="邮箱" min-width="180" />
      <el-table-column label="头像" width="100">
        <template #default="scope">
          <el-avatar :src="scope.row.avatar" :size="40" />
        </template>
      </el-table-column>
      <el-table-column prop="role" label="角色" width="100">
        <template #default="scope">
          <el-tag 
            :type="scope.row.role === 'admin' ? 'danger' : 'primary'"
            effect="plain"
          >
            {{ scope.row.role === 'admin' ? '管理员' : '普通用户' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastLogin" label="最近登录" width="180" />
      <el-table-column label="操作" width="220">
        <template #default="scope">
          <el-button size="small" @click="openUserDialog(scope.row)">编辑</el-button>
          <el-button 
            size="small" 
            type="warning" 
            @click="resetPassword(scope.row)"
          >
            重置密码
          </el-button>
          <el-button 
            size="small" 
            type="danger" 
            @click="confirmDeleteUser(scope.row)"
            :disabled="scope.row.role === 'admin'"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    
    <el-pagination
      v-if="userList.length > 10"
      layout="prev, pager, next"
      :total="userList.length"
      :page-size="10"
      class="pagination"
    />
    
    <!-- 用户编辑对话框 -->
    <el-dialog
      v-model="dialogVisible"
      :title="isEditing ? '编辑用户' : '添加用户'"
      width="500px"
    >
      <el-form :model="currentUser" label-width="100px" :rules="rules" ref="userForm">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="currentUser.username" :disabled="isEditing" />
        </el-form-item>
        
        <el-form-item label="昵称" prop="nickname">
          <el-input v-model="currentUser.nickname" />
        </el-form-item>
        
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="currentUser.email" />
        </el-form-item>
        
        <el-form-item label="角色" prop="role">
          <el-select v-model="currentUser.role" placeholder="请选择角色">
            <el-option label="管理员" value="admin" />
            <el-option label="普通用户" value="user" />
          </el-select>
        </el-form-item>
        
        <el-form-item label="密码" prop="password" v-if="!isEditing">
          <el-input v-model="currentUser.password" type="password" show-password />
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="saveUser">保存</el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { Search } from '@element-plus/icons-vue';

export default {
  name: 'UserManager',
  setup() {
    // 搜索和筛选
    const searchKeyword = ref('');
    const roleFilter = ref('');
    
    // 用户列表数据 - 实际应用中应从API获取
    const userList = ref([
      {
        id: 1,
        username: 'admin',
        nickname: '系统管理员',
        email: 'admin@example.com',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        role: 'admin',
        lastLogin: new Date().toLocaleString()
      },
      {
        id: 2,
        username: 'user1',
        nickname: '张三',
        email: 'zhangsan@example.com',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        role: 'user',
        lastLogin: new Date().toLocaleString()
      },
      {
        id: 3,
        username: 'user2',
        nickname: '李四',
        email: 'lisi@example.com',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        role: 'user',
        lastLogin: new Date().toLocaleString()
      },
      {
        id: 4,
        username: 'hr_manager',
        nickname: '人力资源经理',
        email: 'hr@example.com',
        avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
        role: 'admin',
        lastLogin: new Date().toLocaleString()
      }
    ]);
    
    // 筛选后的用户列表
    const filteredUsers = computed(() => {
      return userList.value.filter(user => {
        const matchKeyword = searchKeyword.value 
          ? (user.username.includes(searchKeyword.value) || 
             user.nickname.includes(searchKeyword.value) || 
             user.email.includes(searchKeyword.value))
          : true;
          
        const matchRole = roleFilter.value 
          ? user.role === roleFilter.value
          : true;
          
        return matchKeyword && matchRole;
      });
    });
    
    // 对话框控制
    const dialogVisible = ref(false);
    const isEditing = ref(false);
    const currentUser = ref({
      username: '',
      nickname: '',
      email: '',
      role: 'user',
      password: ''
    });
    
    // 表单验证规则
    const rules = {
      username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        { min: 3, max: 20, message: '长度在3到20个字符之间', trigger: 'blur' }
      ],
      nickname: [
        { required: true, message: '请输入昵称', trigger: 'blur' }
      ],
      email: [
        { required: true, message: '请输入邮箱地址', trigger: 'blur' },
        { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
      ],
      role: [
        { required: true, message: '请选择角色', trigger: 'change' }
      ],
      password: [
        { required: true, message: '请输入密码', trigger: 'blur', when: (rule, value) => !isEditing.value },
        { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur', when: (rule, value) => !isEditing.value }
      ]
    };
    
    const userForm = ref(null);
    
    // 打开用户编辑对话框
    const openUserDialog = (user) => {
      if (user) {
        // 编辑用户
        currentUser.value = { ...user };
        isEditing.value = true;
      } else {
        // 添加新用户
        currentUser.value = {
          username: '',
          nickname: '',
          email: '',
          role: 'user',
          password: '',
          avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'
        };
        isEditing.value = false;
      }
      dialogVisible.value = true;
    };
    
    // 确认删除用户
    const confirmDeleteUser = (user) => {
      if (user.role === 'admin') {
        ElMessage.warning('不能删除管理员账户');
        return;
      }
      
      ElMessageBox.confirm(
        `确定要删除用户 ${user.nickname} (${user.username}) 吗？此操作不可恢复。`,
        '确认删除',
        {
          confirmButtonText: '删除',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        deleteUser(user.id);
      }).catch(() => {
        // 用户取消删除
      });
    };
    
    // 删除用户
    const deleteUser = (id) => {
      userList.value = userList.value.filter(user => user.id !== id);
      ElMessage.success('用户删除成功');
    };
    
    // 重置密码
    const resetPassword = (user) => {
      ElMessageBox.confirm(
        `确定要重置用户 ${user.nickname} (${user.username}) 的密码吗？`,
        '确认重置密码',
        {
          confirmButtonText: '重置',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).then(() => {
        // 实际应用中应调用API
        ElMessage.success(`密码已重置为默认密码并发送到用户邮箱: ${user.email}`);
      }).catch(() => {
        // 用户取消操作
      });
    };
    
    // 保存用户
    const saveUser = () => {
      if (userForm.value) {
        userForm.value.validate((valid) => {
          if (valid) {
            if (isEditing.value) {
              // 更新现有用户
              const index = userList.value.findIndex(u => u.id === currentUser.value.id);
              if (index !== -1) {
                userList.value[index] = { ...currentUser.value };
              }
              ElMessage.success('用户信息更新成功');
            } else {
              // 添加新用户
              const newId = Math.max(0, ...userList.value.map(u => u.id)) + 1;
              const newUser = {
                ...currentUser.value,
                id: newId,
                lastLogin: new Date().toLocaleString()
              };
              userList.value.push(newUser);
              ElMessage.success('用户创建成功');
            }
            dialogVisible.value = false;
          } else {
            return false;
          }
        });
      }
    };
    
    return {
      searchKeyword,
      roleFilter,
      userList,
      filteredUsers,
      dialogVisible,
      currentUser,
      isEditing,
      rules,
      userForm,
      Search,
      openUserDialog,
      confirmDeleteUser,
      resetPassword,
      saveUser
    };
  }
};
</script>

<style scoped>
.user-manager {
  padding: 20px;
}

.page-title {
  margin-bottom: 20px;
  text-align: center;
  color: #409EFF;
}

.info-alert {
  margin-bottom: 20px;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}

.search-area {
  display: flex;
  gap: 10px;
}

.search-input {
  width: 300px;
}

.pagination {
  margin-top: 20px;
  text-align: center;
}
</style> 