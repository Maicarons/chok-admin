<template>
  <div>
    <el-card>
      <template #header>
        <div class="card-header">
          <span>App Management</span>
          <div>
            <el-input v-model="search" placeholder="Search apps..." style="width: 250px" clearable />
            <el-button type="primary" style="margin-left: 10px" @click="refresh">Refresh</el-button>
          </div>
        </div>
      </template>

      <el-table :data="filteredApps" v-loading="loading" stripe>
        <el-table-column prop="uid" label="UID" width="100" />
        <el-table-column label="Name" min-width="150">
          <template #default="{ row }">
            {{ row.names?.en || row.uid }}
          </template>
        </el-table-column>
        <el-table-column label="Categories" width="150">
          <template #default="{ row }">
            <el-tag v-for="cat in row.categories" :key="cat" size="small" style="margin-right: 4px">
              {{ cat }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Downloads" width="100" align="center">
          <template #default="{ row }">
            {{ row.download_count || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="Views" width="80" align="center">
          <template #default="{ row }">
            {{ row.view_count || 0 }}
          </template>
        </el-table-column>
        <el-table-column label="License" width="100">
          <template #default="{ row }">
            {{ row.license || '-' }}
          </template>
        </el-table-column>
        <el-table-column label="Actions" width="120" fixed="right">
          <template #default="{ row }">
            <el-button link type="primary" size="small" @click="viewDetail(row)">Detail</el-button>
            <el-button link type="danger" size="small">Remove</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- Detail Dialog -->
    <el-dialog v-model="dialogVisible" :title="selectedApp?.names?.en || 'App Detail'" width="700px">
      <template v-if="selectedApp">
        <el-descriptions :column="2" border>
          <el-descriptions-item label="UID">{{ selectedApp.uid }}</el-descriptions-item>
          <el-descriptions-item label="License">{{ selectedApp.license || '-' }}</el-descriptions-item>
          <el-descriptions-item label="Website">
            <a :href="selectedApp.website" target="_blank">{{ selectedApp.website || '-' }}</a>
          </el-descriptions-item>
          <el-descriptions-item label="Categories">
            <el-tag v-for="cat in selectedApp.categories" :key="cat" size="small" style="margin: 2px">{{ cat }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Download Count">{{ selectedApp.download_count || 0 }}</el-descriptions-item>
          <el-descriptions-item label="View Count">{{ selectedApp.view_count || 0 }}</el-descriptions-item>
          <el-descriptions-item label="Platforms" :span="2">
            <el-tag v-for="p in Object.keys(selectedApp.downloads || {})" :key="p" size="small" style="margin: 2px">{{ p }}</el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="Summary EN" :span="2">{{ selectedApp.summaries?.en || '-' }}</el-descriptions-item>
        </el-descriptions>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAppStore } from '../stores/app'

const store = useAppStore()
const loading = computed(() => store.loading)
const search = ref('')
const dialogVisible = ref(false)
const selectedApp = ref(null)

const allApps = computed(() => {
  return [...(store.hotApps || []), ...(store.latestApps || [])]
    .filter((a, i, arr) => arr.findIndex(x => x.uid === a.uid) === i)
})

const filteredApps = computed(() => {
  if (!search.value) return allApps.value
  const q = search.value.toLowerCase()
  return allApps.value.filter(a =>
    a.uid.toLowerCase().includes(q) ||
    Object.values(a.names || {}).some(n => n.toLowerCase().includes(q))
  )
})

function viewDetail(app) {
  selectedApp.value = app
  dialogVisible.value = true
}

async function refresh() {
  await store.fetchStats()
  await store.fetchApps()
}

onMounted(() => refresh())
</script>

<style scoped>
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
