# SkillPilot AI

<div align="center">

### AI-Powered Mock Interview Platform

**Practice interviews • Get personalized AI feedback • Track your performance**

SkillPilot AI is a full-stack AI mock interview platform that generates personalized interview questions based on a candidate's **role, experience, and skills**, then evaluates their answers and provides actionable feedback.

</div>

---

## Features

* **AI-Generated Interviews** — Personalized technical, behavioral, and situational questions
* **Adaptive Questioning** — Questions tailored to role, experience, and skills
* **AI Answer Evaluation** — 1–10 scoring with strengths, weaknesses, and improvement suggestions
* **Performance Dashboard** — Track interview history, scores, and progress
* **Authentication** — Google OAuth with NextAuth.js and Firebase
* **Responsive UI** — Modern interface with glassmorphism, animations, and dark/light mode

---

## Tech Stack

**Frontend**
Next.js • React • Tailwind CSS • Framer Motion • Lucide React

**AI & Backend**
Groq API • Next.js API Routes • NextAuth.js

**Database & Authentication**
Firebase Firestore • Firebase Authentication • Google OAuth

---

## How It Works

```text
Role + Experience + Skills
            ↓
   AI Question Generation
            ↓
        User Answers
            ↓
       Groq AI Analysis
            ↓
 Score + Strengths + Weaknesses
            ↓
    Personalized Feedback
            ↓
     Performance Dashboard
```

---

## Screenshots

### Home Page

<img src="public/screenshots/home.png" alt="SkillPilot AI Home Page" width="100%"/>

### Sign In

<img src="public/screenshots/signin.png" alt="SkillPilot AI Sign In" width="100%"/>

### Dashboard

<img src="public/screenshots/dashboard.png" alt="SkillPilot AI Dashboard" width="100%"/>

### Interview Session

<img src="public/screenshots/interview.png" alt="SkillPilot AI Interview Session" width="100%"/>

### AI Feedback

<img src="public/screenshots/feedback.png" alt="SkillPilot AI Feedback" width="100%"/>

---

## Run Locally

```bash
git clone https://github.com/yourusername/skillpilot-ai.git
cd skillpilot-ai
npm install
npm run dev
```

Create a `.env.local` file with your Firebase, Google OAuth, NextAuth, and Groq API credentials.

Open:

```text
http://localhost:3000
```

---

## Future Improvements

* Voice-based interviews
* Resume-based question generation
* Speech analysis
* Advanced interview analytics
* Personalized interview preparation

---

<div align="center">

**SkillPilot AI — Practice Smarter. Interview Better.**

Built with Next.js, Firebase & AI.

</div>
