<template>
  <div class="chat-container">
    <!-- 左侧用户列表 -->
    <div class="sidebar">
      <div class="user-info">
        <el-upload
          class="avatar-uploader"
          action="#"
          :show-file-list="false"
          :auto-upload="false"
          :on-change="handleAvatarChange"
          accept="image/*"
        >
          <el-avatar :size="40" :src="currentUser?.avatar">
            {{ currentUser?.username?.charAt(0) }}
          </el-avatar>
          <div class="avatar-hover-mask">
            <el-icon><Camera /></el-icon>
          </div>
        </el-upload>
        <span class="username">{{ currentUser?.username }}</span>
        <el-dropdown trigger="click">
          <el-button link>
            <el-icon><Setting /></el-icon>
          </el-button>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="router.push('/change-password')">
                修改密码
              </el-dropdown-item>
              <el-dropdown-item @click="handleLogout" divided>
                退出登录
              </el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="user-list">
        <div class="list-header">
          <h3>在线用户 ({{ onlineUsers.length }})</h3>
        </div>
        <el-scrollbar>
          <div v-for="user in onlineUsers" :key="user.id" class="user-item">
            <el-avatar :size="32">{{ user.username.charAt(0) }}</el-avatar>
            <span class="user-name">{{ user.username }}</span>
            <el-tag size="small" type="success" effect="dark">在线</el-tag>
          </div>
        </el-scrollbar>
      </div>
    </div>

    <!-- 右侧聊天区域 -->
    <div class="chat-main">
      <div class="chat-header">
        <h2>聊天室</h2>
      </div>
      
      <!-- 消息列表 -->
      <div class="message-container" ref="messageContainer">
        <el-scrollbar>
          <div class="message-list">
            <div v-for="msg in messages" :key="msg.id" 
                 :class="['message-item', msg.userId === currentUser?.id ? 'message-mine' : '']">
              <div class="message-info">
                <span class="sender">{{ msg.username }}</span>
                <span class="time">{{ formatTime(msg.time) }}</span>
              </div>
              <div class="message-content">{{ msg.content }}</div>
            </div>
          </div>
        </el-scrollbar>
      </div>

      <!-- 输入区域 -->
      <div class="input-area">
        <el-input
          v-model="messageInput"
          type="textarea"
          :rows="3"
          :autosize="false"
          resize="none"
          placeholder="输入消息..."
          @keyup.enter.native="sendMessage"
        />
        <el-button type="primary" :loading="sending" @click="sendMessage">
          发送 <el-icon class="el-icon--right"><Position /></el-icon>
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue'
import { ElMessage } from 'element-plus'
import { Position, Setting, Camera } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router'
import type { UploadFile } from 'element-plus'

const router = useRouter()
const messageInput = ref('')
const sending = ref(false)
const messageContainer = ref<HTMLElement | null>(null)
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'

interface UserInfo {
  id: number
  username: string
  avatar?: string
}

const currentUser = ref<UserInfo>({
  id: 0,
  username: '',
  avatar: defaultAvatar
})

// 模拟数据
const onlineUsers = ref([
  { id: 1, username: '用户1' },
  { id: 2, username: '用户2' },
  { id: 3, username: '用户3' }
])

const messages = ref([
  { 
    id: 1, 
    userId: 0, 
    username: '系统', 
    content: '欢迎来到聊天室！', 
    time: new Date() 
  }
])

// 格式化时间
const formatTime = (time: Date) => {
  const date = new Date(time)
  return date.getHours().toString().padStart(2, '0') + ':' + 
         date.getMinutes().toString().padStart(2, '0')
}

// 发送消息
const sendMessage = async () => {
  if (!messageInput.value.trim()) {
    return
  }

  sending.value = true
  try {
    // TODO: 调用WebSocket发送消息
    const newMessage = {
      id: messages.value.length + 1,
      userId: currentUser.value?.id,
      username: currentUser.value?.username,
      content: messageInput.value,
      time: new Date()
    }
    messages.value.push(newMessage)
    messageInput.value = ''

    // 滚动到底部
    await nextTick()
    const scrollbar = messageContainer.value?.querySelector('.el-scrollbar__wrap')
    if (scrollbar) {
      scrollbar.scrollTop = scrollbar.scrollHeight
    }
  } catch (error) {
    ElMessage.error('发送失败')
  } finally {
    sending.value = false
  }
}

const handleLogout = () => {
  localStorage.removeItem('userInfo')
  router.push('/login')
}

// 处理头像上传
const handleAvatarChange = (file: UploadFile) => {
  if (!file.raw) {
    ElMessage.error('文件上传失败')
    return
  }

  const isImage = file.raw.type.startsWith('image/')
  const isLt2M = file.raw.size / 1024 / 1024 < 2

  if (!isImage) {
    ElMessage.error('只能上传图片文件！')
    return
  }
  if (!isLt2M) {
    ElMessage.error('图片大小不能超过 2MB！')
    return
  }

  // 读取图片为 base64
  const reader = new FileReader()
  reader.readAsDataURL(file.raw)
  reader.onload = () => {
    if (currentUser.value && reader.result) {
      currentUser.value = {
        ...currentUser.value,
        avatar: reader.result as string
      }
      // 更新本地存储
      localStorage.setItem('userInfo', JSON.stringify(currentUser.value))
      ElMessage.success('头像更新成功')
    }
  }
}

onMounted(() => {
  // 获取当前用户信息
  const userInfo = localStorage.getItem('userInfo')
  if (!userInfo) {
    router.push('/login')
    return
  }
  try {
    const parsedInfo = JSON.parse(userInfo) as UserInfo
    currentUser.value = {
      ...parsedInfo,
      avatar: parsedInfo.avatar || defaultAvatar
    }
  } catch (error) {
    router.push('/login')
  }
  
  // TODO: 建立WebSocket连接
})
</script>

<style scoped>
.chat-container {
  display: flex;
  height: 100vh;
  background-color: var(--background-color);
}

.sidebar {
  width: 260px;
  background: #fff;
  border-right: 1px solid #e8e8e8;
  display: flex;
  flex-direction: column;
}

.user-info {
  padding: 20px;
  border-bottom: 1px solid #e8e8e8;
  display: flex;
  align-items: center;
  gap: 12px;
}

.username {
  font-weight: 500;
  color: #333;
}

.user-list {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.list-header {
  padding: 12px 20px;
  border-bottom: 1px solid #e8e8e8;
}

.list-header h3 {
  margin: 0;
  color: #666;
  font-size: 14px;
}

.user-item {
  padding: 12px 20px;
  display: flex;
  align-items: center;
  gap: 12px;
  transition: background-color 0.3s;
  cursor: pointer;
}

.user-item:hover {
  background-color: #f5f7fa;
}

.user-name {
  flex: 1;
  color: #333;
}

.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #fff;
}

.chat-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e8e8e8;
}

.chat-header h2 {
  margin: 0;
  color: #333;
}

.message-container {
  flex: 1;
  padding: 20px;
  overflow: hidden;
}

.message-list {
  padding: 0 20px;
}

.message-item {
  margin-bottom: 20px;
  max-width: 70%;
}

.message-mine {
  margin-left: auto;
  text-align: right;
}

.message-info {
  margin-bottom: 4px;
}

.sender {
  font-weight: 500;
  color: #333;
  margin-right: 8px;
}

.time {
  color: #999;
  font-size: 12px;
}

.message-content {
  padding: 12px 16px;
  background: #f4f4f5;
  border-radius: 4px;
  color: #333;
  line-height: 1.4;
}

.message-mine .message-content {
  background: var(--primary-color);
  color: #fff;
}

.input-area {
  padding: 20px;
  border-top: 1px solid #e8e8e8;
  display: flex;
  align-items: flex-start;
  gap: 16px;
  height: 120px;
}

.input-area .el-input {
  flex: 1;
}

.input-area :deep(.el-textarea__inner) {
  height: 80px !important;
  resize: none;
}

.input-area .el-button {
  height: 80px;
  width: 100px;
}

.avatar-uploader {
  position: relative;
  cursor: pointer;
}

.avatar-hover-mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 50%;
  opacity: 0;
  transition: opacity 0.3s;
}

.avatar-hover-mask .el-icon {
  color: white;
  font-size: 16px;
}

.avatar-uploader:hover .avatar-hover-mask {
  opacity: 1;
}
</style> 