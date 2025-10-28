 'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useRef, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Send, ArrowLeft, Loader2 } from 'lucide-react'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'

interface Message {
  id: string
  content: string
  createdAt: string
  sender: {
    name: string
    role: string
  }
}

interface Conversation {
  vendorId: string
  vendorName: string
  lastMessage?: string
}

function MessagesContent() {
  const searchParams = useSearchParams()
  const dashboardId = searchParams.get('dashboard')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [selectedVendor, setSelectedVendor] = useState<string | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [loading, setLoading] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!dashboardId) return

    // Fetch conversations (vendors with messages)
    const fetchConversations = async () => {
      try {
        const response = await fetch(`/api/messages/conversations?dashboard=${dashboardId}`)
        const data = await response.json()
        setConversations(data)
      } catch (error) {
        console.error('Error fetching conversations:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchConversations()
  }, [dashboardId])

  useEffect(() => {
    if (!selectedVendor || !dashboardId) return

    // Fetch messages for selected vendor
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `/api/messages?dashboard=${dashboardId}&vendor=${selectedVendor}`
        )
        const data = await response.json()
        setMessages(data)
      } catch (error) {
        console.error('Error fetching messages:', error)
      }
    }

    fetchMessages()

    // Set up real-time subscription
    const channel = supabase
      .channel(`messages-${dashboardId}-${selectedVendor}`)
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `dashboard_id=eq.${dashboardId}`
      }, (payload) => {
        fetchMessages()
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [selectedVendor, dashboardId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedVendor || !dashboardId) return

    try {
      await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dashboardId,
          vendorId: selectedVendor,
          content: newMessage
        })
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  const selectedConversation = conversations.find(c => c.vendorId === selectedVendor)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-rose-500" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-rose-50 to-white">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold mb-8">Messages</h1>

        <div className="grid md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Conversations List */}
          <Card className="md:col-span-1 overflow-hidden flex flex-col">
            <CardHeader>
              <CardTitle>Vendors</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-0">
              {conversations.length === 0 ? (
                <div className="p-6 text-center text-gray-600">
                  No conversations yet
                </div>
              ) : (
                <div>
                  {conversations.map((conversation) => (
                    <button
                      key={conversation.vendorId}
                      onClick={() => setSelectedVendor(conversation.vendorId)}
                      className={`w-full p-4 text-left border-b hover:bg-gray-50 transition-colors ${
                        selectedVendor === conversation.vendorId ? 'bg-rose-50' : ''
                      }`}
                    >
                      <div className="font-semibold">{conversation.vendorName}</div>
                      {conversation.lastMessage && (
                        <div className="text-sm text-gray-600 truncate mt-1">
                          {conversation.lastMessage}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Messages */}
          <Card className="md:col-span-2 overflow-hidden flex flex-col">
            {selectedVendor ? (
              <>
                <CardHeader className="border-b">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedVendor(null)}
                      className="md:hidden"
                    >
                      <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <CardTitle>{selectedConversation?.vendorName}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="flex-1 overflow-y-auto p-4">
                  {messages.length === 0 ? (
                    <div className="text-center text-gray-600 py-12">
                      No messages yet. Start the conversation!
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {messages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${
                            message.sender.role === 'CLIENT' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          <div
                            className={`max-w-[70%] rounded-lg p-3 ${
                              message.sender.role === 'CLIENT'
                                ? 'bg-rose-500 text-white'
                                : 'bg-gray-200 text-gray-900'
                            }`}
                          >
                            <p className="text-sm">{message.content}</p>
                            <p
                              className={`text-xs mt-1 ${
                                message.sender.role === 'CLIENT'
                                  ? 'text-rose-100'
                                  : 'text-gray-600'
                              }`}
                            >
                              {format(new Date(message.createdAt), 'h:mm a')}
                            </p>
                          </div>
                        </div>
                      ))}
                      <div ref={messagesEndRef} />
                    </div>
                  )}
                </CardContent>
                <div className="border-t p-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <Button onClick={sendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <p className="text-gray-600">Select a vendor to start messaging</p>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}

export default function MessagesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <MessagesContent />
    </Suspense>
  )
}

// dynamic export placed at top for client directive ordering
