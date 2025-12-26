-- Drop existing policies to avoid conflicts (optional, but good practice)
drop policy if exists "Users can view participants of their rooms" on room_participants;
drop policy if exists "Users can view their own rooms" on rooms;

-- Simplified Policy: Users can view participants where they are the user
-- This is the base case for the recursion
create policy "Users can view their own participant rows"
  on room_participants for select
  using ( auth.uid() = user_id );

-- Simplified Policy: Users can view participants of rooms they are in
-- This uses a security definer function to break recursion or just a simpler join
-- But for now, let's try a direct approach that avoids self-referencing the same table in a way that causes infinite recursion

-- Alternative: Use a view or a function, but let's try to fix the policy first.
-- The previous policy was:
-- select 1 from room_participants rp where rp.room_id = room_participants.room_id and rp.user_id = auth.uid()

-- This causes recursion because checking if "I am in the room" requires querying room_participants, which triggers the policy again.

-- FIX: We need a way to check room membership without triggering the select policy on the same table for the same row in a loop.
-- However, Supabase/Postgres RLS usually handles this if structured correctly.

-- Let's try a different approach:
-- 1. Users can see rows where user_id = auth.uid() (My membership)
-- 2. Users can see rows where room_id IN (select room_id from room_participants where user_id = auth.uid())

create policy "Users can view participants of rooms they belong to"
  on room_participants for select
  using (
    room_id in (
      select room_id from room_participants where user_id = auth.uid()
    )
  );

-- Note: The above might still cause recursion if not careful.
-- To be safe, let's use a security definer function to get my rooms.

create or replace function get_my_room_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select room_id from room_participants where user_id = auth.uid();
$$;

-- Now use this function in the policy
drop policy if exists "Users can view participants of rooms they belong to" on room_participants;

create policy "Users can view participants of rooms they belong to"
  on room_participants for select
  using (
    room_id in ( select get_my_room_ids() )
  );

-- Also update rooms policy
create policy "Users can view rooms they belong to"
  on rooms for select
  using (
    id in ( select get_my_room_ids() )
  );
