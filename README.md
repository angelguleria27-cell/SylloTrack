# 📚 SylloTrack - Syllabus Progress Tracker

**SylloTrack** is a modern full-stack MERN application that enables students to input their syllabus, break it down into topics, track their study progress over time, and visualize their overall subject completion.

---

## 🛠️ Tech Stack

- **MongoDB** (Mongoose ODM)
- **Express.js** (Node.js REST API)
- **React.js** (Vite + React Router + Modern CSS)
- **Node.js**

---

## 📁 Monorepo Structure

```
/SylloTrack
├── /client          # React frontend (Vite)
│   ├── src/
│   │   ├── api/     # Axios API configuration
│   │   ├── components/ # Reusable UI components (Navbar, Cards, ProgressBars)
│   │   ├── pages/   # Application pages (Dashboard, AddSubject, SubjectDetail, EditSubject)
│   │   ├── index.css # Custom CSS design system (Blue, White, Light Gray palette)
│   │   └── App.jsx
│   └── package.json
├── /server          # Express + MongoDB backend
│   ├── config/      # MongoDB connection (db.js)
│   ├── controllers/ # Subject and Topic controllers
│   ├── models/      # Mongoose schemas (Subject, Topic)
│   ├── routes/      # REST API route handlers
│   ├── .env         # Environment configuration
│   ├── server.js    # Entry point
│   └── package.json
├── package.json     # Root monorepo configuration (runs concurrent frontend & backend)
└── README.md
```

---

## ⚙️ Environment Configuration

Create a `.env` file inside the `server/` directory:

```env
PORT=5001
MONGO_URI=mongodb://127.0.0.1:27017/syllotrack
```

*(Note: Replace `MONGO_URI` with your local MongoDB URI or MongoDB Atlas connection string).*

---

## 🚀 Quick Start Instructions

### 1. Install Dependencies
Run the following command in the project root to install dependencies across the monorepo (root, client, and server):

```bash
npm run install:all
```

### 2. Configure Database
Ensure local MongoDB is running, or set your `MONGO_URI` in `server/.env`.

### 3. Run Application
Start both the React frontend and Express backend simultaneously using:

```bash
npm run dev
```

- **Frontend**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001](http://localhost:5001)

---

## 🔌 API Endpoints

### Subjects API
- `GET /api/subjects` — Fetch all subjects
- `GET /api/subjects/:id` — Fetch single subject details
- `POST /api/subjects` — Create a new subject (with optional batch topics)
- `PUT /api/subjects/:id` — Update subject name
- `DELETE /api/subjects/:id` — Delete subject and associated topics

### Topics API
- `GET /api/topics/:subjectId` — Fetch topics for a subject
- `POST /api/topics` — Create a topic for a subject
- `PUT /api/topics/:id` — Update topic (title or completed status)
- `DELETE /api/topics/:id` — Delete a topic

---

## ✨ Features

1. **Dashboard & Analytics**: View overall progress percentage across all subjects with interactive stat cards.
2. **Add Subject & Syllabus**: Dynamically add multiple topics while creating a new subject.
3. **Interactive Syllabus Checklist**: Toggle topic completion checkboxes with instant real-time progress bar recalculations.
4. **Subject Detail & Topic Management**: Add, edit, or delete individual topics cleanly.
5. **Edit Subject**: Rename subjects and manage topics effortlessly.
