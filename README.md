# 🦦 Sisu - Health & Wellness Companion

> **Understanding yourself and the world around you, through the right resources at the right time.**

Sisu is an interactive mental health and wellness web application designed to guide users through daily emotional check-ins, soothing breathing exercises, core value tracking, and curated mental health resources — accompanied by an interactive, Duolingo-style sea otter mascot (**Sisu the Otter**).

---

## 🌊 Value Proposition & Key Features

1. **Sisu the Otter Mascot Companion**
   - An interactive mascot featuring dynamic visual expressions (Joyful, Breathing, Caring, Thoughtful, Milestone Celebration) that provides gentle encouragement, check-in prompts, and streak celebrations throughout the user journey.

2. **Daily Emotional & Mood Check-In**
   - Fast, expressive mood selector with emotion tagging, reflection journaling, and instant mascot commentary.

3. **Interactive Ocean Wave Breathing Visualizer**
   - Hardware-accelerated 60fps breathing exercise visualizer with customizable techniques:
     - **Box Breathing (4-4-4-4)** – Focus & stress relief
     - **4-7-8 Relaxing Breath** – Deep relaxation & sleep prep
     - **Ocean Calm Breath** – Soothing rhythm matched to wave animation

4. **Long-Term Core Values & Alignment Tracker**
   - Interface to define personal core values (e.g., *Resilience, Mindfulness, Compassion, Courage*) and log daily value-aligned actions to track long-term personal evolution.

5. **Smart Mental Health Resource Hub**
   - Curated starter library of evidence-based wellness guides:
     - *5-4-3-2-1 Grounding Technique*
     - *CBT Thought Reframing Cards*
     - *Sleep Hygiene & Wind-Down Guide*
     - *Anxiety & Panic Relief Tool*

6. **Ambient Sea Soundscapes**
   - Built-in soothing ambient audio player (Ocean Waves, Gentle Rain, Stream) with volume controls.

7. **Dual-Mode State System**
   - **Instant Guest Access**: Full offline access with `localStorage` persistence — zero friction upfront.
   - **Cloud Sync**: Optional Supabase Auth & PostgreSQL sync across devices.

---

## 🎨 Visual Identity & Color Palette

- **Deep Ocean Slate (`#0F172A`)** – Main calm background
- **Card Slate (`#1E293B`)** – Soft floating aquatic cards
- **Seafoam Teal (`#14B8A6`)** – Primary accent & positive highlights
- **Warm Sand (`#FEF3C7`)** – Gentle neutral text & cards
- **Soft Coral (`#F43F5E`)** – Heartfelt mascot & milestone accents

---

## 🛠️ Architecture & Tech Stack

- **Frontend**: React (ES6+/JSX) + Vite + Custom CSS Variables / Tailwind CSS
- **Data Persistence**: `localStorage` (Guest Mode) + Supabase JS Client (`@supabase/supabase-js`)
- **State Management**: React Context (`AuthContext`, `WellnessContext`) & Custom Hooks (`useLocalStorage`, `useSupabaseSync`, `useBreathingTimer`, `useSoundscape`)

---

## 📁 Repository Structure

```text
hackathon-cs-girlies/
├── golden-rules.md               # Core Engineering & Architecture Rules
├── README.md                     # Project Overview & Setup Guide
├── architecture/
│   └── README.md                 # System Architecture & Layering Rules
├── context/
│   ├── ai-constraints.md         # Runtime & AI context guidelines
│   └── design-contracts.md       # Component, Hook, & Service contracts
├── agents/                       # AI Agent specifications
├── languages/                    # Language conventions
└── workflows/                    # AI workflow commands ($prepare, $design-session, etc.)
```

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