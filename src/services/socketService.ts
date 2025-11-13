import { io, Socket } from 'socket.io-client'
import { useAuthStore } from '@/stores/auth'

let socket: Socket | null = null
let connectionPromise: Promise<Socket> | null = null

export const getSocket = () => socket

export const leaveProjectRoom = (projectId: number) => {
  if (socket?.connected) {
    const room = `project_${projectId}`
    console.log(`Emitting leave_project for room: ${room}`)
    socket.emit('leave_project', projectId) // Send event to backend
    // Optional: socket.leave(room) on client-side too, though backend handles primary logic
  } else {
    console.warn('Socket not connected, cannot leave room.')
  }
}

export const connectSocket = (): Promise<Socket> => {
  if (socket?.connected) {
    return Promise.resolve(socket)
  }
  // If already connecting, return the existing promise
  if (connectionPromise) {
    return connectionPromise
  }

  connectionPromise = new Promise((resolve, reject) => {
    // ... (get token if needed) ...
    console.log('Attempting to connect socket...')
    const newSocket = io(import.meta.env.VITE_API_URL, {
      /* ... */
    })

    newSocket.on('connect', () => {
      console.log('⚡️ Socket connected:', newSocket.id)
      socket = newSocket
      connectionPromise = null

      // 👇 ENVIAR TOKEN AL CONECTAR 👇
      const authStore = useAuthStore() // Obtén el store
      const token = authStore.token
      if (token) {
        console.log('Authenticating socket...')
        socket.emit('authenticate', token)
      } else {
        console.warn('Socket connected but no auth token found.')
        // Podrías desconectar si la autenticación es obligatoria
        // socket.disconnect();
        // reject(new Error("No auth token"));
        // return;
      }

      resolve(socket) // Resuelve DESPUÉS de intentar autenticar
      // ... otros listeners ...
    })

    newSocket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message)
      socket = null
      connectionPromise = null // Reset promise on error
      reject(err) // Reject the promise
    })
  })
  return connectionPromise
}
export const disconnectSocket = () => {
  if (socket) {
    console.log('Disconnecting socket...')
    socket.disconnect()
    socket = null
  }
}

export const joinProjectRoom = async (projectId: number) => {
  try {
    // Wait for connection if not already connected
    const currentSocket = socket?.connected ? socket : await connectSocket()
    if (currentSocket?.connected) {
      console.log(`Emitting join_project for project ID: ${projectId}`)
      currentSocket.emit('join_project', projectId)
    } else {
      console.error('Failed to connect socket before joining room.')
    }
  } catch (error) {
    console.error('Error connecting socket to join room:', error)
  }
}
// En src/services/socketService.ts
export const joinUserRoom = (userId: number) => {
  if (socket?.connected) {
    socket.emit('join_user_room', userId) // Evento para el backend
  }
}

export const leaveUserRoom = (userId: number) => {
  if (socket?.connected) {
    socket.emit('leave_user_room', userId) // Evento para el backend
  }
}
// Add functions here to emit other events (e.g., emitTaskUpdate)
// export const emitTaskUpdate = (taskData) => { ... };

// Add functions here to listen to specific events (could also be done in components)
// export const listenForTaskUpdates = (callback) => { ... };
