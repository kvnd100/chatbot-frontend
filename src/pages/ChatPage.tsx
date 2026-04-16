import { useRef, useEffect, useState, type KeyboardEvent } from 'react'
import { Bot, Plus, LogOut, Send, MessageSquare } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useChatStore } from '@/store/chatStore'
import { useLogout } from '@/hooks/useAuth'
import {
  useConversations,
  useCreateConversation,
  useConversationMessages,
  useChatSocket,
} from '@/hooks/useChat'
import type { Message, Conversation } from '@/types'
import { cn, formatTime, formatDate } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// ── Sidebar ───────────────────────────────────────────────────────────────────

function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: Conversation
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full rounded-lg px-3 py-2.5 text-left transition-colors',
        isActive
          ? 'bg-white/15 text-white'
          : 'text-slate-300 hover:bg-white/8 hover:text-white',
      )}
    >
      <div className="flex items-center gap-2">
        <MessageSquare className="h-3.5 w-3.5 shrink-0 opacity-60" />
        <span className="truncate text-sm font-medium">
          {conv.title ?? 'New conversation'}
        </span>
      </div>
      <p className="mt-0.5 pl-5.5 text-xs text-slate-400">{formatDate(conv.createdAt)}</p>
    </button>
  )
}

function Sidebar({
  conversations,
  isLoading,
  onNewChat,
}: {
  conversations: Conversation[]
  isLoading: boolean
  onNewChat: () => void
}) {
  const user = useAuthStore((s) => s.user)
  const logout = useLogout()
  const { activeConversationId, setActiveConversation } = useChatStore()

  return (
    <aside className="flex w-64 shrink-0 flex-col bg-slate-900">
      {/* Logo */}
      <div className="flex h-16 items-center gap-2.5 border-b border-slate-700/60 px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
          <Bot className="h-4.5 w-4.5 text-white" />
        </div>
        <span className="text-base font-semibold text-white">LearnBot</span>
      </div>

      {/* New chat */}
      <div className="p-3">
        <Button
          onClick={onNewChat}
          className="w-full justify-start gap-2 bg-indigo-600 text-white hover:bg-indigo-500"
        >
          <Plus className="h-4 w-4" />
          New chat
        </Button>
      </div>

      {/* Conversation list */}
      <div className="flex-1 overflow-y-auto scrollbar-thin px-2 pb-2">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-600 border-t-indigo-400" />
          </div>
        ) : conversations.length === 0 ? (
          <p className="px-3 py-4 text-center text-xs text-slate-500">No conversations yet</p>
        ) : (
          <div className="space-y-0.5">
            {conversations.map((conv) => (
              <ConversationItem
                key={conv.id}
                conv={conv}
                isActive={conv.id === activeConversationId}
                onClick={() => setActiveConversation(conv.id)}
              />
            ))}
          </div>
        )}
      </div>

      {/* User footer */}
      <div className="border-t border-slate-700/60 p-3">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-white">{user?.name}</p>
            <p className="truncate text-xs text-slate-400">@{user?.username}</p>
          </div>
          <button
            onClick={logout}
            title="Sign out"
            className="rounded-md p-1.5 text-slate-400 transition-colors hover:bg-slate-700 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

// ── Message bubbles ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: Message }) {
  const isUser = message.role === 'user'

  return (
    <div className={cn('flex items-end gap-3', isUser && 'flex-row-reverse')}>
      {/* Avatar */}
      <div
        className={cn(
          'flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold',
          isUser ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600',
        )}
      >
        {isUser ? 'U' : <Bot className="h-4 w-4" />}
      </div>

      {/* Bubble */}
      <div
        className={cn(
          'max-w-[72%] rounded-2xl px-4 py-2.5 text-sm',
          isUser
            ? 'rounded-br-sm bg-indigo-600 text-white'
            : 'rounded-bl-sm border border-slate-200 bg-white text-slate-800 shadow-sm',
        )}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{message.content}</p>
        <p
          className={cn(
            'mt-1.5 text-[11px]',
            isUser ? 'text-right text-indigo-200' : 'text-slate-400',
          )}
        >
          {formatTime(message.createdAt)}
        </p>
      </div>
    </div>
  )
}

function TypingIndicator() {
  return (
    <div className="flex items-end gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-200">
        <Bot className="h-4 w-4 text-slate-600" />
      </div>
      <div className="rounded-2xl rounded-bl-sm border border-slate-200 bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center gap-1">
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.3s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400 [animation-delay:-0.15s]" />
          <span className="h-2 w-2 animate-bounce rounded-full bg-slate-400" />
        </div>
      </div>
    </div>
  )
}

// ── Message input ─────────────────────────────────────────────────────────────

function MessageInput({
  onSend,
  disabled,
}: {
  onSend: (content: string) => void
  disabled?: boolean
}) {
  const [value, setValue] = useState('')
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const adjustHeight = () => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  const handleSubmit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setValue('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit()
    }
  }

  return (
    <div className="flex items-end gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ring-1 ring-transparent transition-shadow focus-within:ring-indigo-500/30 focus-within:border-indigo-300">
      <textarea
        ref={textareaRef}
        value={value}
        onChange={(e) => {
          setValue(e.target.value)
          adjustHeight()
        }}
        onKeyDown={handleKeyDown}
        placeholder="Message LearnBot… (Enter to send, Shift+Enter for newline)"
        disabled={disabled}
        rows={1}
        className="flex-1 resize-none bg-transparent text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none disabled:opacity-50"
        style={{ minHeight: '24px', maxHeight: '160px' }}
      />
      <button
        onClick={handleSubmit}
        disabled={!value.trim() || disabled}
        className="mb-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-indigo-600 text-white transition-colors hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Send className="h-4 w-4" />
      </button>
    </div>
  )
}

// ── Empty / welcome states ────────────────────────────────────────────────────

function WelcomeScreen({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-6 p-8">
      <div className="flex h-20 w-20 items-center justify-center rounded-3xl bg-indigo-50">
        <Bot className="h-10 w-10 text-indigo-600" />
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold text-slate-900">Welcome to LearnBot</h2>
        <p className="mt-2 text-slate-500">Your AI-powered learning companion. Ask me anything.</p>
      </div>
      <Button
        onClick={onNewChat}
        className="gap-2 bg-indigo-600 px-6 hover:bg-indigo-500"
      >
        <Plus className="h-4 w-4" />
        Start a conversation
      </Button>
    </div>
  )
}

function EmptyConversation() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-3 p-8">
      <MessageSquare className="h-10 w-10 text-slate-300" />
      <p className="text-sm text-slate-500">Send a message to start the conversation</p>
    </div>
  )
}

// ── Chat window ───────────────────────────────────────────────────────────────

function ChatWindow({
  conversations,
  isBotTyping,
  onSend,
}: {
  conversations: Conversation[]
  isBotTyping: boolean
  onSend: (content: string) => void
}) {
  const activeConversationId = useChatStore((s) => s.activeConversationId)
  const messagesMap = useChatStore((s) => s.messages)
  const messages = activeConversationId ? messagesMap[activeConversationId] ?? [] : []
  const { isLoading: isLoadingMessages } = useConversationMessages(activeConversationId)
  const bottomRef = useRef<HTMLDivElement>(null)

  const activeConv = conversations.find((c) => c.id === activeConversationId)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isBotTyping])

  if (!activeConversationId) return null

  return (
    <>
      {/* Header */}
      <div className="flex h-16 shrink-0 items-center border-b border-slate-200 bg-white px-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50">
            <Bot className="h-4 w-4 text-indigo-600" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              {activeConv?.title ?? 'New conversation'}
            </h2>
            <p className="text-xs text-slate-400">LearnBot</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto scrollbar-thin bg-slate-50 p-6">
        {isLoadingMessages ? (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600" />
          </div>
        ) : messages.length === 0 && !isBotTyping ? (
          <EmptyConversation />
        ) : (
          <div className="mx-auto max-w-3xl space-y-4">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isBotTyping && <TypingIndicator />}
            <div ref={bottomRef} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className="shrink-0 border-t border-slate-200 bg-white p-4">
        <div className="mx-auto max-w-3xl">
          <MessageInput onSend={onSend} disabled={isBotTyping} />
          <p className="mt-2 text-center text-[11px] text-slate-400">
            LearnBot can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────

export function ChatPage() {
  const { data: conversations = [], isLoading: isLoadingConvs } = useConversations()
  const createConversation = useCreateConversation()
  const { isBotTyping, sendMessage } = useChatSocket()
  const activeConversationId = useChatStore((s) => s.activeConversationId)

  const handleNewChat = () => {
    createConversation.mutate(undefined)
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        conversations={conversations}
        isLoading={isLoadingConvs}
        onNewChat={handleNewChat}
      />

      <main className="flex flex-1 flex-col overflow-hidden">
        {activeConversationId ? (
          <ChatWindow
            conversations={conversations}
            isBotTyping={isBotTyping}
            onSend={sendMessage}
          />
        ) : (
          <WelcomeScreen onNewChat={handleNewChat} />
        )}
      </main>
    </div>
  )
}
