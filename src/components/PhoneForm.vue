<script setup lang="ts">
import { ref } from "vue";

const emit = defineEmits<{
  submit: [phone: string, countryCode: string];
}>();

const countryCode = ref("+57");
const phoneNumber = ref("");
const loading = ref(false);
const errorMessage = ref("");

// Cambiar luego por variables de entorno
const SUPABASE_URL =
  "https://gclglssgpdsslkucbaoj.supabase.co/rest/v1/users?id=";
const SUPABASE_ANON_KEY = "";

const countryCodes = [
  { code: "+1", name: "USA/Canadá" },
  { code: "+52", name: "México" },
  { code: "+34", name: "España" },
  { code: "+54", name: "Argentina" },
  { code: "+56", name: "Chile" },
  { code: "+57", name: "Colombia" },
  { code: "+51", name: "Perú" },
];

const handleSubmit = async () => {
  if (!phoneNumber.value.trim()) {
    errorMessage.value = "Por favor ingresa tu número de WhatsApp";
    return;
  }

  loading.value = true;
  errorMessage.value = "";

  const fullPhone = `${countryCode.value.replace("+", "")}${phoneNumber.value.replace(/\D/g, "")}`;
  console.log(fullPhone);

  try {
    const response = await fetch(`${SUPABASE_URL}eq.${fullPhone}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        apikey: "sb_publishable__rZDXVWHsnGHu8qwcGW8DA_COzc8ANK",
        Authorization: "Bearer sb_publishable__rZDXVWHsnGHu8qwcGW8DA_COzc8ANK",
      },
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();

    if (data && data.length > 0) {
      errorMessage.value = "Este número ya se encuentra registrado";
      loading.value = false;
      return;
    }

    emit("submit", fullPhone, countryCode.value);
  } catch (error) {
    console.error("Error validando usuario:", error);
    errorMessage.value = "Hubo un error al validar. Intenta nuevamente.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="phone-form-container">
    <form @submit.prevent="handleSubmit" class="phone-form">
      <div class="phone-input-group">
        <select
          id="country-code"
          v-model="countryCode"
          class="country-code-select"
          :disabled="loading"
        >
          <option
            v-for="country in countryCodes"
            :key="country.code"
            :value="country.code"
          >
            {{ country.code }}
          </option>
        </select>
        <input
          id="phone"
          v-model="phoneNumber"
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
        :class="{ loading }"
      >
        <span v-if="loading" class="button-content">
          <span class="spinner" />
          Validando...
        </span>
        <span v-else>Continuar</span>
      </button>

      <transition name="fade">
        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>
      </transition>
    </form>
  </div>
</template>

<style scoped>
.phone-form-container {
  width: 100%;
}

.phone-form {
  background: rgba(255, 255, 255, 0.95);
  padding: 2.5rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(26, 58, 46, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(46, 125, 50, 0.1);
}

.phone-input-group {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
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

.button-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.spinner {
  width: 18px;
  height: 18px;
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
  margin-top: 1rem;
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
</style>
