# 🦦 Sisu — Health & Wellness Companion

> **Understanding yourself and slowing the world around you.**

Sisu is an interactive wellness web application designed to provide a calm, low-pressure space for reflection, breathing exercises, grounding activities, and personal check-ins.

Built during a hackathon by the **Computer Science Girlies** team, Sisu combines an ocean-themed interface, an expressive otter mascot, interactive wellness tools, and optional cloud synchronization.

## ✨ Features

* 🌊 **Mood Check-ins** — Record your mood, energy level, and optional reflections.
* 🫧 **Interactive Breathing Visualizer** — Guided breathing exercises including Box Breathing, 4-7-8 breathing, and Ocean Calm.
* 🦦 **Sisu the Otter** — An interactive mascot that responds to user activity throughout the application.
* 🤝 **Connect** — A shared breathing experience where users can see others participating in real time.
* 💭 **Reframe Thoughts** — A guided tool for turning difficult thoughts into more constructive perspectives.
* 🧭 **Core Values** — Reflect on relationships, connections, and personal values.
* 👀 **5-4-3-2-1 Grounding** — An interactive sensory grounding exercise.
* 📚 **Resource Hub** — A collection of wellness and mental-health resources.
* 🌧️ **Ambient Soundscapes** — Ocean waves, rain, and stream sounds with volume controls.
* 📈 **Growth Dashboard** — View check-ins, streaks, and mood trends over time.
* 🌙 **Day/Night Modes** — Switch between light and dark visual environments.
* 👤 **Guest Mode** — Use the application without creating an account, with data stored locally.
* ☁️ **Optional Cloud Sync** — Supabase authentication and database synchronization for users who want their data available across devices.

## 👩‍💻 My Contributions

As a member of the development team, I worked primarily on the backend/integration side while also contributing to application functionality and UI.

My contributions included:

* Developed the **Connect/Friend Circle functionality**.
* Implemented navigation between the **Friend Circle and Breathing experience**.
* Worked on the **breathing-session flow** and interaction logic.
* Implemented the `useBreathingPresence` hook for displaying users participating in the breathing experience.
* Added a **breathing-session completion/celebration experience**.
* Worked on the application's **soundscape functionality**.
* Fixed styling issues in the **Resource Hub** and aligned it with the project's design system.
* Updated application navigation in `App.jsx`.
* Worked with **Supabase/local development and testing** for application synchronization and presence functionality.
* Tested the user flow and helped integrate features across the application.

## 🏆 Hackathon

Sisu was created as part of the **Computer Science Girlies Hackathon**.

🏅 **Award: Most Viral**

The project was developed collaboratively under a time constraint, requiring the team to divide responsibilities, integrate features, troubleshoot issues, and iterate quickly.

## 🛠️ Tech Stack

### Frontend

* React
* Vite
* JavaScript
* Tailwind CSS
* Custom CSS

### Backend & Data

* Supabase
* PostgreSQL
* Supabase Authentication
* Local storage / guest mode

### Other

* React Context
* Custom React hooks
* Real-time presence functionality
* Responsive UI

## 🏗️ Project Structure

```text
hackathon-cs-girlies/
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   ├── services/
│   └── styles/
├── supabase/
├── architecture/
├── agents/
├── context/
├── design_sessions/
├── languages/
├── workflows/
├── .vscode/
├── README.md
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/BlinaCode/hackathon-cs-girlies.git
cd hackathon-cs-girlies
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

If Supabase is not configured, the application can operate using its local/guest functionality where supported.

### 4. Start the development server

```bash
npm run dev
```

The application will then be available through the local development URL provided by Vite.

## 🎨 Design Philosophy

### Frictionless Entry

Sisu provides guest access so users can explore the application's features without being required to create an account.

### Calm UX

The interface uses a consistent ocean-inspired environment and gentle interactions to create a comfortable experience.

### Consistent Visual Language

Ocean colors, the Sisu otter mascot, and themed illustrations are used throughout the application to create a cohesive visual identity.

### Responsive Experience

The application was designed with mobile usage and accessibility in mind, allowing users to access its tools across different screen sizes.

## 👥 Team Project

Sisu was created collaboratively by the **Computer Science Girlies** hackathon team.

This repository is a fork of the team's original repository. The project was developed collaboratively, and the **My Contributions** section above highlights the areas I personally worked on.

## ⚠️ Disclaimer

Sisu is a wellness and self-reflection application and is **not a replacement for professional healthcare or emergency services**. Its tools are intended to support reflection, grounding, and general wellbeing.
