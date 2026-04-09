import { io, Socket } from 'socket.io-client'
import type { Message } from '@/types'

const SOCKET_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(SOCKET_URL, { autoConnect: false })
  }
  return socket
}

export function connectSocket() {
  getSocket().connect()
}

export function disconnectSocket() {
  socket?.disconnect()
  socket = null
}

// Typed socket event helpers
export function joinConversation(conversationId: string) {
  getSocket().emit('joinConversation', { conversationId })
}

export function leaveConversation(conversationId: string) {
  getSocket().emit('leaveConversation', { conversationId })
}

export function sendSocketMessage(conversationId: string, content: string) {
  getSocket().emit('sendMessage', { conversationId, content, role: 'user' })
}

export function onNewMessage(handler: (message: Message) => void) {
  getSocket().on('newMessage', handler)
  return () => getSocket().off('newMessage', handler)
}

export function onSocketError(handler: (err: { statusCode: number; message: string }) => void) {
  getSocket().on('error', handler)
  return () => getSocket().off('error', handler)
}
