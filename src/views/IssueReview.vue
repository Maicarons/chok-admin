<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Issue Review</span>
          <div>
            <el-select v-model="statusFilter" placeholder="Status" clearable style="width: 140px">
              <el-option label="All" value="" />
              <el-option label="Pending" value="pending" />
              <el-option label="Verified" value="verified" />
              <el-option label="Resolved" value="resolved" />
            </el-select>
            <el-button style="margin-left: 10px" @click="fetchIssues">Refresh</el-button>
          </div>
        </div>
      </template>

      <el-table :data="issues" v-loading="loading" stripe>
        <el-table-column type="index" width="60" />
        <el-table-column prop="app_uid" label="App UID" width="200" />
        <el-table-column prop="title" label="Title" min-width="200" show-overflow-tooltip />
        <el-table-column prop="issue_type" label="Type" width="120">
          <template #default="{ row }">
            <el-tag :type="row.issue_type === 'ci_check' ? 'warning' : 'info'" size="small">
              {{ row.issue_type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'pending' ? 'danger' : row.status === 'verified' ? 'warning' : 'success'"
              size="small"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="created_at" label="Created" width="170">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">View</el-button>
            <el-button v-if="row.status === 'pending'" link type="warning" size="small" @click="updateStatus(row, 'verified')">Verify</el-button>
            <el-button v-if="row.status !== 'resolved'" link type="success" size="small" @click="updateStatus(row, 'resolved')">Resolve</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Detail Dialog -->
    <el-dialog v-model="dialogVisible" title="Issue Detail" width="600px">
      <template v-if="selectedIssue">
        <el-descriptions :column="1" border>
          <el-descriptions-item label="App UID">{{ selectedIssue.app_uid }}</el-descriptions-item>
          <el-descriptions-item label="Title">{{ selectedIssue.title }}</el-descriptions-item>
          <el-descriptions-item label="Type">{{ selectedIssue.issue_type }}</el-descriptions-item>
          <el-descriptions-item label="Status">{{ selectedIssue.status }}</el-descriptions-item>
          <el-descriptions-item label="Created">{{ formatDate(selectedIssue.created_at) }}</el-descriptions-item>
          <el-descriptions-item label="Description">
            <pre style="margin: 0; white-space: pre-wrap">{{ selectedIssue.description }}</pre>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getIssues, updateIssueStatus } from '../api'
import { useAuthStore } from '../stores/auth'
import { ElMessage } from 'element-plus'

const authStore = useAuthStore()
const issues = ref([])
const loading = ref(false)
const statusFilter = ref('')
const dialogVisible = ref(false)
const selectedIssue = ref(null)

async function fetchIssues() {
  loading.value = true
  try {
    const params = {}
    if (statusFilter.value) params.status = statusFilter.value
    const res = await getIssues(params)
    issues.value = res.data?.issues || []
  } catch {
    /* handled by interceptor */
  } finally {
    loading.value = false
  }
}

function viewDetail(issue) {
  selectedIssue.value = issue
  dialogVisible.value = true
}

async function updateStatus(issue, status) {
  if (!authStore.isReviewer) {
    ElMessage.warning('Only reviewers can update issue status')
    return
  }
  try {
    await updateIssueStatus(issue.id, status)
    issue.status = status
    ElMessage.success(`Issue marked as ${status}`)
  } catch {
    /* handled by interceptor */
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

onMounted(() => fetchIssues())
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
