"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

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
        <div className="min-h-[100dvh] bg-black flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-white tracking-tight">"more than just texting"</h1>
            </div>

            <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md">
                <h2 className="text-3xl font-extrabold mb-8 text-center text-white tracking-tight">
                    {isSignUp ? 'Sign Up' : 'Login'}
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-600 transition-colors"
                            placeholder="name@example.com"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-3 bg-gray-950 border border-gray-800 rounded-xl focus:outline-none focus:border-purple-500 text-white placeholder-gray-600 transition-colors"
                            placeholder="••••••••"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-4 rounded-xl transition-all shadow-lg shadow-purple-900/20 disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                    </button>
                </form>

                <div className="mt-8 flex items-center justify-between">
                    <span className="border-b w-[35%] lg:w-[40%] border-gray-800"></span>
                    <span className="text-xs text-center text-gray-500 uppercase">or</span>
                    <span className="border-b w-[35%] lg:w-[40%] border-gray-800"></span>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="mt-6 w-full flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium py-3 px-4 rounded-xl focus:outline-none transition-colors disabled:opacity-50"
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

                <div className="mt-8 text-center bg-white/5 mx-auto w-fit px-4 py-2 rounded-full border border-white/5">
                    <p className="text-sm text-gray-400">
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

            <div className="mt-8 text-center">
                <p className="text-xs text-text-secondary opacity-60 font-medium tracking-widest uppercase">
                    jannu की rachna
                </p>
            </div>
        </div>
    )
}
