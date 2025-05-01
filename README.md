# Video-Progress-Tracker

# 📽️ Video Progress Tracker (MERN Stack)

## Project Overview

This project is a video progress tracking tool built using the **MERN** stack (MongoDB, Express.js, React, Node.js) with **Tailwind CSS** for styling. The tool allows users to track their progress while watching videos, ensuring that skipping does not count as progress. The progress is saved and can be resumed from the last watched position.

## 📁 Repository Structure
```
video-progress-tracker/
├── client/             # React frontend (Vite + Redux Toolkit Query + TailwindCSS)
│   ├── src/
│   │   ├── components/
│   │   │   └── VideoPlayer.jsx
│   │   ├── features/
│   │   │   └── apiSlice.js
│   │   └── App.jsx
│   └── ...
├── server/             # Express backend with MongoDB
│   ├── models/         
│   │   └── Progress.js
│   ├── routes/
│   │   └── progress.js
│   └── index.js
├── README.md
└── package.json
```

## 🚀 Setup Instructions

### Prerequisites
- Node.js
- MongoDB (local or cloud)

### 1. Clone the Repo
```bash
git clone https://github.com/Arpit12890/Video-Progress-Tracker.git
cd video-progress-tracker
```

### 2. Install Dependencies
```bash
# For backend
cd server
npm install

# For frontend
cd ../client
npm install
```

### 3. Start the App
```bash
# Start backend
cd server
npm run dev

# Start frontend (in a separate terminal)
cd ../client
npm run dev
```

### 4. Add Sample Video
Put a file named `sample.mp4` in the `client/public/` directory.

---

## 📦 API Overview

### `GET /api/progress/:userId/:videoId`
Returns previously saved watched intervals and last position.

### `POST /api/progress/update`
Body:
```json
{
  "userId": "123",
  "videoId": "abc",
  "newInterval": { "start": 10, "end": 20 },
  "lastPosition": 20
}
```

---

## 📺 Design Decisions

### ✅ Tracked Watched Intervals
- We captured watched seconds using a `Set` inside `VideoPlayer.jsx`, updated every second while the video is playing.
- Only newly watched seconds were stored to avoid duplication.

### ✅ Merged Intervals
- On the backend (`progress.js`), we used a function `mergeIntervals()` to combine overlapping or adjacent intervals.
- This ensured we calculated the *real unique* duration the user watched.

### ✅ Resume from Last Watched
- On frontend mount, we retrieved and set `video.currentTime` using saved `lastPosition`.
- Also restored watched seconds from the backend to maintain progress.

### ✅ Data Persistence
- MongoDB stores:
  - `userId`
  - `videoId`
  - `intervals`: Array of `{start, end}`
  - `lastPosition`: Number

---

## ⚠️ Challenges & Solutions

### 1. **Skipping Forward**
**Problem:** Users could jump ahead and falsely increase progress.
**Solution:** Only count seconds the user *actually watched* with the video playing.

### 2. **Accurate Merging**
**Problem:** Intervals like [10-20], [19-25] needed to be merged.
**Solution:** Wrote a robust `mergeIntervals()` function that merges overlapping and adjacent segments.

### 3. **Progress Loss on Reload**
**Problem:** Watched percentage was resetting.
**Solution:** Ensured progress is fetched and applied after metadata is loaded in the video element.

---

## 👨‍💻 Contributors
- Arpit gupta - [GitHub](https://github.com/Arpit12890)


