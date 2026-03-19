<script setup lang="ts">
import SavingsForm from './components/SavingsForm.vue'


</script>

<template>

  <div class="landing-page">
    <section class="hero-section">
      <h1 class="hero-title">Tu Futuro Financiero,<br><span class="title-secondary">Comienza Aquí</span></h1>
      <p class="hero-subtitle">
        Diseñamos un sistema de ahorro programado que se adapta a tu ritmo de vida,<br>automatizado vía WhatsApp para tu tranquilidad.
      </p>
    </section>

    <section class="main-container">
      <div class="iframe-placeholder">
        <p class="placeholder-text">[ Espacio reservado para integración de iFrame ]</p>
      </div>
    </section>

    <section class="savings-section">
      <div class="savings-content">
        <div class="savings-info">
          <h2 class="section-title">Comienza tu Ahorro</h2>
          <p class="section-description">
            Al ingresar tu número de WhatsApp podrás iniciar sesión en nuestro flujo automatizado
            y realizar tu pago para el ahorro programado de manera rápida y segura.
          </p>
        </div>

        <SavingsForm/>
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
  font-family: 'Georgia', 'Garamond', serif;
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
  width: 100%;
  height: 65vh;
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(46, 125, 50, 0.1);
  border-radius: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 8px 32px rgba(26, 58, 46, 0.08);
  backdrop-filter: blur(10px);
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
  font-family: 'Georgia', 'Garamond', serif;
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
    height: 50vh;
  }

  .placeholder-text {
    font-size: 1.2rem;
    padding: 2rem;
    text-align: center;
  }
}
</style>
