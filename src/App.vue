<script setup lang="ts">
import { computed } from "vue";
import PhoneForm from "./components/PhoneForm.vue";
import IframeStep from "./components/IframeStep.vue";
import { useFlow } from "./composables/useFlow";

const {
  step,
  phone,
  countryCode,
  loading,
  error,
  status,
  validatePhone,
  setStatus,
} = useFlow();

const handlePhoneSubmit = async () => {
  await validatePhone();
};

const isPhoneStep = computed(() => step.value === 'phone');
const isIframeStep = computed(() => step.value === 'iframe');
</script>

<template>
  <div class="landing-page">
    <section class="hero-section">
      <h1 class="hero-title">
        Tu Futuro Financiero,<br /><span class="title-secondary"
          >Comienza Aquí</span
        >
      </h1>
      <p class="hero-subtitle">
        Diseñamos un sistema de ahorro programado que se adapta a tu ritmo de
        vida,<br />automatizado vía WhatsApp para tu tranquilidad.
      </p>
    </section>

    <section class="main-container">
      <transition name="slide-fade" mode="out-in">
        <PhoneForm
          v-if="isPhoneStep"
          :country-code="countryCode"
          :phone-number="phone"
          :loading="loading"
          :error="error"
          @update:country-code="countryCode = $event"
          @update:phone-number="phone = $event"
          @submit="handlePhoneSubmit"
        />
        <IframeStep
          v-else-if="isIframeStep"
          :status="status"
          @update:status="setStatus"
        />
      </transition>
    </section>
  </div>
</template>

<style scoped>
.landing-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
}

.hero-section {
  padding: 4rem 2rem 2rem;
  text-align: center;
  max-width: 900px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 400;
  color: #2d3436;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  font-family: "Georgia", "Garamond", serif;
}

.title-secondary {
  font-style: italic;
  color: #5a7a6e;
  font-weight: 300;
}

.hero-subtitle {
  font-size: 1.125rem;
  color: #6b8b7f;
  line-height: 1.8;
  font-weight: 300;
  max-width: 750px;
  margin: 0 auto;
  letter-spacing: 0.005em;
}

.main-container {
  flex: 1;
  padding: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  min-height: 800px;
}

.slide-fade-enter-active {
  transition: all 0.4s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  transform: translateX(30px);
  opacity: 0;
}

.slide-fade-leave-to {
  transform: translateX(-30px);
  opacity: 0;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .main-container {
    padding: 1rem;
    min-height: 650px;
  }
}
</style>
