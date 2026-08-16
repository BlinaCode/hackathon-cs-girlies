# 🦦 Sisu - Health & Wellness Companion
> Understanding yourself and slowing the world around you

## What is Sisu?

Sisu is an interactive mental health and wellness web application immersing users in a welcoming ocean-themed environment with a caring sea otter ("Sisu the Otter") that helps guide the user through daily emotional check-ins, soothing breathing exercises, core value tracking, and curated mental health resources. It creates a judgement free space for users to reflect on emotions, negative thoughts, their personal goals and build healthy mental health habits.

---

## 🌊 User Experience

1. **Questionnaire Onboarding**
   - New users are greeted with a gentle health check-in (how they feel, how they physically feel, and what has been on their mind) this personalizes where they will be redirected to in the app. These questions can also be skipped.

2. **Sisu the Otter Mascot**
   - Cute and expressive otter that appears in the app at the top of the page, it will react to the user's activity and offer words of encouragement and guidance. 

3. **Day/Night Modes**
   - The user can choose whether or not to have a light or dark mode ("sky") while on the application.
   
## 🌊 Features

1. **Mood Check-in**
   - Quick and easy emotional check-in with mood selection, energy level toggle, and optional reflecting journaling
   - Sisu is responsive to what is shared and will offer guidance and encouragement

2. **Interactive Ocean Wave Breathing Visualizer**
   - Animated ocean bubble breathing exercise supporting these techniques matching the bubble animation:
     - **Box Breathing (4-4-4-4)** – Focus & stress relief
     - **4-7-8 Relaxing Breath** – Deep relaxation & sleep prep
     - **Ocean Calm Breath** – Soothing rhythm 

3. **Connect**
   - Users can join a live server where other users are participating in breathing exercises in real time. 
   - Includes other user's otters

4. **Reframe Thoughts**
   - A CBT-style tool that guides users to challenge and reframe negative thoughts into more positive and helpful ones.

5. **Core Values**
   - Users can define and check-in with their relationship connectiedness through answering a few questions regarding contact frequency, conversations, trust, closeness, understanding and support.
   - Encourages users to think about how strong that connection is.

6. **5-4-3-2-1 Grounding Exercis**
   - Classic sensory grounding technique for anxiety:
     - sight, smell, touch, hearing, taste*
7. **Resource Hub**
   - A curated list of mental health resources including grounding techniques, CBT resources, emergency hotlines (country specific), and sleep solutions.

8. **Ambient Sea Soundscapes**
   - Built-in soothing ambient audio player of Ocean Waves.

9. **Growth Dashboard**
   - Tracks a user's check-ins, streaks, and progress over time.
   - Includes graphs and charts of mood trends

10. **Account & Guest Mode**
    - **Guest Access**: No login needed, saved locally on device.
    - **Cloud Sync**: Optional Supabase Auth & PostgreSQL sync across devices.

11. **About Sisu**
   - A page dedicated to introducing Sisu the Otter and the purpose of the app.

---
## Design Philosophy

**Frictionless entry**
- We placed emphasis on allowing users to access all of our platform’s resources on guest mode and instead provided an optional cloud sync if they wanted to create an account.

**Calm UX**
- Since mental health is a sensitive topic, we ensured that the user had a calm experience through carefully guarded and empathetic interactions and an accessible HTML.

**Sea Design**
- Throughout the webpage, we used a consistent sea theme through a uniform color palette of light blues, greens and browns, the otter mascot, Sisu and the scattered images of sea items like shells and rocks. This projected to the user a cohesive and serene environment that differentiated our product from other tools available.  

**Empathise on mobile usage**
- To allow for quick accessibility to our website’s resources, we placed a high importance on how the webpage will be viewed on mobile devices.

## Tech Stack

**Frontend**
- The UI was built with a combination of React and Vite and styled with Tailwind CSS and custom CSS theming. 

**Data**
- Data is stored locally by default, however it can be stored in Supabase for usage over multiple devices. 

**State**
- It is run with a React context for the wellness and authentication aspects and uses custom hooks for storage synchronization, timers and sound effects.  

## Who is Sisu for

Sisu is aimed at anyone who wants a low pressure and convenient way to keep track of their mental health through check-in and exercises. This application is not meant to replace professional healthcare workers, however it assists users to practice taking care of themselves and provides connection to other resources when needed. 


## 📁 Repository Structure

```text
hackathon-cs-girlies/
├── golden-rules.md               # Core Engineering & Architecture Rules
├── README.md                     # Project Overview & Setup Guide
├── architecture/
│   └── README.md                 # System Architecture & Layering Rules
├── agents/                       # AI Agent specification
│   ├── .architect.md             # AI Agent architect prompt
│   ├── .engineer.md              # AI Agent engineer prompt
│   └──  .README.md               # Agent architecture overview
├── context/
│   ├── ai-constraints.md         # Runtime & AI context guidelines
│   └── design-contracts.md       # Component, Hook, & Service contracts
├── design_sessions/              # All the design sessions
│   ├── active-design.md          # Currently active design session
│   └── TEMPLATE.md               # Design session template
├── languages/                    # Language conventions
│   └── README.md                 # Language guidelines 
├──  node_modules/                # Json package
├── src/                          # All the source code  
├── assets/                       # All images used
│   ├── components/               # React components 
│   ├── context/                  # React context 
│   ├── hooks/                    # React JS hooks
│   ├── services/                 # React JS Service modules
│   └── styles/                   # All the styles 
│        ├── App.jsx              # The entry point to the application
│        └── main.jsx             # The entry point to the application
├── supabase/                     # Supabase database schema and configuration
└── workflows/                    # AI workflow commands ($prepare, $design-session, etc.)



---

## 🚀 Getting Started

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Environment Configuration**
   Create `.env` in root:
   ```env
   VITE_SUPABASE_URL=https://your-supabase-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```