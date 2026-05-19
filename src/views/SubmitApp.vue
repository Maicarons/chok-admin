<template>
  <div class="submit-app">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>Submit New App Data</span>
          <el-tag type="info">All fields marked * are required for English</el-tag>
        </div>
      </template>

      <el-form
        ref="formRef"
        :model="form"
        :rules="rules"
        label-width="140px"
        style="max-width: 800px"
      >
        <el-divider content-position="left">Basic Information</el-divider>

        <el-form-item label="UID *" prop="uid">
          <el-input v-model="form.uid" placeholder="e.g. 1005" />
        </el-form-item>

        <el-form-item label="Logo URL *" prop="logo">
          <el-input v-model="form.logo" placeholder="https://example.com/logo.png" />
        </el-form-item>

        <el-form-item label="Website">
          <el-input v-model="form.website" placeholder="https://example.com" />
        </el-form-item>

        <el-form-item label="License">
          <el-input v-model="form.license" placeholder="MIT, GPL-3.0, etc." />
        </el-form-item>

        <el-form-item label="Categories *" prop="categories">
          <el-select
            v-model="form.categories"
            multiple
            filterable
            allow-create
            placeholder="Select or type categories"
            style="width: 100%"
          >
            <el-option label="productivity" value="productivity" />
            <el-option label="tools" value="tools" />
            <el-option label="security" value="security" />
            <el-option label="design" value="design" />
            <el-option label="creativity" value="creativity" />
            <el-option label="utilities" value="utilities" />
            <el-option label="development" value="development" />
            <el-option label="education" value="education" />
            <el-option label="entertainment" value="entertainment" />
            <el-option label="social" value="social" />
          </el-select>
        </el-form-item>

        <el-form-item label="Tags">
          <el-select
            v-model="form.tags"
            multiple
            filterable
            allow-create
            placeholder="e.g. open-source, cross-platform"
            style="width: 100%"
          />
        </el-form-item>

        <el-divider content-position="left">English Content *</el-divider>

        <el-form-item label="Name (EN) *" prop="nameEn">
          <el-input v-model="form.nameEn" placeholder="App name in English" />
        </el-form-item>

        <el-form-item label="Summary (EN) *" prop="summaryEn">
          <el-input
            v-model="form.summaryEn"
            type="textarea"
            :rows="2"
            placeholder="Short description in English"
          />
        </el-form-item>

        <el-form-item label="Description (EN)">
          <el-input
            v-model="form.descriptionEn"
            type="textarea"
            :rows="4"
            placeholder="Full Markdown description in English"
          />
        </el-form-item>

        <el-divider content-position="left">Chinese (zh-CN)</el-divider>

        <el-form-item label="Name (zh-CN)">
          <el-input v-model="form.nameZhCN" placeholder="App name in Simplified Chinese" />
        </el-form-item>

        <el-form-item label="Summary (zh-CN)">
          <el-input
            v-model="form.summaryZhCN"
            type="textarea"
            :rows="2"
            placeholder="Short description in Simplified Chinese"
          />
        </el-form-item>

        <el-form-item label="Description (zh-CN)">
          <el-input
            v-model="form.descriptionZhCN"
            type="textarea"
            :rows="4"
            placeholder="Full description in Simplified Chinese"
          />
        </el-form-item>

        <el-divider content-position="left">Chinese (zh-TW)</el-divider>

        <el-form-item label="Name (zh-TW)">
          <el-input v-model="form.nameZhTW" placeholder="App name in Traditional Chinese" />
        </el-form-item>

        <el-form-item label="Summary (zh-TW)">
          <el-input
            v-model="form.summaryZhTW"
            type="textarea"
            :rows="2"
            placeholder="Short description in Traditional Chinese"
          />
        </el-form-item>

        <el-divider content-position="left">Japanese (ja)</el-divider>

        <el-form-item label="Name (ja)">
          <el-input v-model="form.nameJa" placeholder="App name in Japanese" />
        </el-form-item>

        <el-form-item label="Summary (ja)">
          <el-input
            v-model="form.summaryJa"
            type="textarea"
            :rows="2"
            placeholder="Short description in Japanese"
          />
        </el-form-item>

        <el-divider content-position="left">Downloads</el-divider>

        <el-form-item label="Android URL">
          <el-input v-model="form.downloadAndroid" placeholder="https://..." />
        </el-form-item>

        <el-form-item label="iOS URL">
          <el-input v-model="form.downloadIos" placeholder="https://..." />
        </el-form-item>

        <el-form-item label="Windows URL">
          <el-input v-model="form.downloadWindows" placeholder="https://..." />
        </el-form-item>

        <el-form-item label="macOS URL">
          <el-input v-model="form.downloadMacos" placeholder="https://..." />
        </el-form-item>

        <el-form-item label="Linux URL">
          <el-input v-model="form.downloadLinux" placeholder="https://..." />
        </el-form-item>

        <el-form-item label="Web URL">
          <el-input v-model="form.downloadWeb" placeholder="https://..." />
        </el-form-item>

        <el-divider content-position="left">Screenshots</el-divider>

        <el-form-item label="Screenshots">
          <el-input
            v-model="form.screenshots"
            type="textarea"
            :rows="3"
            placeholder="One URL per line"
          />
        </el-form-item>

        <el-form-item>
          <el-button type="primary" :loading="submitting" @click="submitForm">
            Submit for Review
          </el-button>
          <el-button @click="$router.back()">Cancel</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { createSubmission } from '../api'
import { ElMessage } from 'element-plus'

const router = useRouter()
const formRef = ref(null)
const submitting = ref(false)

const form = reactive({
  uid: '',
  logo: '',
  website: '',
  license: '',
  categories: [],
  tags: [],
  nameEn: '',
  summaryEn: '',
  descriptionEn: '',
  nameZhCN: '',
  summaryZhCN: '',
  descriptionZhCN: '',
  nameZhTW: '',
  summaryZhTW: '',
  nameJa: '',
  summaryJa: '',
  downloadAndroid: '',
  downloadIos: '',
  downloadWindows: '',
  downloadMacos: '',
  downloadLinux: '',
  downloadWeb: '',
  screenshots: '',
})

const rules = {
  uid: [{ required: true, message: 'UID is required', trigger: 'blur' }],
  logo: [{ required: true, message: 'Logo URL is required', trigger: 'blur' }],
  categories: [{ type: 'array', required: true, min: 1, message: 'At least one category', trigger: 'change' }],
  nameEn: [{ required: true, message: 'English name is required', trigger: 'blur' }],
  summaryEn: [{ required: true, message: 'English summary is required', trigger: 'blur' }],
}

function buildDownloadUrls() {
  const downloads = {}
  if (form.downloadAndroid) downloads.android = [form.downloadAndroid]
  if (form.downloadIos) downloads.ios = [form.downloadIos]
  if (form.downloadWindows) downloads.windows = [form.downloadWindows]
  if (form.downloadMacos) downloads.macos = [form.downloadMacos]
  if (form.downloadLinux) downloads.linux = [form.downloadLinux]
  if (form.downloadWeb) downloads.web = [form.downloadWeb]
  return downloads
}

function parseScreenshots() {
  return form.screenshots
    .split('\n')
    .map(s => s.trim())
    .filter(Boolean)
}

async function submitForm() {
  const valid = await formRef.value.validate().catch(() => false)
  if (!valid) return

  submitting.value = true
  try {
    const now = new Date().toISOString()
    const base = {
      uid: form.uid,
      logo: form.logo,
      website: form.website,
      license: form.license,
      categories: form.categories,
      tags: form.tags,
      downloads: buildDownloadUrls(),
      screenshots: parseScreenshots(),
      created_at: now,
      updated_at: now,
    }

    const data = [
      {
        ...base,
        name: form.nameEn,
        summary: form.summaryEn,
        description: form.descriptionEn,
      },
    ]

    // Add other languages if provided
    if (form.nameZhCN || form.summaryZhCN) {
      data.push({
        uid: form.uid,
        name: form.nameZhCN || form.nameEn,
        summary: form.summaryZhCN || form.summaryEn,
        description: form.descriptionZhCN || '',
      })
    }
    if (form.nameZhTW || form.summaryZhTW) {
      data.push({
        uid: form.uid,
        name: form.nameZhTW || form.nameEn,
        summary: form.summaryZhTW || form.summaryEn,
        description: '',
      })
    }
    if (form.nameJa || form.summaryJa) {
      data.push({
        uid: form.uid,
        name: form.nameJa || form.nameEn,
        summary: form.summaryJa || form.summaryEn,
        description: '',
      })
    }

    await createSubmission({ uid: form.uid, type: 'new', data })
    ElMessage.success('App submitted for review')
    router.push('/submissions')
  } catch {
    ElMessage.error('Failed to submit app')
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.submit-app {
  max-width: 960px;
  margin: 0 auto;
}
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
