# 🚀 FeatureVote Frontend

A modern React-based frontend for the FeatureVote platform — a system that allows users to submit feedback, vote on ideas, and help prioritize product development.

---

## 🌐 Live Demo
👉 https://featurevote-frontend.vercel.app/login

---

## 🧠 Overview

FeatureVote helps teams:
- Can See user feedbacks along with work status (SUBMITTED, PLANNED, IN_PROGRESS, COMPLETED)
- Can see all the boards available
- Prioritize features for different boards based on real demand
- Convert feedback into actionable tasks

This repository contains the **https://github.com/bitopi2000/featurevote-frontend**, built with React and optimized for performance and usability.

---

## 🏗️ Architecture
<img width="200" height="460" alt="Screenshot 2026-04-22 at 14 15 56" src="https://github.com/user-attachments/assets/4ea58fa6-ca77-4474-b0b6-9f41ed950a51" />

---

## ⚙️ Tech Stack

- **React (Vite)**
- **JavaScript / JSX**
- **CSS**
- REST API integration

---

## 📂 Project Structure
src/
- ├─ components/
- ├─ pages/
- ├─ services/
- ├─ App.jsx
- └─ main.jsx

---

## 🔌 API Integration

The frontend communicates with the backend via REST APIs.

Example:

- GET /api/boards/list
- POST api/auth/login

Environment variable:

VITE_API_URL=https://featurevote-bff.onrender.com/api


---

## 🛠️ Getting Started

### Local Setup
1. Clone repo
- git clone https://github.com/bitopi2000/featurevote-frontend.git
- cd featurevote-frontend
2. Install dependencies
- npm install
3. Run app
- npm run dev

App runs at:

http://localhost:5173

## 🚀 Deployment
- Hosted on Vercel
- Auto-deployed via GitHub

## ✨ Features
- View Boards
- Submit feedback (planned)
- Vote on feedback
- Real-time UI updates (planned)
- Clean and simple UX

🔮 Future Enhancements
- Authentication (JWT / OAuth)
- Real-time updates (WebSockets)
- Improved UI with TailwindCSS
- Analytics dashboard
- Mobile responsiveness
