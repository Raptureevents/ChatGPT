# ChatGPT

This repository contains two versions of a task manager.

* `tasks_app.py` – a Python/Tkinter implementation that falls back to a CLI when no display is available.
* `react-native-app` and `server` – a React Native Windows application backed by a Node.js/Express API with PostgreSQL.

## Running the Python Application

Ensure you have Python installed (version 3.8+ recommended). Tkinter is typically included with standard Python installations. Run the application with:

```bash
python tasks_app.py
```

User accounts and tasks are stored in the SQLite database `app.db` in the project directory. If no GUI display is detected, the script automatically runs in console mode.

## Running the React Native + Node Application

1. Populate `server/.env` based on `server/.env.example` with your PostgreSQL connection string.
2. From `server/` run `npm install` then `npm start` to launch the API on port 3001.
3. From `react-native-app/` run `npm install` and `npm start` to launch the React Native bundler.

The React Native app now features a dashboard with sections for tasks, projects, events and expenses. Reusable components keep the interface minimalistic. The Express backend exposes CRUD endpoints for all resources and provides a `/api/stream` Server-Sent Events endpoint so the client can refresh lists when data changes.
