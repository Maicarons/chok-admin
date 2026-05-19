<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Collections Management</span>
          <el-button type="primary" @click="showCreateDialog">Create Collection</el-button>
        </div>
      </template>

      <el-table :data="collections" v-loading="loading" stripe>
        <el-table-column type="index" width="60" />
        <el-table-column prop="name" label="Name" min-width="180" />
        <el-table-column prop="description" label="Description" min-width="250" show-overflow-tooltip />
        <el-table-column prop="sort_order" label="Sort Order" width="100" align="center" />
        <el-table-column label="Apps" width="80" align="center">
          <template #default="{ row }">
            {{ row.app_uids?.length || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="Created" width="170">
          <template #default="{ row }">
            {{ formatDate(row.created_at) }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="150" fixed="right">
          <template #default>
            <el-button link type="primary" size="small">Edit</el-button>
            <el-button link type="danger" size="small">Delete</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Create Dialog -->
    <el-dialog v-model="dialogVisible" title="Create Collection" width="500px">
      <el-form :model="form" label-width="120px">
        <el-form-item label="Name">
          <el-input v-model="form.name" placeholder="Collection name" />
        </el-form-item>
        <el-form-item label="Description">
          <el-input v-model="form.description" type="textarea" :rows="2" placeholder="Description" />
        </el-form-item>
        <el-form-item label="Cover Image URL">
          <el-input v-model="form.cover_image" placeholder="https://..." />
        </el-form-item>
        <el-form-item label="Sort Order">
          <el-input-number v-model="form.sort_order" :min="0" />
        </el-form-item>
        <el-form-item label="App UIDs">
          <el-input v-model="form.app_uids_text" type="textarea" :rows="3" placeholder="com.example.app1, com.example.app2" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">Cancel</el-button>
        <el-button type="primary" @click="saveCollection">Save</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { getCollections, createCollection } from '../api'
import { ElMessage } from 'element-plus'

const collections = ref([])
const loading = ref(false)
const dialogVisible = ref(false)
const form = ref({
  name: '',
  description: '',
  cover_image: '',
  sort_order: 0,
  app_uids_text: '',
})

async function fetchCollections() {
  loading.value = true
  try {
    const res = await getCollections()
    collections.value = res.data || []
  } catch (e) {
    ElMessage.error('Failed to fetch collections')
  } finally {
    loading.value = false
  }
}

function showCreateDialog() {
  form.value = { name: '', description: '', cover_image: '', sort_order: 0, app_uids_text: '' }
  dialogVisible.value = true
}

async function saveCollection() {
  try {
    const appUids = form.value.app_uids_text
      .split(',')
      .map(s => s.trim())
      .filter(Boolean)
    await createCollection({
      name: form.value.name,
      description: form.value.description,
      cover_image: form.value.cover_image,
      app_uids: appUids,
      sort_order: form.value.sort_order,
    })
    ElMessage.success('Collection created')
    dialogVisible.value = false
    await fetchCollections()
  } catch (e) {
    ElMessage.error('Failed to create collection')
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleString()
}

onMounted(() => fetchCollections())
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
