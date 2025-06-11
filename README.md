# ChatGPT

This repository contains a simple task management application. When a graphical
display is available, it launches a `tkinter`-based GUI. Otherwise, it falls
back to a console interface so you can still manage tasks over a terminal.

## Running the Application

Ensure you have Python installed (version 3.8+ recommended). Tkinter is typically
included with standard Python installations. Run the application with:

```bash
python tasks_app.py
```

Tasks are saved in `tasks.json` in the project directory so you can close and reopen the application without losing your list. If no GUI display is detected, the
script automatically runs in console mode with simple commands (`add`,
`remove`, `done`, `quit`).
