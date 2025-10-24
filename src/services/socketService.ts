import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null
let connectionPromise: Promise<Socket> | null = null

export const getSocket = () => socket

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
    const newSocket = io('http://localhost:3000', {
      /* ... */
    })

    newSocket.on('connect', () => {
      console.log('⚡️ Socket connected:', newSocket.id)
      socket = newSocket // Assign to global variable
      connectionPromise = null // Reset promise
      resolve(socket) // Resolve the promise
      // Add other listeners here or return socket and add them elsewhere

      newSocket.on('disconnect', (reason) => {
        socket = null
        console.log('Socket disconnected:', reason)
      })
      newSocket.on('joined_message', (message) => {
        console.log('Joined message:', message)
      })
      newSocket.on('user_joined', (message) => {
        console.log('User joined:', message)
      })
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

// Add functions here to emit other events (e.g., emitTaskUpdate)
// export const emitTaskUpdate = (taskData) => { ... };

// Add functions here to listen to specific events (could also be done in components)
// export const listenForTaskUpdates = (callback) => { ... };
