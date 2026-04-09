import { create } from 'zustand'
import type { Conversation, Message } from '@/types'

interface ChatState {
  activeConversationId: string | null
  messages: Record<string, Message[]>
  setActiveConversation: (id: string | null) => void
  appendMessage: (conversationId: string, message: Message) => void
  setMessages: (conversationId: string, messages: Message[]) => void
}

export const useChatStore = create<ChatState>((set) => ({
  activeConversationId: null,
  messages: {},
  setActiveConversation: (id) => set({ activeConversationId: id }),
  appendMessage: (conversationId, message) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [...(state.messages[conversationId] ?? []), message],
      },
    })),
  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: { ...state.messages, [conversationId]: messages },
    })),
}))

// Ignore unused Conversation type warning — kept for future use
export type { Conversation }
