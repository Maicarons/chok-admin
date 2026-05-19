<template>
  <div class="dashboard">
    <!-- Stats Cards Row 1 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="32" color="#409eff"><Grid /></el-icon>
            <div>
              <div class="stat-value">{{ stats?.total_apps || 0 }}</div>
              <div class="stat-label">Total Apps</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="32" color="#67c23a"><View /></el-icon>
            <div>
              <div class="stat-value">{{ formatNumber(stats?.total_views || 0) }}</div>
              <div class="stat-label">Total Views</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="32" color="#e6a23c"><Download /></el-icon>
            <div>
              <div class="stat-value">{{ formatNumber(stats?.total_downloads || 0) }}</div>
              <div class="stat-label">Total Downloads</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="32" color="#f56c6c"><Warning /></el-icon>
            <div>
              <div class="stat-value">{{ pendingIssues }}</div>
              <div class="stat-label">Pending Issues</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Stats Row 2: Review stats -->
    <el-row v-if="authStore.isReviewer" :gutter="20" class="stats-row">
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="32" color="#409eff"><Upload /></el-icon>
            <div>
              <div class="stat-value">{{ pendingSubmissions }}</div>
              <div class="stat-label">Pending Submissions</div>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card shadow="hover">
          <div class="stat-card">
            <el-icon :size="32" color="#f56c6c"><Delete /></el-icon>
            <div>
              <div class="stat-value">{{ pendingDeletes }}</div>
              <div class="stat-label">Pending Delete Requests</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- Charts -->
    <el-row :gutter="20" style="margin-top: 20px">
      <el-col :span="16">
        <el-card>
          <template #header>
            <span>App Statistics</span>
          </template>
          <div ref="barChartRef" style="height: 350px"></div>
        </el-card>
      </el-col>
      <el-col :span="8">
        <el-card>
          <template #header>
            <span>Top Apps</span>
          </template>
          <div style="max-height: 350px; overflow-y: auto">
            <div v-for="(app, i) in topApps" :key="app.uid" class="top-app-item">
              <span class="rank">{{ i + 1 }}</span>
              <span class="name">{{ app.names?.en || app.uid }}</span>
              <span class="count">{{ app.download_count || 0 }} dl</span>
            </div>
            <el-empty v-if="!topApps.length" description="No data" />
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAppStore } from '../stores/app'
import { useAuthStore } from '../stores/auth'
import { getIssues, getSubmissions } from '../api'
import * as echarts from 'echarts'

const store = useAppStore()
const authStore = useAuthStore()
const stats = computed(() => store.stats)
const topApps = computed(() => {
  const apps = store.hotApps || []
  return apps.slice(0, 10).sort((a, b) => (b.download_count || 0) - (a.download_count || 0))
})

const pendingIssues = ref(0)
const pendingSubmissions = ref(0)
const pendingDeletes = ref(0)
const barChartRef = ref(null)
let chartInstance = null

function formatNumber(n) {
  if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return (n / 1000).toFixed(1) + 'K'
  return String(n)
}

function initChart() {
  if (!barChartRef.value) return
  chartInstance = echarts.init(barChartRef.value)
  const names = topApps.value.map(a => (a.names?.en || a.uid).substring(0, 15))
  const downloads = topApps.value.map(a => a.download_count || 0)
  const views = topApps.value.map(a => a.view_count || 0)

  chartInstance.setOption({
    tooltip: { trigger: 'axis' },
    legend: { data: ['Downloads', 'Views'] },
    xAxis: { type: 'category', data: names, axisLabel: { rotate: 30 } },
    yAxis: { type: 'value' },
    series: [
      { name: 'Downloads', type: 'bar', data: downloads, itemStyle: { color: '#409eff' } },
      { name: 'Views', type: 'bar', data: views, itemStyle: { color: '#67c23a' } },
    ],
  })
}

async function fetchPendingStats() {
  try {
    const issueRes = await getIssues({ status: 'pending' })
    pendingIssues.value = issueRes.data?.total || 0
  } catch { /* ignore */ }

  if (authStore.isReviewer) {
    try {
      const subRes = await getSubmissions({ status: 'pending', type: 'new' })
      pendingSubmissions.value = subRes.data?.total || 0
    } catch { /* ignore */ }
    try {
      const delRes = await getSubmissions({ status: 'pending', type: 'delete' })
      pendingDeletes.value = delRes.data?.total || 0
    } catch { /* ignore */ }
  }
}

onMounted(async () => {
  await store.fetchStats()
  await store.fetchApps()
  await fetchPendingStats()
  setTimeout(initChart, 100)
})
</script>

<style scoped>
.stats-row { margin-bottom: 20px; }
.stat-card {
  display: flex;
  align-items: center;
  gap: 16px;
}
.stat-value {
  font-size: 24px;
  font-weight: 700;
  color: #303133;
}
.stat-label {
  font-size: 13px;
  color: #909399;
}
.top-app-item {
  display: flex;
  align-items: center;
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
}
.rank {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #409eff;
  color: #fff;
  border-radius: 50%;
  font-size: 12px;
  font-weight: 700;
  margin-right: 10px;
}
.name {
  flex: 1;
  font-size: 14px;
}
.count {
  color: #909399;
  font-size: 12px;
}
</style>
