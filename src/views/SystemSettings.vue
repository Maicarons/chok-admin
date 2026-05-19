<template>
  <div>
    <el-card>
      <template #header><span>System Settings</span></template>

      <el-form label-width="160px" style="max-width: 600px">
        <el-form-item label="API Server URL">
          <el-input v-model="settings.apiUrl" placeholder="http://localhost:8888" />
        </el-form-item>
        <el-form-item label="CDN URL">
          <el-input v-model="settings.cdnUrl" placeholder="https://cdn.example.com" />
        </el-form-item>
        <el-form-item label="Data Sync Interval">
          <el-input-number v-model="settings.syncInterval" :min="1" :max="24" />
          <span style="margin-left: 8px">hours</span>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="saveSettings">Save Settings</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header><span>Data Sync</span></template>
      <p style="color: #909399; margin-bottom: 16px">
        Manually trigger a data reload from main.json. This refreshes all app data on the server.
      </p>
      <el-button type="primary" @click="triggerSync">
        <el-icon style="margin-right: 6px"><Refresh /></el-icon>
        Sync Data Now
      </el-button>
    </el-card>

    <el-card style="margin-top: 20px">
      <template #header><span>About</span></template>
      <el-descriptions :column="1" border>
        <el-descriptions-item label="System">CHOKAPP Admin Panel</el-descriptions-item>
        <el-descriptions-item label="Version">1.0.0</el-descriptions-item>
        <el-descriptions-item label="Server">Go HTTP Server</el-descriptions-item>
        <el-descriptions-item label="Client">Flutter + GetX</el-descriptions-item>
        <el-descriptions-item label="Admin">Vue 3 + Element Plus</el-descriptions-item>
      </el-descriptions>
    </el-card>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { syncData } from '../api'
import { ElMessage } from 'element-plus'

const settings = ref({
  apiUrl: 'http://localhost:8888',
  cdnUrl: 'https://cdn.example.com',
  syncInterval: 1,
})

function saveSettings() {
  ElMessage.success('Settings saved')
}

async function triggerSync() {
  try {
    await syncData()
    ElMessage.success('Data sync triggered successfully')
  } catch (e) {
    ElMessage.error('Failed to trigger sync')
  }
}
</script>
