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
        <div className="min-h-[100dvh] bg-app-background flex flex-col items-center justify-center p-4">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-teal-primary tracking-tight">"more than just texting"</h1>
            </div>

            <div className="bg-white dark:bg-panel-header-background p-8 rounded-lg shadow-lg w-full max-w-md">
                <h2 className="text-3xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600 dark:from-teal-400 dark:to-emerald-400 tracking-tight">
                    {isSignUp ? 'Sign Up' : 'Login'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-teal-primary dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-text-secondary mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-teal-primary dark:bg-gray-800 dark:border-gray-700"
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-teal-primary hover:bg-teal-secondary text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Processing...' : (isSignUp ? 'Sign Up' : 'Log In')}
                    </button>
                </form>

                <div className="mt-6 flex items-center justify-between">
                    <span className="border-b w-[35%] lg:w-[40%] dark:border-gray-700"></span>
                    <span className="text-xs text-center text-gray-500 uppercase dark:text-gray-400">or</span>
                    <span className="border-b w-[35%] lg:w-[40%] dark:border-gray-700"></span>
                </div>

                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="mt-6 w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded focus:outline-none transition-colors disabled:opacity-50"
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

                <div className="mt-6 text-center">
                    <p className="text-sm text-text-secondary">
                        {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                    </p>
                    <button
                        onClick={() => setIsSignUp(!isSignUp)}
                        disabled={loading}
                        className="text-teal-primary hover:underline text-sm font-medium mt-1"
                    >
                        {isSignUp ? 'Log in' : 'Sign up'}
                    </button>
                </div>
            </div>
        </div>
    )
}
