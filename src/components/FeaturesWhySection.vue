<script setup lang="ts">
const features = [
  {
    title: "Pasarela de pagos con Stripe",
    description:
      "Pagos en línea seguros y confiables con una de las plataformas líderes del mundo.",
    icon: "stripe",
  },
  {
    title: "Conectados con Truora",
    description:
      "Validación de identidad digital integrada para proteger tu registro y tus datos.",
    icon: "truora",
  },
  {
    title: "Supabase",
    description:
      "Infraestructura de datos moderna, escalable y lista para tu información.",
    icon: "supabase",
  },
  {
    title: "WhatsApp",
    description:
      "Comunicación directa por el canal que ya usas todos los días, sin fricciones.",
    icon: "whatsapp",
  },
];
</script>

<template>
  <section class="features-why">
    <div class="features-inner">
      <header class="features-header">
        <h2 class="features-title">¿Por qué elegirnos?</h2>
        <p class="features-subtitle">
          Confianza, rapidez y calidad en cada servicio.
        </p>
      </header>

      <div class="features-grid">
        <article v-for="item in features" :key="item.icon" class="feature-card">
          <div class="feature-icon-wrap" aria-hidden="true">
            <!-- Stripe -->
            <svg
              v-if="item.icon === 'stripe'"
              class="feature-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="5" width="20" height="14" rx="2" />
              <path d="M2 10h20" />
              <path d="M6 15h4" />
            </svg>
            <!-- Truora -->
            <svg
              v-else-if="item.icon === 'truora'"
              class="feature-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
            <!-- Supabase -->
            <svg
              v-else-if="item.icon === 'supabase'"
              class="feature-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
              <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
            </svg>
            <!-- WhatsApp -->
            <svg
              v-else
              class="feature-icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.75"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path
                d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
              />
            </svg>
          </div>
          <h3 class="feature-card-title">{{ item.title }}</h3>
          <p class="feature-card-text">{{ item.description }}</p>
        </article>
      </div>
    </div>
  </section>
</template>

<style scoped>
.features-why {
  width: 100%;
  max-width: 100%;
  box-sizing: border-box;
  padding: clamp(2.5rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem);
  background: #ffffff;
  overflow-x: clip;
}

.features-inner {
  max-width: 72rem;
  margin: 0 auto;
}

.features-header {
  text-align: center;
  margin-bottom: clamp(2rem, 5vw, 3rem);
}

.features-title {
  font-size: 3.5rem;
  font-weight: 400;
  color: #2d3436;
  margin-bottom: 1.5rem;
  line-height: 1.3;
  letter-spacing: -0.01em;
  font-family: "Georgia", "Garamond", serif;
}

.features-subtitle {
  margin: 0;
  font-size: clamp(0.95rem, 2.5vw, 1.05rem);
  font-style: italic;
  color: #5a7a6e;
  font-weight: 400;
  line-height: 1.5;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: clamp(1rem, 3vw, 1.5rem);
  align-items: stretch;
}

.feature-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: clamp(1.25rem, 3vw, 1.75rem);
  box-shadow: 0 4px 24px rgba(26, 58, 46, 0.08);
  border: 1px solid rgba(46, 125, 50, 0.08);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
  box-sizing: border-box;
}

.feature-icon-wrap {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  background: rgba(76, 175, 80, 0.14);
  color: #2e7d32;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  flex-shrink: 0;
}

.feature-icon {
  width: 28px;
  height: 28px;
}

.feature-card-title {
  margin: 0 0 0.5rem;
  font-size: clamp(0.95rem, 2.2vw, 1.05rem);
  font-weight: 600;
  color: #2d3436;
  line-height: 1.35;
  font-family: "Georgia", "Garamond", serif;
}

.feature-card-text {
  margin: 0;
  font-size: clamp(0.8rem, 2vw, 0.875rem);
  color: #6b8b7f;
  line-height: 1.55;
  font-family: "Georgia", "Garamond", serif;
}

@media (max-width: 1024px) {
  .features-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 540px) {
  .features-grid {
    grid-template-columns: 1fr;
  }
}
</style>
