-- Check and enable Realtime for messages table
-- Run this in your Supabase SQL Editor

-- 1. Check current replication status
SELECT 
    schemaname,
    tablename,
    CASE 
        WHEN EXISTS (
            SELECT 1 
            FROM pg_publication_tables 
            WHERE schemaname = 'public' 
            AND tablename = 'messages'
        ) THEN 'ENABLED ✅'
        ELSE 'DISABLED ❌'
    END as realtime_status
FROM pg_tables
WHERE schemaname = 'public' 
AND tablename = 'messages';

-- 2. If realtime is disabled, enable it with this command:
-- (Uncomment the line below and run it)

-- ALTER PUBLICATION supabase_realtime ADD TABLE messages;

-- 3. Verify it's enabled
SELECT * FROM pg_publication_tables WHERE tablename = 'messages';
