<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";
import SavingsForm from "./components/SavingsForm.vue";
import RegistrationForm from "./components/RegistrationForm.vue";
import FeaturesWhySection from "./components/FeaturesWhySection.vue";
import {
  sendWhatsappOutbound,
  splitFullPhoneForOutbound,
} from "./lib/whatsappOutbound";

const token = ref("");
const truoraStatus = ref<"idle" | "processing" | "success" | "failed">("idle");
const popupVisible = ref(false);
const popupMessage = ref("");
const phone = ref("");
const savedFullPhone = ref("");
const savedPassword = ref("");

const pendingToken = ref(false);

const onRegistrationValidated = async (payload: {
  fullPhone: string;
  password: string;
}) => {
  savedFullPhone.value = payload.fullPhone;
  savedPassword.value = payload.password;
  pendingToken.value = true;
  try {
    await getApiKey(payload.fullPhone);
    truoraStatus.value = "processing";
  } catch (e) {
    showPopup("No se pudo iniciar la validación. Intenta de nuevo.");
  } finally {
    pendingToken.value = false;
  }
};

const onRegistrationAccountExists = () => {
  showPopup("Ya existe una cuenta verificada con ese número de teléfono.");
};

const postUserToSupabase = async () => {
  const base = import.meta.env.VITE_URL_SUPABASE || "";
  const response = await fetch(`${base}users`, {
    method: "POST",
    headers: {
      apikey: `${import.meta.env.VITE_APIKEY_SUPABASE}`,
      Authorization: `Bearer ${import.meta.env.VITE_APIKEY_SUPABASE}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: savedFullPhone.value,
      password: savedPassword.value,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    console.error(
      "Error al guardar usuario en Supabase:",
      response.status,
      text,
    );
    throw new Error("No se pudo guardar el registro");
  }
};

const showPopup = (message: string) => {
  popupMessage.value = message;
  popupVisible.value = true;
  setTimeout(() => {
    popupVisible.value = false;
  }, 8000);
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
    void postUserToSupabase()
      .then(async () => {
        const { country_code, phone_number } = splitFullPhoneForOutbound(
          savedFullPhone.value,
        );
        await sendWhatsappOutbound({ country_code, phone_number });
        truoraStatus.value = "success";
      })
      .catch((err) => {
        console.error(err);
        showPopup(
          "La validación fue correcta pero hubo un error al guardar el registro o al enviar WhatsApp. Revisa la consola o contacta soporte.",
        );
      });
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

const getApiKey = async (fullPhone: string) => {
  const formData = new URLSearchParams();

  const phoneWithoutPlus = fullPhone.startsWith("+")
    ? fullPhone.slice(1)
    : fullPhone;
  formData.append("key_type", "web");
  formData.append("api_key_version", "1");
  formData.append("country", "ALL");
  formData.append("grant", "digital-identity");
  formData.append("redirect_url", "https://hamal-rvx2.onrender.com/");
  formData.append("flow_id", "IPFf546d1193a10b3e22999f3e5d61e18d4");
  formData.append("account_id", phoneWithoutPlus);
  formData.append("phone", phoneWithoutPlus);

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

    console.group("❌ Error detallado de la API");
    console.error("Status:", response.status);
    console.error("Respuesta del servidor:", errorData);
    console.error("Datos enviados:", Object.fromEntries(formData.entries()));
    console.groupEnd();

    throw new Error(`Fallo en la API (Status: ${response.status})`);
  }

  const data = await response.json();
  token.value = data.api_key;
};

onMounted(() => {
  window.addEventListener("message", handleMessage);
});

onUnmounted(() => {
  window.removeEventListener("message", handleMessage);
});
</script>

<template>
  <div class="landing-page">
    <section class="main-container">
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
        <RegistrationForm
          v-model:phone="phone"
          :pending-token="pendingToken"
          @validated="onRegistrationValidated"
          @account-exists="onRegistrationAccountExists"
        />
      </section>

      <div class="iframe-placeholder">
        <template v-if="truoraStatus === 'success'">
          <div class="success-message-box">
            <span class="success-icon">✓</span>
            <h3>Se registró su cuenta correctamente</h3>
            <p>Le llegará un mensaje al WhatsApp para empezar el ahorro.</p>
          </div>
        </template>
        <div v-else-if="truoraStatus === 'idle'" class="step-placeholder">
          <div class="step-placeholder-inner">
            <span class="step-badge">Paso 1 · Registro</span>
            <h3 class="step-placeholder-title">
              Completa el formulario con tu número de teléfono y tu contraseña
              para crear tu cuenta.
            </h3>

            <p class="step-placeholder-hint">
              Cuando termines, podrás continuar con el siguiente paso: la
              validación de identidad en este recuadro.
            </p>
          </div>
        </div>
        <div
          v-else-if="truoraStatus === 'processing' && !token"
          class="step-placeholder"
        >
          Cargando validación...
        </div>
        <iframe
          v-else-if="truoraStatus === 'processing' && token"
          class="truora-iframe"
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

    <FeaturesWhySection />

    <section class="savings-section">
      <div class="savings-content">
        <div class="savings-info">
          <h2 class="section-title">Comienza tu Ahorro</h2>
          <p class="section-description">
            Si ya estás registrado, al ingresar tu número de WhatsApp podrás
            iniciar sesión en nuestro flujo automatizado y realizar tu pago para
            el ahorro programado de manera rápida y segura.
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
  width: 100%;
  max-width: 100vw;
  overflow-x: clip;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #f5f7fa 0%, #e8f5e9 100%);
  box-sizing: border-box;
}

.hero-section {
  flex: 1 1 320px;
  min-width: 0;
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
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: center;
  align-items: flex-start;
  gap: 2.5rem;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
}

.iframe-placeholder {
  flex: 0 1 auto;
  width: 450px;
  height: 700px;
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

.step-placeholder {
  width: 100%;
  padding: 1.25rem 1rem;
  box-sizing: border-box;
}

.step-placeholder-inner {
  max-width: 26rem;
  margin: 0 auto;
  text-align: center;
}

.step-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: #2e7d32;
  background: rgba(76, 175, 80, 0.12);
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  margin-bottom: 1rem;
}

.step-placeholder-title {
  font-size: 1.35rem;
  font-weight: 500;
  color: #2d3436;
  margin: 0 0 0.75rem;
  font-family: "Georgia", "Garamond", serif;
  line-height: 1.3;
}

.step-placeholder-lead,
.step-placeholder-hint {
  font-size: 0.95rem;
  color: #6b8b7f;
  line-height: 1.65;
  margin: 0 0 0.75rem;
  font-weight: 400;
}

.step-placeholder-hint {
  margin-bottom: 0;
  font-size: 0.9rem;
  opacity: 0.95;
}

.truora-iframe {
  max-width: 100%;
  border: none;
  border-radius: 12px;
  display: block;
}

.placeholder-text {
  font-size: 1.5rem;
  color: #7ba898;
  font-weight: 300;
  letter-spacing: 0.02em;
}

.savings-section {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: clamp(2rem, 5vw, 3rem) clamp(0.75rem, 4vw, 2rem) clamp(2.5rem, 6vw, 4rem);
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(10px);
  overflow-x: clip;
}

.savings-content {
  width: 100%;
  max-width: min(56rem, 100%);
  margin: 0 auto;
  padding: 0;
  box-sizing: border-box;
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: clamp(1.5rem, 4vw, 3rem);
  align-items: start;
}

.savings-content > * {
  min-width: 0;
}

.savings-info {
  text-align: left;
  min-width: 0;
}

.section-title {
  font-size: clamp(1.35rem, 4vw, 2.125rem);
  font-weight: 400;
  color: #2d3436;
  margin-bottom: 1rem;
  line-height: 1.25;
  font-family: "Georgia", "Garamond", serif;
  letter-spacing: -0.01em;
  word-wrap: break-word;
  overflow-wrap: break-word;
}

.section-description {
  font-size: clamp(0.9rem, 2.4vw, 1.05rem);
  color: #6b8b7f;
  line-height: 1.65;
  font-weight: 300;
  letter-spacing: 0.005em;
  margin: 0;
  max-width: 100%;
  word-wrap: break-word;
  overflow-wrap: break-word;
  hyphens: auto;
}

@media (max-width: 960px) {
  .savings-content {
    grid-template-columns: 1fr;
    gap: 1.75rem;
  }

  .savings-info {
    text-align: center;
    max-width: 28rem;
    margin-left: auto;
    margin-right: auto;
  }
}

@media (max-width: 768px) {
  .main-container {
    flex-direction: column;
    align-items: center;
    padding: 1.25rem 1rem 2rem;
    gap: 1.75rem;
  }

  .hero-section {
    order: 1;
    width: 100%;
    padding: 2rem 0.5rem 0;
  }

  .iframe-placeholder {
    order: 2;
    width: 100%;
    max-width: 450px;
    height: auto;
    min-height: 280px;
    max-height: min(70vh, 520px);
  }

  .truora-iframe {
    width: 100% !important;
    height: min(65vh, 420px) !important;
    max-height: 420px;
  }

  .hero-title {
    font-size: 2.25rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .hero-subtitle br {
    display: none;
  }

  .savings-section {
    padding-left: max(0.75rem, env(safe-area-inset-left));
    padding-right: max(0.75rem, env(safe-area-inset-right));
  }

  .step-placeholder-title {
    font-size: 1.2rem;
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
