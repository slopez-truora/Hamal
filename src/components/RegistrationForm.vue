<script setup lang="ts">
import { ref, computed } from "vue";

const props = defineProps<{
  phone: string; // valor completo: +573001234567
  pendingToken?: boolean;
}>();

const isBusy = computed(
  () => props.pendingToken === true || loading.value,
);

const emit = defineEmits<{
  "update:phone": [value: string];
  validated: [payload: { fullPhone: string; password: string }];
  "account-exists": [];
}>();

const countryCode = ref("+57");
const phoneNumber = ref("");
const password = ref("");

const loading = ref(false);
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

// 👉 teléfono completo
const fullPhone = computed(() => `${countryCode.value}${phoneNumber.value}`);

// 👉 emitir cada vez que cambie
const updatePhone = () => {
  emit("update:phone", fullPhone.value);
};

const handleSubmit = async () => {
  if (!phoneNumber.value.trim() || !password.value.trim()) {
    errorMessage.value = "Completa todos los campos";
    return;
  }

  loading.value = true;
  errorMessage.value = "";
  updatePhone();
  try {
    const base = import.meta.env.VITE_URL_SUPABASE || "";
    const url = `${base}users?id=eq.${encodeURIComponent(fullPhone.value)}`;

    const response = await fetch(url, {
      method: "GET",
      headers: {
        apikey: `${import.meta.env.VITE_APIKEY_SUPABASE}`,
        Authorization: `Bearer ${import.meta.env.VITE_APIKEY_SUPABASE}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Error en la petición");
    }

    const rows = await response.json();

    if (Array.isArray(rows) && rows.length > 0) {
      emit("account-exists");
      return;
    }

    emit("validated", {
      fullPhone: fullPhone.value,
      password: password.value,
    });
  } catch (error) {
    errorMessage.value = "Hubo un error, intenta nuevamente";
    console.error(error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="auth-form-container">
    <form @submit.prevent="handleSubmit" class="auth-form">
      <!-- 📱 PHONE GROUP -->
      <div class="phone-input-group">
        <select
          v-model="countryCode"
          class="country-code-select"
          :disabled="isBusy"
          @change="updatePhone"
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
          v-model="phoneNumber"
          @input="updatePhone"
          type="tel"
          placeholder="Número de teléfono"
          class="phone-input"
          :disabled="isBusy"
        />
      </div>

      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        class="input"
        :disabled="isBusy"
      />

      <button
        type="submit"
        class="submit-button"
        :disabled="isBusy"
        :class="{ loading: isBusy }"
      >
        <span v-if="isBusy">{{
          pendingToken ? "Iniciando validación..." : "Validando..."
        }}</span>
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
.auth-form-container {
  width: 100%;
  max-width: 420px;
  margin: 2rem auto 0;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

/* 📱 PHONE GROUP */
.phone-input-group {
  display: flex;
  gap: 0.75rem;
}

.country-code-select {
  width: 90px;
  padding: 0.75rem;
  border-radius: 12px;
  border: 2px solid rgba(46, 125, 50, 0.15);
  background: white;
}

.phone-input {
  flex: 1;
  padding: 0.75rem;
  border-radius: 12px;
  border: 2px solid rgba(46, 125, 50, 0.15);
}

/* 🔒 PASSWORD */
.input {
  padding: 0.75rem;
  border-radius: 12px;
  border: 2px solid rgba(46, 125, 50, 0.15);
}

/* 🚀 BUTTON */
.submit-button {
  padding: 1rem;
  border-radius: 12px;
  border: none;
  color: white;
  cursor: pointer;
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
}

.submit-button:disabled {
  opacity: 0.6;
}

.submit-button.loading {
  background: linear-gradient(135deg, #66bb6a 0%, #43a047 100%);
}

.error-message {
  font-size: 0.9rem;
  color: red;
  text-align: center;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
