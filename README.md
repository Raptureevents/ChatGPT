# ChatGPT

This repository contains a task management application with user authentication.
When a graphical display is available, it launches a Tkinter GUI starting with a
login screen. Otherwise, it falls back to a console interface so you can still
manage tasks over a terminal.

## Running the Application

Ensure you have Python installed (version 3.8+ recommended). Tkinter is typically
included with standard Python installations. Run the application with:

```bash
python tasks_app.py
```

User accounts and tasks are stored in the SQLite database `app.db` in the project
directory. If no GUI display is detected, the script automatically runs in console
mode. After logging in you can use simple commands (`add`, `remove`, `done`,
`quit`) to manage tasks.
