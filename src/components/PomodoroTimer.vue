<script setup lang="ts">
import { ref, computed, onUnmounted, watch } from 'vue' // Add watch
import apiClient from '@/services/api'
import type { tipo_sesion_pomodoro_enum } from '@/data/DataTypes'

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
// --- Limpieza al desmontar (no changes needed) ---
onUnmounted(() => {
  pauseTimer() // Limpia el intervalo si el componente se destruye
})
</script>

<template>
  <div class="pomodoro-timer">
    <div class="timer-display">
      <span>{{ formattedTime }}</span>
      <small>{{ currentSessionType }}</small>
    </div>
    <div class="timer-controls">
      <button v-if="timerState !== 'running'" @click="startTimer">▶️ Iniciar</button>
      <button v-if="timerState === 'running'" @click="pauseTimer">⏸️ Pausar</button>
      <button @click="resetTimer">🔄 Resetear</button>
      <button @click="skipSession">⏭️ Saltar</button>
    </div>
  </div>
</template>

<style scoped>
.pomodoro-timer {
  background-color: var(--color-surface);
  padding: 1rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.timer-display {
  font-size: 3rem;
  font-weight: bold;
  color: var(--color-text-primary);
  text-align: center;
}
.timer-display small {
  display: block;
  font-size: 0.9rem;
  font-weight: normal;
  color: var(--color-text-secondary);
  text-transform: capitalize;
}

.timer-controls {
  display: flex;
  gap: 0.75rem;
}

.timer-controls button {
  background-color: var(--color-background);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.timer-controls button:hover {
  background-color: var(--color-border);
}

/* Estilo específico para el botón de Iniciar/Reanudar */
.timer-controls button:first-child {
  background-color: var(--color-accent);
  color: white;
  border-color: var(--color-accent);
}
.timer-controls button:first-child:hover {
  background-color: var(--color-accent-hover);
}
</style>
