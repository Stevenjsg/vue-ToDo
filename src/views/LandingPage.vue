<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToAuth = () => {
  router.push('/auth')
}
</script>

<template>
  <div class="landing-page">
    <header class="main-nav">
      <div class="container">
        <div class="logo">MiApp</div>
        <nav>
          <a href="#features">Características</a>
          <a href="#pricing">Precios</a>
        </nav>
        <div class="nav-buttons">
          <button class="btn-secondary" @click="goToAuth">Iniciar Sesión</button>
          <button class="btn-primary" @click="goToAuth">Regístrate Gratis</button>
        </div>
      </div>
    </header>

    <section class="hero-section">
      <div class="container hero-content">
        <h1>Organiza tu caos.</h1>
        <p class="subtitulo">
          Deja de saltar entre cinco apps distintas. Tu centro de productividad personal por fin
          unifica tareas, recordatorios recurrentes, notas y un temporizador de foco. Sincronizado
          en todos tus dispositivos.
        </p>
        <button class="btn-primary cta-hero" @click="goToAuth">Empieza Gratis - Sin tarjeta</button>

        <div class="hero-visual">
          <img src="#" alt="Vista previa de la app" />
        </div>
      </div>
    </section>

    <section id="features" class="features-section">
      <div class="container">
        <div class="feature-grid">
          <div class="feature-card">
            <span>🔔</span>
            <h3>Recordatorios Inteligentes</h3>
            <p>
              Desde tomar una pastilla cada 8 horas hasta regar las plantas. Nuestro sistema nativo
              en Kotlin asegura que nunca olvides una tarea recurrente.
            </p>
          </div>
          <div class="feature-card">
            <span>✅</span>
            <h3>Tareas con Superpoderes</h3>
            <p>
              Asigna prioridades, filtra por etiquetas (tags), añade subtareas y ve todo en un
              dashboard claro. El control total de tus proyectos.
            </p>
          </div>
          <div class="feature-card">
            <span>🍅</span>
            <h3>Foco y Notas Integrados</h3>
            <p>
              Toma notas mientras trabajas y mide tu productividad con el temporizador Pomodoro
              integrado. Tu espacio de trabajo y tu gestor de tareas viven juntos.
            </p>
          </div>
        </div>
      </div>
    </section>

    <section class="sync-section">
      <div class="container sync-content">
        <div class="sync-visual">
          <img src="#" alt="Logo de Vue" class="sync-logo" />
          <img src="#" alt="Logo de Kotlin" class="sync-logo" />
        </div>
        <div class="sync-text">
          <h2>Sincronizado. Siempre. En todas partes.</h2>
          <p>
            Nuestra arquitectura única te ofrece lo mejor de dos mundos: la potencia de una
            <strong>aplicación web (Vue)</strong> en tu escritorio y la fiabilidad de una
            <strong>aplicación nativa (Kotlin)</strong> en tu móvil.
          </p>
          <p>
            Añade una tarea en tu PC y se reflejará al instante en tu teléfono. Sin fricción, solo
            flujo.
          </p>
        </div>
      </div>
    </section>

    <section id="pricing" class="pricing-section">
      <div class="container">
        <h2>Un plan para cada necesidad</h2>
        <div class="pricing-grid">
          <div class="pricing-tier">
            <h3>Personal</h3>
            <h2>Gratis</h2>
            <p>Para organizar tu vida diaria.</p>
            <ul>
              <li>Tareas Ilimitadas</li>
              <li>Notas Ilimitadas</li>
              <li>Sincronización Web y Móvil</li>
              <li>1 Proyecto</li>
            </ul>
            <button class="btn-secondary" @click="goToAuth">Empieza Gratis</button>
          </div>

          <div class="pricing-tier popular">
            <span class="badge">Más Popular</span>
            <h3>Pro</h3>
            <h2>4.99€ <small>/ mes</small></h2>
            <p>Para profesionales y "power-users".</p>
            <ul>
              <li>Todo lo del plan Personal, y además:</li>
              <li><strong>Proyectos Ilimitados</strong></li>
              <li><strong>Recordatorios Recurrentes Avanzados</strong></li>
              <li><strong>Etiquetas (Tags) y Filtros</strong></li>
              <li>Vista de Calendario (Próximamente)</li>
            </ul>
            <button class="btn-primary" @click="goToAuth">Prueba Pro 7 días gratis</button>
          </div>

          <div class="pricing-tier">
            <h3>Teams</h3>
            <h2>8.99€ <small>/u/mes</small></h2>
            <p>Para colaborar con tu equipo.</p>
            <ul>
              <li>Todo lo del plan Pro, y además:</li>
              <li><strong>Proyectos Colaborativos</strong></li>
              <li>Asignación de Tareas</li>
              <li>Dashboard de Equipo</li>
              <li>Integración con Slack (Próximamente)</li>
            </ul>
            <button class="btn-secondary" @click="goToAuth">Contactar con Ventas</button>
          </div>
        </div>
      </div>
    </section>

    <section class="final-cta-section">
      <div class="container">
        <h2>¿Listo para dejar atrás el caos?</h2>
        <p>Crea tu cuenta gratuita en 30 segundos. Recupera tu foco hoy mismo.</p>
        <button class="btn-primary cta-hero" @click="goToAuth">Regístrate Gratis</button>
      </div>
    </section>

    <footer class="main-footer">
      <div class="container">
        <p>© {{ new Date().getFullYear() }} MiApp. Todos los derechos reservados.</p>
      </div>
    </footer>
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
