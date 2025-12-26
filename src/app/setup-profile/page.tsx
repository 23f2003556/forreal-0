"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, ArrowRight, Sparkles } from 'lucide-react'

export default function SetupProfile() {
    const [fullName, setFullName] = useState('')
    const [loading, setLoading] = useState(false)
    const [checking, setChecking] = useState(true)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            if (!user) {
                router.push('/login')
                return
            }

            const { data: profile } = await supabase
                .from('profiles')
                .select('username')
                .eq('id', user.id)
                .single()

            if (profile?.username && !profile.username.startsWith('user_')) {
                router.push('/')
            }
            setChecking(false)
        }
        checkUser()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!fullName.trim()) return

        setLoading(true)
        const { data: { user } } = await supabase.auth.getUser()

        if (user) {
            const { error } = await supabase
                .from('profiles')
                .update({
                    username: fullName.trim(),
                    full_name: fullName.trim(),
                    avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName.trim()}`
                })
                .eq('id', user.id)

            if (!error) {
                router.push('/')
            }
        }
        setLoading(false)
    }

    if (checking) {
        return (
            <div className="flex h-[100dvh] w-full items-center justify-center bg-app-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-primary"></div>
            </div>
        )
    }

    return (
        <div className="min-h-[100dvh] bg-app-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-3xl shadow-xl border border-gray-100">
                <div className="text-center space-y-2">
                    <div className="inline-flex p-3 rounded-2xl bg-teal-50 text-teal-primary mb-2">
                        <Sparkles size={32} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome to ForReal!</h1>
                    <p className="text-gray-500">Let's start with your name so friends can find you.</p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-teal-primary transition-colors">
                            <User size={20} />
                        </div>
                        <input
                            type="text"
                            required
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            className="block w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-2xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-teal-primary/20 focus:border-teal-primary transition-all text-lg"
                            placeholder="Enter your full name"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || !fullName.trim()}
                        className="group relative w-full flex justify-center items-center py-4 px-4 border border-transparent text-lg font-semibold rounded-2xl text-white bg-teal-primary hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-teal-primary/20"
                    >
                        {loading ? (
                            <div className="h-6 w-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <>
                                Get Started
                                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
                            </>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
