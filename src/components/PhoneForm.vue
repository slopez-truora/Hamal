<script setup lang="ts">
interface Props {
  countryCode: string
  phoneNumber: string
  loading: boolean
  error: string | null
}

interface Emits {
  (e: 'update:countryCode', value: string): void
  (e: 'update:phoneNumber', value: string): void
  (e: 'submit'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const countryCodes = [
  { code: '+1', name: 'USA/Canadá' },
  { code: '+52', name: 'México' },
  { code: '+34', name: 'España' },
  { code: '+54', name: 'Argentina' },
  { code: '+56', name: 'Chile' },
  { code: '+57', name: 'Colombia' },
  { code: '+51', name: 'Perú' },
]

const handleSubmit = () => {
  emit('submit')
}

const updateCountryCode = (value: string) => {
  emit('update:countryCode', value)
}

const updatePhoneNumber = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:phoneNumber', target.value)
}
</script>

<template>
  <div class="phone-form-container">
    <form @submit.prevent="handleSubmit" class="phone-form">
      <div class="form-header">
        <h2>Ingresa tu Número</h2>
        <p>Validaremos tu teléfono para comenzar tu ahorro programado</p>
      </div>

      <div class="phone-input-group">
        <select
          id="country-code"
          :value="countryCode"
          @change="updateCountryCode(($event.target as HTMLSelectElement).value)"
          class="country-code-select"
          :disabled="loading"
        >
          <option v-for="country in countryCodes" :key="country.code" :value="country.code">
            {{ country.code }}
          </option>
        </select>
        <input
          id="phone"
          :value="phoneNumber"
          @input="updatePhoneNumber"
          type="tel"
          placeholder="Número de WhatsApp"
          class="phone-input"
          :disabled="loading"
          pattern="[0-9]*"
        />
      </div>

      <button
        type="submit"
        class="submit-button"
        :disabled="loading || !phoneNumber.trim()"
        :class="{ 'loading': loading }"
      >
        <span v-if="loading">
          <div class="button-spinner"></div>
          Validando...
        </span>
        <span v-else>Continuar</span>
      </button>

      <transition name="fade">
        <p v-if="error" class="error-message">
          {{ error }}
        </p>
      </transition>
    </form>
  </div>
</template>

<style scoped>
.phone-form-container {
  width: 450px;
  height: 700px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(46, 125, 50, 0.1);
  border-radius: 24px;
  box-shadow: 0 8px 32px rgba(26, 58, 46, 0.08);
  backdrop-filter: blur(10px);
  padding: 2rem;
}

.phone-form {
  width: 100%;
  max-width: 350px;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-header {
  text-align: center;
}

.form-header h2 {
  font-size: 1.875rem;
  font-weight: 400;
  color: #2d3436;
  margin-bottom: 0.75rem;
  font-family: 'Georgia', 'Garamond', serif;
  letter-spacing: -0.01em;
}

.form-header p {
  font-size: 1rem;
  color: #6b8b7f;
  line-height: 1.6;
  font-weight: 300;
}

.phone-input-group {
  display: flex;
  gap: 0.75rem;
  align-items: stretch;
}

.country-code-select {
  flex: 0 0 auto;
  width: 90px;
  padding: 0.875rem 0.5rem;
  font-size: 0.95rem;
  border: 2px solid rgba(46, 125, 50, 0.15);
  border-radius: 12px;
  background: white;
  color: #1a3a2e;
  transition: all 0.3s ease;
  font-family: inherit;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
}

.country-code-select:hover:not(:disabled) {
  border-color: rgba(46, 125, 50, 0.3);
}

.country-code-select:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

.country-code-select:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.phone-input {
  flex: 1;
  padding: 0.875rem 1.125rem;
  font-size: 1rem;
  border: 2px solid rgba(46, 125, 50, 0.15);
  border-radius: 12px;
  background: white;
  color: #1a3a2e;
  transition: all 0.3s ease;
  font-family: inherit;
}

.phone-input:focus {
  outline: none;
  border-color: #4caf50;
  box-shadow: 0 0 0 4px rgba(76, 175, 80, 0.1);
}

.phone-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.phone-input::placeholder {
  color: #a0b5ad;
  font-style: italic;
  font-size: 0.95rem;
}

.submit-button {
  width: 100%;
  padding: 1.125rem;
  font-size: 1.05rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: white;
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 16px rgba(46, 125, 50, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(46, 125, 50, 0.35);
}

.submit-button:active:not(:disabled) {
  transform: translateY(0);
}

.submit-button:disabled {
  opacity: 0.65;
  cursor: not-allowed;
  transform: none;
}

.submit-button.loading {
  background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
}

.button-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.error-message {
  padding: 0.875rem;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.6;
  font-weight: 500;
  background: rgba(244, 67, 54, 0.1);
  color: #c62828;
  border: 1px solid rgba(244, 67, 54, 0.3);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@media (max-width: 768px) {
  .phone-form-container {
    width: 100%;
    max-width: 400px;
    height: 600px;
  }

  .form-header h2 {
    font-size: 1.5rem;
  }

  .form-header p {
    font-size: 0.9rem;
  }
}
</style>
