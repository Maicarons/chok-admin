<template>
  <div class="submission-review">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Submission Review</span>
          <div class="header-actions">
            <el-select
              v-model="statusFilter"
              placeholder="Status"
              clearable
              style="width: 140px; margin-right: 8px"
              @change="fetchSubmissions"
            >
              <el-option label="All" value="" />
              <el-option label="Pending" value="pending" />
              <el-option label="Approved" value="approved" />
              <el-option label="Rejected" value="rejected" />
            </el-select>
            <el-select
              v-model="typeFilter"
              placeholder="Type"
              clearable
              style="width: 120px; margin-right: 8px"
              @change="fetchSubmissions"
            >
              <el-option label="All" value="" />
              <el-option label="New" value="new" />
              <el-option label="Edit" value="edit" />
              <el-option label="Delete" value="delete" />
            </el-select>
            <el-button @click="fetchSubmissions">
              <el-icon><Refresh /></el-icon>
              Refresh
            </el-button>
          </div>
        </div>
      </template>

      <el-table :data="submissions" v-loading="loading" stripe>
        <el-table-column type="index" label="#" width="60" />
        <el-table-column prop="uid" label="UID" width="120" />
        <el-table-column prop="type" label="Type" width="90">
          <template #default="{ row }">
            <el-tag
              :type="row.type === 'delete' ? 'danger' : row.type === 'edit' ? 'warning' : 'success'"
              size="small"
            >
              {{ row.type }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="Status" width="100">
          <template #default="{ row }">
            <el-tag
              :type="row.status === 'pending' ? 'info' : row.status === 'approved' ? 'success' : 'danger'"
              size="small"
            >
              {{ row.status }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="submitter_name" label="Submitter" width="140" />
        <el-table-column prop="reviewer_name" label="Reviewer" width="140" />
        <el-table-column prop="created_at" label="Created" width="170">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="200" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="primary" link @click="viewDetail(row)">
              View
            </el-button>
            <template v-if="row.status === 'pending'">
              <el-button size="small" type="success" link @click="approve(row)">
                Approve
              </el-button>
              <el-button size="small" type="danger" link @click="showReject(row)">
                Reject
              </el-button>
            </template>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination" v-if="total > 0">
        <el-pagination
          v-model:current-page="page"
          :page-size="50"
          :total="total"
          layout="total, prev, pager, next"
          @current-change="fetchSubmissions"
        />
      </div>
    </el-card>

    <!-- Detail Dialog -->
    <el-dialog v-model="detailVisible" title="Submission Detail" width="700px">
      <el-descriptions v-if="selected" :column="2" border>
        <el-descriptions-item label="UID">{{ selected.uid }}</el-descriptions-item>
        <el-descriptions-item label="Type">
          <el-tag :type="selected.type === 'delete' ? 'danger' : 'success'" size="small">
            {{ selected.type }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Status">
          <el-tag
            :type="selected.status === 'pending' ? 'info' : selected.status === 'approved' ? 'success' : 'danger'"
            size="small"
          >
            {{ selected.status }}
          </el-tag>
        </el-descriptions-item>
        <el-descriptions-item label="Submitter">{{ selected.submitter_name }}</el-descriptions-item>
        <el-descriptions-item label="Reviewer">{{ selected.reviewer_name || '-' }}</el-descriptions-item>
        <el-descriptions-item label="Created">{{ formatDate(selected.created_at) }}</el-descriptions-item>
        <el-descriptions-item v-if="selected.review_note" label="Review Note" :span="2">
          {{ selected.review_note }}
        </el-descriptions-item>
      </el-descriptions>

      <div v-if="selected && selected.data" class="submission-data">
        <h4>App Data:</h4>
        <el-input
          type="textarea"
          :rows="15"
          :model-value="formatData(selected.data)"
          readonly
        />
      </div>

      <template #footer>
        <el-button @click="detailVisible = false">Close</el-button>
        <template v-if="selected?.status === 'pending'">
          <el-button type="success" @click="approve(selected); detailVisible = false">
            Approve
          </el-button>
          <el-button type="danger" @click="showReject(selected); detailVisible = false">
            Reject
          </el-button>
        </template>
      </template>
    </el-dialog>

    <!-- Reject Dialog -->
    <el-dialog v-model="rejectVisible" title="Reject Submission" width="500px">
      <el-form>
        <el-form-item label="Reason">
          <el-input
            v-model="reviewNote"
            type="textarea"
            :rows="3"
            placeholder="Reason for rejection"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="rejectVisible = false">Cancel</el-button>
        <el-button type="danger" :loading="actionLoading" @click="confirmReject">
          Reject
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  getSubmissions, getSubmissionDetail,
  approveSubmission, rejectSubmission,
} from '../api'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)
const submissions = ref([])
const total = ref(0)
const page = ref(1)
const statusFilter = ref('')
const typeFilter = ref('')

const detailVisible = ref(false)
const selected = ref(null)

const rejectVisible = ref(false)
const reviewNote = ref('')
const actionLoading = ref(false)

async function fetchSubmissions() {
  loading.value = true
  try {
    const res = await getSubmissions({
      status: statusFilter.value || undefined,
      type: typeFilter.value || undefined,
      limit: 50,
      offset: (page.value - 1) * 50,
    })
    submissions.value = res.data.submissions || []
    total.value = res.data.total || 0
  } catch {
    /* handled by interceptor */
  } finally {
    loading.value = false
  }
}

async function viewDetail(row) {
  try {
    const res = await getSubmissionDetail(row.id)
    selected.value = res.data
    detailVisible.value = true
  } catch {
    /* handled */
  }
}

async function approve(row) {
  try {
    await ElMessageBox.confirm(`Approve submission for app "${row.uid}"?`, 'Confirm')
  } catch {
    return
  }
  actionLoading.value = true
  try {
    await approveSubmission(row.id)
    ElMessage.success('Submission approved')
    fetchSubmissions()
  } catch {
    /* handled */
  } finally {
    actionLoading.value = false
  }
}

function showReject(row) {
  selected.value = row
  reviewNote.value = ''
  rejectVisible.value = true
}

async function confirmReject() {
  if (!selected.value) return
  actionLoading.value = true
  try {
    await rejectSubmission(selected.value.id, reviewNote.value)
    ElMessage.success('Submission rejected')
    rejectVisible.value = false
    fetchSubmissions()
  } catch {
    /* handled */
  } finally {
    actionLoading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

function formatData(dataStr) {
  try {
    return JSON.stringify(JSON.parse(dataStr), null, 2)
  } catch {
    return dataStr
  }
}

onMounted(fetchSubmissions)
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
.header-actions {
  display: flex;
  align-items: center;
}
.pagination {
  margin-top: 16px;
  display: flex;
  justify-content: flex-end;
}
.submission-data {
  margin-top: 16px;
}
.submission-data h4 {
  margin: 0 0 8px;
}
</style>
