<script setup lang="ts">
import { ref } from 'vue'
import PomodoroTimer from '@components/PomodoroTimer.vue' // Asumiendo la ruta
import PomodoroTimer from '@/components/PomodoroTimer.vue' // Asumiendo la ruta
import IconSettings from '@/assets/icon/IconSettings.vue'

// --- Estado y Datos ---
const showConfig = ref(false)
const workDuration = ref(25)
const shortBreakDuration = ref(5)
const longBreakDuration = ref(15)
const sessionsBeforeLongBreak = ref(4)

// Definimos la estructura de un preset
interface PomodoroPreset {
  name: string
  config: {
    work: number
    short: number
    long: number
    sessions: number
  }
}

// Inicializamos los presets (podrías cargarlos de localStorage)
const presets = ref<PomodoroPreset[]>([
  { name: 'Clásico', config: { work: 25, short: 5, long: 15, sessions: 4 } },
  { name: 'Focus 50/10', config: { work: 50, short: 10, long: 20, sessions: 2 } },
])

const selectedPresetName = ref('Clásico')
const newPresetName = ref('')

// --- FUNCIONES ---

// 👇 1. Define la función applyPreset
const applyPreset = () => {
  const selected = presets.value.find((p) => p.name === selectedPresetName.value)
  if (selected) {
    workDuration.value = selected.config.work
    shortBreakDuration.value = selected.config.short
    longBreakDuration.value = selected.config.long
    sessionsBeforeLongBreak.value = selected.config.sessions
  }
}

// 👇 2. Define la función savePreset
const savePreset = () => {
  const name = newPresetName.value.trim()
  if (name && !presets.value.some((p) => p.name === name)) {
    presets.value.push({
      name: name,
      config: {
        work: workDuration.value,
        short: shortBreakDuration.value,
        long: longBreakDuration.value,
        sessions: sessionsBeforeLongBreak.value,
      },
    })
    newPresetName.value = '' // Limpia el input
    // Opcional: Guarda los presets en localStorage
    // localStorage.setItem('pomodoroPresets', JSON.stringify(presets.value));
  } else if (!name) {
    alert('Por favor, introduce un nombre para el preset.')
  } else {
    alert('Ya existe un preset con ese nombre.')
  }
}

// Puedes llamar a applyPreset al inicio para cargar la configuración inicial
applyPreset()
</script>

<template>
  <div class="pomodoro-view">
    <div class="timer-container">
      <PomodoroTimer
        :work-minutes="workDuration"
        :short-break-minutes="shortBreakDuration"
        :long-break-minutes="longBreakDuration"
        :sessions-before-long-break="sessionsBeforeLongBreak"
      />
    </div>

    <div class="config-wrapper">
      <div class="config-header">
        <select v-model="selectedPresetName" @change="applyPreset" class="preset-select">
          <option v-for="p in presets" :key="p.name" :value="p.name">{{ p.name }}</option>
        </select>
        <button @click="showConfig = !showConfig" class="settings-btn" title="Ajustes">
          <IconSettings />
        </button>
      </div>

      <Transition name="slide-fade">
        <div v-if="showConfig" class="config-details">
          <div class="duration-inputs">
            <label
              >Trabajo: <input type="number" v-model.number="workDuration" min="1" /> min</label
            >
            <label
              >Desc. Corto:
              <input type="number" v-model.number="shortBreakDuration" min="1" /> min</label
            >
            <label
              >Desc. Largo:
              <input type="number" v-model.number="longBreakDuration" min="1" /> min</label
            >
            <label
              >Sesiones: <input type="number" v-model.number="sessionsBeforeLongBreak" min="1"
            /></label>
          </div>
          <div class="save-preset">
            <input type="text" v-model="newPresetName" placeholder="Nombre del nuevo preset" />
            <button @click="savePreset">Guardar Preset</button>
          </div>
        </div>
      </Transition>
    </div>
  </div>
</template>

<style scoped>
.config-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  gap: 1rem; /* Añade espacio entre el select y el botón */
}

.preset-select {
  flex-grow: 1; /* 1. Hace que el select ocupe el espacio disponible */

  /* Tus estilos existentes */
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 6px;
  font-size: 1rem;

  /* Evita que el texto se desborde si es muy largo */
  overflow: hidden;
  text-overflow: ellipsis;
}

.pomodoro-view {
  max-width: 900px; /* Ancho máximo para el contenido */
  margin: 2rem auto; /* Centrado */
  padding: 1rem;
}

h1 {
  text-align: center;
  color: var(--color-text-primary);
  margin-bottom: 2rem;
}

/* --- Sección de Configuración --- */
.config-section {
  background-color: var(--color-surface);
  padding: 1.5rem;
  border-radius: 12px;
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
  display: flex;
  flex-direction: column; /* Apilado por defecto (móvil) */
  gap: 1.5rem;
}

/* Grupo para selector de presets */
.preset-selector {
  display: flex;
  flex-direction: column; /* Apilado en móvil */
  gap: 0.5rem;
}

/* Grupo para inputs de duración */
.duration-inputs {
  display: grid;
  /* 2 columnas en móvil, 4 en escritorio */
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

/* Grupo para guardar preset */
.save-preset {
  display: flex;
  flex-direction: column; /* Apilado en móvil */
  gap: 0.5rem;
}
.settings-btn {
  flex-shrink: 0; /* 2. Evita que el botón se encoja */

  /* Tus estilos existentes */
  background: none;
  border: none;
  color: var(--color-text-secondary);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 50%;
  display: flex; /* Ayuda a centrar el icono ⚙️ */
  align-items: center;
  justify-content: center;
}
.settings-btn:hover {
  background-color: var(--color-border);
}
label {
  display: flex;
  flex-direction: column; /* Etiqueta encima del input en móvil */
  gap: 0.25rem;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

input[type='number'],
input[type='text'],
select {
  width: 100%; /* Ocupa todo el ancho disponible en su contenedor */
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border-radius: 6px;
  box-sizing: border-box; /* Asegura que el padding no desborde */
  font-size: 1rem;
}

button {
  padding: 0.75rem 1rem;
  border: none;
  background-color: var(--color-accent);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
}
.save-preset button {
  background-color: var(--color-surface);
  color: var(--color-accent);
  border: 1px solid var(--color-accent);
}

/* --- Media Query para Escritorio --- */
@media (min-width: 768px) {
  .pomodoro-view {
    max-width: 600px; /* Centra el contenido */
    margin: 2rem auto;
    padding: 1rem;
  }

  .timer-container {
    background-color: var(--color-surface);
    border-radius: 12px;
    border: 1px solid var(--color-border);
    padding: 2rem;
    margin-bottom: 2rem;
  }

  /* --- Sección de Configuración --- */
  .config-wrapper {
    background-color: var(--color-surface);
    border-radius: 12px;
    border: 1px solid var(--color-border);
  }

  .config-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 1.5rem;
  }

  .preset-select {
    padding: 0.75rem;
    border: 1px solid var(--color-border);
    background-color: var(--color-background);
    color: var(--color-text-primary);
    border-radius: 6px;
    font-size: 1rem;
  }

  .settings-btn {
    background: none;
    border: none;
    color: var(--color-text-secondary);
    font-size: 1.5rem;
    cursor: pointer;
    padding: 0.5rem;
    border-radius: 50%;
  }
  .settings-btn:hover {
    background-color: var(--color-border);
  }

  .config-details {
    padding: 0 1.5rem 1.5rem 1.5rem;
    border-top: 1px solid var(--color-border);
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }
  .save-preset {
    flex-direction: row; /* Lado a lado en escritorio */
    align-items: center;
  }
  .save-preset input {
    flex-grow: 1; /* Input ocupa espacio sobrante */
  }
  .save-preset button {
    width: auto; /* Ancho automático */
  }
}
/* --- Animación para mostrar/ocultar configuración --- */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease-out;
  max-height: 200px; /* Altura máxima aproximada */
}
.slide-fade-enter-from,
.slide-fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
  max-height: 0;
}
/* --- Contenedor del Pomodoro Timer --- */
/* (El componente PomodoroTimer ya tiene sus propios estilos internos) */
.pomodoro-timer-container {
  /* Puedes añadir márgenes o estilos aquí si necesitas */
  margin-top: 2rem;
}
</style>
