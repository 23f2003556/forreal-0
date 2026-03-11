"use client"

import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Users, Building, GraduationCap, ArrowRight, Zap, Shield, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LandingPage() {
    const router = useRouter();

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants: any = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    return (
        <div className="min-h-screen bg-black text-white overflow-x-hidden w-full font-sans antialiased selection:bg-purple-500/30">
            {/* Navigation */}
            <nav className="fixed w-full z-50 top-0 border-b border-white/5 bg-black/50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-purple-600 to-blue-500 flex items-center justify-center">
                                <MessageSquare className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-xl tracking-tight">forreal.</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                                Log in
                            </Link>
                            <Link href="/login" className="text-sm font-medium px-4 py-2 rounded-full bg-white text-black hover:bg-gray-100 transition-colors">
                                Sign up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Hero Section */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

                <motion.div
                    className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm font-medium text-purple-300 mb-8 hover:bg-white/10 transition-colors cursor-default">
                        <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
                        beyond texting
                    </motion.div>

                    <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
                        Stop guessing.<br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500">
                            Start connecting.
                        </span>
                    </motion.h1>

                    <motion.p variants={itemVariants} className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto mb-12">
                        Forreal helps you interpret mood, intent, and engagement in real-time, completely transforming how you chat online.
                    </motion.p>

                    <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => router.push('/login')}
                            className="w-full sm:w-auto px-8 py-4 rounded-full bg-white text-black font-bold text-lg hover:scale-105 transition-transform flex items-center justify-center gap-2 group"
                        >
                            Get Started Free
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </motion.div>
                </motion.div>
            </section>

            {/* The Problem Section */}
            <section className="py-24 bg-zinc-950 border-y border-white/5 relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center max-w-4xl mx-auto mb-16"
                    >
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Problem</h2>
                        <p className="text-xl md:text-2xl text-gray-400 leading-relaxed font-light">
                            "People struggle to interpret mood, intent, and engagement in online chats, leading to frequent misunderstandings and less meaningful digital connections."
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 }}
                            className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5"
                        >
                            <div className="text-4xl font-bold text-purple-500 mb-2">55%</div>
                            <p className="text-gray-400">of communication is non-verbal. In texts, you're flying blind, leading to anxiety over how messages are received.</p>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                            className="bg-zinc-900/40 p-6 rounded-2xl border border-white/5"
                        >
                            <div className="text-4xl font-bold text-blue-500 mb-2">3x</div>
                            <p className="text-gray-400">more likely to have a conflict escalate in text compared to face-to-face conversations due to misread tones.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* The Impact Section */}
            <section className="py-32 relative">
                <div className="absolute left-0 top-1/3 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-20">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">forreal's magic</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">When communication breaks down, everyone feels the friction.</p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* Impact Card - Love */}
                        <motion.div
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className="bg-zinc-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-sm group cursor-default"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-pink-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-pink-500/20 transition-all">
                                <Heart className="w-6 h-6 text-pink-500 group-hover:fill-pink-500/20 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Love</h3>
                            <p className="text-gray-400 text-sm">Find what is really in their mind. Uncover hidden affection and avoid overthinking short replies.</p>
                        </motion.div>

                        {/* Impact Card - Friends */}
                        <motion.div
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className="bg-zinc-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-sm group cursor-default"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-yellow-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-yellow-500/20 transition-all">
                                <Users className="w-6 h-6 text-yellow-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Friends</h3>
                            <p className="text-gray-400 text-sm">Crack the right joke at the right time. Measure the room's vibe before sending that meme.</p>
                        </motion.div>

                        {/* Impact Card - Work */}
                        <motion.div
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className="bg-zinc-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-sm group cursor-default"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-blue-500/20 transition-all">
                                <Building className="w-6 h-6 text-blue-500" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Work</h3>
                            <p className="text-gray-400 text-sm">Be more productive. Ensure your professional instructions are clear, polite, and well-received.</p>
                        </motion.div>

                        {/* Impact Card - Artistic */}
                        <motion.div
                            whileHover={{ y: -10, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 10 }}
                            className="bg-zinc-900/50 border border-white/10 p-6 rounded-3xl backdrop-blur-sm group cursor-default"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-purple-500/20 transition-all">
                                <Zap className="w-6 h-6 text-purple-500 group-hover:fill-purple-500/20 transition-colors" />
                            </div>
                            <h3 className="text-xl font-bold mb-3">Artistic</h3>
                            <p className="text-gray-400 text-sm">Brainstorm new ideas seamlessly. Let the AI suggest creative tangents based on the conversation's flow.</p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-32 bg-gradient-to-b from-zinc-950 to-black relative">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row items-center gap-16">
                        <div className="flex-1">
                            <h2 className="text-3xl md:text-5xl font-bold mb-6">Forreal solves this.</h2>
                            <p className="text-xl text-gray-400 mb-8">
                                Our AI friend engine acts as your personal communication coach, running quietly in the background to provide real-time insights.
                            </p>

                            <div className="space-y-6">
                                <div className="flex gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <Zap className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold">Real-time Vibe Checks</h4>
                                        <p className="text-gray-400">Instantly gauge the engagement level and mood of the conversation.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <Shield className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold">Red & Green Flags</h4>
                                        <p className="text-gray-400">Spot potential misunderstandings before they happen.</p>
                                    </div>
                                </div>
                                <div className="flex gap-4">
                                    <div className="mt-1 w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center shrink-0">
                                        <Heart className="w-5 h-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold">Smart Icebreakers</h4>
                                        <p className="text-gray-400">Never run out of things to say with context-aware reply suggestions.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mock UI Representation */}
                        <div className="flex-1 w-full max-w-md relative">
                            <div className="absolute -inset-4 bg-gradient-to-tr from-purple-500 to-blue-500 rounded-3xl blur-[30px] opacity-30 animate-pulse" />
                            <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-6 shadow-2xl">
                                <div className="space-y-4">
                                    {/* Mock message */}
                                    <div className="flex gap-3">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 shrink-0" />
                                        <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none">
                                            <p className="text-sm">Hey, are we still on for the project review later?</p>
                                        </div>
                                    </div>
                                    {/* AI Insight popover mock */}
                                    <motion.div
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        whileInView={{ opacity: 1, scale: 1 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: 0.3 }}
                                        className="ml-11 bg-purple-900/30 border border-purple-500/30 p-4 rounded-2xl relative"
                                    >
                                        <div className="absolute -left-2 top-4 w-4 h-4 bg-purple-900/30 border-l border-t border-purple-500/30 rotate-[-45deg]" />
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-xs font-bold text-purple-300 uppercase">AI Insight</span>
                                            <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-400 text-[10px] font-bold">Vibe: Professional</span>
                                        </div>
                                        <p className="text-sm text-gray-300">Tone is direct but friendly. High engagement (85%).</p>
                                        <div className="mt-3 flex gap-2">
                                            <span className="text-xs px-3 py-1.5 rounded-full bg-white/10 text-white cursor-pointer hover:bg-white/20">"Yes, see you at 3!"</span>
                                        </div>
                                    </motion.div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-32 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-purple-900/20 to-black pointer-events-none" />
                <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-8">Ready to transform your conversations?</h2>
                    <button
                        onClick={() => router.push('/login')}
                        className="px-10 py-5 rounded-full bg-white text-black font-bold text-xl hover:scale-105 transition-transform shadow-[0_0_40px_rgba(168,85,247,0.4)]"
                    >
                        Join Forreal Today
                    </button>
                    <p className="mt-8 text-gray-500 font-medium tracking-widest uppercase text-xs">
                        jannu की rachna
                    </p>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;
