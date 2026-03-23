<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps<{ iframeUrl: string }>()
const status = ref<'idle' | 'processing' | 'success' | 'failed'>('idle')

const messageHandler = (event: MessageEvent) => {
  const message = event.data
  if (message === 'truora.process.succeeded') {
    status.value = 'success'
  }
  if (message === 'truora.process.failed') {
    status.value = 'failed'
  }
  if (message === 'truora.steps.completed') {
    status.value = 'processing'
  }
}

onMounted(() => {
  status.value = 'processing'
  window.addEventListener('message', messageHandler)
})

onUnmounted(() => {
  window.removeEventListener('message', messageHandler)
})
</script>

<template>
  <div class="iframe-step">
    <p v-if="status === 'idle'" class="status-text">
      Completa la validación para continuar
    </p>
    <p v-else-if="status === 'processing'" class="status-text">
      <span class="spinner" />
      Estamos validando tu información...
    </p>
    <p v-else-if="status === 'success'" class="status-text success">
      Validación completada correctamente ✅
    </p>
    <p v-else-if="status === 'failed'" class="status-text error">
      No se pudo completar la validación ❌. Intenta nuevamente.
    </p>

    <div v-if="props.iframeUrl" class="iframe-wrapper">
      <iframe
        :src="props.iframeUrl"
        allow="camera"
        width="400"
        height="750"
        class="truora-iframe"
      />
    </div>
  </div>
</template>

<style scoped>
.iframe-step {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.status-text {
  font-size: 1rem;
  color: #6b8b7f;
  font-weight: 400;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.status-text.success {
  color: #2e7d32;
  font-weight: 500;
}

.status-text.error {
  color: #c62828;
  font-weight: 500;
}

.spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(107, 139, 127, 0.3);
  border-top-color: #6b8b7f;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.iframe-wrapper {
  width: 100%;
  display: flex;
  justify-content: center;
}

.truora-iframe {
  border: none;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(26, 58, 46, 0.1);
}
</style>
