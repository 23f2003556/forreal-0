"use client"

import React from 'react'
import { Search, MoreVertical } from 'lucide-react'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

import { ArrowLeft, Check, Edit2 } from 'lucide-react'

export function Sidebar() {
    const { rooms, activeRoomId, setActiveRoomId, loading, searchUsers, createPrivateRoom, updateProfile, currentUser } = useChat()
    const [searchQuery, setSearchQuery] = React.useState('')
    const [searchResults, setSearchResults] = React.useState<any[]>([])
    const [isSearching, setIsSearching] = React.useState(false)
    const [isMenuOpen, setIsMenuOpen] = React.useState(false)
    const [isProfileOpen, setIsProfileOpen] = React.useState(false)
    const [newUsername, setNewUsername] = React.useState('')
    const [newStatus, setNewStatus] = React.useState('')
    const [isEditingUsername, setIsEditingUsername] = React.useState(false)
    const [isEditingStatus, setIsEditingStatus] = React.useState(false)
    const router = useRouter()

    React.useEffect(() => {
        if (currentUser) {
            setNewUsername(currentUser.username || '')
            setNewStatus(currentUser.status || '')
        }
    }, [currentUser])

    React.useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim()) {
                setIsSearching(true)
                const results = await searchUsers(searchQuery)
                setSearchResults(results)
                setIsSearching(false)
            } else {
                setSearchResults([])
            }
        }, 300)

        return () => clearTimeout(delayDebounceFn)
    }, [searchQuery, searchUsers])

    const handleUserClick = async (userId: string) => {
        const roomId = await createPrivateRoom(userId)
        if (roomId) {
            setActiveRoomId(roomId)
            setSearchQuery('')
            setSearchResults([])
        }
    }

    const handleLogout = async () => {
        await supabase.auth.signOut()
        router.push('/login')
    }

    const handleUpdateProfile = async () => {
        await updateProfile({ username: newUsername, status: newStatus })
        setIsEditingUsername(false)
        setIsEditingStatus(false)
    }

    if (isProfileOpen) {
        return (
            <div className="flex flex-col h-full border-r border-gray-200 bg-app-background w-full md:w-[400px]">
                <div className="h-[108px] bg-teal-primary flex items-end px-4 pb-4 text-white">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setIsProfileOpen(false)}>
                            <ArrowLeft className="w-6 h-6" />
                        </button>
                        <h2 className="text-xl font-medium">Profile</h2>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="flex justify-center py-8">
                        <div className="w-48 h-48 rounded-full bg-gray-300 overflow-hidden relative group cursor-pointer">
                            <img src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.username}`} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-sm flex-col gap-2">
                                <span>CHANGE PROFILE PHOTO</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 px-8 py-4 shadow-sm mb-4">
                        <label className="text-teal-primary text-sm mb-4 block">Your Name</label>
                        <div className="flex items-center justify-between">
                            {isEditingUsername ? (
                                <div className="flex-1 flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={newUsername}
                                        onChange={(e) => setNewUsername(e.target.value)}
                                        className="flex-1 border-b-2 border-teal-primary focus:outline-none bg-transparent py-1"
                                        autoFocus
                                    />
                                    <button onClick={handleUpdateProfile} className="text-gray-500 hover:text-teal-primary">
                                        <Check className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-text-primary text-lg">{currentUser?.username}</span>
                                    <button onClick={() => setIsEditingUsername(true)} className="text-icon-gray hover:text-teal-primary">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                        <p className="text-gray-500 text-sm mt-4">
                            This is not your username or pin. This name will be visible to your ForReal contacts.
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-900 px-8 py-4 shadow-sm">
                        <label className="text-teal-primary text-sm mb-4 block">About</label>
                        <div className="flex items-center justify-between">
                            {isEditingStatus ? (
                                <div className="flex-1 flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={newStatus}
                                        onChange={(e) => setNewStatus(e.target.value)}
                                        className="flex-1 border-b-2 border-teal-primary focus:outline-none bg-transparent py-1"
                                        autoFocus
                                    />
                                    <button onClick={handleUpdateProfile} className="text-gray-500 hover:text-teal-primary">
                                        <Check className="w-5 h-5" />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <span className="text-text-primary text-lg">{currentUser?.status || "Hey there! I am using ForReal."}</span>
                                    <button onClick={() => setIsEditingStatus(true)} className="text-icon-gray hover:text-teal-primary">
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="flex flex-col h-full border-r border-gray-200 bg-white dark:bg-gray-900 w-full md:w-[400px]">
            {/* Header */}
            <div className="px-4 py-3 bg-panel-header-background flex justify-between items-center h-[60px] border-b border-gray-200 dark:border-gray-800 relative">
                <div
                    onClick={() => setIsProfileOpen(true)}
                    className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden cursor-pointer hover:opacity-80 transition-opacity"
                >
                    <img src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.username}`} alt="User Avatar" className="w-full h-full object-cover" />
                </div>
                <div className="flex gap-4 text-icon-gray">
                    <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="relative">
                        <MoreVertical className="w-6 h-6" />
                    </button>

                    {/* Dropdown Menu */}
                    {isMenuOpen && (
                        <div className="absolute top-12 right-4 bg-white dark:bg-gray-800 shadow-lg rounded-lg py-2 w-48 z-50 border border-gray-100 dark:border-gray-700">
                            <button
                                onClick={handleLogout}
                                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-text-primary flex items-center gap-2"
                            >
                                <LogOut className="w-4 h-4" />
                                Log out
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Search Bar */}
            <div className="p-2 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
                <div className="relative bg-panel-header-background rounded-lg h-[35px] flex items-center px-4">
                    <Search className="w-5 h-5 text-icon-gray mr-4" />
                    <input
                        type="text"
                        placeholder="Search or start new chat"
                        className="bg-transparent border-none focus:outline-none text-sm w-full text-text-primary placeholder:text-text-secondary"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* Chat List or Search Results */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {searchQuery ? (
                    // Search Results
                    <div>
                        <div className="px-4 py-2 text-teal-primary text-sm font-medium uppercase">
                            {isSearching ? 'Searching...' : 'Search Results'}
                        </div>
                        {searchResults.length === 0 && !isSearching ? (
                            <div className="p-4 text-center text-gray-500 text-sm">
                                No users found.
                            </div>
                        ) : (
                            searchResults.map((user) => (
                                <div
                                    key={user.id}
                                    onClick={() => handleUserClick(user.id)}
                                    className="flex items-center px-3 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-3 flex-shrink-0">
                                        <img src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-text-primary font-medium truncate">{user.username}</h3>
                                        <p className="text-sm text-text-secondary truncate">{user.status || "Hey there! I am using ForReal."}</p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ) : (
                    // Existing Chat List
                    loading ? (
                        <div className="p-4 text-center text-gray-500">Loading chats...</div>
                    ) : rooms.length === 0 ? (
                        <div className="p-4 text-center text-gray-500 text-sm mt-4">
                            No chats yet. Start a new conversation!
                        </div>
                    ) : (
                        rooms.map((room) => (
                            <div
                                key={room.id}
                                onClick={() => setActiveRoomId(room.id)}
                                className={cn(
                                    "flex items-center px-3 py-3 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-800",
                                    activeRoomId === room.id && "bg-gray-200 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-700"
                                )}
                            >
                                <div className="w-12 h-12 rounded-full bg-gray-300 overflow-hidden mr-3 flex-shrink-0">
                                    <img src={room.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${room.name}`} alt={room.name} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-1">
                                        <h3 className="text-text-primary font-medium truncate">{room.name}</h3>
                                        <span className="text-xs text-text-secondary">
                                            {room.last_message_at ? format(new Date(room.last_message_at), 'HH:mm') : ''}
                                        </span>
                                    </div>
                                    <p className="text-sm text-text-secondary truncate">
                                        {room.last_message || "Click to start chatting"}
                                    </p>
                                </div>
                            </div>
                        ))
                    )
                )}
            </div>
        </div>
    )
}
