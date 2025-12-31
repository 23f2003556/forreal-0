#!/usr/bin/env node

/**
 * Diagnostic script to test Supabase Realtime connection
 * Run with: node test_realtime.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

async function testRealtimeConnection() {
    console.log('🧪 Testing Supabase Realtime Connection...\n');

    // Check environment variables
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
        console.error('❌ ERROR: Supabase credentials not found in .env.local');
        process.exit(1);
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );

    console.log('✅ Supabase client created');
    console.log('📡 Testing realtime subscription...\n');

    // Create a test channel
    const channel = supabase
        .channel('test-channel')
        .on('postgres_changes', {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
        }, (payload) => {
            console.log('📨 Received message:', payload);
        })
        .subscribe((status) => {
            console.log('🔌 Subscription status:', status);

            if (status === 'SUBSCRIBED') {
                console.log('\n✅ SUCCESS! Realtime is working correctly.');
                console.log('📊 Your real-time subscription is active.');
                console.log('\n💡 Tips:');
                console.log('   - Messages should appear instantly when sent');
                console.log('   - Check browser console for subscription logs');
                console.log('   - Look for "📨 New message received" logs\n');

                setTimeout(() => {
                    console.log('🔌 Cleaning up test subscription...');
                    supabase.removeChannel(channel);
                    process.exit(0);
                }, 2000);
            } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
                console.error('\n❌ ERROR: Realtime subscription failed!');
                console.error('Status:', status);
                console.log('\n🔍 Troubleshooting:');
                console.log('   1. Check if Realtime is enabled in Supabase dashboard');
                console.log('   2. Go to: Database → Replication');
                console.log('   3. Enable replication for the "messages" table');
                console.log('   4. Restart your dev server\n');
                process.exit(1);
            }
        });

    // Timeout after 10 seconds
    setTimeout(() => {
        console.log('\n⏱️  Timeout: Subscription took too long');
        console.log('This might indicate a connection issue.');
        supabase.removeChannel(channel);
        process.exit(1);
    }, 10000);
}

testRealtimeConnection();
