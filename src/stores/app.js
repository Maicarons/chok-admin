import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getStats, getHotApps, getLatestApps } from '../api'

export const useAppStore = defineStore('app', () => {
  const stats = ref(null)
  const hotApps = ref([])
  const latestApps = ref([])
  const loading = ref(false)

  async function fetchStats() {
    try {
      const res = await getStats()
      stats.value = res.data
    } catch (e) {
      console.error('Failed to fetch stats:', e)
    }
  }

  async function fetchApps() {
    loading.value = true
    try {
      const [hot, latest] = await Promise.all([
        getHotApps(50),
        getLatestApps(50),
      ])
      hotApps.value = hot.data || []
      latestApps.value = latest.data || []
    } catch (e) {
      console.error('Failed to fetch apps:', e)
    } finally {
      loading.value = false
    }
  }

  return { stats, hotApps, latestApps, loading, fetchStats, fetchApps }
})
