import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState, useCallback } from 'react'
import { chatService } from '@/services/chat.service'
import { useChatStore } from '@/store/chatStore'
import {
  connectSocket,
  disconnectSocket,
  joinConversation,
  leaveConversation,
  sendSocketMessage,
  onNewMessage,
  onSocketError,
} from '@/services/socket'

export function useConversations() {
  return useQuery({
    queryKey: ['conversations'],
    queryFn: chatService.getConversations,
    staleTime: 10_000,
  })
}

export function useCreateConversation() {
  const queryClient = useQueryClient()
  const setActiveConversation = useChatStore((s) => s.setActiveConversation)

  return useMutation({
    mutationFn: (title?: string) => chatService.createConversation(title),
    onSuccess: (conv) => {
      queryClient.invalidateQueries({ queryKey: ['conversations'] })
      setActiveConversation(conv.id)
    },
  })
}

export function useConversationMessages(conversationId: string | null) {
  const setMessages = useChatStore((s) => s.setMessages)

  const query = useQuery({
    queryKey: ['messages', conversationId],
    queryFn: () => chatService.getMessages(conversationId!),
    enabled: !!conversationId,
    staleTime: 30_000,
  })

  useEffect(() => {
    if (query.data && conversationId) {
      setMessages(conversationId, query.data)
    }
  }, [query.data, conversationId, setMessages])

  return { isLoading: query.isLoading }
}

export function useChatSocket() {
  const [isBotTyping, setIsBotTyping] = useState(false)
  const activeConversationId = useChatStore((s) => s.activeConversationId)
  const prevConvIdRef = useRef<string | null>(null)

  // Socket lifecycle — connect once, disconnect on unmount
  useEffect(() => {
    connectSocket()

    const offMessage = onNewMessage((message) => {
      const { activeConversationId: convId, appendMessage } = useChatStore.getState()
      if (convId) {
        appendMessage(convId, message)
        if (message.role === 'assistant') {
          setIsBotTyping(false)
        }
      }
    })

    const offError = onSocketError((err) => {
      console.error('Socket error:', err)
      setIsBotTyping(false)
    })

    return () => {
      offMessage()
      offError()
      disconnectSocket()
    }
  }, [])

  // Join/leave conversation rooms when active conversation changes
  useEffect(() => {
    const prev = prevConvIdRef.current
    if (prev && prev !== activeConversationId) {
      leaveConversation(prev)
    }
    if (activeConversationId) {
      joinConversation(activeConversationId)
    }
    prevConvIdRef.current = activeConversationId
  }, [activeConversationId])

  // Reset typing indicator when switching conversations
  useEffect(() => {
    setIsBotTyping(false)
  }, [activeConversationId])

  const sendMessage = useCallback((content: string) => {
    const convId = useChatStore.getState().activeConversationId
    if (!convId || !content.trim()) return
    setIsBotTyping(true)
    sendSocketMessage(convId, content.trim())
  }, [])

  return { isBotTyping, sendMessage }
}
