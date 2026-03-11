-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table
create table profiles (
  id uuid references auth.users on delete cascade not null primary key,
  username text unique,
  avatar_url text,
  status text default 'Hey there! I am using ForReal.',
  last_seen timestamp with time zone default timezone('utc'::text, now()),
  is_online boolean default false,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create rooms table
create table rooms (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  name text, -- Null for one-on-one chats
  type text check (type in ('private', 'group')) not null,
  image_url text
);

-- Create room_participants table
create table room_participants (
  room_id uuid references rooms on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  joined_at timestamp with time zone default timezone('utc'::text, now()),
  is_admin boolean default false,
  primary key (room_id, user_id)
);

-- Create messages table
create table messages (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  room_id uuid references rooms on delete cascade not null,
  sender_id uuid references profiles(id) on delete cascade not null,
  content text,
  type text check (type in ('text', 'image', 'audio')) default 'text',
  media_url text,
  status text check (status in ('sent', 'delivered', 'read')) default 'sent'
);

-- Enable Row Level Security
alter table profiles enable row level security;
alter table rooms enable row level security;
alter table room_participants enable row level security;
alter table messages enable row level security;

-- Policies

-- Profiles: Everyone can read profiles
create policy "Public profiles are viewable by everyone"
  on profiles for select
  using ( true );

-- Profiles: Users can update their own profile
create policy "Users can update own profile"
  on profiles for update
  using ( auth.uid() = id );

-- Rooms: Users can view rooms they are part of
create policy "Users can view their own rooms"
  on rooms for select
  using (
    exists (
      select 1 from room_participants
      where room_participants.room_id = rooms.id
      and room_participants.user_id = auth.uid()
    )
  );

-- Room Participants: Users can view participants of rooms they are in
create policy "Users can view participants of their rooms"
  on room_participants for select
  using (
    exists (
      select 1 from room_participants rp
      where rp.room_id = room_participants.room_id
      and rp.user_id = auth.uid()
    )
  );

-- Messages: Users can view messages in rooms they are part of
create policy "Users can view messages in their rooms"
  on messages for select
  using (
    exists (
      select 1 from room_participants
      where room_participants.room_id = messages.room_id
      and room_participants.user_id = auth.uid()
    )
  );

-- Messages: Users can insert messages into rooms they are part of
create policy "Users can insert messages in their rooms"
  on messages for insert
  with check (
    exists (
      select 1 from room_participants
      where room_participants.room_id = messages.room_id
      and room_participants.user_id = auth.uid()
    )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger for new user signup
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Storage Bucket Setup (Instructions)
-- You need to create a public bucket named 'media' in Supabase Storage.
-- Policy: Give read access to everyone, write access to authenticated users.
