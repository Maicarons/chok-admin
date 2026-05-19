<template>
  <el-container style="height: 100vh">
    <el-aside width="220px">
      <div class="logo">
        <el-icon :size="28"><Promotion /></el-icon>
        <span>CHOKAPP Admin</span>
      </div>
      <el-menu
        :default-active="currentRoute"
        router
        background-color="#304156"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item index="/dashboard">
          <el-icon><DataAnalysis /></el-icon>
          <span>Dashboard</span>
        </el-menu-item>
        <el-menu-item index="/apps">
          <el-icon><Grid /></el-icon>
          <span>App Management</span>
        </el-menu-item>
        <el-menu-item index="/submit">
          <el-icon><Upload /></el-icon>
          <span>Submit App</span>
        </el-menu-item>
        <el-menu-item v-if="authStore.isReviewer" index="/submissions">
          <el-icon><Checked /></el-icon>
          <span>Review Submissions</span>
          <el-badge
            v-if="pendingCount > 0"
            :value="pendingCount"
            class="menu-badge"
          />
        </el-menu-item>
        <el-menu-item index="/issues">
          <el-icon><Warning /></el-icon>
          <span>Issue Review</span>
        </el-menu-item>
        <el-menu-item index="/collections">
          <el-icon><Collection /></el-icon>
          <span>Collections</span>
        </el-menu-item>
        <el-menu-item v-if="authStore.isAdmin" index="/users">
          <el-icon><User /></el-icon>
          <span>User Management</span>
        </el-menu-item>
        <el-menu-item index="/settings">
          <el-icon><Setting /></el-icon>
          <span>Settings</span>
        </el-menu-item>
      </el-menu>
    </el-aside>

    <el-container>
      <el-header style="height: 60px">
        <div class="header-content">
          <h2>{{ pageTitle }}</h2>
          <div class="header-right">
            <el-dropdown trigger="click" @command="handleCommand">
              <span class="user-info">
                <el-avatar
                  v-if="authStore.user"
                  :src="authStore.user.avatar_url"
                  :size="32"
                />
                <span class="username">{{ authStore.user?.username || 'User' }}</span>
                <el-tag
                  :type="roleTagType"
                  size="small"
                  class="role-tag"
                >
                  {{ authStore.userRole }}
                </el-tag>
                <el-icon><ArrowDown /></el-icon>
              </span>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item disabled>
                    Signed in as <strong>{{ authStore.user?.username }}</strong>
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon><SwitchButton /></el-icon>
                    Sign Out
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </el-header>
      <el-main>
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { getSubmissions } from '../api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const pendingCount = ref(0)

const currentRoute = computed(() => route.path)
const pageTitle = computed(() => route.meta?.title || 'Dashboard')

const roleTagType = computed(() => {
  const map = { admin: 'danger', reviewer: 'warning', user: 'info' }
  return map[authStore.userRole] || 'info'
})

async function fetchPendingCount() {
  if (!authStore.isReviewer) return
  try {
    const res = await getSubmissions({ status: 'pending', limit: 1 })
    pendingCount.value = res.data?.total || 0
  } catch { /* ignore */ }
}

function handleCommand(cmd) {
  if (cmd === 'logout') {
    authStore.logout()
    router.push('/login')
  }
}

onMounted(() => {
  authStore.fetchMe()
  fetchPendingCount()
})
</script>

<style scoped>
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 20px;
  color: #fff;
  font-size: 16px;
  font-weight: 600;
  background: #263445;
}
.el-aside {
  background: #304156;
}
.el-header {
  background: #fff;
  border-bottom: 1px solid #e4e7ed;
  display: flex;
  align-items: center;
}
.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.header-content h2 {
  margin: 0;
  font-size: 18px;
  color: #303133;
}
.header-right {
  display: flex;
  align-items: center;
}
.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
  transition: background 0.2s;
}
.user-info:hover {
  background: #f5f7fa;
}
.username {
  font-size: 14px;
  color: #303133;
}
.role-tag {
  text-transform: capitalize;
}
.menu-badge {
  margin-left: auto;
  margin-right: 16px;
}
.el-main {
  background: #f0f2f5;
}
</style>
