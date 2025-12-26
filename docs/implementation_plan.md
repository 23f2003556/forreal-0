# Migration Plan: OpenAI to Google Gemini

## Goal
Replace OpenAI GPT-4o with Google Gemini Flash for the "Friend Engine" feature to utilize the free tier.

## User Review Required
> [!IMPORTANT]
> You will need to obtain a **Google Gemini API Key** from [Google AI Studio](https://aistudio.google.com/app/apikey).

## Proposed Changes

### Dependencies
- [NEW] Install `@google/generative-ai`
- [DELETE] Uninstall `openai` (optional, can keep for future)

### Backend API
#### [MODIFY] [route.ts](file:///Users/jannuvashisht/aichat/src/app/api/analyze/route.ts)
- Replace `openai` import with `@google/generative-ai`.
- Initialize `GoogleGenerativeAI` client with `GEMINI_API_KEY`.
- Update the prompt structure (Gemini handles system instructions differently or just as part of the prompt).
- Update the response parsing logic (Gemini returns a different object structure).
- Ensure JSON mode is enforced (Gemini supports `response_mime_type: "application/json"`).

### Avatars & Status
#### [MODIFY] [Sidebar.tsx](file:///Users/jannuvashisht/aichat/src/components/sidebar/Sidebar.tsx)
- Change user avatar URL from `avataaars` to `initials`.
- Update default status text to remove "WhatsApp".

#### [MODIFY] [LoginPage.tsx](file:///Users/jannuvashisht/aichat/src/app/login/page.tsx)
- Change signup avatar URL from `avataaars` to `initials`.

### Branding & Deployment
#### [MODIFY] [layout.tsx](file:///Users/jannuvashisht/aichat/src/app/layout.tsx)
- Change `title` to "ForReal".
- Update `description` to remove "clone" references.

#### [MODIFY] [page.tsx](file:///Users/jannuvashisht/aichat/src/app/login/page.tsx)
- Replace logo and "ForReal" branding with "more than just texting".
- Enhance "Log in to ForReal" heading with premium styling (gradient, better typography).

#### [MODIFY] [README.md](file:///Users/jannuvashisht/aichat/README.md)
- Replace all "WhatsApp" and "clone" references with "ForReal" or generic terms.

### AI & Interactive Features
#### [MODIFY] [route.ts](file:///Users/jannuvashisht/aichat/src/app/api/analyze/route.ts)
- Update the `POST` handler to accept `userPrompt`.
- Modify the AI prompt to handle `userPrompt` if provided, generating a specific response instead of (or in addition to) static suggestions.

#### [MODIFY] [CoachPanel.tsx](file:///Users/jannuvashisht/aichat/src/components/chat/CoachPanel.tsx)
- Replace the static "Suggested Replies" section with a "Suggest Reply" input field and "Ask AI" button.
- Add state to manage the user's prompt and the AI's response.

#### [MODIFY] [ChatWindow.tsx](file:///Users/jannuvashisht/aichat/src/components/chat/ChatWindow.tsx)
- Update the `Send` icon to be always visible in the chat input area.

### Icons
#### [MODIFY] [ChatWindow.tsx](file:///Users/jannuvashisht/aichat/src/components/chat/ChatWindow.tsx)
- Remove `Search` and `MoreVertical` from the header.
- Remove `Smile`, `Paperclip`, and `Mic` from the input area.

#### [MODIFY] [Sidebar.tsx](file:///Users/jannuvashisht/aichat/src/components/sidebar/Sidebar.tsx)
- Remove `CircleDashed` and `MessageSquare` from the header.
- Remove the `Search` icon from the profile photo overlay.

### Components
#### [MODIFY] [MainLayout.tsx](file:///Users/jannuvashisht/aichat/src/components/layout/MainLayout.tsx)
- Remove the `<ContactInfo />` sidebar component.

### Google Login & Onboarding Fix
#### [MODIFY] [auth/callback/route.ts](file:///Users/jannuvashisht/aichat/src/app/auth/callback/route.ts)
- Ensure the session is correctly established and cookies are set for the App Router.

#### [NEW] [setup-profile/page.tsx](file:///Users/jannuvashisht/aichat/src/app/setup-profile/page.tsx)
- Create a premium onboarding page where users **must** enter their full name.
- Update the Supabase `profiles` table with the new name.

#### [MODIFY] [MainLayout.tsx](file:///Users/jannuvashisht/aichat/src/components/layout/MainLayout.tsx)
- Add a check: if `currentUser` exists but `username` (or `full_name`) is missing/default, redirect to `/setup-profile`.

### Separate Signup Form
#### [MODIFY] [login/page.tsx](file:///Users/jannuvashisht/aichat/src/app/login/page.tsx)
- Add `isSignUp` state to toggle between Login and Signup modes.
- Update the form to show "Sign Up" heading and button when in signup mode.
- Change the bottom link to toggle between "Log in" and "Sign up".

## Verification Plan

### Manual Verification
- **Toggle:** Verify that clicking "Sign up" or "Log in" at the bottom correctly switches the form mode.
- **Signup:** Verify that the signup form works and shows the "Check your email" alert.
- **Login:** Verify that the login form still works as expected.
