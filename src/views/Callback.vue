<template>
  <div class="callback-container">
    <el-result
      v-if="error"
      icon="error"
      title="Login Failed"
      :sub-title="error"
    >
      <template #extra>
        <el-button type="primary" @click="$router.push('/login')">Back to Login</el-button>
      </template>
    </el-result>
    <div v-else class="loading">
      <el-icon class="is-loading" :size="48"><Loading /></el-icon>
      <p>Completing sign in...</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const error = ref('')

onMounted(async () => {
  const code = route.query.code
  if (!code) {
    error.value = 'No authorization code received'
    return
  }
  try {
    await authStore.login(code)
    const redirect = localStorage.getItem('redirect') || '/dashboard'
    localStorage.removeItem('redirect')
    router.replace(redirect)
  } catch (e) {
    error.value = e.response?.data?.message || e.message || 'Login failed'
  }
})
</script>

<style scoped>
.callback-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background: #f0f2f5;
}
.loading {
  text-align: center;
  color: #606266;
}
.loading p {
  margin-top: 16px;
  font-size: 16px;
}
</style>
