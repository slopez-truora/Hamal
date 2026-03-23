<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import type { ValidationStatus } from '../composables/useFlow'

interface Props {
  status: ValidationStatus
}

interface Emits {
  (e: 'update:status', status: ValidationStatus): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const iframeUrl = ref('')
const iframeLoaded = ref(false)

const handleMessage = (event: MessageEvent) => {
  const message = event.data

  if (message === 'truora.process.succeeded') {
    console.log('Process succeeded')
    emit('update:status', 'success')
  }

  if (message === 'truora.process.failed') {
    console.log('Process failed')
    emit('update:status', 'failed')
  }

  if (message === 'truora.steps.completed') {
    console.log('Steps completed, waiting for final result')
  }
}

const handleIframeLoad = () => {
  iframeLoaded.value = true
}

onMounted(async () => {
  const apiKey = import.meta.env.VITE_TRUORA_API_KEY || ''
  const flowId = import.meta.env.VITE_FLOW_ID || ''

  try {
    const formData = new URLSearchParams()
    formData.append('key_type', 'web')
    formData.append('api_key_version', '1')
    formData.append('country', 'ALL')
    formData.append('grant', 'digital-identity')
    formData.append('redirect_url', 'https://hamal-rvx2.onrender.com/')
    formData.append('flow_id', flowId)
    formData.append('account_id', '3012351819')

    const response = await fetch('https://api.account.truora.com/v1/api-keys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Truora-API-Key': apiKey,
      },
      body: formData.toString(),
    })

    if (response.ok) {
      const data = await response.json()
      iframeUrl.value = `https://identity.truora.com/?token=${data.api_key}`
    } else {
      console.error('Failed to get Truora token')
      emit('update:status', 'failed')
    }
  } catch (error) {
    console.error('Error fetching Truora token:', error)
    emit('update:status', 'failed')
  }

  window.addEventListener('message', handleMessage)
})

onUnmounted(() => {
  window.removeEventListener('message', handleMessage)
})
</script>

<template>
  <div class="iframe-step">
    <div class="iframe-container">
      <div v-if="!iframeLoaded || !iframeUrl" class="loading-overlay">
        <div class="spinner"></div>
        <p>Cargando validación...</p>
      </div>
      <iframe
        v-if="iframeUrl"
        :src="iframeUrl"
        allow="camera"
        class="validation-iframe"
        @load="handleIframeLoad"
      />
    </div>

    <div class="status-section">
      <div v-if="status === 'idle' || status === 'processing'" class="status-message">
        <div class="status-icon processing">
          <div class="pulse-ring"></div>
          <span>⏳</span>
        </div>
        <p class="status-text">
          <strong>Completa la validación para continuar</strong><br />
          <span class="status-subtext">Estamos validando tu información...</span>
        </p>
      </div>

      <div v-else-if="status === 'success'" class="status-message success">
        <div class="status-icon">
          <span>✅</span>
        </div>
        <p class="status-text">
          <strong>Validación completada exitosamente</strong><br />
          <span class="status-subtext">Pronto recibirás un mensaje en WhatsApp para continuar con tu ahorro programado.</span>
        </p>
      </div>

      <div v-else-if="status === 'failed'" class="status-message error">
        <div class="status-icon">
          <span>❌</span>
        </div>
        <p class="status-text">
          <strong>La validación falló</strong><br />
          <span class="status-subtext">Por favor intenta nuevamente o contacta soporte.</span>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.iframe-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
}

.iframe-container {
  position: relative;
  width: 450px;
  height: 700px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(46, 125, 50, 0.1);
  border-radius: 24px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(26, 58, 46, 0.08);
  backdrop-filter: blur(10px);
}

.validation-iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.95);
  z-index: 10;
  gap: 1rem;
}

.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(46, 125, 50, 0.1);
  border-top-color: #4caf50;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.loading-overlay p {
  color: #6b8b7f;
  font-size: 1rem;
  font-weight: 500;
}

.status-section {
  width: 100%;
  max-width: 450px;
}

.status-message {
  background: rgba(255, 255, 255, 0.95);
  padding: 2rem;
  border-radius: 20px;
  box-shadow: 0 4px 16px rgba(26, 58, 46, 0.08);
  border: 2px solid rgba(46, 125, 50, 0.1);
  display: flex;
  align-items: center;
  gap: 1.5rem;
  transition: all 0.3s ease;
}

.status-message.success {
  border-color: rgba(76, 175, 80, 0.3);
  background: rgba(232, 245, 233, 0.95);
}

.status-message.error {
  border-color: rgba(244, 67, 54, 0.3);
  background: rgba(255, 235, 238, 0.95);
}

.status-icon {
  position: relative;
  flex-shrink: 0;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.status-icon.processing {
  animation: pulse 2s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.pulse-ring {
  position: absolute;
  width: 100%;
  height: 100%;
  border: 3px solid #4caf50;
  border-radius: 50%;
  animation: pulse-ring 2s ease-out infinite;
}

@keyframes pulse-ring {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  100% {
    transform: scale(1.5);
    opacity: 0;
  }
}

.status-text {
  flex: 1;
  line-height: 1.6;
}

.status-text strong {
  color: #2d3436;
  font-size: 1.125rem;
  font-weight: 600;
  display: block;
  margin-bottom: 0.5rem;
}

.status-subtext {
  color: #6b8b7f;
  font-size: 0.95rem;
  font-weight: 400;
}

.status-message.success .status-text strong {
  color: #2e7d32;
}

.status-message.error .status-text strong {
  color: #c62828;
}

@media (max-width: 768px) {
  .iframe-container {
    width: 100%;
    max-width: 400px;
    height: 600px;
  }

  .status-message {
    padding: 1.5rem;
    flex-direction: column;
    text-align: center;
  }

  .status-icon {
    width: 50px;
    height: 50px;
    font-size: 1.75rem;
  }
}
</style>
