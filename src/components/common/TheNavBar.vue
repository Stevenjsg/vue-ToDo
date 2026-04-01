<script setup lang="ts">
defineEmits(['navigateToAuth'])
</script>

<template>
  <div class="landing-page">
    <header class="main-nav">
      <div class="container">
        <div class="logo"><RouterLink to="/">BTaskora </RouterLink></div>
        <nav>
          <a href="#features">Características</a>
          <a href="#pricing">Precios</a>
        </nav>
        <div class="nav-buttons">
          <button class="btn-secondary" @click="$emit('navigateToAuth')">Iniciar Sesión</button>
          <button class="btn-primary" @click="$emit('navigateToAuth')">Regístrate Gratis</button>
        </div>
      </div>
    </header>
  </div>
</template>

<style scoped>
/* ==========================================================================
   Contenedor y Utilidades Generales
   ========================================================================== */
.landing-page {
  background-color: var(--color-background);
  color: var(--color-text-primary);
}

.container {
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 2rem;
}

section {
  padding: 6rem 0;
}

/* ==========================================================================
   Botones
   ========================================================================== */
.btn-primary {
  background-color: var(--color-accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-primary:hover {
  background-color: var(--color-accent-hover);
  transform: translateY(-2px);
}

.btn-secondary {
  background-color: var(--color-surface);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.btn-secondary:hover {
  background-color: var(--color-border);
}

/* ==========================================================================
   1. Navegación Principal
   ========================================================================== */
.main-nav {
  background-color: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-nav .container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  font-weight: 700;
  font-size: 1.5rem;
}

.main-nav nav {
  display: flex;
  gap: 2rem;
}

.main-nav nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  font-weight: 500;
}
.main-nav nav a:hover {
  color: var(--color-text-primary);
}

.nav-buttons {
  display: flex;
  gap: 1rem;
}

/* ==========================================================================
   2. Hero Section
   ========================================================================== */
.hero-section {
  padding-top: 8rem;
  padding-bottom: 8rem;
  text-align: center;
}

.hero-content {
  max-width: 700px;
}

.hero-content h1 {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.subtitulo {
  font-size: 1.2rem;
  color: var(--color-text-secondary);
  line-height: 1.7;
  margin-bottom: 2.5rem;
}

.cta-hero {
  font-size: 1.1rem;
  padding: 1rem 2rem;
}

.hero-visual {
  margin-top: 4rem;
  background-color: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  height: 400px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
}
.hero-visual img {
  max-width: 90%;
  border-radius: 8px;
}

/* ==========================================================================
   3. Características
   ========================================================================== */
.features-section {
  background-color: var(--color-surface);
}

.feature-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
}

.feature-card {
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 12px;
}

.feature-card span {
  font-size: 2rem;
}

.feature-card h3 {
  font-size: 1.25rem;
  margin-top: 1rem;
  margin-bottom: 0.5rem;
}

.feature-card p {
  color: var(--color-text-secondary);
  line-height: 1.6;
}

/* ==========================================================================
   4. Sincronización
   ========================================================================== */
.sync-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 4rem;
}

.sync-visual {
  background-color: var(--color-surface);
  border-radius: 12px;
  padding: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  border: 1px solid var(--color-border);
}
.sync-logo {
  max-width: 100px;
}

.sync-text h2 {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}
.sync-text p {
  font-size: 1.1rem;
  line-height: 1.7;
  color: var(--color-text-secondary);
}

/* ==========================================================================
   5. Precios
   ========================================================================== */
.pricing-section {
  background-color: var(--color-surface);
}

.pricing-section h2 {
  text-align: center;
  font-size: 2.5rem;
  margin-bottom: 4rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 2rem;
}

.pricing-tier {
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  display: flex;
  flex-direction: column;
}

.pricing-tier h3 {
  font-size: 1.2rem;
  font-weight: 500;
  color: var(--color-accent);
}
.pricing-tier h2 {
  font-size: 2.5rem;
  margin: 0.5rem 0;
  text-align: left;
}
.pricing-tier p {
  color: var(--color-text-secondary);
  margin-bottom: 1.5rem;
}
.pricing-tier ul {
  list-style: '✓ ';
  padding-left: 1.5rem;
  line-height: 1.8;
  flex-grow: 1;
}
.pricing-tier button {
  width: 100%;
}

.pricing-tier.popular {
  border-color: var(--color-accent);
  position: relative;
  overflow: hidden;
}
.badge {
  position: absolute;
  top: 0;
  right: 0;
  background-color: var(--color-accent);
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  font-weight: 700;
  transform: rotate(45deg) translate(25%, -20%);
  transform-origin: center;
  width: 100px;
}

/* ==========================================================================
   6. CTA Final y Footer
   ========================================================================== */
.final-cta-section {
  text-align: center;
  background-color: var(--color-surface);
}
.final-cta-section h2 {
  font-size: 2.5rem;
}

.main-footer {
  text-align: center;
  padding: 2rem 0;
  border-top: 1px solid var(--color-border);
  color: var(--color-text-secondary);
  font-size: 0.9rem;
}

/* ==========================================================================
   Responsive
   ========================================================================== */
@media (max-width: 768px) {
  .main-nav nav {
    display: none;
  }
  .nav-buttons .btn-secondary {
    display: none;
  }

  .hero-content h1 {
    font-size: 2.5rem;
  }

  .feature-grid,
  .pricing-grid,
  .sync-content {
    grid-template-columns: 1fr;
  }

  .sync-content {
    /* Invierte el orden en móvil */
    grid-auto-flow: dense;
  }
  .sync-visual {
    grid-row: 1;
  }

  .pricing-tier {
    margin-bottom: 2rem;
  }
}
</style>
