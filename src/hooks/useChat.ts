"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store'

export function useChat() {
    const {
        currentUser,
        activeRoomId,
        rooms,
        messages,
        setCurrentUser,
        setActiveRoomId,
        setRooms,
        setMessages,
        addMessage,
        updateMessage
    } = useChatStore()
    const [loading, setLoading] = useState(true)

    // Fetch current user
    useEffect(() => {
        const fetchUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (user) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', user.id)
                    .single()

                if (profile) {
                    setCurrentUser(profile)
                    // Auto-update status if it has the old branding
                    if (profile.status === 'Hey there! I am using WhatsApp.') {
                        const newStatus = 'Hey there! I am using ForReal.'
                        supabase.from('profiles').update({ status: newStatus }).eq('id', user.id).then(() => {
                            setCurrentUser({ ...profile, status: newStatus })
                        })
                    }
                } else {
                    // If auth user exists but profile is missing, set a placeholder
                    // to allow MainLayout to redirect to /setup-profile
                    setCurrentUser({
                        id: user.id,
                        username: '',
                        avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${user.email || user.id}`,
                        status: 'Hey there! I am using ForReal.'
                    })
                }
            } else {
                setCurrentUser(null)
            }
            setLoading(false)
        }
        fetchUser()
    }, [setCurrentUser])

    // Fetch rooms
    useEffect(() => {
        if (!currentUser) return

        const fetchRooms = async () => {
            const { data } = await supabase
                .from('room_participants')
                .select(`
          room_id,
          rooms (
            id,
            name,
            type,
            image_url,
            room_participants (
              user_id,
              profiles (
                username,
                avatar_url,
                is_online,
                last_seen
              )
            )
          )
        `)
                .eq('user_id', currentUser.id)

            if (data) {
                const formattedRooms = data.map((item: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                    const room = item.rooms
                    // For private chats, get the other user's details
                    if (room.type === 'private') {
                        const otherParticipant = room.room_participants.find(
                            (p: any) => p.user_id !== currentUser.id // eslint-disable-line @typescript-eslint/no-explicit-any
                        )
                        if (otherParticipant) {
                            room.name = otherParticipant.profiles.username
                            room.image_url = otherParticipant.profiles.avatar_url
                            room.is_online = otherParticipant.profiles.is_online
                            room.last_seen = otherParticipant.profiles.last_seen
                            room.other_user_id = otherParticipant.user_id
                        } else {
                            room.is_invalid = true
                        }
                    }
                    return room
                })
                    .filter((r: any) => !r.is_invalid) // eslint-disable-line @typescript-eslint/no-explicit-any

                // Deduplicate private rooms
                const uniqueRooms = formattedRooms.reduce((acc: any[], current: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                    if (current.type === 'private' && current.other_user_id) {
                        const existingIndex = acc.findIndex(r => r.type === 'private' && r.other_user_id === current.other_user_id)
                        if (existingIndex > -1) {
                            return acc
                        }
                    }
                    acc.push(current)
                    return acc
                }, [])

                setRooms(uniqueRooms)
            }
        }

        // Initial fetch
        fetchRooms()

        // 🔄 Auto-refresh rooms every 5 seconds to update online status
        const roomsInterval = setInterval(() => {
            fetchRooms()
        }, 5000) // Poll every 5 seconds

        return () => {
            clearInterval(roomsInterval)
        }
    }, [currentUser, setRooms])

    // Fetch messages for active room
    useEffect(() => {
        if (!activeRoomId) {
            setMessages([])
            return
        }

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', activeRoomId)
                .order('created_at', { ascending: true })

            if (data) setMessages(data)
        }

        // Initial fetch
        fetchMessages()

        // 🔄 Auto-refresh every 1 second for real-time updates
        const pollInterval = setInterval(() => {
            fetchMessages()
        }, 1000) // Poll every 1 second

        // Realtime subscription with status logging
        const channel = supabase
            .channel(`room:${activeRoomId}`, {
                config: {
                    broadcast: { self: false }
                }
            })
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${activeRoomId}`,
            }, (payload) => {
                console.log('📨 New message received:', payload.new)
                addMessage(payload.new)

                // If the message is from the other person, mark it as read immediately
                if (payload.new.sender_id !== currentUser?.id) {
                    supabase.from('messages').update({ status: 'read' }).eq('id', payload.new.id).then()
                }
            })
            .on('postgres_changes', {
                event: 'UPDATE',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${activeRoomId}`,
            }, (payload) => {
                console.log('🔄 Message updated:', payload.new)
                updateMessage(payload.new.id, payload.new)
            })
            .subscribe((status) => {
                console.log('🔌 Subscription status:', status)
                if (status === 'SUBSCRIBED') {
                    console.log('✅ Real-time subscription active for room:', activeRoomId)
                }
            })

        // Mark unread messages as read when entering room
        const markAsRead = async () => {
            if (!currentUser) return
            const { error, count } = await supabase
                .from('messages')
                .update({ status: 'read' })
                .eq('room_id', activeRoomId)
                .neq('sender_id', currentUser.id)
                .in('status', ['sent', 'delivered'])
                .select() // Select is needed to return count/data with RLS? Usually update returns count if specified.

            if (error) {
                console.error('❌ Error marking messages as read:', error)
            } else {
                console.log(`✅ Marked ${count || '?'} messages as read`)
            }
        }
        markAsRead()

        return () => {
            console.log('🔌 Unsubscribing from room:', activeRoomId)
            clearInterval(pollInterval) // Clean up polling
            supabase.removeChannel(channel)
        }
    }, [activeRoomId, setMessages, addMessage, updateMessage, currentUser])

    // Safety: Ensure active room exists in rooms list
    useEffect(() => {
        if (!activeRoomId || !currentUser) return

        const activeRoomExists = rooms.find(r => r.id === activeRoomId)
        if (!activeRoomExists) {
            console.log('⚠️ Active room not in list, fetching details...', activeRoomId)
            const fetchActiveRoom = async () => {
                const { data } = await supabase
                    .from('room_participants')
                    .select(`
                      room_id,
                      rooms (
                        id,
                        name,
                        type,
                        image_url,
                        room_participants (
                          user_id,
                          profiles (
                            username,
                            avatar_url,
                            is_online,
                            last_seen
                          )
                        )
                      )
                    `)
                    .eq('room_id', activeRoomId)
                    .eq('user_id', currentUser.id)
                    .single()

                if (data && data.rooms) {
                    const room = data.rooms as any
                    if (room.type === 'private') {
                        const otherParticipant = room.room_participants.find(
                            (p: any) => p.user_id !== currentUser.id
                        )
                        if (otherParticipant) {
                            room.name = otherParticipant.profiles.username
                            room.image_url = otherParticipant.profiles.avatar_url
                            room.is_online = otherParticipant.profiles.is_online
                            room.last_seen = otherParticipant.profiles.last_seen
                            room.other_user_id = otherParticipant.user_id
                        }
                    }
                    // Add to rooms list to resolve "Loading..." state
                    setRooms([...rooms, room])
                }
            }
            fetchActiveRoom()
        }
    }, [activeRoomId, rooms, currentUser, setRooms])

    const sendMessage = async (content: string, type: 'text' | 'image' | 'audio' = 'text') => {
        if (!currentUser || !activeRoomId) return

        // Check if recipient is online to determine initial status
        let initialStatus = 'sent'
        const currentRoom = rooms.find(r => r.id === activeRoomId)
        if (currentRoom && currentRoom.is_online) {
            initialStatus = 'delivered'
        }

        // Insert message into database - real-time subscription will add it to UI
        const { error } = await supabase.from('messages').insert({
            room_id: activeRoomId,
            sender_id: currentUser.id,
            content,
            type,
            status: initialStatus
        })

        if (error) {
            console.error('Error sending message:', error)
        }
    }

    const deleteMessage = async (messageId: string) => {
        if (!currentUser) return

        // Optimistic update
        setMessages(messages.filter(m => m.id !== messageId))

        const { error } = await supabase
            .from('messages')
            .delete()
            .eq('id', messageId)

        if (error) {
            console.error('Error deleting message:', error)
            // Revert on error? For now, fetchMessages will handle sync
            const { data } = await supabase.from('messages').select('*').eq('id', messageId).single()
            if (data) addMessage(data)
        }
    }

    const reactToMessage = async (messageId: string, emoji: string) => {
        if (!currentUser) return

        // Find message
        const message = messages.find(m => m.id === messageId)
        if (!message) return

        const currentReactions = message.reactions || {}
        // Toggle reaction for current user: { "👍": ["userId1", "userId2"] }
        // Or simpler: { "userId": "👍" } -> Limit 1 reaction per user?
        // Let's go with array of users per emoji: { "👍": ["user1"] }

        // Actually simpler for MVP: Array of objects { emoji, user_id } stored in JSONB
        // Or just let Supabase handle it via a separate table?
        // The prompt implies a "reactions" column. Let's assume it's JSONB: { "👍": [uid1, uid2], "❤️": [] }

        let newReactions = { ...currentReactions }
        const userIds = newReactions[emoji] || []

        if (userIds.includes(currentUser.id)) {
            // Remove reaction
            newReactions[emoji] = userIds.filter((id: string) => id !== currentUser.id)
        } else {
            // Add reaction
            newReactions[emoji] = [...userIds, currentUser.id]
        }

        // Clean up empty keys
        if (newReactions[emoji].length === 0) {
            delete newReactions[emoji]
        }

        // Optimistic UI
        updateMessage(messageId, { reactions: newReactions })

        const { error } = await supabase
            .from('messages')
            .update({ reactions: newReactions })
            .eq('id', messageId)

        if (error) {
            console.error('Error reacting:', error)
            updateMessage(messageId, { reactions: currentReactions })
        }
    }

    const sendTyping = async () => {
        if (!activeRoomId) return
        await supabase.channel(`room:${activeRoomId}`).send({
            type: 'broadcast',
            event: 'typing',
            payload: { userId: currentUser?.id },
        })
    }

    const searchUsers = async (query: string) => {
        if (!query.trim()) return []
        const { data } = await supabase
            .from('profiles')
            .select('*')
            .ilike('username', `%${query}%`)
            .neq('id', currentUser?.id)
            .limit(10)
        return data || []
    }

    // Simple UUID generator to avoid crypto issues
    const uuidv4 = () => {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8)
            return v.toString(16)
        })
    }

    const createPrivateRoom = async (otherUserId: string) => {
        if (!currentUser) return null

        // 1. Check if room exists in local state
        const existingRoom = rooms.find(r => r.type === 'private' && r.other_user_id === otherUserId)
        if (existingRoom) {
            return existingRoom.id
        }

        // 2. Check server-side for existing room
        const { data: existingRoomData } = await supabase
            .from('room_participants')
            .select('room_id')
            .eq('user_id', currentUser.id)
            .in('room_id', (
                await supabase
                    .from('room_participants')
                    .select('room_id')
                    .eq('user_id', otherUserId)
                    .then(({ data }) => data?.map(d => d.room_id) || [])
            ) as any) // eslint-disable-line @typescript-eslint/no-explicit-any
            .limit(1)
            .maybeSingle()

        if (existingRoomData) {
            return existingRoomData.room_id
        }

        // 3. Create new room with client-side ID
        const newRoomId = uuidv4()

        const { error: roomError } = await supabase
            .from('rooms')
            .insert({ id: newRoomId, type: 'private' })

        if (roomError) {
            console.error('Error creating room:', roomError)
            return null
        }

        // 4. Add participants
        const { error: participantError } = await supabase.from('room_participants').insert([
            { room_id: newRoomId, user_id: currentUser.id },
            { room_id: newRoomId, user_id: otherUserId }
        ])

        if (participantError) {
            console.error('Error adding participants:', participantError)
            return null
        }

        // Force refresh rooms (simple way)
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', otherUserId).single()

        const newRoomObj = {
            id: newRoomId,
            created_at: new Date().toISOString(),
            type: 'private',
            name: profile?.username || 'User',
            image_url: profile?.avatar_url,
            other_user_id: otherUserId,
            room_participants: [] // Simplified
        }

        setRooms([newRoomObj, ...rooms])

        return newRoomId
    }

    const updateProfile = async (updates: { username?: string, status?: string }) => {
        if (!currentUser) return

        const { error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', currentUser.id)

        if (!error) {
            setCurrentUser({ ...currentUser, ...updates })
        }

        return error
    }

    return {
        rooms,
        messages,
        loading,
        currentUser,
        activeRoomId,
        setActiveRoomId,
        sendMessage,
        sendTyping,
        searchUsers,
        createPrivateRoom,
        updateProfile,
        deleteMessage,
        reactToMessage,
    }
}
