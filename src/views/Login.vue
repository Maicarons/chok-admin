<template>
  <div class="login-container">
    <div class="login-card">
      <div class="login-header">
        <el-icon :size="48" color="#409eff"><Promotion /></el-icon>
        <h1>CHOKAPP Admin</h1>
        <p>App Discovery & Sharing Platform</p>
      </div>
      <el-button
        type="primary"
        size="large"
        :loading="loading"
        @click="handleLogin"
        class="github-btn"
      >
        <svg class="github-icon" viewBox="0 0 24 24" width="20" height="20">
          <path fill="currentColor" d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
        </svg>
        Sign in with GitHub
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const loading = ref(false)

const GITHUB_CLIENT_ID = 'Ov23liAANybP8CDNNims'

function handleLogin() {
  loading.value = true
  const redirectUri = window.location.origin + '/callback'
  const scope = 'read:user'
  window.location.href = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${redirectUri}&scope=${scope}`
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.login-card {
  background: #fff;
  border-radius: 12px;
  padding: 48px 40px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  text-align: center;
  width: 400px;
  max-width: 90vw;
}
.login-header {
  margin-bottom: 32px;
}
.login-header h1 {
  margin: 12px 0 4px;
  font-size: 24px;
  color: #303133;
}
.login-header p {
  color: #909399;
  font-size: 14px;
  margin: 0;
}
.github-btn {
  width: 100%;
  height: 48px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}
.github-icon {
  flex-shrink: 0;
}
</style>
