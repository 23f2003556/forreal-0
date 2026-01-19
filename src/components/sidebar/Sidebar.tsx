"use client"

import React from 'react'
import { Search, MoreVertical, LogOut, ArrowLeft, Check, Edit2, Users, MessageSquare, Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useChat } from '@/hooks/useChat'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function Sidebar() {
    const { rooms, activeRoomId, setActiveRoomId, loading, searchUsers, createPrivateRoom, updateProfile, currentUser } = useChat()
    const { theme, setTheme } = useTheme()
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
        if (searchQuery.trim()) {
            setIsSearching(true)
        } else {
            setIsSearching(false)
            setSearchResults([])
        }

        const delayDebounceFn = setTimeout(async () => {
            if (searchQuery.trim()) {
                const results = await searchUsers(searchQuery)
                setSearchResults(results)
                setIsSearching(false)
            }
        }, 500)

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
        window.location.href = '/login'
    }

    const handleUpdateProfile = async () => {
        await updateProfile({ username: newUsername, status: newStatus })
        setIsEditingUsername(false)
        setIsEditingStatus(false)
    }

    // Profile Panel (Modernized)
    if (isProfileOpen) {
        return (
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col h-full bg-white dark:bg-gray-900 w-full md:w-[400px] border-r border-gray-100 dark:border-gray-800"
            >
                <div className="h-[180px] bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 relative p-6 flex flex-col justify-end text-white shrink-0">
                    <button
                        onClick={() => setIsProfileOpen(false)}
                        className="absolute top-6 left-6 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </button>
                    <div>
                        <h2 className="text-3xl font-bold mb-1">Profile</h2>
                        <p className="text-blue-100 text-sm">Customize how others see you</p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-0 pb-6 bg-white dark:bg-gray-950">
                    <div className="relative -mt-16 mb-6 flex justify-center">
                        <div className="w-32 h-32 rounded-full ring-4 ring-white dark:ring-gray-950 bg-gray-200 overflow-hidden relative group cursor-pointer shadow-xl z-10">
                            <img src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.username}`} alt="Profile" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 hidden group-hover:flex items-center justify-center text-white text-[10px] font-bold tracking-widest uppercase flex-col gap-1 transition-all">
                                <span>Change</span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800 overflow-hidden">
                        {/* Display Name Section */}
                        <div className="p-4 border-b border-gray-50 dark:border-gray-800 group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400">
                                    <Users className="w-4 h-4" />
                                </div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Display Name</label>
                            </div>

                            <div className="pl-11">
                                {isEditingUsername ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-gray-900 dark:text-gray-100 font-medium text-sm transition-all"
                                            autoFocus
                                            placeholder="Enter your name"
                                        />
                                        <button onClick={handleUpdateProfile} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group/edit cursor-pointer" onClick={() => setIsEditingUsername(true)}>
                                        <span className="text-gray-900 dark:text-gray-100 font-medium text-base">{currentUser?.username}</span>
                                        <button className="text-gray-300 group-hover/edit:text-blue-600 p-1 opacity-0 group-hover/edit:opacity-100 transition-all">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Bio / Status Section */}
                        <div className="p-4 group transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-800/50">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                                    <MessageSquare className="w-4 h-4" />
                                </div>
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Bio / Status</label>
                            </div>

                            <div className="pl-11">
                                {isEditingStatus ? (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="text"
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-gray-800 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-gray-900 dark:text-gray-100 text-sm transition-all"
                                            autoFocus
                                            placeholder="What's on your mind?"
                                        />
                                        <button onClick={handleUpdateProfile} className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                                            <Check className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex items-center justify-between group/edit cursor-pointer" onClick={() => setIsEditingStatus(true)}>
                                        <span className="text-gray-600 dark:text-gray-400 text-sm">{currentUser?.status || "Hey there! I am using ForReal."}</span>
                                        <button className="text-gray-300 group-hover/edit:text-purple-600 p-1 opacity-0 group-hover/edit:opacity-100 transition-all">
                                            <Edit2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-950 w-full md:w-[400px] border-r border-gray-100 dark:border-gray-800/50 relative z-10">
            {/* Modern Header */}
            <div className="px-5 py-4 flex justify-between items-center bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl sticky top-0 z-20 border-b border-gray-100 dark:border-gray-800">
                <div onClick={() => setIsProfileOpen(true)} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-transparent group-hover:ring-purple-500/20 transition-all">
                            <img src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.username}`} alt="Me" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-gray-900 dark:text-white text-sm leading-tight">forreal</h2>
                        <span className="text-xs text-green-500 font-medium">beyond texting </span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors text-gray-500"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute top-12 right-0 bg-white dark:bg-gray-900 shadow-xl rounded-xl py-1 w-48 border border-gray-100 dark:border-gray-800 overflow-hidden"
                            >
                                <button
                                    onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200 text-sm font-medium flex items-center gap-2"
                                >
                                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                    {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
                                </button>
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 hover:bg-gray-50 dark:hover:bg-gray-800 text-red-600 dark:text-red-400 text-sm font-medium flex items-center gap-2"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            {/* Search */}
            <div className="px-4 py-3">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400 group-focus-within:text-purple-500 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search people..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-800 rounded-xl leading-5 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1 pb-4">
                {searchQuery ? (
                    <div className="space-y-1">
                        <div className="px-2 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                            {isSearching ? 'Searching...' : 'Results'}
                        </div>
                        {searchResults.length === 0 && !isSearching ? (
                            <div className="text-center py-8 text-gray-500 text-sm">
                                <Users className="w-8 h-8 mx-auto mb-2 opacity-20" />
                                No users found
                            </div>
                        ) : (
                            searchResults.map((user) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={user.id}
                                    onClick={() => handleUserClick(user.id)}
                                    className="flex items-center p-3 cursor-pointer hover:bg-white dark:hover:bg-gray-900 rounded-xl transition-all border border-transparent hover:border-gray-100 dark:hover:border-gray-800 hover:shadow-sm group"
                                >
                                    <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden mr-3.5 flex-shrink-0 ring-2 ring-transparent group-hover:ring-purple-500/20 transition-all">
                                        <img src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-gray-900 dark:text-gray-100 font-semibold text-sm truncate">{user.username}</h3>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.status || "Hey there! I am using ForReal."}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 bg-purple-100 dark:bg-purple-900/30 p-1.5 rounded-full text-purple-600 dark:text-purple-400 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                ) : (
                    loading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-gray-400">
                            <div className="w-6 h-6 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
                            <span className="text-xs font-medium">Loading conversations...</span>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-12 text-gray-500">
                            <div className="w-16 h-16 bg-gray-50 dark:bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                <MessageSquare className="w-8 h-8 text-gray-300" />
                            </div>
                            <h3 className="text-gray-900 dark:text-white font-medium mb-1">No chats yet</h3>
                            <p className="text-xs text-gray-400">Search for a friend to start chatting!</p>
                        </div>
                    ) : (
                        rooms.map((room) => (
                            <motion.div
                                layout
                                key={room.id}
                                onClick={() => setActiveRoomId(room.id)}
                                className={cn(
                                    "flex items-center p-3 cursor-pointer rounded-xl transition-all border group relative overflow-hidden",
                                    activeRoomId === room.id
                                        ? "bg-purple-50 dark:bg-purple-900/10 border-purple-100 dark:border-purple-900/40"
                                        : "bg-transparent border-transparent hover:bg-white dark:hover:bg-gray-900 hover:border-gray-100 dark:hover:border-gray-800 hover:shadow-sm"
                                )}
                            >
                                <div className="relative w-12 h-12 mr-3.5 flex-shrink-0">
                                    <div className={cn(
                                        "w-full h-full rounded-full overflow-hidden ring-2 transition-all",
                                        activeRoomId === room.id ? "ring-purple-500" : "ring-transparent group-hover:ring-purple-200 dark:group-hover:ring-purple-900"
                                    )}>
                                        <img src={room.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${room.name}`} alt={room.name} className="w-full h-full object-cover" />
                                    </div>
                                    {/* Online Indicator for List */}
                                    {room.is_online && (
                                        <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-gray-950 rounded-full z-10" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 z-10">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={cn(
                                            "font-semibold text-sm truncate transition-colors",
                                            activeRoomId === room.id ? "text-purple-900 dark:text-purple-100" : "text-gray-900 dark:text-gray-100"
                                        )}>
                                            {room.name}
                                        </h3>
                                        <span className={cn(
                                            "text-[10px] font-medium",
                                            activeRoomId === room.id ? "text-purple-600 dark:text-purple-300" : "text-gray-400"
                                        )}>
                                            {room.last_message_at ? format(new Date(room.last_message_at), 'HH:mm') : ''}
                                        </span>
                                    </div>
                                    <p className={cn(
                                        "text-xs truncate transition-colors",
                                        activeRoomId === room.id ? "text-purple-700/70 dark:text-purple-200/70" : "text-gray-500 dark:text-gray-400"
                                    )}>
                                        {room.last_message || "Active now"}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )
                )}
            </div>
        </div>
    )
}
