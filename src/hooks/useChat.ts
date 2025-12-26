"use client"

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useChatStore } from '@/lib/store'

export function useChat() {
    const { currentUser, activeRoomId, setCurrentUser, setActiveRoomId } = useChatStore()
    const [rooms, setRooms] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any
    const [messages, setMessages] = useState<any[]>([]) // eslint-disable-line @typescript-eslint/no-explicit-any
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
                console.log('Raw rooms data:', data)
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
                            console.log('No other participant found for room:', room.id, 'Participants:', room.room_participants)
                            // Mark as invalid to filter out later
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
                            // Keep the one created later (or with more recent message if we had that info)
                            // For now, just keep the one with the higher ID (assuming UUID v4 is not ordered, but created_at is)
                            // Actually, let's keep the one that is already in the accumulator if it looks "better", or replace it.
                            // Simple strategy: Keep the first one encountered? No, we want to clean up.
                            // Let's just keep the first one for now to ensure uniqueness.
                            return acc
                        }
                    }
                    acc.push(current)
                    return acc
                }, [])

                console.log('Formatted and Unique rooms:', uniqueRooms)
                setRooms(uniqueRooms)
            }
        }

        fetchRooms()

        // Subscribe to new rooms (optional for MVP)
    }, [currentUser])

    // Fetch messages for active room
    useEffect(() => {
        if (!activeRoomId) return

        const fetchMessages = async () => {
            const { data } = await supabase
                .from('messages')
                .select('*')
                .eq('room_id', activeRoomId)
                .order('created_at', { ascending: true })

            if (data) setMessages(data)
        }

        fetchMessages()

        // Realtime subscription
        const channel = supabase
            .channel(`room:${activeRoomId}`)
            .on('postgres_changes', {
                event: 'INSERT',
                schema: 'public',
                table: 'messages',
                filter: `room_id=eq.${activeRoomId}`,
            }, (payload) => {
                setMessages((prev) => [...prev, payload.new])
            })
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [activeRoomId])

    const sendMessage = async (content: string, type: 'text' | 'image' | 'audio' = 'text') => {
        if (!currentUser || !activeRoomId) return

        const newMessage = {
            id: uuidv4(),
            room_id: activeRoomId,
            sender_id: currentUser.id,
            content,
            type,
            created_at: new Date().toISOString(),
            status: 'sent'
        }

        // Optimistic update
        setMessages((prev) => [...prev, newMessage])

        const { error } = await supabase.from('messages').insert({
            room_id: activeRoomId,
            sender_id: currentUser.id,
            content,
            type,
        })

        if (error) {
            // Rollback or show error (omitted for MVP)
            console.error('Error sending message:', error)
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

        // 2. Check server-side for existing room (to avoid race conditions/stale state)
        // We can do this by querying room_participants
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
            .single()

        // Note: The above query is a bit complex for client-side. 
        // A better way is to rely on a unique constraint or a stored procedure, 
        // but for now let's try to find a common room ID.

        // Simplified check: Get all my rooms, then check if other user is in any of them.
        // But since we already fetched rooms in `fetchRooms`, the local check #1 should cover 99% of cases
        // IF `fetchRooms` has completed.

        // If we found a server-side room that wasn't in local state yet:
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

        setRooms(prev => [newRoomObj, ...prev])

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
    }
}
