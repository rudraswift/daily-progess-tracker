# Daily Task Progress Tracker

**Plan your day, track your progress, and see how your productivity trends over time.**

A full-stack personal productivity web application for managing daily tasks, organizing work by time of day, and analyzing performance with dashboards and calendar views—all with a polished, theme-aware interface.

---

## 🚀 Features

- **Task management** — Add, edit, and delete tasks with a streamlined workflow.
- **Time-based organization** — Categorize tasks into **Morning**, **Afternoon**, **Evening**, and **Night** sections.
- **Status at a glance** — Mark tasks as **completed** or **pending**; keep **Done** and **Undo** lists separate for clarity.
- **Daily progress** — Track completion with a **daily progress percentage** so you always know how your day is going.
- **Insights dashboard** — Visualize productivity with charts and summary metrics.
- **Calendar view** — Review **past performance** by date and spot patterns over time.
- **Persistent data** — **MongoDB** storage for long-term history and reliable tracking across sessions.
- **Themes** — Switch between **dark mode** and **light mode**; theme preference can be persisted via **localStorage**.
- **Modern UX** — Smooth transitions, responsive layout, and a clean UI built with **Tailwind CSS**.

---

## 🖥️ Screenshots

> Replace the placeholder links below with your own image URLs (e.g. GitHub-hosted assets or a `docs/` folder in the repo).

| Dashboard | Task board |
|-----------|------------|
| ![Dashboard](https://via.placeholder.com/640x360?text=Dashboard+screenshot) | ![Tasks](https://via.placeholder.com/640x360?text=Task+board+screenshot) |

| Analytics | Calendar |
|-----------|----------|
| ![Analytics](https://via.placeholder.com/640x360?text=Analytics+screenshot) | ![Calendar](https://via.placeholder.com/640x360?text=Calendar+screenshot) |

---

## 🛠️ Tech Stack

| Layer | Technologies |
|--------|----------------|
| **Frontend** | [React](https://react.dev/), [Vite](https://vitejs.dev/), [Tailwind CSS](https://tailwindcss.com/) |
| **Routing & UI** | [React Router](https://reactrouter.com/), [Lucide React](https://lucide.dev/) (icons), [Recharts](https://recharts.org/) (charts) |
| **State management** | **React Context API** (e.g. theme, authentication) + **React Hooks** for local UI state |
| **Backend** | [Node.js](https://nodejs.org/), [Express.js](https://expressjs.com/) |
| **Database** | [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/) |
| **Auth & security** | JWT ([jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)), password hashing ([bcrypt](https://github.com/kelektiv/node.bcrypt.js)) |
| **Other** | [CORS](https://github.com/expressjs/cors), [dotenv](https://github.com/motdotla/dotenv), **localStorage** (theme persistence) |

---

## ⚙️ Installation & Setup

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally, or a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) connection string

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/daily-task-progress-tracker.git
cd daily-task-progress-tracker
```

### 2. Install dependencies

**Frontend** (Vite + React app lives in `daily tracker/`):

```bash
cd "daily tracker"
npm install
```

**Backend**:

```bash
cd ../backend
npm install
```

### 3. Environment variables (backend)

Create a `.env` file inside `backend/` (do not commit secrets):

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/daily_tracker
JWT_SECRET=your_strong_secret_here
```

Adjust `MONGODB_URI` for Atlas or your local MongoDB instance.

### 4. Run the application

**Terminal 1 — API server**

```bash
cd backend
node server.js
```

**Terminal 2 — frontend dev server**

```bash
cd "daily tracker"
npm run dev
```

Open the URL shown in the terminal (typically `http://localhost:5173` for Vite). Ensure the backend port matches your API client configuration if you customize it.

**Production build (frontend)**

```bash
cd "daily tracker"
npm run build
npm run preview
```

---

## 📁 Folder Structure

```text
daily-task-progress-tracker/
├── daily tracker/          # React (Vite) frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # Reusable UI (sidebar, modals, cards, etc.)
│   │   ├── context/        # Theme, auth, and other React contexts
│   │   ├── hooks/
│   │   ├── pages/          # Route-level views (dashboard, analytics, etc.)
│   │   ├── config/
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
├── backend/                # Express API
│   ├── middleware/
│   ├── models/             # Mongoose schemas
│   ├── routes/             # REST routes (tasks, auth)
│   ├── server.js
│   └── package.json
└── README.md
```

---

## 📊 How It Works

Users sign in and manage tasks through the React SPA. Tasks are grouped by **time section** and status, driving the **daily completion percentage**. The **dashboard** and **analytics** layers aggregate this data for insights; the **calendar** ties activity to specific dates. The **Express** API validates requests, issues **JWTs** for protected routes, and persists documents in **MongoDB**. The **theme** preference is stored in the browser (**localStorage**) so light/dark mode survives reloads.

---

## 🔮 Future Enhancements

- **AI-based productivity insights** — Summaries, focus suggestions, and anomaly detection from task history.
- **Weekly reports** — Automated rollups with trends and goals.
- **Notifications & reminders** — Browser or push reminders for due tasks and streaks.

---

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository and create a feature branch (`git checkout -b feature/your-feature`).
2. Make focused commits with clear messages.
3. Open a pull request describing the change and any setup steps.

Please keep PRs scoped, match existing code style, and avoid unrelated refactors.

---

## 📜 License

This project is released under the **MIT License**.

---

## 🙌 Acknowledgements

- [React](https://react.dev/) and [Vite](https://vitejs.dev/) teams for an excellent developer experience.
- [Tailwind CSS](https://tailwindcss.com/) for rapid, consistent styling.
- [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/) for flexible document storage.
- [Recharts](https://recharts.org/) for composable chart components.

---

<p align="center">
  Built with care for clarity, consistency, and long-term habit tracking.
</p>
