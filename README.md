# Habit Tracker 🚀

A modern, fast, and satisfying Habit Tracker built with **Next.js 15**, **React**, **Tailwind CSS**, and **Firebase**.

Track your daily routines, build streaks, and visualize your progress with a real-time GitHub-style heatmap. 

## ✨ Features

- **Google & Email Authentication**: Securely sign in and sync your habits across all your devices using Firebase Auth.
- **Flexible vs Scheduled Habits**: Add habits that need to be done at specific times on specific days, or "flexible" habits that you can check off any time.
- **Dark Mode Support**: Seamlessly toggle between light and dark modes with a beautiful, high-contrast color palette.
- **Real-Time Heatmap**: View your habit history in a GitHub-style heatmap that updates instantly across devices using Firestore `onSnapshot`.
- **Daily Celebrations**: Finish all your scheduled habits for the day to trigger a rewarding triple-confetti explosion! 🎉
- **Offline Resilient**: Uses Firestore's `browserLocalPersistence` to ensure your data loads instantly.

## 🛠 Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS
- **Backend & Database**: Firebase (Auth, Firestore, Hosting)
- **Deployment**: Firebase Hosting (Static Export)
- **Icons & Animations**: Lucide React, Canvas Confetti

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js installed on your machine. You will also need a Firebase project set up with Firestore and Authentication (Email/Password + Google Provider) enabled.

### 1. Clone the repository

```bash
git clone https://github.com/cpccu/HackathonClassFinal.git
cd HackathonClassFinal
```

### 2. Install dependencies

```bash
npm install
```

### 3. Setup Environment Variables

Create a `.env.local` file in the root of the project and add your Firebase configuration:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the app running locally.

## 📦 Deployment

This project is configured to be statically exported and deployed to Firebase Hosting.

1. Build the static export:
```bash
npm run build
```

2. Deploy to Firebase:
```bash
npx firebase-tools deploy --only hosting
```

## 📝 License

MIT License - feel free to use this project for your own hackathons and personal tracking!
