# Task Tracker App

## Tech Stack
- Frontend: React Native (Expo) + TypeScript + TanStack Query
- Backend: Node.js + Express + TypeScript
- Database: MongoDB
- Auth: JWT + expo-secure-store

## Prerequisites
- Node.js >= 18
- MongoDB (local or Atlas)
- Expo CLI: npm install -g expo-cli
- iOS Simulator or Android Emulator or Expo Go app

## Setup & Run

### 1. Clone the repo
```bash
git clone <repo-url>
cd task-tracker
```

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm run dev
# Backend runs on http://localhost:5000
```

### 3. Frontend Setup
```bash
cd frontend
npm install
# Edit src/api/client.ts with your machine's IP if using physical device
npx expo start
# Press 'a' for Android, 'i' for iOS
```

## API Endpoints
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | /auth/signup | No | Register |
| POST | /auth/login | No | Login |
| GET | /tasks | Yes | Get all tasks |
| POST | /tasks | Yes | Create task |
| PATCH | /tasks/:id | Yes | Update task |
| DELETE | /tasks/:id | Yes | Delete task |

## Features
- ✅ JWT Authentication (signup/login)
- ✅ Secure token storage (expo-secure-store)
- ✅ Full task CRUD
- ✅ Filter tasks (All/Pending/Completed)
- ✅ Pull-to-refresh
- ✅ Loading, error, empty states
- ✅ Persistent login session
- ✅ Password hashing (bcryptjs)
- ✅ Input validation

## Project Structure
task-tracker/
├── backend/          # Node.js + Express API
│   └── src/
│       ├── config/   # DB connection
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       └── types/
└── frontend/         # React Native Expo
    └── src/
        ├── api/      # Axios + API functions
        ├── components/
        ├── context/  # Auth context
        ├── hooks/    # TanStack Query hooks
        ├── navigation/
        ├── screens/
        ├── storage/  # SecureStore helpers
        └── types/
