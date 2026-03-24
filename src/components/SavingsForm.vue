<script setup lang="ts">
import { ref } from "vue";
import { sendWhatsappOutbound } from "../lib/whatsappOutbound";

const countryCode = ref("+57");
const phoneNumber = ref("");
const loading = ref(false);
const success = ref(false);
const errorMessage = ref("");

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
  success.value = false;
  errorMessage.value = "";

  try {
    await sendWhatsappOutbound({
      country_code: countryCode.value,
      phone_number: phoneNumber.value,
    });
    success.value = true;
    phoneNumber.value = "";
  } catch (error) {
    errorMessage.value =
      "Hubo un error, lo sentimos. Revisa que sea un telefono valido o que no exita un flujo iniciado y vuelve a intentar.";
    console.error("🚨 Error capturado:", error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="savings-form-container">
    <form @submit.prevent="handleSubmit" class="savings-form">
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
        :class="{ loading: loading, success: success }"
      >
        <span v-if="loading">Procesando...</span>
        <span v-else-if="success">¡Enviado con éxito!</span>
        <span v-else>Iniciar Ahorro</span>
      </button>

      <transition name="fade">
        <p v-if="success" class="success-message">
          ¡Excelente! Pronto recibirás un mensaje en WhatsApp para continuar.
        </p>
      </transition>

      <transition name="fade">
        <p v-if="errorMessage" class="error-message">
          {{ errorMessage }}
        </p>
      </transition>
    </form>
  </div>
</template>

<style scoped>
/* Misma lógica que RegistrationForm: contenedor acotado al ancho útil, sin overflow horizontal */
.savings-form-container {
  width: 100%;
  max-width: min(420px, 100%);
  margin-left: auto;
  margin-right: auto;
  box-sizing: border-box;
}

.savings-form {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  background: rgba(255, 255, 255, 0.95);
  padding: clamp(1.25rem, 4vw, 2.5rem);
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
  min-width: 0;
  width: 100%;
}

.country-code-select {
  flex: 0 0 auto;
  width: 90px;
  min-width: 72px;
  padding: 0.75rem 0.5rem;
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
  flex: 1 1 0;
  min-width: 0;
  padding: 0.75rem 0.875rem;
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

.submit-button.success {
  background: linear-gradient(135deg, #66bb6a 0%, #4caf50 100%);
}

.success-message,
.error-message {
  margin-top: 1rem;
  padding: 0.875rem;
  border-radius: 10px;
  font-size: 0.9rem;
  text-align: center;
  line-height: 1.6;
  font-weight: 500;
}

.success-message {
  background: rgba(76, 175, 80, 0.1);
  color: #2e7d32;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.error-message {
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
