import tkinter as tk
from tkinter import messagebox, simpledialog
import os
import sqlite3
import hashlib
from pathlib import Path
from tkinter import ttk

# Database file lives in the same directory as this script
DB_FILE = str(Path(__file__).with_name('app.db'))

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def init_db():
    """Create required tables if they do not exist."""
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute(
            """
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT
            )
            """
        )
        c.execute(
            """
            CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id INTEGER,
                description TEXT,
                done INTEGER DEFAULT 0,
                FOREIGN KEY(user_id) REFERENCES users(id)
            )
            """
        )

def load_tasks(user_id):
    """Return a list of task dicts for the given user."""
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("SELECT id, description, done FROM tasks WHERE user_id=?", (user_id,))
        rows = c.fetchall()
    return [
        {"id": row[0], "description": row[1], "done": bool(row[2])} for row in rows
    ]

def add_task_db(user_id, desc):
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute(
            "INSERT INTO tasks (user_id, description) VALUES (?, ?)", (user_id, desc)
        )

def remove_task_db(task_id):
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute("DELETE FROM tasks WHERE id=?", (task_id,))

def mark_done_db(task_id):
    with sqlite3.connect(DB_FILE) as conn:
        conn.execute("UPDATE tasks SET done=1 WHERE id=?", (task_id,))

def get_user(username, password):
    with sqlite3.connect(DB_FILE) as conn:
        c = conn.cursor()
        c.execute("SELECT id, password FROM users WHERE username=?", (username,))
        row = c.fetchone()
    if row and row[1] == hash_password(password):
        return row[0]
    return None

def register_user(username, password) -> bool:
    try:
        with sqlite3.connect(DB_FILE) as conn:
            conn.execute(
                "INSERT INTO users (username, password) VALUES (?, ?)",
                (username, hash_password(password)),
            )
        return True
    except sqlite3.IntegrityError:
        return False


class LoginWindow(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("Login")
        self.geometry("300x150")

        ttk.Label(self, text="Username:").pack(pady=(10, 0))
        self.username_var = tk.StringVar()
        ttk.Entry(self, textvariable=self.username_var).pack(fill=tk.X, padx=20)

        ttk.Label(self, text="Password:").pack(pady=(10, 0))
        self.password_var = tk.StringVar()
        ttk.Entry(self, textvariable=self.password_var, show="*").pack(fill=tk.X, padx=20)

        btn_frame = ttk.Frame(self)
        btn_frame.pack(pady=10)

        ttk.Button(btn_frame, text="Login", command=self.login).pack(side=tk.LEFT, padx=5)
        ttk.Button(btn_frame, text="Register", command=self.register).pack(side=tk.LEFT, padx=5)

    def login(self):
        username = self.username_var.get().strip()
        password = self.password_var.get().strip()
        user_id = get_user(username, password)
        if user_id:
            self.destroy()
            app = TaskApp(user_id, username)
            app.mainloop()
        else:
            messagebox.showerror("Login Failed", "Invalid credentials")

    def register(self):
        username = self.username_var.get().strip()
        password = self.password_var.get().strip()
        if register_user(username, password):
            messagebox.showinfo("Register", "Account created. You can now log in.")
        else:
            messagebox.showerror("Register", "Username already exists")

class TaskApp(tk.Tk):
    def __init__(self, user_id, username):
        super().__init__()
        self.title(f'Tasks - {username}')
        self.geometry('300x400')

        self.user_id = user_id
        self.tasks = load_tasks(user_id)

        self.task_listbox = tk.Listbox(self, selectmode=tk.SINGLE)
        self.task_listbox.pack(fill=tk.BOTH, expand=True, padx=10, pady=10)

        button_frame = ttk.Frame(self)
        button_frame.pack(fill=tk.X, padx=10)

        add_btn = ttk.Button(button_frame, text='Add Task', command=self.add_task)
        add_btn.pack(side=tk.LEFT, expand=True, fill=tk.X)

        remove_btn = ttk.Button(button_frame, text='Remove', command=self.remove_task)
        remove_btn.pack(side=tk.LEFT, expand=True, fill=tk.X)

        done_btn = ttk.Button(button_frame, text='Mark Done', command=self.mark_done)
        done_btn.pack(side=tk.LEFT, expand=True, fill=tk.X)

        self.refresh_tasks()

    def add_task(self):
        task = simpledialog.askstring('New Task', 'Enter task description:')
        if task:
            add_task_db(self.user_id, task)
            self.tasks = load_tasks(self.user_id)
            self.refresh_tasks()

    def remove_task(self):
        idx = self.task_listbox.curselection()
        if not idx:
            messagebox.showwarning('Remove Task', 'No task selected')
            return
        task_id = self.tasks[idx[0]]["id"]
        remove_task_db(task_id)
        self.tasks = load_tasks(self.user_id)
        self.refresh_tasks()

    def mark_done(self):
        idx = self.task_listbox.curselection()
        if not idx:
            messagebox.showwarning('Mark Done', 'No task selected')
            return
        task_id = self.tasks[idx[0]]["id"]
        mark_done_db(task_id)
        self.tasks = load_tasks(self.user_id)
        self.refresh_tasks()

    def refresh_tasks(self):
        self.task_listbox.delete(0, tk.END)
        self.tasks = load_tasks(self.user_id)
        for task in self.tasks:
            desc = task['description']
            if task.get('done'):
                desc += ' [DONE]'
            self.task_listbox.insert(tk.END, desc)

def print_tasks(tasks):
    if not tasks:
        print("No tasks available.")
    for i, task in enumerate(tasks, 1):
        status = "[DONE]" if task.get('done') else ""
        print(f"{i}. {task['description']} {status}")


def run_cli():
    init_db()
    username = input("Username: ").strip()
    password = input("Password: ").strip()
    user_id = get_user(username, password)
    if not user_id:
        choice = input("User not found. Register? (y/n): ").lower()
        if choice == 'y':
            if register_user(username, password):
                user_id = get_user(username, password)
            else:
                print("Registration failed")
                return
        else:
            return

    while True:
        tasks = load_tasks(user_id)
        print("\nCurrent tasks:")
        print_tasks(tasks)
        cmd = input("\nCommand (add/remove/done/quit): ").strip().lower()
        if cmd == 'add':
            desc = input("Task description: ").strip()
            if desc:
                add_task_db(user_id, desc)
        elif cmd.startswith('remove'):
            parts = cmd.split()
            if len(parts) == 2 and parts[1].isdigit():
                idx = int(parts[1]) - 1
                if 0 <= idx < len(tasks):
                    remove_task_db(tasks[idx]['id'])
                else:
                    print("Invalid index")
            else:
                print("Usage: remove <task number>")
        elif cmd.startswith('done'):
            parts = cmd.split()
            if len(parts) == 2 and parts[1].isdigit():
                idx = int(parts[1]) - 1
                if 0 <= idx < len(tasks):
                    mark_done_db(tasks[idx]['id'])
                else:
                    print("Invalid index")
            else:
                print("Usage: done <task number>")
        elif cmd == 'quit':
            break
        else:
            print("Unknown command")


if __name__ == '__main__':
    init_db()
    if os.environ.get('DISPLAY'):
        LoginWindow().mainloop()
    else:
        print("No display found. Running in console mode.")
        run_cli()
