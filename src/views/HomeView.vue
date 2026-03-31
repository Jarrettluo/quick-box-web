<template>
  <div class="container">
    <header>
      <div class="header-content">
        <div class="title-area">
          <h1 class="logo">{{ $t('app.logo') }}</h1>
          <p class="slogan">{{ $t('app.slogan') }}</p>
        </div>
        <LanguageSelector />
      </div>
    </header>

    <div class="card">
      <div class="tab-container">
        <button
            class="tab"
            :class="{ active: activeTab === 'folder-upload' }"
            @click="switchTab('folder-upload')"
        >
          {{ $t('tabs.folderUpload') }}
        </button>
        <button
            class="tab"
            :class="{ active: activeTab === 'upload' }"
            @click="switchTab('upload')"
        >
          {{ $t('tabs.fileUpload') }}
        </button>
        <button
            class="tab"
            :class="{ active: activeTab === 'download' }"
            @click="switchTab('download')"
        >
          {{ $t('tabs.download') }}
        </button>
      </div>
      <!-- 上传文件夹区域 -->
      <div v-if="activeTab === 'folder-upload'" class="tab-content">
        <form v-if="!folderUploaded" @submit.prevent="handleFolderUpload">
          <div class="form-group">
            <label for="folder">{{ $t('upload.selectFolder') }}</label>

            <!-- 文件夹选择区域 -->
            <div class="file-input-container">
              <input
                  type="file"
                  id="folder"
                  ref="folderInput"
                  @change="handleFolderChange"
                  required
                  :disabled="folderUploading"
                  class="file-input"
                  webkitdirectory
                  directory
                  multiple
              >
              <label for="folder" class="file-input-label" :class="{ 'disabled': folderUploading }">
                <div class="file-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                  </svg>
                </div>
                <div class="file-input-text">
                  <span v-if="!selectedFolder || selectedFolder.length === 0">{{ $t('upload.clickSelectFolder') }}</span>
                  <span v-else class="file-selected">{{ selectedFolderName }}</span>
                  <p class="file-input-hint">{{ $t('upload.folderHint') }}</p>
                </div>
              </label>
            </div>

            <!-- 文件夹信息卡片 -->
            <div v-if="selectedFolder && selectedFolder.length > 0" class="file-info-card">
              <div class="file-info-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="file-icon">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
                </svg>
                <div class="file-info-main">
                  <h4 class="file-name">{{ selectedFolderName }}</h4>
                  <p class="file-size">{{ folderFileCount }} {{ $t('upload.filesCount') }} {{ formatFileSize(folderTotalSize) }}</p>
                </div>
                <button v-if="!folderUploading" type="button" class="file-remove-btn" @click="removeFolder" :title="$t('upload.removeFolder') || '移除文件夹'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 上传进度区域 -->
            <div v-if="folderUploading" class="upload-progress-container">
              <div class="progress-header">
                <span class="progress-title">{{ $t('upload.uploadProgress') }}</span>
                <span class="progress-percent">{{ folderUploadProgress }}%</span>
              </div>

              <!-- 自定义进度条 -->
              <div class="custom-progress-bar">
                <div
                    class="custom-progress-fill"
                    :style="{ width: folderUploadProgress + '%' }"
                ></div>
              </div>

              <!-- 文件进度信息 -->
              <div v-if="folderCurrentFile > 0" class="chunk-info-container">
                <div class="chunk-stats">
                  <span class="chunk-label">{{ $t('upload.fileProgress') }}</span>
                  <span class="chunk-value">{{ folderCurrentFile }}/{{ folderTotalFiles }}</span>
                </div>
                <div class="chunk-progress-bar">
                  <div
                      class="chunk-progress-fill"
                      :style="{ width: (folderCurrentFile / folderTotalFiles * 100) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- 上传状态 -->
              <div class="upload-status">
                <div class="status-dot" :class="{ 'active': folderUploading }"></div>
                <span class="status-text">
                  {{ folderUploading ? $t('upload.uploading') : $t('upload.prepare') }}
                </span>
              </div>
            </div>

            <!-- 错误信息 -->
            <div v-if="folderUploadError" class="error-message-card">
              <div class="error-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ $t('upload.uploadFailed') }}</span>
              </div>
              <p class="error-details">{{ folderUploadError }}</p>
            </div>
          </div>

          <div class="notice">
            <strong>{{ $t('upload.noticeTitle') || '使用说明：' }}</strong> {{ $t('upload.folderNotice') }}
          </div>

          <button
              type="submit"
              class="btn btn-block upload-btn"
              :disabled="!selectedFolder || selectedFolder.length === 0 || folderUploading"
              :class="{ 'uploading': folderUploading }"
          >
            <span v-if="folderUploading" class="btn-loading">
              <span class="loading-spinner"></span>
              {{ $t('upload.uploadingBtn') }}
            </span>
            <span v-else>
              {{ $t('upload.generateCode') }}
            </span>
          </button>
        </form>

        <!-- 上传结果区域 -->
        <div v-if="folderUploaded && fileStore.fileInfo && fileStore.pickupCode" class="result-container">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>{{ $t('result.codeGenerated') }}</h3>
          <p class="success-message">{{ $t('result.folderUploadSuccess') }}</p>
          <div
              class="code-display"
              @click="copyCode"
              :title="$t('result.clickToCopy')"
          >
            {{ fileStore.pickupCode }}
          </div>
          <p class="expiry-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 style="vertical-align: middle; margin-right: 6px;">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ $t('result.expires') }}: {{ fileStore.fileInfo.expires }}
          </p>
          <div class="action-buttons">
            <button class="btn btn-action copy-btn" @click="copyCode">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   style="margin-right: 8px;">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              {{ $t('result.copyCode') }}
            </button>
            <button class="btn btn-action share-btn" @click="copyLink">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   style="margin-right: 8px;">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              {{ $t('result.shareLink') }}
            </button>
          </div>
          <button class="btn btn-block new-upload-btn" @click="resetFolderUpload">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 style="margin-right: 8px;">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            {{ $t('result.uploadNewFolder') }}
          </button>
        </div>
      </div>

      <!-- 上传文件区域 -->
      <div v-if="activeTab === 'upload'" class="tab-content">
        <form v-if="!isUploaded" @submit.prevent="handleUpload">
          <div class="form-group">
            <label for="file">{{ $t('upload.selectFile') }}</label>

            <!-- 改进的文件选择区域 -->
            <div class="file-input-container">
              <input
                  type="file"
                  id="file"
                  ref="fileInput"
                  @change="handleFileChange"
                  required
                  :disabled="isUploading"
                  class="file-input"
              >
              <label for="file" class="file-input-label" :class="{ 'disabled': isUploading }">
                <div class="file-input-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                </div>
                <div class="file-input-text">
                  <span v-if="!selectedFile">{{ $t('upload.clickSelectFile') }}</span>
                  <span v-else class="file-selected">{{ selectedFile.name }}</span>
                  <p class="file-input-hint">{{ $t('upload.fileHint') }}</p>
                </div>
              </label>
            </div>

            <!-- 文件信息卡片 -->
            <div v-if="selectedFile" class="file-info-card">
              <div class="file-info-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                     class="file-icon">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
                <div class="file-info-main">
                  <h4 class="file-name">{{ selectedFile.name }}</h4>
                  <p class="file-size">{{ formatFileSize(selectedFile.size) }}</p>
                </div>
                <button v-if="!isUploading" type="button" class="file-remove-btn" @click="removeFile" :title="$t('upload.removeFile') || '移除文件'">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                       stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>

            <!-- 上传进度区域 -->
            <div v-if="isUploading" class="upload-progress-container">
              <div class="progress-header">
                <span class="progress-title">{{ $t('upload.uploadProgress') }}</span>
                <span class="progress-percent">{{ uploadProgress }}%</span>
              </div>

              <!-- 自定义进度条 -->
              <div class="custom-progress-bar">
                <div
                    class="custom-progress-fill"
                    :style="{ width: uploadProgress + '%' }"
                ></div>
              </div>

              <!-- 分片信息 -->
              <div v-if="currentChunk > 0" class="chunk-info-container">
                <div class="chunk-stats">
                  <span class="chunk-label">{{ $t('upload.chunkProgress') }}</span>
                  <span class="chunk-value">{{ currentChunk }}/{{ totalChunks }}</span>
                </div>
                <div class="chunk-progress-bar">
                  <div
                      class="chunk-progress-fill"
                      :style="{ width: (currentChunk / totalChunks * 100) + '%' }"
                  ></div>
                </div>
              </div>

              <!-- 上传状态 -->
              <div class="upload-status">
                <div class="status-dot" :class="{ 'active': isUploading }"></div>
                <span class="status-text">
                  {{ isUploading ? $t('upload.uploading') : $t('upload.prepare') }}
                </span>
              </div>
            </div>

            <!-- 错误信息 -->
            <div v-if="uploadError" class="error-message-card">
              <div class="error-header">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                     stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <span>{{ $t('upload.uploadFailed') }}</span>
              </div>
              <p class="error-details">{{ uploadError }}</p>
            </div>
          </div>

          <div class="notice">
            <strong>{{ $t('upload.noticeTitle') || '使用说明：' }}</strong> {{ $t('upload.notice') }}
          </div>

          <button
              type="submit"
              class="btn btn-block upload-btn"
              :disabled="!selectedFile || isUploading"
              :class="{ 'uploading': isUploading }"
          >
            <span v-if="isUploading" class="btn-loading">
              <span class="loading-spinner"></span>
              {{ $t('upload.uploadingBtn') }}
            </span>
            <span v-else>
              {{ $t('upload.generateCode') }}
            </span>
          </button>
        </form>

        <!-- 上传结果区域 -->
        <div v-if="isUploaded && fileStore.fileInfo && fileStore.pickupCode" class="result-container">
          <div class="success-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
          </div>
          <h3>{{ $t('result.codeGenerated') }}</h3>
          <p class="success-message">{{ $t('result.fileUploadSuccess') }}</p>
          <div
              class="code-display"
              @click="copyCode"
              :title="$t('result.clickToCopy')"
          >
            {{ fileStore.pickupCode }}
          </div>
          <p class="expiry-info">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 style="vertical-align: middle; margin-right: 6px;">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {{ $t('result.expires') }}: {{ fileStore.fileInfo.expires }}
          </p>
          <div class="action-buttons">
            <button class="btn btn-action copy-btn" @click="copyCode">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   style="margin-right: 8px;">
                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
              </svg>
              {{ $t('result.copyCode') }}
            </button>
            <button class="btn btn-action share-btn" @click="copyLink">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   style="margin-right: 8px;">
                <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                <polyline points="16 6 12 2 8 6"></polyline>
                <line x1="12" y1="2" x2="12" y2="15"></line>
              </svg>
              {{ $t('result.shareLink') }}
            </button>
          </div>
          <button class="btn btn-block new-upload-btn" @click="resetUpload">
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 style="margin-right: 8px;">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="17 8 12 3 7 8"></polyline>
              <line x1="12" y1="3" x2="12" y2="15"></line>
            </svg>
            {{ $t('result.uploadNew') }}
          </button>
        </div>

        <FileCard v-if="isUploaded && fileStore.fileInfo" :file="fileStore.fileInfo"/>

        <HistoryView></HistoryView>
      </div>

      <!-- 提取文件区域 -->
      <div v-if="activeTab === 'download'" class="tab-content">
        <form @submit.prevent="handleDownload">
          <div class="form-group">
            <label for="code">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   style="vertical-align: middle; margin-right: 8px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
              {{ $t('download.inputCode') }}
            </label>

            <!-- 改进的取件码输入区域 -->
            <div class="code-input-container">
              <input
                  type="text"
                  id="code"
                  v-model="downloadCode"
                  :placeholder="$t('download.placeholder')"
                  required
                  maxlength="6"
                  class="code-input-enhanced"
                  :class="{ 'has-value': downloadCode.length > 0 }"
              >
              <div class="code-input-hint">
                <span v-if="downloadCode.length === 0">{{ $t('download.enterCode') }}</span>
                <span v-else class="code-length-indicator">
                  {{ $t('download.entered') }} {{ downloadCode.length }}/6 {{ $t('download.bits') }}
                </span>
              </div>
            </div>
          </div>

          <div class="notice download-notice">
            <div class="notice-header">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none"
                   stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                   style="vertical-align: middle; margin-right: 8px;">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <strong>{{ $t('download.importantNotice') }}</strong>
            </div>
            <div class="notice-content">
              <p>{{ $t('download.notice1') }}</p>
              <p>{{ $t('download.notice2') }}</p>
              <p>{{ $t('download.notice3') }}</p>
            </div>
          </div>

          <button
              type="submit"
              class="btn btn-block download-btn"
              :disabled="!downloadCode || downloadCode.length !== 6"
              :class="{ 'disabled': !downloadCode || downloadCode.length !== 6 }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
                 stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                 style="margin-right: 10px;">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            {{ $t('download.extractFile') }}
          </button>
        </form>
      </div>
    </div>

    <!-- 使用弹窗组件 -->
    <Modal
        :isVisible="showModal"
        :title="$t('modal.shareLink')"
        @close="showModal = false"
        @confirm="handleConfirm"
    >
      <!-- 这里引入另一个组件的内容 -->
      <ModalContent/>
    </Modal>

    <!-- 分享下载链接弹窗 -->
    <ShareModal
        :isVisible="showShareModal"
        :link="downloadLink"
        @close="showShareModal = false"
        @link-copied="showShareModal = false"
    />

    <footer>
      <p>{{ $t('app.footer') }}</p>
    </footer>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useFileStore} from '../stores/fileStore'
import FileCard from '../components/FileCard.vue'
import {FileUploadService} from '@/api/index.js'
import {FolderUploadService} from '@/api/fileService.js'
import HistoryView from "@/views/HistoryView.vue";
import message from "@/utils/message.js";

import Modal from '../components/Modal.vue';
import ModalContent from '../components/ModalContent.vue';
import ShareModal from '../components/ShareModal.vue';
import {copyPickupCode} from "@/utils/clipboard.js";
import LanguageSelector from '../components/LanguageSelector.vue';

const { t } = useI18n()
const activeTab = ref('upload')
const fileInput = ref(null)
const selectedFile = ref(null)
const folderInput = ref(null)
const selectedFolder = ref(null)
const downloadCode = ref('')
const isUploaded = ref(false)
const isUploading = ref(false)
const folderUploaded = ref(false)
const folderUploading = ref(false)
const uploadProgress = ref(0)
const folderUploadProgress = ref(0)
const currentChunk = ref(0)
const totalChunks = ref(0)
const folderCurrentFile = ref(0)
const folderTotalFiles = ref(0)
const folderCurrentChunk = ref(0)
const uploadError = ref('')
const folderUploadError = ref('')

const fileStore = useFileStore()
const router = useRouter()

const showModal = ref(false)
const showShareModal = ref(false)

// 计算下载链接
const downloadLink = computed(() => {
  if (!fileStore.pickupCode) return ''
  const baseUrl = window.location.origin
  return `${baseUrl}/result/${fileStore.pickupCode}`
})

// 文件夹相关信息计算属性
const selectedFolderName = computed(() => {
  if (!selectedFolder.value || selectedFolder.value.length === 0) return ''
  // 尝试从第一个文件中获取文件夹路径
  const firstFile = selectedFolder.value[0]
  if (firstFile.webkitRelativePath) {
    const parts = firstFile.webkitRelativePath.split('/')
    if (parts.length > 1) {
      return parts[0] // 返回顶层文件夹名
    }
  }
  return '文件夹'
})

const folderFileCount = computed(() => {
  return selectedFolder.value ? selectedFolder.value.length : 0
})

const folderTotalSize = computed(() => {
  if (!selectedFolder.value) return 0
  return Array.from(selectedFolder.value).reduce((total, file) => total + file.size, 0)
})

// 创建文件上传服务实例
const uploadService = new FileUploadService({
  chunkSize: 5 * 1024 * 1024, // 5MB
  concurrentUploads: 3,
  maxRetries: 3
})

// 创建文件夹上传服务实例
const folderUploadService = new FolderUploadService({
  chunkSize: 5 * 1024 * 1024, // 5MB
  concurrentUploads: 3,
  maxRetries: 3
})

const switchTab = (tab) => {
  activeTab.value = tab
}

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0]
  uploadError.value = ''
}

const handleFolderChange = (event) => {
  selectedFolder.value = event.target.files
  folderUploadError.value = ''
}

const removeFile = () => {
  selectedFile.value = null
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const removeFolder = () => {
  selectedFolder.value = null
  if (folderInput.value) {
    folderInput.value.value = ''
  }
}

const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

const handleUpload = async () => {
  if (!selectedFile.value) return

  isUploading.value = true
  uploadError.value = ''
  uploadProgress.value = 0
  currentChunk.value = 0

  try {
    // 使用分片上传服务
    const fileCode = await uploadService.uploadFile(selectedFile.value, {
      onProgress: (percent) => {
        uploadProgress.value = percent
      },
      onChunkUploaded: (chunkIndex) => {
        currentChunk.value = chunkIndex
      },
      onError: (error) => {
        uploadError.value = error.message || t('upload.uploadFailed')
      }
    })

    // 上传成功，设置取件码和文件信息
    fileStore.pickupCode = fileCode
    fileStore.fileInfo = {
      name: selectedFile.value.name,
      size: formatFileSize(selectedFile.value.size),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }

    // 保存到历史记录
    await fileStore.setUploadResult(fileCode, {
      name: selectedFile.value.name,
      size: selectedFile.value.size
    })

    isUploaded.value = true

  } catch (error) {
    uploadError.value = error.message || t('upload.uploadFailed') + ', please retry'
  } finally {
    isUploading.value = false
  }
}

const handleFolderUpload = async () => {
  if (!selectedFolder.value || selectedFolder.value.length === 0) return

  folderUploading.value = true
  folderUploadError.value = ''
  folderUploadProgress.value = 0
  folderCurrentFile.value = 0
  folderTotalFiles.value = selectedFolder.value.length
  folderCurrentChunk.value = 0

  try {
    // 使用文件夹上传服务
    const folderName = selectedFolderName.value || 'untitled_folder'
    const result = await folderUploadService.uploadFolder(selectedFolder.value, folderName, {
      onProgress: (progressInfo) => {
        folderUploadProgress.value = progressInfo.overallProgress
        folderCurrentFile.value = progressInfo.uploadedFiles
        folderTotalFiles.value = progressInfo.totalFiles
      },
      onFileProgress: (fileProgress) => {
        // 可以用于显示当前文件的上传进度，但这里我们主要使用整体进度
      },
      onError: (error) => {
        folderUploadError.value = error.message || t('upload.uploadFailed')
      },
      keepStructure: true,
      autoZip: true,
      metadata: {}
    })

    // 上传成功，设置取件码和文件信息
    fileStore.pickupCode = result.accessCode || result.fileCode
    fileStore.fileInfo = {
      name: folderName,
      size: formatFileSize(folderTotalSize.value),
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    }

    // 保存到历史记录（可能需要适配文件夹）
    await fileStore.setUploadResult(fileStore.pickupCode, {
      name: folderName,
      size: folderTotalSize.value
    })

    folderUploaded.value = true

  } catch (error) {
    folderUploadError.value = error.message || t('upload.uploadFailed') + ', please retry'
  } finally {
    folderUploading.value = false
  }
}

const copyCode = async () => {
  if (fileStore.pickupCode) {
    const success = await copyPickupCode(
        fileStore.pickupCode,
        (code) => {
          message.success(t('message.codeCopied', { code: code }))
        },
        () => {
          message.error(t('message.copyCodeFailed'))
        }
    )

    if (!success) {
      // 如果复制失败，显示取件码让用户手动复制
      message.info(`${t('message.codeCopied', { code: fileStore.pickupCode })}`)
    }
  } else {
    message.error(t('message.noCode'))
  }
}


const copyLink = () => {
  if (fileStore.pickupCode) {
    showShareModal.value = true
  } else {
    message.error(t('message.generateCodeFirst'))
  }
}

const resetUpload = () => {
  isUploaded.value = false
  isUploading.value = false
  selectedFile.value = null
  uploadProgress.value = 0
  currentChunk.value = 0
  totalChunks.value = 0
  uploadError.value = ''

  if (fileInput.value) {
    fileInput.value.value = ''
  }

  fileStore.clearUploadResult()
}

const resetFolderUpload = () => {
  folderUploaded.value = false
  folderUploading.value = false
  selectedFolder.value = null
  folderUploadProgress.value = 0
  folderCurrentFile.value = 0
  folderTotalFiles.value = 0
  folderCurrentChunk.value = 0
  folderUploadError.value = ''

  if (folderInput.value) {
    folderInput.value.value = ''
  }

  fileStore.clearUploadResult()
}

const handleDownload = () => {
  if (!downloadCode.value) return
  router.push({
    path: `/result/${downloadCode.value}`,
    query: {isUploader: true}
  })
}

const handleConfirm = () => {
  alert(t('modal.confirm'))
  showModal.value = false
}

</script>

<style scoped>


* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Arial, sans-serif;
}

.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

header {
  text-align: center;
  margin: 40px 0;
}

.header-content {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.title-area {
  text-align: center;
}

.logo {
  font-size: 2.5rem;
  font-weight: bold;
  color: var(--primary);
  margin-bottom: 10px;
}

.slogan {
  color: var(--gray);
  font-size: 1.1rem;
}

.card {
  background: var(--light);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  padding: 30px;
  margin-bottom: 30px;
  border: 1px solid var(--border);
}

.tab-container {
  display: flex;
  margin-bottom: 25px;
  border-bottom: 1px solid var(--border);
  gap: 10px;
}

.tab {
  padding: 12px 24px;
  cursor: pointer;
  font-weight: 500;
  background: none;
  border: none;
  outline: none;
  color: var(--gray);
  font-size: 1rem;
  transition: all 0.3s ease;
  border-bottom: 2px solid transparent;
  position: relative;
}

.tab:hover {
  color: var(--primary);
}

.tab.active {
  color: var(--primary);
  border-bottom: 2px solid var(--primary);
  font-weight: 600;
}

.tab-content {
  display: block;
}

.form-group {
  margin-bottom: 25px;
}

label {
  display: block;
  margin-bottom: 10px;
  font-weight: 600;
  color: var(--gray-dark);
  font-size: 0.95rem;
}

/* 文件选择区域样式 */
.file-input-container {
  position: relative;
  margin-bottom: 15px;
}

.file-input {
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 2;
}

.file-input-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--gray-light);
  border: 2px dashed var(--border);
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  min-height: 180px;
}

.file-input-label:hover {
  border-color: var(--primary-light);
  background: rgba(74, 107, 223, 0.05);
}

.file-input-label.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.file-input-label.disabled:hover {
  border-color: var(--border);
  background: var(--gray-light);
}

.file-input-icon {
  margin-bottom: 15px;
  color: var(--primary);
}

.file-input-icon svg {
  width: 48px;
  height: 48px;
}

.file-input-text {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-input-text span {
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--gray-dark);
}

.file-selected {
  color: var(--primary) !important;
  font-weight: 600 !important;
}

.file-input-hint {
  font-size: 0.9rem;
  color: var(--gray);
  margin-top: 5px;
}

/* 文件信息卡片 */
.file-info-card {
  background: var(--light);
  border: 1px solid var(--border);
  border-radius: 10px;
  padding: 16px;
  margin-top: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.file-info-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.file-icon {
  color: var(--primary);
  flex-shrink: 0;
}

.file-info-main {
  flex: 1;
  min-width: 0;
}

.file-name {
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--gray-dark);
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.file-size {
  font-size: 0.85rem;
  color: var(--gray);
}

.file-remove-btn {
  background: none;
  border: none;
  color: var(--gray);
  cursor: pointer;
  padding: 6px;
  border-radius: 6px;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.file-remove-btn:hover {
  background: var(--gray-light);
  color: var(--danger);
}

/* 上传进度区域 */
.upload-progress-container {
  background: var(--gray-light);
  border-radius: 10px;
  padding: 20px;
  margin-top: 20px;
  border: 1px solid var(--border);
}

.progress-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}

.progress-title {
  font-weight: 600;
  color: var(--gray-dark);
  font-size: 1rem;
}

.progress-percent {
  font-weight: 700;
  color: var(--primary);
  font-size: 1.1rem;
}

/* 自定义进度条 */
.custom-progress-bar {
  height: 10px;
  background: var(--border);
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 20px;
}

.custom-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, var(--primary-light), var(--primary));
  border-radius: 5px;
  transition: width 0.3s ease;
}

/* 分片信息 */
.chunk-info-container {
  background: var(--light);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 15px;
  margin-bottom: 15px;
}

.chunk-stats {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.chunk-label {
  font-size: 0.9rem;
  color: var(--gray);
}

.chunk-value {
  font-weight: 600;
  color: var(--primary);
  font-size: 0.9rem;
}

.chunk-progress-bar {
  height: 6px;
  background: var(--border);
  border-radius: 3px;
  overflow: hidden;
}

.chunk-progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #4a6bdf, #6a8bff);
  border-radius: 3px;
  transition: width 0.3s ease;
}

/* 上传状态 */
.upload-status {
  display: flex;
  align-items: center;
  gap: 10px;
}

.status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--gray);
  transition: all 0.3s ease;
}

.status-dot.active {
  background: var(--success);
  box-shadow: 0 0 0 3px rgba(40, 167, 69, 0.2);
  animation: pulse 1.5s infinite;
}

.status-text {
  font-size: 0.9rem;
  color: var(--gray-dark);
}

/* 错误信息卡片 */
.error-message-card {
  background: #fff5f5;
  border: 1px solid #fcc;
  border-radius: 10px;
  padding: 16px;
  margin-top: 15px;
}

.error-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.error-header svg {
  color: var(--danger);
}

.error-header span {
  font-weight: 600;
  color: var(--danger);
}

.error-details {
  font-size: 0.9rem;
  color: #c00;
  margin: 0;
  line-height: 1.5;
}

/* 按钮样式 */
.btn {
  background: var(--primary);
  color: white;
  border: none;
  padding: 14px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.btn:hover {
  background: var(--primary-dark);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 107, 223, 0.3);
}

.btn:active {
  transform: translateY(0);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none !important;
  box-shadow: none !important;
}

.btn-block {
  display: block;
  width: 100%;
}

.upload-btn {
  margin-top: 10px;
  font-size: 1.05rem;
  padding: 16px;
}

.upload-btn.uploading {
  background: var(--gray);
}

.btn-loading {
  display: flex;
  align-items: center;
  gap: 10px;
}

.loading-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s linear infinite;
}

/* 通知区域 */
.notice {
  background: #f1f8ff;
  padding: 16px;
  border-radius: 8px;
  margin: 20px 0;
  font-size: 0.9rem;
  color: var(--gray-dark);
  border-left: 4px solid var(--primary);
}

.notice strong {
  color: var(--primary);
}

/* 上传结果区域 */
.result-container {
  text-align: center;
  padding: 30px 20px;
  background: var(--gray-light);
  border-radius: 12px;
  margin-top: 20px;
}

.success-icon {
  margin-bottom: 20px;
}

.success-icon svg {
  color: var(--success);
}

.success-message {
  color: var(--gray);
  margin-bottom: 20px;
  font-size: 1rem;
}

.code-display {
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: 3px;
  color: var(--primary);
  margin: 20px 0;
  padding: 20px;
  background: var(--light);
  border-radius: 10px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
  border: 2px solid transparent;
}

.code-display:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
  border-color: var(--primary-light);
}

.code-display:active {
  transform: translateY(0);
}

.expiry-info {
  color: var(--gray);
  margin-bottom: 25px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-buttons {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.btn-action {
  flex: 1;
  padding: 12px;
  font-size: 0.95rem;
}

.copy-btn {
  background: var(--success);
}

.copy-btn:hover {
  background: #218838;
}

.share-btn {
  background: var(--primary);
}

.share-btn:hover {
  background: var(--primary-dark);
}

.new-upload-btn {
  background: var(--light);
  color: var(--primary);
  border: 2px solid var(--primary);
}

.new-upload-btn:hover {
  background: var(--primary);
  color: var(--light);
}

/* 输入框样式 */
.code-input {
  width: 100%;
  padding: 14px;
  border: 2px solid var(--border);
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  letter-spacing: 2px;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
}

.code-input:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(74, 107, 223, 0.2);
}

.code-input::placeholder {
  color: var(--gray);
  font-weight: normal;
  letter-spacing: normal;
  text-transform: none;
}

/* 页脚 */
footer {
  text-align: center;
  margin-top: 50px;
  color: var(--gray);
  font-size: 0.9rem;
  padding: 20px 0;
  border-top: 1px solid var(--border);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .container {
    padding: 12px;
    margin: 0;
  }

  .header-content {
    flex-direction: column;
    gap: 15px;
  }

  .card {
    padding: 18px;
    border-radius: 16px;
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.06);
  }

  header {
    margin: 20px 0 25px;
  }

  .logo {
    font-size: 1.8rem;
    margin-bottom: 8px;
  }

  .slogan {
    font-size: 0.9rem;
  }

  .tab-container {
    margin-bottom: 20px;
    gap: 8px;
  }

  .tab {
    padding: 10px 18px;
    font-size: 0.9rem;
    border-radius: 8px 8px 0 0;
  }

  .file-input-label {
    padding: 25px 12px;
    min-height: 140px;
  }

  .file-input-icon svg {
    width: 36px;
    height: 36px;
  }

  .file-input-text span {
    font-size: 1rem;
  }

  .code-input-enhanced {
    font-size: 1.2rem;
    padding: 16px;
    letter-spacing: 3px;
  }

  .code-display {
    font-size: 1.8rem;
    padding: 15px;
    letter-spacing: 2px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 10px;
  }

  .btn-action {
    width: 100%;
    padding: 14px;
    font-size: 1rem;
  }

  .example-codes {
    gap: 8px;
  }

  .example-code {
    padding: 6px 10px;
    font-size: 0.85rem;
  }

  .download-notice {
    padding: 16px;
    margin: 20px 0;
  }

  .notice-header strong {
    font-size: 0.95rem;
  }

  .notice-content {
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 8px;
  }

  .card {
    padding: 14px;
    border-radius: 14px;
  }

  header {
    margin: 16px 0 20px;
  }

  .logo {
    font-size: 1.6rem;
  }

  .slogan {
    font-size: 0.85rem;
  }

  .tab-container {
    flex-direction: column;
    gap: 6px;
    border-bottom: none;
  }

  .tab {
    width: 100%;
    text-align: center;
    border-radius: 8px;
    padding: 12px 16px;
    border: 1px solid var(--border);
    background: var(--gray-light);
  }

  .tab.active {
    border-color: var(--primary);
    background: rgba(74, 107, 223, 0.1);
  }

  .file-input-label {
    padding: 20px 10px;
    min-height: 120px;
  }

  .file-input-icon svg {
    width: 32px;
    height: 32px;
  }

  .file-input-text span {
    font-size: 0.95rem;
  }

  .code-input-enhanced {
    font-size: 1.1rem;
    padding: 14px;
    letter-spacing: 2px;
  }

  .code-display {
    font-size: 1.6rem;
    padding: 12px;
  }

  .upload-progress-container {
    padding: 12px;
  }

  .upload-progress-container h3 {
    font-size: 1rem;
  }

  .progress-percent {
    font-size: 1rem;
  }

  .example-codes {
    flex-direction: column;
    align-items: center;
  }

  .example-code {
    width: 100%;
    text-align: center;
  }

  .download-notice {
    padding: 14px;
    margin: 15px 0;
  }

  footer {
    margin-top: 30px;
    padding: 15px 0;
    font-size: 0.8rem;
  }
}

/* 取件码输入容器 */
.code-input-container {
  margin-bottom: 20px;
}

/* 增强的取件码输入框 */
.code-input-enhanced {
  width: 100%;
  padding: 18px 20px;
  border: 2px solid var(--border);
  border-radius: 10px;
  font-size: 1.4rem;
  font-weight: 700;
  letter-spacing: 4px;
  text-align: center;
  text-transform: uppercase;
  transition: all 0.3s ease;
  font-family: 'Courier New', monospace;
  background: var(--light);
  color: var(--gray-dark);
  margin-bottom: 8px;
}

.code-input-enhanced:focus {
  outline: none;
  border-color: var(--primary);
  box-shadow: 0 0 0 3px rgba(74, 107, 223, 0.2);
  transform: translateY(-1px);
}

.code-input-enhanced.has-value {
  border-color: var(--primary-light);
  background: rgba(74, 107, 223, 0.05);
  color: var(--primary);
}

.code-input-enhanced::placeholder {
  color: var(--gray);
  font-weight: normal;
  letter-spacing: normal;
  text-transform: none;
  font-size: 1.1rem;
}

/* 输入提示 */
.code-input-hint {
  text-align: center;
  font-size: 0.9rem;
  color: var(--gray);
  margin-top: 5px;
  min-height: 20px;
}

.code-length-indicator {
  color: var(--primary);
  font-weight: 500;
}

/* 取件码示例 */
.code-examples {
  background: var(--gray-light);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 15px;
  margin-top: 15px;
}

.example-title {
  font-size: 0.9rem;
  color: var(--gray);
  margin-bottom: 10px;
  display: flex;
  align-items: center;
}

.example-codes {
  display: flex;
  gap: 10px;
  justify-content: center;
  flex-wrap: wrap;
}

.example-code {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: var(--primary);
  background: var(--light);
  padding: 8px 12px;
  border-radius: 6px;
  border: 1px solid var(--border);
  font-size: 0.9rem;
  letter-spacing: 1px;
}

/* 下载通知区域 */
.download-notice {
  background: #fff8e1;
  border-left: 4px solid var(--warning);
  padding: 20px;
  margin: 25px 0;
}

.notice-header {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.notice-header svg {
  color: var(--warning);
}

.notice-header strong {
  color: var(--warning);
  font-size: 1rem;
}

.notice-content {
  font-size: 0.9rem;
  color: var(--gray-dark);
  line-height: 1.6;
}

.notice-content p {
  margin-bottom: 8px;
  display: flex;
  align-items: flex-start;
}

.notice-content p:before {
  content: "•";
  color: var(--warning);
  font-weight: bold;
  margin-right: 8px;
}

/* 下载按钮 */
.download-btn {
  background: var(--success);
  padding: 16px;
  font-size: 1.05rem;
  font-weight: 600;
  margin-top: 10px;
}

.download-btn:hover:not(.disabled) {
  background: #218838;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(40, 167, 69, 0.3);
}

.download-btn.disabled {
  background: var(--gray);
  cursor: not-allowed;
  opacity: 0.6;
}

.download-btn.disabled:hover {
  transform: none;
  box-shadow: none;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .code-input-enhanced {
    font-size: 1.2rem;
    padding: 16px;
    letter-spacing: 3px;
  }

  .example-codes {
    gap: 8px;
  }

  .example-code {
    padding: 6px 10px;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .code-input-enhanced {
    font-size: 1.1rem;
    padding: 14px;
    letter-spacing: 2px;
  }

  .example-codes {
    flex-direction: column;
    align-items: center;
  }

  .example-code {
    width: 100%;
    text-align: center;
  }
}
</style>
