# Trackademic Mobile – Setup Guide

## Project Structure (mirrors image.png)

trackademic-mobile/
├── api/
│   ├── axiosConfig.ts      ← HTTP client (change myIP!)
│   ├── auth.ts             ← login / register endpoints
│   └── classes.ts          ← classes / performance endpoints
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx       ← Home screen
│   │   ├── classes.tsx     ← My Classes screen
│   │   ├── performance.tsx ← My Performance screen
│   │   └── profile.tsx     ← Profile screen
│   ├── _layout.tsx         ← Root layout (drawer + tabs + topbar)
│   ├── login.tsx           ← Login screen
│   └── register.tsx        ← Register screen
├── components/
│   ├── AlertModal.tsx      ← Success / Error / Info popup
│   ├── DrawerNav.tsx       ← Side drawer navigation
│   ├── JoinClassModal.tsx  ← "Join your respective class!" modal
│   └── LoadingOverlay.tsx  ← Loading spinner overlay
├── constants/
│   ├── Colors.ts           ← App color palette
│   └── Dummy.ts            ← Offline fallback data
├── hooks/
│   ├── useAlert.ts         ← Alert + loading state management
│   └── useAuth.ts          ← Auth session (AsyncStorage)
├── backend/
│   ├── server.ts           ← Express API server
│   ├── schema.sql          ← MySQL database schema + seed data
│   └── package.json        ← Backend dependencies
└── package.json            ← Expo app dependencies

---

## 1 — Backend Setup

### Install & Run

cd backend
npm install
npm run dev        # starts on port 3000

### Database

1. Open MySQL Workbench or phpMyAdmin
2. Run backend/schema.sql (creates tables + seeds dummy data)
3. Verify: SELECT * FROM users;  → should show Margarette Perez, Juan Dela Cruz

### .env (optional, otherwise defaults apply)

DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=sample_db

---

## 2 — Find your local IP

Windows:  ipconfig  → look for "IPv4 Address" (e.g. 192.168.1.5)
macOS:    ifconfig  → look for "inet" under en0
Linux:    hostname -I

Update api/axiosConfig.ts:

  const myIP = '192.168.1.5';   ← your actual IP

---

## 3 — Expo App Setup

npm install          # in the root trackademic-mobile/ folder
npm run dev          # or: npx expo start

Then:
- Press 'a' for Android emulator
- Press 'i' for iOS simulator
- Scan QR with Expo Go app on your phone (must be same WiFi)

---

## Demo Login

Email:    23-72068@g.batstate-u.edu.ph
Password: password123

---

## API Endpoints

POST  /api/register          → register new user
POST  /api/login             → login (returns user object)
GET   /api/classes/:userId   → get enrolled classes
POST  /api/classes/join      → join class by code
GET   /api/performance/:userId → get scores/classworks
GET   /api/notifications/:userId → get notifications
PUT   /api/profile/:userId   → update profile
