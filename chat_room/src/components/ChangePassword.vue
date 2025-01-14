<template>
  <div class="change-password-container">
    <div class="change-password-box">
      <h2>修改密码</h2>
      <el-form :model="passwordForm" @submit.prevent="handleChangePassword">
        <el-form-item>
          <el-input
            v-model="passwordForm.oldPassword"
            type="password"
            placeholder="原密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="passwordForm.newPassword"
            type="password"
            placeholder="新密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-input
            v-model="passwordForm.confirmPassword"
            type="password"
            placeholder="确认新密码"
            prefix-icon="Lock"
            show-password
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleChangePassword" :loading="loading" class="submit-button">
            确认修改
          </el-button>
        </el-form-item>
        <div class="form-footer">
          <router-link to="/chat">返回聊天室</router-link>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const loading = ref(false)
const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const handleChangePassword = async () => {
  if (!passwordForm.oldPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
    ElMessage.warning('请填写完整信息')
    return
  }

  if (passwordForm.newPassword !== passwordForm.confirmPassword) {
    ElMessage.error('两次输入的新密码不一致')
    return
  }

  loading.value = true
  try {
    // TODO: 调用修改密码接口
    ElMessage.success('密码修改成功')
    router.push('/chat')
  } catch (error) {
    ElMessage.error('修改失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.change-password-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.change-password-box {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  max-width: 400px;
}

h2 {
  text-align: center;
  color: #333;
  margin-bottom: 2rem;
}

.submit-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
}

.form-footer {
  text-align: center;
  margin-top: 1rem;
  color: #666;
}

.form-footer a {
  color: var(--primary-color);
  text-decoration: none;
}

.el-form-item {
  margin-bottom: 20px;
}
</style>
  