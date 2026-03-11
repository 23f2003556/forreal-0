"use client"

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Users, Building, GraduationCap, ArrowRight, Zap, Shield, Heart } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function LandingPage() {
    const router = useRouter();
    const [activeTab, setActiveTab] = useState('love');
    const [activeTechFeature, setActiveTechFeature] = useState(0);
    const [phraseIndex, setPhraseIndex] = useState(0);

    const phrases = [
        "does she like me?",
        "what does it mean?",
        "why left on read?",
        "is he joking?"
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setPhraseIndex((prev) => (prev + 1) % phrases.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

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

    const techFeatures = [
        {
            id: 'engine',
            title: 'Natural Language Engine',
            icon: Zap,
            description: 'Forreal uses advanced LLMs fine-tuned on nuanced human conversation to detect subtle shifts in tone, sarcasm, and unspoken intent.',
            stat: '< 200ms',
            statLabel: 'Inference Latency'
        },
        {
            id: 'context',
            title: 'Continuous Context Memory',
            icon: Building, // Using Building as a placeholder for database/memory
            description: 'The AI does not just read the last message. It analyzes the entire flow of the conversation, remembering inside jokes and recurring themes.',
            stat: '99%',
            statLabel: 'Context Retention'
        },
        {
            id: 'privacy',
            title: 'On-Device Edge Processing',
            icon: Shield,
            description: 'Your private chats stay private. Critical vibe-checks and emotional analysis are processed securely, minimizing data exposure.',
            stat: 'Zero',
            statLabel: 'Data Sold'
        }
    ];

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
                    <motion.div variants={itemVariants} className="mb-4 h-12 flex items-center justify-center overflow-hidden">
                        <AnimatePresence mode="popLayout">
                            <motion.span
                                key={phraseIndex}
                                initial={{ y: 40, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                exit={{ y: -40, opacity: 0 }}
                                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                                className="text-2xl md:text-4xl font-medium text-gray-500 italic"
                            >
                                "{phrases[phraseIndex]}"
                            </motion.span>
                        </AnimatePresence>
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

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative bg-zinc-900/40 p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-all cursor-default overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">55%</div>
                                    <div className="h-px bg-white/10 flex-1 ml-4 group-hover:bg-purple-500/20 transition-colors" />
                                </div>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    of communication is non-verbal. In texts, you're flying blind, leading to anxiety over how messages are received.
                                </p>
                            </div>
                        </motion.div>
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="group relative bg-zinc-900/40 p-8 rounded-3xl border border-white/5 hover:border-blue-500/30 transition-all cursor-default overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-gradient-to-bl from-blue-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">3x</div>
                                    <div className="h-px bg-white/10 flex-1 ml-4 group-hover:bg-blue-500/20 transition-colors" />
                                </div>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    more likely to have a conflict escalate in text compared to face-to-face conversations due to misread tones.
                                </p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Solution Section */}
            <section className="py-32 bg-gradient-to-b from-zinc-950 to-black relative overflow-hidden">
                {/* Background Tech Grids */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-sm font-medium text-blue-400 mb-6"
                        >
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            How it works
                        </motion.div>
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">Forreal solves this.</h2>
                        <p className="text-xl text-gray-400">
                            Our AI friend engine acts as your personal communication coach. Here is the magic under the hood.
                        </p>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-12 items-start">
                        {/* Interactive Feature List (Timeline style) */}
                        <div className="flex-1 space-y-4 w-full">
                            {techFeatures.map((feature, index) => {
                                const isActive = activeTechFeature === index;
                                const Icon = feature.icon;
                                return (
                                    <motion.div
                                        key={feature.id}
                                        onClick={() => setActiveTechFeature(index)}
                                        className={`p-6 rounded-3xl cursor-pointer transition-all border ${isActive
                                            ? 'bg-zinc-900 border-purple-500/30 shadow-[0_0_30px_rgba(168,85,247,0.1)]'
                                            : 'bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-900/60'
                                            }`}
                                    >
                                        <div className="flex items-start gap-4">
                                            <div className={`mt-1 w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-colors ${isActive ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-gray-500'
                                                }`}>
                                                <Icon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className={`text-xl font-bold mb-2 transition-colors ${isActive ? 'text-white' : 'text-gray-400'}`}>
                                                    {feature.title}
                                                </h4>
                                                <AnimatePresence>
                                                    {isActive && (
                                                        <motion.div
                                                            initial={{ opacity: 0, height: 0 }}
                                                            animate={{ opacity: 1, height: 'auto' }}
                                                            exit={{ opacity: 0, height: 0 }}
                                                            transition={{ duration: 0.3 }}
                                                            className="overflow-hidden"
                                                        >
                                                            <p className="text-gray-400 leading-relaxed mb-4">
                                                                {feature.description}
                                                            </p>
                                                            <div className="inline-flex items-center gap-2 bg-black/50 px-3 py-1.5 rounded-lg border border-white/5">
                                                                <span className="text-purple-400 font-bold">{feature.stat}</span>
                                                                <span className="text-xs text-gray-500 uppercase tracking-widest">{feature.statLabel}</span>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>

                        {/* Interactive Visualization Area */}
                        <div className="flex-1 w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-8 relative min-h-[500px] flex items-center justify-center overflow-hidden">
                            {/* Ambient Glow */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/5 via-transparent to-blue-500/5" />

                            <AnimatePresence mode="wait">
                                {activeTechFeature === 0 && (
                                    <motion.div
                                        key="engine"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative w-full max-w-sm"
                                    >
                                        {/* Visualization for NLP Engine */}
                                        <div className="space-y-4 relative z-10 w-full">
                                            <div className="bg-zinc-800 p-4 rounded-2xl rounded-tr-none self-end ml-auto w-[80%] border border-white/5">
                                                <p className="text-sm">"Fine, do whatever you want."</p>
                                            </div>

                                            {/* Scanning effect */}
                                            <div className="relative h-20 flex flex-col justify-center items-center">
                                                <motion.div
                                                    animate={{ y: [-10, 10, -10] }}
                                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                                    className="w-full h-px bg-purple-500/50 shadow-[0_0_10px_rgba(168,85,247,0.8)] absolute z-20"
                                                />
                                                <div className="flex gap-2">
                                                    <span className="text-xs font-mono text-gray-500">Processing vectors...</span>
                                                </div>
                                            </div>

                                            <div className="bg-purple-900/30 border border-purple-500/30 p-4 rounded-2xl w-[90%]">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Shield className="w-4 h-4 text-purple-400" />
                                                    <span className="text-xs font-bold text-purple-300">Engine Output</span>
                                                </div>
                                                <div className="space-y-2">
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-gray-400">Literal Meaning:</span>
                                                        <span className="text-gray-300">Agreement</span>
                                                    </div>
                                                    <div className="flex justify-between text-xs">
                                                        <span className="text-purple-400 font-bold">Inferred Intent:</span>
                                                        <span className="text-red-400 font-bold">Frustration / Disagreement</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {activeTechFeature === 1 && (
                                    <motion.div
                                        key="context"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative w-full h-full flex items-center justify-center p-4"
                                    >
                                        <div className="relative w-full h-[300px]">
                                            {/* Central Hub representing memory */}
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-blue-500/20 border border-blue-500/50 rounded-full flex items-center justify-center z-10 backdrop-blur-sm">
                                                <Building className="w-8 h-8 text-blue-400" />
                                            </div>

                                            {/* Circular nodes connecting to center */}
                                            {[
                                                { label: "Inside Jokes", angle: 0 },
                                                { label: "Tone History", angle: 72 },
                                                { label: "Preferences", angle: 144 },
                                                { label: "Past Conflicts", angle: 216 },
                                                { label: "Relationship", angle: 288 }
                                            ].map((node, i) => {
                                                const rad = (node.angle * Math.PI) / 180;
                                                const radius = 100;
                                                const x = Math.cos(rad) * radius;
                                                const y = Math.sin(rad) * radius;

                                                return (
                                                    <motion.div
                                                        key={i}
                                                        initial={{ opacity: 0, scale: 0 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: i * 0.1 }}
                                                        className="absolute top-1/2 left-1/2 w-12 h-12 -ml-6 -mt-6"
                                                        style={{ x, y }}
                                                    >
                                                        <div className="w-full h-full bg-zinc-800 border border-white/10 rounded-full flex items-center justify-center relative group">
                                                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                                                            {/* Line to center */}
                                                            <div className="absolute top-1/2 left-1/2 w-[100px] h-px bg-blue-500/20 origin-left -z-10" style={{ transform: `rotate(${Math.PI + rad}rad)` }} />
                                                            <span className="absolute -bottom-6 whitespace-nowrap text-[10px] text-gray-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                                                                {node.label}
                                                            </span>
                                                        </div>
                                                    </motion.div>
                                                );
                                            })}
                                        </div>
                                    </motion.div>
                                )}

                                {activeTechFeature === 2 && (
                                    <motion.div
                                        key="privacy"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 1.1 }}
                                        transition={{ duration: 0.4 }}
                                        className="relative w-full h-full flex flex-col items-center justify-center"
                                    >
                                        <div className="relative">
                                            <Shield className="w-32 h-32 text-gray-800" />
                                            <motion.div
                                                animate={{ opacity: [0.5, 1, 0.5] }}
                                                transition={{ repeat: Infinity, duration: 2 }}
                                                className="absolute inset-0"
                                            >
                                                <Shield className="w-32 h-32 text-green-500/30 blur-md" />
                                            </motion.div>
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <Shield className="w-16 h-16 text-green-400" />
                                            </div>
                                        </div>

                                        <div className="mt-8 text-center space-y-4 w-full px-8">
                                            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-white/5">
                                                <span className="text-xs text-gray-400 font-mono">End-to-End Encryption</span>
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-white/5">
                                                <span className="text-xs text-gray-400 font-mono">Local Vibe Analysis</span>
                                                <div className="w-2 h-2 rounded-full bg-green-500" />
                                            </div>
                                            <div className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg border border-white/5">
                                                <span className="text-xs text-gray-400 font-mono">Cloud Diagnostics</span>
                                                <div className="w-2 h-2 rounded-full bg-red-500" />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </section>

            {/* The Impact Section */}
            <section className="py-32 relative bg-zinc-950/50">
                <div className="absolute left-0 top-1/3 w-[500px] h-[500px] bg-blue-600/10 blur-[100px] rounded-full pointer-events-none" />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-5xl font-bold mb-6">forreal's magic</h2>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">Different vibes for different tribes. See how it works.</p>
                    </div>

                    {/* Interactive Tabs */}
                    <div className="flex flex-wrap justify-center gap-4 mb-12">
                        {[
                            { id: 'love', icon: Heart, label: 'Love', color: 'text-pink-500', bg: 'bg-pink-500' },
                            { id: 'friends', icon: Users, label: 'Friends', color: 'text-yellow-500', bg: 'bg-yellow-500' },
                            { id: 'work', icon: Building, label: 'Work', color: 'text-blue-500', bg: 'bg-blue-500' },
                            { id: 'artistic', icon: Zap, label: 'Artistic', color: 'text-purple-500', bg: 'bg-purple-500' }
                        ].map((tab) => {
                            const Icon = tab.icon;
                            const isActive = activeTab === tab.id;
                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`relative px-6 py-3 rounded-full flex items-center gap-2 font-bold transition-all ${isActive ? 'text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    {isActive && (
                                        <motion.div
                                            layoutId="activeTab"
                                            className={`absolute inset-0 ${tab.bg}/20 border border-${tab.bg.split('-')[1]}-500/50 rounded-full`}
                                            transition={{ type: "spring", duration: 0.6 }}
                                        />
                                    )}
                                    <Icon className={`w-5 h-5 relative z-10 ${isActive ? tab.color : ''}`} />
                                    <span className="relative z-10">{tab.label}</span>
                                </button>
                            );
                        })}
                    </div>

                    {/* Tab Content */}
                    <div className="max-w-4xl mx-auto bg-zinc-900 shadow-2xl rounded-3xl border border-white/10 overflow-hidden relative min-h-[400px]">
                        <AnimatePresence mode="wait">
                            {activeTab === 'love' && (
                                <motion.div
                                    key="love"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center h-full"
                                >
                                    <div className="flex-1 space-y-6">
                                        <div className="w-16 h-16 rounded-2xl bg-pink-500/20 flex items-center justify-center">
                                            <Heart className="w-8 h-8 text-pink-500" />
                                        </div>
                                        <h3 className="text-3xl font-bold">Uncover hidden affection.</h3>
                                        <p className="text-gray-400 text-lg">
                                            Find what is really in their mind. Stop overthinking short replies and understand the true intent behind the text.
                                        </p>
                                    </div>
                                    <div className="flex-1 w-full bg-zinc-950 p-6 rounded-2xl border border-white/5 relative">
                                        <div className="flex gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-pink-500/20 shrink-0" />
                                            <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none"><p className="text-sm">okay cool.</p></div>
                                        </div>
                                        <div className="ml-11 bg-pink-900/30 border border-pink-500/30 p-4 rounded-xl relative">
                                            <div className="absolute -left-2 top-4 w-4 h-4 bg-pink-900/30 border-l border-t border-pink-500/30 rotate-[-45deg]" />
                                            <span className="text-[10px] font-bold text-pink-400 uppercase tracking-wider">AI Vibe Check</span>
                                            <p className="text-sm text-gray-300 mt-1">High engagement! Tone implies they are nervous but excited. Try a reassuring reply.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'friends' && (
                                <motion.div
                                    key="friends"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center h-full"
                                >
                                    <div className="flex-1 space-y-6">
                                        <div className="w-16 h-16 rounded-2xl bg-yellow-500/20 flex items-center justify-center">
                                            <Users className="w-8 h-8 text-yellow-500" />
                                        </div>
                                        <h3 className="text-3xl font-bold">Crack the right joke.</h3>
                                        <p className="text-gray-400 text-lg">
                                            Measure the room's vibe before sending that meme. Avoid awkward silence in the group chat.
                                        </p>
                                    </div>
                                    <div className="flex-1 w-full bg-zinc-950 p-6 rounded-2xl border border-white/5 relative">
                                        <div className="flex gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-yellow-500/20 shrink-0" />
                                            <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none"><p className="text-sm">I just failed my driver's test.</p></div>
                                        </div>
                                        <div className="ml-11 bg-yellow-900/30 border border-yellow-500/30 p-4 rounded-xl relative">
                                            <div className="absolute -left-2 top-4 w-4 h-4 bg-yellow-900/30 border-l border-t border-yellow-500/30 rotate-[-45deg]" />
                                            <span className="text-[10px] font-bold text-yellow-400 uppercase tracking-wider">AI Coach Alert</span>
                                            <p className="text-sm text-gray-300 mt-1">Sarcasm/Jokes not recommended right now. Send support first.</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'work' && (
                                <motion.div
                                    key="work"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center h-full"
                                >
                                    <div className="flex-1 space-y-6">
                                        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                                            <Building className="w-8 h-8 text-blue-500" />
                                        </div>
                                        <h3 className="text-3xl font-bold">Be more productive.</h3>
                                        <p className="text-gray-400 text-lg">
                                            Ensure your professional instructions are clear, polite, and well-received by colleagues and clients.
                                        </p>
                                    </div>
                                    <div className="flex-1 w-full bg-zinc-950 p-6 rounded-2xl border border-white/5 relative">
                                        <div className="flex flex-row-reverse gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-blue-500/50 shrink-0" />
                                            <div className="bg-blue-600 p-3 rounded-2xl rounded-tr-none"><p className="text-sm">Give me that report by 5.</p></div>
                                        </div>
                                        <div className="mr-11 bg-red-900/30 border border-red-500/30 p-4 rounded-xl relative">
                                            <div className="absolute -right-2 top-4 w-4 h-4 bg-red-900/30 border-r border-t border-red-500/30 rotate-[45deg]" />
                                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider">AI Polish Suggestion</span>
                                            <p className="text-sm text-gray-300 mt-1">A bit too blunt! Try: "Could you please send over the report by 5 PM? Thanks!"</p>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeTab === 'artistic' && (
                                <motion.div
                                    key="artistic"
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -20 }}
                                    transition={{ duration: 0.3 }}
                                    className="p-8 md:p-12 flex flex-col md:flex-row gap-12 items-center h-full"
                                >
                                    <div className="flex-1 space-y-6">
                                        <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                                            <Zap className="w-8 h-8 text-purple-500" />
                                        </div>
                                        <h3 className="text-3xl font-bold">Brainstorm seamlessly.</h3>
                                        <p className="text-gray-400 text-lg">
                                            Let the AI suggest creative tangents and expand on ideas based on the organic flow of the conversation.
                                        </p>
                                    </div>
                                    <div className="flex-1 w-full bg-zinc-950 p-6 rounded-2xl border border-white/5 relative">
                                        <div className="flex gap-3 mb-6">
                                            <div className="w-8 h-8 rounded-full bg-purple-500/20 shrink-0" />
                                            <div className="bg-zinc-800 p-3 rounded-2xl rounded-tl-none"><p className="text-sm">I want the design to feel like... digital retro?</p></div>
                                        </div>
                                        <div className="ml-11 bg-purple-900/30 border border-purple-500/30 p-4 rounded-xl relative">
                                            <div className="absolute -left-2 top-4 w-4 h-4 bg-purple-900/30 border-l border-t border-purple-500/30 rotate-[-45deg]" />
                                            <span className="text-[10px] font-bold text-purple-400 uppercase tracking-wider">AI Tangent Match</span>
                                            <div className="flex flex-col gap-2 mt-2">
                                                <span className="text-xs px-3 py-1.5 rounded-full border border-purple-500/30 text-white cursor-pointer hover:bg-white/10 w-fit">"Like vaporwave vibes?"</span>
                                                <span className="text-xs px-3 py-1.5 rounded-full border border-purple-500/30 text-white cursor-pointer hover:bg-white/10 w-fit">"Maybe Cyberpunk aesthetics?"</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
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
