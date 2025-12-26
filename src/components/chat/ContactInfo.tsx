"use client"

import React from 'react'
import { useChat } from '@/hooks/useChat'
import { X } from 'lucide-react'

export function ContactInfo() {
    const { activeRoomId, rooms } = useChat()
    const activeRoom = rooms.find(r => r.id === activeRoomId)

    if (!activeRoom) return null

    return (
        <div className="flex flex-col h-full border-l border-gray-200 bg-white dark:bg-gray-900 w-[300px] hidden xl:flex">
            <div className="px-4 py-3 bg-panel-header-background h-[60px] flex items-center border-b border-gray-200 dark:border-gray-800">
                <button className="mr-4 text-icon-gray"><X className="w-5 h-5" /></button>
                <h2 className="font-semibold text-text-primary">Contact Info</h2>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
                <div className="p-8 flex flex-col items-center bg-white dark:bg-gray-900 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div className="w-40 h-40 rounded-full bg-gray-300 overflow-hidden mb-4">
                        <img src={activeRoom.image_url || `https://api.dicebear.com/7.x/initials/svg?seed=${activeRoom.name}`} alt={activeRoom.name} className="w-full h-full object-cover" />
                    </div>
                    <h3 className="text-xl font-medium text-text-primary mb-1">{activeRoom.name}</h3>
                    <p className="text-gray-500 text-sm">{activeRoom.is_online ? 'Online' : 'Offline'}</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-900 mt-2 border-b border-gray-100 dark:border-gray-800">
                    <h4 className="text-sm text-text-secondary mb-2">About</h4>
                    <p className="text-text-primary">Hey there! I am using ForReal.</p>
                </div>

                <div className="p-4 bg-white dark:bg-gray-900 mt-2">
                    <h4 className="text-sm text-text-secondary mb-4">Media, links and docs</h4>
                    <div className="flex gap-2 overflow-hidden">
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                        <div className="w-20 h-20 bg-gray-200 rounded-lg"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}
