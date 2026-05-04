"use client"

import React from 'react'
import { Search, MoreVertical, LogOut, ArrowLeft, Check, Edit2, Users, MessageSquare, Sun, Moon, Camera } from 'lucide-react'
import { useTheme } from 'next-themes'
import { useChat } from '@/logic/hooks/useChat'
import { cn } from '@/logic/utils'
import { format } from 'date-fns'
import { supabase } from '@/backend/supabase/client'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'

export function Sidebar() {
    const { rooms, activeRoomId, setActiveRoomId, loading, searchUsers, createPrivateRoom, updateProfile, currentUser, unreadCounts } = useChat()
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
        try {
            await supabase.auth.signOut()
        } catch (e) {
            console.log('Error signing out', e)
        }
        router.push('/login')
        router.refresh()
        setIsMenuOpen(false)
    }

    const handleUpdateProfile = async () => {
        await updateProfile({ username: newUsername, status: newStatus })
        setIsEditingUsername(false)
        setIsEditingStatus(false)
    }

    // Profile Panel (Modernized & Premium)
    if (isProfileOpen) {
        return (
            <motion.div
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex flex-col h-full bg-[#f8fafc] dark:bg-[#0a0f1d] w-full md:w-[400px] border-r border-gray-100 dark:border-gray-800/50 pt-safe"
            >
                {/* Premium Banner Header */}
                <div className="h-[220px] bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative p-8 flex flex-col justify-end text-white shrink-0 pt-[calc(2rem+env(safe-area-inset-top))]">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-400/20 rounded-full blur-2xl -ml-16 -mb-16 pointer-events-none" />

                    <button
                        onClick={() => setIsProfileOpen(false)}
                        className="absolute top-[calc(1.5rem+env(safe-area-inset-top))] left-6 p-2.5 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full transition-all active:scale-95 border border-white/10 z-20 group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-0.5 transition-transform" />
                    </button>

                    <div className="relative z-10">
                        <motion.h2
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="text-4xl font-black mb-2 tracking-tight"
                        >
                            Profile
                        </motion.h2>
                        <motion.p
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                            className="text-white/80 text-sm font-medium tracking-wide"
                        >
                            Customize your digital identity
                        </motion.p>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pt-10 pb-10 bg-transparent pb-safe">
                    {/* Centered Avatar with Glow - Now fully below banner */}
                    <div className="relative mb-12 flex justify-center">
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ type: "spring", damping: 15 }}
                            className="relative group"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500 to-pink-500 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity" />
                            <div className="w-36 h-36 rounded-full ring-8 ring-white dark:ring-[#0a0f1d] bg-gray-200 overflow-hidden relative shadow-2xl z-10">
                                <img
                                    src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.username}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white text-[10px] font-black tracking-widest uppercase flex-col gap-1 transition-all cursor-pointer">
                                    <Camera className="w-6 h-6 mb-1" />
                                    <span>Change</span>
                                </div>
                            </div>
                            {/* Discrete indicator button */}
                            <button className="absolute bottom-1 right-1 w-10 h-10 bg-gradient-to-tr from-purple-600 to-pink-500 rounded-full border-4 border-white dark:border-[#0a0f1d] shadow-lg flex items-center justify-center text-white z-20 hover:scale-110 transition-transform active:scale-95">
                                <Camera className="w-4 h-4" />
                            </button>
                        </motion.div>
                    </div>

                    <div className="space-y-6">
                        {/* Display Name Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-900/40 backdrop-blur-xl rounded-[28px] p-6 shadow-sm border border-white dark:border-white/5"
                        >
                            <div className="flex items-center gap-3 mb-4 text-purple-600 dark:text-purple-400">
                                <Users className="w-5 h-5" />
                                <label className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Display Name</label>
                            </div>

                            <div className="relative">
                                {isEditingUsername ? (
                                    <div className="flex items-center gap-3">
                                        <input
                                            type="text"
                                            value={newUsername}
                                            onChange={(e) => setNewUsername(e.target.value)}
                                            className="w-full bg-gray-50 dark:bg-[#1a1f2e] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-gray-900 dark:text-gray-100 font-bold transition-all border border-transparent focus:border-purple-500/30"
                                            autoFocus
                                        />
                                        <button
                                            onClick={handleUpdateProfile}
                                            className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center justify-between group/field cursor-pointer p-1"
                                        onClick={() => setIsEditingUsername(true)}
                                    >
                                        <span className="text-gray-900 dark:text-white font-black text-2xl tracking-tight leading-none group-hover/field:text-purple-600 transition-colors">
                                            {currentUser?.username}
                                        </span>
                                        <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl opacity-0 group-hover/field:opacity-100 transition-all active:scale-95">
                                            <Edit2 className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Status Card */}
                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-900/40 backdrop-blur-xl rounded-[28px] p-6 shadow-sm border border-white dark:border-white/5"
                        >
                            <div className="flex items-center gap-3 mb-4 text-blue-600 dark:text-blue-400">
                                <MessageSquare className="w-5 h-5" />
                                <label className="text-xs font-black uppercase tracking-[0.2em] opacity-80">Bio / Status</label>
                            </div>

                            <div className="relative">
                                {isEditingStatus ? (
                                    <div className="flex items-center gap-3">
                                        <textarea
                                            value={newStatus}
                                            onChange={(e) => setNewStatus(e.target.value)}
                                            rows={2}
                                            className="w-full bg-gray-50 dark:bg-[#1a1f2e] px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/30 text-gray-900 dark:text-gray-100 font-medium transition-all border border-transparent focus:border-blue-500/30 resize-none text-sm"
                                            autoFocus
                                            placeholder="What's on your mind?"
                                        />
                                        <button
                                            onClick={handleUpdateProfile}
                                            className="p-4 bg-emerald-500 text-white rounded-2xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all self-end"
                                        >
                                            <Check className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center justify-between group/field cursor-pointer p-1"
                                        onClick={() => setIsEditingStatus(true)}
                                    >
                                        <p className="text-gray-600 dark:text-gray-400 text-base font-medium leading-relaxed group-hover/field:text-gray-900 dark:group-hover:text-gray-100 transition-colors italic">
                                            "{currentUser?.status || "Hey there! I am using ForReal."}"
                                        </p>
                                        <div className="p-2.5 bg-gray-50 dark:bg-white/5 rounded-xl opacity-0 group-hover/field:opacity-100 transition-all active:scale-95 shrink-0 ml-4">
                                            <Edit2 className="w-4 h-4 text-gray-400" />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        )
    }

    return (
        <div className="flex flex-col h-full bg-[#0a0710] w-full md:w-[400px] border-r border-white/5 relative z-10 font-sans text-white">
            {/* Modern Header */}
            <div className="px-6 py-5 flex justify-between items-center bg-[#0a0710]/80 backdrop-blur-xl sticky top-0 z-20 border-b border-white/5 pt-[calc(1.25rem+env(safe-area-inset-top))]">
                <div onClick={() => setIsProfileOpen(true)} className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative">
                        <div className="w-9 h-9 rounded-full bg-white/5 overflow-hidden ring-1 ring-white/10 group-hover:ring-purple-500/40 transition-all">
                            <img src={currentUser?.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${currentUser?.username}`} alt="Me" className="w-full h-full object-cover" />
                        </div>
                        <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-[#0a0710] rounded-full"></div>
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-[15px] leading-tight tracking-tight">forreal</h2>
                        <span className="text-[10px] text-green-500/80 font-medium tracking-wider uppercase">beyond texting</span>
                    </div>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 hover:bg-white/5 rounded-full transition-colors text-white/40 hover:text-white"
                    >
                        <MoreVertical className="w-5 h-5" />
                    </button>
                    <AnimatePresence>
                        {isMenuOpen && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95, y: 10 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="absolute top-12 right-0 bg-[#16121e] shadow-2xl rounded-xl py-1.5 w-48 border border-white/10 overflow-hidden z-50"
                            >
                                <button
                                    onClick={handleLogout}
                                    className="w-full text-left px-4 py-2.5 hover:bg-white/5 text-red-400 text-sm font-medium flex items-center gap-2"
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
            <div className="px-5 py-4">
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-white/20 group-focus-within:text-purple-400 transition-colors" />
                    </div>
                    <input
                        type="text"
                        placeholder="Search people..."
                        className="block w-full pl-10 pr-3 py-2.5 border border-white/5 rounded-xl leading-5 bg-white/5 text-white placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-purple-500/30 focus:bg-white/10 transition-all text-sm"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1 pb-4">
                {searchQuery ? (
                    <div className="space-y-1">
                        <div className="px-3 py-2 text-[10px] font-bold text-white/20 uppercase tracking-[0.15em] mb-1">
                            {isSearching ? 'Searching...' : 'Results'}
                        </div>
                        {searchResults.length === 0 && !isSearching ? (
                            <div className="text-center py-8 text-white/40 text-sm italic">
                                <Users className="w-8 h-8 mx-auto mb-2 opacity-10" />
                                No users found
                            </div>
                        ) : (
                            searchResults.map((user) => (
                                <motion.div
                                    initial={{ opacity: 0, y: 5 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    key={user.id}
                                    onClick={() => handleUserClick(user.id)}
                                    className="flex items-center p-3 cursor-pointer hover:bg-white/5 rounded-xl transition-all border border-transparent group"
                                >
                                    <div className="w-11 h-11 rounded-full bg-white/5 overflow-hidden mr-3.5 flex-shrink-0 ring-1 ring-white/10 group-hover:ring-purple-500/30 transition-all">
                                        <img src={user.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${user.username}`} alt={user.username} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="text-white font-semibold text-sm truncate">{user.username}</h3>
                                        <p className="text-[11px] text-white/40 truncate">{user.status || "Hey there! I am using ForReal."}</p>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 bg-purple-500/20 p-2 rounded-full text-purple-400 transition-all transform translate-x-2 group-hover:translate-x-0">
                                        <MessageSquare className="w-4 h-4" />
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                ) : (
                    loading ? (
                        <div className="flex flex-col items-center justify-center h-40 gap-3 text-white/20">
                            <div className="w-5 h-5 border-2 border-purple-500/50 border-t-transparent rounded-full animate-spin" />
                            <span className="text-[10px] font-bold uppercase tracking-widest">Loading...</span>
                        </div>
                    ) : rooms.length === 0 ? (
                        <div className="text-center py-16 px-4 text-white/30">
                            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                                <MessageSquare className="w-6 h-6 text-white/20" strokeWidth={1.5} />
                            </div>
                            <h3 className="text-white text-sm font-semibold mb-1 tracking-tight">No chats yet</h3>
                            <p className="text-[11px] text-white/40">Search for a friend to start chatting.</p>
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
                                        ? "bg-purple-500/8 border-purple-500/20 shadow-inner"
                                        : "bg-transparent border-transparent hover:bg-white/5"
                                )}
                            >
                                <div className="relative w-11 h-11 mr-3.5 flex-shrink-0">
                                    <div className={cn(
                                        "w-full h-full rounded-full overflow-hidden ring-1 transition-all",
                                        activeRoomId === room.id ? "ring-purple-500/50" : "ring-white/10 group-hover:ring-white/20"
                                    )}>
                                        <img src={room.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${room.name}`} alt={room.name} className="w-full h-full object-cover" />
                                    </div>
                                    {room.is_online && (
                                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#0a0710] rounded-full z-10" />
                                    )}
                                </div>

                                <div className="flex-1 min-w-0 z-10">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className={cn(
                                            "text-sm truncate transition-colors font-semibold",
                                            activeRoomId === room.id ? "text-white" : 
                                            unreadCounts[room.id] > 0 ? "text-white" : "text-white/70"
                                        )}>
                                            {room.name}
                                        </h3>
                                        <span className={cn(
                                            "text-[10px] font-medium",
                                            activeRoomId === room.id ? "text-purple-400" : 
                                            unreadCounts[room.id] > 0 ? "text-purple-400" : "text-white/20"
                                        )}>
                                            {room.last_message_at ? format(new Date(room.last_message_at), 'HH:mm') : ''}
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <p className={cn(
                                            "text-[11px] truncate transition-colors flex-1",
                                            activeRoomId === room.id ? "text-white/60" : 
                                            unreadCounts[room.id] > 0 ? "text-white/90" : "text-white/40"
                                        )}>
                                            {room.last_message || "Active now"}
                                        </p>
                                        {unreadCounts[room.id] > 0 && (
                                            <div className="bg-purple-500 text-[#0a0710] text-[9px] font-black min-w-[16px] h-[16px] flex items-center justify-center rounded-full ml-2">
                                                {unreadCounts[room.id]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        ))
                    )
                )}
            </div>
        </div>
    )
    )
}
