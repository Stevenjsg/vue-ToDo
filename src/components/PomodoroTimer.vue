<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue' // Add watch
import apiClient from '@/services/api'
import type { tipo_sesion_pomodoro_enum } from '@/data/DataTypes'
import IconPlay from '@/assets/icon/IconPlay.vue'
import IconRepeat from '@/assets/icon/IconRepeat.vue'
import IconSkip from '@/assets/icon/IconSkip.vue'
import IconPause from '@/assets/icon/IconPause.vue'

// --- Define Props with Defaults ---
const props = withDefaults(
  defineProps<{
    workMinutes?: number
    shortBreakMinutes?: number
    longBreakMinutes?: number
    sessionsBeforeLongBreak?: number
  }>(),
  {
    // Default values if props are not provided
    workMinutes: 25,
    shortBreakMinutes: 5,
    longBreakMinutes: 15,
    sessionsBeforeLongBreak: 4,
  },
)

// --- Estado del Temporizador ---
// Initialize timeLeft with the prop value
const timeLeft = ref(props.workMinutes * 60)
const timerState = ref<'idle' | 'running' | 'paused'>('idle')
const currentSessionType = ref<tipo_sesion_pomodoro_enum>('trabajo')
const completedSessions = ref(0)
let intervalId: number | null = null

// --- Watch for Prop Changes ---
// If the configuration changes in the parent, reset the timer
watch(
  () => [
    props.workMinutes,
    props.shortBreakMinutes,
    props.longBreakMinutes,
    props.sessionsBeforeLongBreak,
  ],
  () => {
    resetTimer()
  },
)

// --- Funciones de Control ---
const startTimer = () => {
  if (timerState.value === 'running') return
  timerState.value = 'running'
  intervalId = setInterval(() => {
    if (timeLeft.value > 0) {
      timeLeft.value--
    } else {
      handleSessionEnd()
    }
  }, 1000)
}

const pauseTimer = () => {
  if (intervalId) {
    clearInterval(intervalId)
    intervalId = null
  }
  timerState.value = 'paused'
}
const resetTimer = () => {
  pauseTimer()
  currentSessionType.value = 'trabajo'
  // Use props for resetting timeLeft
  timeLeft.value = props.workMinutes * 60
  completedSessions.value = 0
  timerState.value = 'idle'
}

const skipSession = () => {
  handleSessionEnd(true)
}

// --- Lógica de Fin de Sesión ---
const handleSessionEnd = async (skipped = false) => {
  pauseTimer()

  // Use props for durations
  const duration =
    currentSessionType.value === 'trabajo'
      ? props.workMinutes
      : currentSessionType.value === 'descanso_corto'
        ? props.shortBreakMinutes
        : props.longBreakMinutes

  // ... (logging logic remains the same) ...
  if (!skipped && currentSessionType.value === 'trabajo') {
    completedSessions.value++
    try {
      await apiClient.post('/pomodoro/log', {
        durationMinutes: duration,
        sessionType: currentSessionType.value,
      })
      console.log('Pomodoro session logged.')
    } catch (error) {
      console.error('Error logging pomodoro session:', error)
    }
  }
  // Determine the next session using props
  if (currentSessionType.value === 'trabajo') {
    if (completedSessions.value % props.sessionsBeforeLongBreak === 0) {
      currentSessionType.value = 'descanso_largo'
      timeLeft.value = props.longBreakMinutes * 60
    } else {
      currentSessionType.value = 'descanso_corto'
      timeLeft.value = props.shortBreakMinutes * 60
    }
  } else {
    currentSessionType.value = 'trabajo'
    timeLeft.value = props.workMinutes * 60
  }

  timerState.value = 'idle'
  // Opcional: Notificación o sonido
  // new Audio('/path/to/notification.mp3').play();
  // alert('¡Sesión terminada!');
  // ... (notification logic) ...
}

// --- Formato del Tiempo (no changes needed) ---
const formattedTime = computed(() => {
  const minutes = Math.floor(timeLeft.value / 60)
  const seconds = timeLeft.value % 60
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
})

// --- Propiedades Computadas para el SVG ---
const totalDuration = computed(() => {
  // Duración total de la sesión actual en segundos
  if (currentSessionType.value === 'trabajo') return props.workMinutes * 60
  if (currentSessionType.value === 'descanso_corto') return props.shortBreakMinutes * 60
  if (currentSessionType.value === 'descanso_largo') return props.longBreakMinutes * 60
  return props.workMinutes * 60 // Fallback
})

// --- Lógica del Círculo SVG ---
const radius = 90 // Radio del círculo
const circumference = 2 * Math.PI * radius // Circunferencia

const progressOffset = computed(() => {
  const percentageLeft = timeLeft.value / totalDuration.value
  return circumference * (1 - percentageLeft)
})

// --- Limpieza al desmontar (no changes needed) ---
onUnmounted(() => {
  pauseTimer() // Limpia el intervalo si el componente se destruye
})
</script>

<template>
  <div class="pomodoro-timer">
    <div class="visual-timer">
      <svg class="timer-svg" viewBox="0 0 200 200">
        <circle class="timer-track" :r="radius" cx="100" cy="100" />
        <circle
          class="timer-progress"
          :r="radius"
          cx="100"
          cy="100"
          :style="{
            strokeDasharray: circumference,
            strokeDashoffset: progressOffset,
          }"
        />
      </svg>
      <div class="timer-display">
        <span>{{ formattedTime }}</span>
        <small>{{ currentSessionType }}</small>
      </div>
    </div>

    <div class="timer-controls">
      <button class="btn-timer" v-if="timerState !== 'running'" @click="startTimer">
        <IconPlay />
      </button>
      <button class="btn-timer" v-if="timerState === 'running'" @click="pauseTimer">
        <IconPause />
      </button>
      <button class="btn-timer" @click="resetTimer">
        <IconRepeat />
      </button>
      <button class="btn-timer" @click="skipSession">
        <IconSkip />
      </button>
    </div>
  </div>
</template>

<style scoped>
.btn-timer {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}
.btn-timer:hover {
  background-color: var(--color-accent-hover);
}
.pomodoro-timer {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* --- Círculo Visual --- */
.visual-timer {
  position: relative;
  width: 240px;
  height: 240px;
  margin: 1rem 0;
}

.timer-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg); /* Inicia el progreso desde arriba */
}

.timer-track,
.timer-progress {
  fill: none;
  stroke-width: 10;
}

.timer-track {
  stroke: var(--color-border); /* Color del fondo del círculo */
}

.timer-progress {
  stroke: var(--color-accent); /* Color del progreso */
  transition: stroke-dashoffset 0.5s linear;
}

/* --- Texto del Temporizador (Centrado) --- */
.timer-display {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}

.timer-display span {
  font-size: 3.5rem;
  font-weight: bold;
  color: var(--color-text-primary);
  line-height: 1;
}
.timer-display small {
  display: block;
  font-size: 1rem;
  font-weight: normal;
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

/* --- Controles (sin cambios) --- */
.timer-controls {
  display: flex;
  gap: 0.75rem;
}
/* ... (pega tus estilos de botones aquí) ... */
</style>
