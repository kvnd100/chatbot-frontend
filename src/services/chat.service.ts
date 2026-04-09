import api from './api'
import type { Conversation, Message } from '@/types'

export const chatService = {
  getConversations: () => api.get<Conversation[]>('/chat/conversation').then((r) => r.data),

  getConversation: (id: string) =>
    api.get<Conversation>(`/chat/conversation/${id}`).then((r) => r.data),

  createConversation: (title?: string) =>
    api.post<Conversation>('/chat/conversation', { title }).then((r) => r.data),

  getMessages: (conversationId: string) =>
    api.get<Message[]>(`/chat/conversation/${conversationId}/messages`).then((r) => r.data),
}
