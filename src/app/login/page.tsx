"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MessageSquare, ArrowLeft } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default function LoginPage() {
    const [isSignUp, setIsSignUp] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const router = useRouter()

    useEffect(() => {
        const checkUser = async () => {
            console.log('DEBUG: Initial session check starting...')
            try {
                const { data: { user }, error } = await supabase.auth.getUser()
                console.log('DEBUG: Initial session check result:', { user: user?.id, error })
                if (user) {
                    router.push('/')
                }
            } catch (err) {
                console.error('DEBUG: Initial session check failed:', err)
            }
        }
        checkUser()
    }, [router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError(null)

        try {
            const trimmedEmail = email.trim()
            if (isSignUp) {
                console.log('DEBUG: Attempting signup for:', JSON.stringify(trimmedEmail))
                const { data, error } = await supabase.auth.signUp({
                    email: trimmedEmail,
                    password,
                    options: {
                        data: {
                            full_name: trimmedEmail.split('@')[0],
                            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${trimmedEmail}`,
                        },
                    },
                })
                console.log('DEBUG: Signup result:', { data, error })
                if (error) throw error

                if (data.user) {
                    const fullName = trimmedEmail.split('@')[0];
                    const { error: profileError } = await supabase
                        .from('profiles')
                        .upsert({
                            id: data.user.id,
                            username: fullName.trim(),
                            avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${fullName.trim()}`,
                            updated_at: new Date().toISOString()
                        })

                    if (!profileError) {
                        // If signup and profile creation are successful, redirect
                        window.location.href = '/'
                    } else {
                        console.error('DEBUG: Profile setup error:', profileError)
                        alert('Error saving profile: ' + profileError.message)
                    }
                } else {
                    // If user data is not immediately available (e.g., email confirmation needed)
                    alert('Check your email for the confirmation link!')
                }
            } else {
                console.log('DEBUG: Attempting login for:', JSON.stringify(trimmedEmail))
                const { data, error } = await supabase.auth.signInWithPassword({
                    email: trimmedEmail,
                    password,
                })
                console.log('DEBUG: Login result:', { data, error })
                if (error) throw error
                // Use window.location.href for a hard redirect to ensure cookies are sent
                window.location.href = '/'
            }
        } catch (err: any) {
            console.error('DEBUG: Auth error:', err)
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    const handleGoogleLogin = async () => {
        setLoading(true)
        setError(null)
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: `${window.location.origin}/auth/callback`,
                },
            })
            if (error) throw error
        } catch (err: any) {
            setError(err.message)
            setLoading(false)
        }
    }

    return (
        <div className="min-h-[100dvh] bg-black text-white flex flex-col items-center justify-center p-4 relative overflow-hidden selection:bg-purple-500/30 font-sans antialiased">
            {/* Ambient background glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

            {/* Navigation (Simple version matching landing page) */}
            <nav className="absolute top-0 w-full z-50 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-20 max-w-7xl mx-auto">
                    <Link href="/" className="flex items-center gap-2 group">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center group-hover:scale-105 transition-transform">
                            <MessageSquare className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">forreal.</span>
                    </Link>
                    <Link href="/" className="flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        <ArrowLeft className="w-4 h-4" />
                        Back to home
                    </Link>
                </div>
            </nav>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="w-full max-w-md relative z-10"
            >
                <div className="mb-8 text-center">
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-purple-300 mb-6 cursor-default"
                    >
                        <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                        beyond texting
                    </motion.div>
                    <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                        {isSignUp ? 'Create an account' : 'Welcome back'}
                    </h1>
                    <p className="text-gray-400 text-sm">
                        {isSignUp ? 'Join forreal to start interpreting intent instantly.' : 'Log in to continue'}
                    </p>
                </div>

                <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 p-8 rounded-3xl shadow-2xl">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 text-sm font-medium flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-semibold py-3.5 px-4 rounded-2xl focus:outline-none transition-all disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-1 .67-2.28 1.07-3.71 1.07-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.67-.35-1.39-.35-2.09s.13-1.42.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>

                    <div className="my-8 flex items-center justify-between">
                        <span className="border-b w-[35%] lg:w-[40%] border-white/10"></span>
                        <span className="text-xs font-bold text-center text-gray-500 uppercase tracking-wider">or</span>
                        <span className="border-b w-[35%] lg:w-[40%] border-white/10"></span>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3.5 bg-black/50 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-white placeholder-gray-600 transition-all font-medium"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full p-3.5 bg-black/50 border border-white/10 rounded-2xl focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 text-white placeholder-gray-600 transition-all font-medium"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-400 hover:to-blue-400 text-white font-bold py-3.5 px-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.3)] hover:shadow-[0_0_30px_rgba(168,85,247,0.5)] disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] mt-2"
                        >
                            {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                        </button>
                    </form>
                </div>

                <div className="mt-8 text-center flex flex-col items-center gap-4">
                    <div className="bg-white/5 border border-white/10 px-6 py-3 rounded-full backdrop-blur-md inline-block">
                        <p className="text-sm font-medium text-gray-300">
                            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                            <button
                                onClick={() => setIsSignUp(!isSignUp)}
                                disabled={loading}
                                className="text-purple-400 hover:text-purple-300 font-bold ml-2 transition-colors focus:outline-none"
                            >
                                {isSignUp ? 'Log in' : 'Sign up'}
                            </button>
                        </p>
                    </div>
                </div>
            </motion.div>

            <div className="absolute bottom-6 w-full text-center pointer-events-none">
                <p className="text-[10px] text-gray-500 font-bold tracking-[0.2em] uppercase">
                    jannu की rachna
                </p>
            </div>
        </div>
    )
}
