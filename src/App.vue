<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import SavingsForm from "./components/SavingsForm.vue";

const token = ref("");
const truoraStatus = ref<"idle" | "processing" | "success" | "failed">("idle");
const popupVisible = ref(false);
const popupMessage = ref("");

const showPopup = (message: string) => {
  popupMessage.value = message;
  popupVisible.value = true;
  setTimeout(() => {
    popupVisible.value = false;
  }, 4000);
};

const closePopup = () => {
  popupVisible.value = false;
};

const handleMessage = (event: MessageEvent) => {
  const data = event.data;
  const message =
    typeof data === "string"
      ? data
      : (data?.type ?? data?.message ?? JSON.stringify(data));

  console.log("[postMessage] event.data:", data, "| tipo:", typeof data);

  if (message === "truora.process.succeeded") {
    truoraStatus.value = "success";
  }
  if (message === "truora.process.failed") {
    truoraStatus.value = "failed";
    showPopup("No se pudo completar la validación. Intenta nuevamente.");
  }
  if (message === "truora.steps.completed") {
    showPopup(
      "Pasos completados. Esperando resultado final de la validación...",
    );
  }
};

const getApiKey = async () => {
  try {
    const formData = new URLSearchParams();

    formData.append("key_type", "web");
    formData.append("api_key_version", "1");
    formData.append("country", "ALL");
    formData.append("grant", "digital-identity");
    formData.append("redirect_url", "https://hamal-rvx2.onrender.com/");
    formData.append("flow_id", "IPFfd125057a738611c514d6480fdde52c7");
    formData.append("account_id", "3012351819");
    formData.append("phone", "+573012351819");

    const response = await fetch("https://api.account.truora.com/v1/api-keys", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Truora-API-Key": import.meta.env.VITE_TRUORA_API_KEY || "",
      },
      body: formData.toString(),
    });

    if (!response.ok) {
      const errorText = await response.text();
      let errorData;
      try {
        errorData = JSON.parse(errorText);
      } catch {
        errorData = errorText;
      }

      // 3. Imprimimos el detalle en la consola del navegador
      console.group("❌ Error detallado de la API");
      console.error("Status:", response.status);
      console.error("Respuesta del servidor:", errorData);
      // Convertimos formData a objeto solo para verlo fácil en consola
      console.error("Datos enviados:", Object.fromEntries(formData.entries()));
      console.groupEnd();

      throw new Error(`Fallo en la API (Status: ${response.status})`);
    }

    const data = await response.json();
    token.value = data.api_key;
  } catch (error) {
    console.error("🚨 Error capturado:", error);
  }
};

onMounted(() => {
  getApiKey();
  window.addEventListener("message", handleMessage);
});

onUnmounted(() => {
  window.removeEventListener("message", handleMessage);
});
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
      <div class="iframe-placeholder">
        <template v-if="truoraStatus === 'success'">
          <div class="success-message-box">
            <span class="success-icon">✓</span>
            <h3>Se registró su cuenta correctamente</h3>
            <p>Le llegará un mensaje al WhatsApp para empezar el ahorro.</p>
          </div>
        </template>
        <iframe
          v-else-if="token"
          :src="`https://identity.truora.com/?token=${token}`"
          allow="camera"
          width="450"
          height="700"
        />
      </div>
    </section>

    <!-- Ventanita emergente informativa -->
    <Teleport to="body">
      <Transition name="popup">
        <div v-if="popupVisible" class="popup-overlay" @click.self="closePopup">
          <div class="popup-box">
            <p>{{ popupMessage }}</p>
            <button class="popup-close" @click="closePopup">Cerrar</button>
          </div>
        </div>
      </Transition>
    </Teleport>

    <section class="savings-section">
      <div class="savings-content">
        <div class="savings-info">
          <h2 class="section-title">Comienza tu Ahorro</h2>
          <p class="section-description">
            Al ingresar tu número de WhatsApp podrás iniciar sesión en nuestro
            flujo automatizado y realizar tu pago para el ahorro programado de
            manera rápida y segura.
          </p>
        </div>

        <SavingsForm />
      </div>
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
}

.iframe-placeholder {
  width: 500px;
  height: 750px;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(46, 125, 50, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(26, 58, 46, 0.08);
  backdrop-filter: blur(10px);
}

.success-message-box {
  text-align: center;
  padding: 2rem;
  max-width: 380px;
}

.success-message-box .success-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
  color: white;
  font-size: 2rem;
  font-weight: bold;
  border-radius: 50%;
  margin-bottom: 1.5rem;
}

.success-message-box h3 {
  font-size: 1.5rem;
  color: #2d3436;
  margin-bottom: 0.75rem;
  font-family: "Georgia", "Garamond", serif;
}

.success-message-box p {
  font-size: 1rem;
  color: #6b8b7f;
  line-height: 1.6;
}

.placeholder-text {
  font-size: 1.5rem;
  color: #7ba898;
  font-weight: 300;
  letter-spacing: 0.02em;
}

.savings-section {
  padding: 3rem 2rem 4rem;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
}

.savings-content {
  max-width: 900px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: center;
}

.savings-info {
  text-align: left;
}

.section-title {
  font-size: 2.125rem;
  font-weight: 400;
  color: #2d3436;
  margin-bottom: 1.25rem;
  line-height: 1.3;
  font-family: "Georgia", "Garamond", serif;
  letter-spacing: -0.01em;
}

.section-description {
  font-size: 1.05rem;
  color: #6b8b7f;
  line-height: 1.8;
  font-weight: 300;
  letter-spacing: 0.005em;
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .savings-content {
    grid-template-columns: 1fr;
    gap: 2rem;
  }

  .savings-info {
    text-align: center;
  }

  .iframe-placeholder {
    width: 100%;
    max-width: 450px;
    height: 50vh;
    min-height: 500px;
  }

  .placeholder-text {
    font-size: 1.2rem;
    padding: 2rem;
    text-align: center;
  }
}
</style>

<style>
/* Popup global (Teleport a body) */
.popup-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  padding: 1rem;
}

.popup-box {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.2);
  max-width: 400px;
  text-align: center;
}

.popup-box p {
  font-size: 1rem;
  color: #2d3436;
  line-height: 1.6;
  margin-bottom: 1.25rem;
}

.popup-close {
  padding: 0.6rem 1.5rem;
  background: linear-gradient(135deg, #43a047 0%, #2e7d32 100%);
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: 500;
  cursor: pointer;
  transition: opacity 0.2s;
}

.popup-close:hover {
  opacity: 0.9;
}

.popup-enter-active,
.popup-leave-active {
  transition: opacity 0.25s ease;
}

.popup-enter-from,
.popup-leave-to {
  opacity: 0;
}
</style>
