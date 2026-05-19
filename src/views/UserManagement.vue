<template>
  <div class="user-management">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>User Management</span>
          <el-button @click="fetchUsers">
            <el-icon><Refresh /></el-icon>
            Refresh
          </el-button>
        </div>
      </template>

      <el-table :data="users" v-loading="loading" stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column label="Avatar" width="80">
          <template #default="{ row }">
            <el-avatar :src="row.avatar_url" :size="36" />
          </template>
        </el-table-column>
        <el-table-column prop="username" label="Username" min-width="150" />
        <el-table-column prop="github_id" label="GitHub ID" width="120" />
        <el-table-column prop="role" label="Role" width="140">
          <template #default="{ row }">
            <el-select
              :model-value="row.role"
              size="small"
              @change="(val) => changeRole(row, val)"
              :disabled="row.id === 1"
            >
              <el-option label="User" value="user" />
              <el-option label="Reviewer" value="reviewer" />
              <el-option label="Admin" value="admin" />
            </el-select>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="Joined" width="170">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="GitHub" width="80">
          <template #default="{ row }">
            <el-button
              size="small"
              link
              type="primary"
              @click="openGithub(row.github_id)"
            >
              <el-icon><Link /></el-icon>
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getUsers, updateUserRole } from '../api'
import { ElMessage } from 'element-plus'

const loading = ref(false)
const users = ref([])

async function fetchUsers() {
  loading.value = true
  try {
    const res = await getUsers()
    users.value = res.data || []
  } catch {
    /* handled */
  } finally {
    loading.value = false
  }
}

async function changeRole(user, newRole) {
  try {
    await updateUserRole(user.id, newRole)
    user.role = newRole
    ElMessage.success(`Role updated to ${newRole}`)
  } catch {
    /* handled */
  }
}

function openGithub(githubId) {
  window.open(`https://github.com/${githubId}`, '_blank')
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

onMounted(fetchUsers)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
