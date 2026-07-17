# Aegis AI

## 🏆 Challenge Vertical

Smart Stadiums & Tournament Operations

---

## 📖 Overview

Aegis AI is an AI-powered stadium operations platform designed to assist volunteers and event coordinators during large sporting events such as the FIFA World Cup 2026.

The platform combines AI-driven incident analysis, multilingual communication, and a live operations dashboard to improve response time, crowd management, and spectator experience.

---

## ✨ Features

### 🚨 AI Incident Commander

- Analyze live incidents
- Generate AI-powered recommendations
- Assess risk level
- Suggest volunteer deployment
- Estimate resolution time
- Maintain incident history

### 🌍 AI Volunteer Interpreter

- Automatic language detection
- Translate spectator speech into English
- Translate volunteer responses back into the visitor's language
- Support multilingual communication during international events

### 📊 Live Stadium Operations Dashboard

- Stadium overview
- Live incident monitoring
- AI reasoning panel
- Match status
- Operational insights

---

## 🧠 Approach & Logic

The application collects incident details entered by operators and uses an AI reasoning engine powered by Groq to generate structured operational recommendations.

For multilingual assistance, the platform translates conversations between volunteers and international spectators, reducing communication barriers during live events.

Firebase Authentication and Cloud Firestore are used to manage users and application data.

---

## ⚙️ Tech Stack

- Next.js 16
- React
- TypeScript
- Tailwind CSS
- Firebase Authentication
- Cloud Firestore
- Groq API
- Framer Motion
- shadcn/ui

---

## 📂 Project Structure

```
src/
 ├── app/
 ├── ai/
 ├── components/
 ├── services/
 ├── hooks/
 ├── lib/
 └── types/
```

---

## 🚀 Installation

Clone the repository

```bash
git clone https://github.com/sunnywityyy/aegis-ai.git
```

Install dependencies

```bash
npm install
```

Create a `.env.local` file and add your environment variables.

Run the development server

```bash
npm run dev
```

Build for production

```bash
npm run build
```

---

## 🔑 Required Environment Variables

```
GROQ_API_KEY=

NEXT_PUBLIC_FIREBASE_API_KEY=

NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=

NEXT_PUBLIC_FIREBASE_PROJECT_ID=

NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=

NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=

NEXT_PUBLIC_FIREBASE_APP_ID=
```

---

## 🌐 Live Demo

Add your deployed Vercel URL here.

Example

```
https://your-project.vercel.app
```

---

## 📝 Assumptions

- Internet connectivity is available inside the stadium.
- Volunteers have access to smartphones or tablets.
- AI recommendations assist operators but do not replace human decision-making.
- Firebase services are available during operation.

---

## 👥 Team

**Team Name:** Antique Ant

Project: **Aegis AI**

---

## 📄 License

Developed for the Hack2Skill Prompt Wars Hackathon.
